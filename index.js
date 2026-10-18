import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-uu7ruvv-shard-00-00.vwk5wcf.mongodb.net:27017,ac-uu7ruvv-shard-00-01.vwk5wcf.mongodb.net:27017,ac-uu7ruvv-shard-00-02.vwk5wcf.mongodb.net:27017/?ssl=true&replicaSet=atlas-1389v7-shard-0&authSource=admin`,
);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const clientConnection = await connectToMongoDB();
const db = clientConnection.db("simple-crud");
const users = db.collection("users");

app.get("/users", async (req, res) => {
  const cursor = users.find({});
  const allUsers = await cursor.toArray();
  res.send(allUsers);
});

app.post("/users", async (req, res) => {
  const newUser = req.body;
  const result = await users.insertOne(newUser);
  res.send(result);
  console.log(`A document was inserted with the _id: ${result.insertedId}`);
});

app.listen(port, () => {
  console.log(`Simple CRUD is running on ${port} port`);
});
