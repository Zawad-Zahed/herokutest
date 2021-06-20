const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
// console.log(process.env.DB_USER);

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

console.log("new", process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kjs3d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  // console.log('connection error',err);
  const bookCollection = client.db("amaderBoiGhor").collection("books");

  app.get("/books", (req, res) => {
    bookCollection.find().toArray((err, book) => {
      res.send(book);
    });
  });

  app.post("/addBook", (req, res) => {
    // const newBook = req.body;
    console.log(req.body);
    bookCollection.insertOne(req.body).then((result) => {
      console.log("inserted count :", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.delete("/deleteBook/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    console.log("delete this", id);

    bookCollection.findOneAndDelete({ _id: id }).then((documents) => {
      console.log("documents deleted", documents);
      res.send(!!documents.value);
    });
  });
  // perform actions on the collection object
  // client.close();
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
