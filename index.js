const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cog8e.mongodb.net/Spicy-Velvet?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("Spicy-Velvet").collection("products");
    const newProductCollection = client
      .db("Spicy-Velvet")
      .collection("newProducts");

    //get product from server
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      // console.log(products);
      res.send(products);
    });

    //get single products
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    //update a single value
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const { quantity } = req.body;
      const query = { _id: ObjectId(id) };
      const data = { $set: { Quantity: quantity } };
      const result = await productCollection.updateOne(query, data);
      res.send(result);
    });

    // Post a new item in DB
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });
    // Post a my item in DB
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    //get my items from server
    app.get("/myItem", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      // const query = {};
      const cursor = newProductCollection.find(query);
      const myItems = await cursor.toArray();
      res.send(myItems);
    });

    // //delete My-item product
    // app.delete("/myItems", async (req, res) => {
    //   const id = req.query;
    //   console.log(id);
    //   // const query = {};
    //   const query = { _id: ObjectId(id) };
    //   const result = await newProductCollection.deleteOne(query);
    //   res.send(result);
    // });

    //delete a single  product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

// root
app.get("/", (req, res) => {
  res.send("Spicy Velvet warehouse website running");
});

app.listen(port, () => {
  console.log("Server is running : ", port);
});
