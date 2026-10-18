import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
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

app.get("/users/:id", async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await users.findOne(query);
    res.send(result);
})

app.post("/users", async (req, res) => {
  const newUser = req.body;
  const result = await users.insertOne(newUser);
  res.send(result);
  console.log(`A document was inserted with the _id: ${result.insertedId}`);
});

app.patch("/users/:id", async(req,res)=>{
    const id = req.params.id;
    const updateUser = req.body;
    const query = {_id: new ObjectId(id)};
    const options = {upsert: true};
    const updateDoc = {
        $set:{
            name: req.body.name,
            email: req.body.email,
        }
    }

    const result = await users.updateOne(query, updateDoc, options);

    res.send(result);
})

app.delete("/users/:id", async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await users.deleteOne(query);
    res.send(result);
})

app.listen(port, () => {
  console.log(`Simple CRUD is running on ${port} port`);
});
