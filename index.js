const express = require("express");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const cors = require("cors");
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ipn6sc.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const servicesCollection = client.db("GeniusCar").collection("services");
    const ordersCollection = client.db("GeniusCar").collection("orders");
    app.get("/services", async (req, res) => {
      const query = {};
      const result = await servicesCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    // orders collection

    app.get("/orders", async (req, res) => {
    
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const result = await ordersCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.send(result);
    });
    // delete order 
      app.delete("/orders/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await ordersCollection.deleteOne(query);
        res.send(result);
      })




    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World! server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
