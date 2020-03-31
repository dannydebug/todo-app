const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "chanchi";
const collectionName = "todos";

async function getCollection() {
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  return client.db(dbName).collection(collectionName);
}

// getCollection()
//   .then(collection => {
//     return collection.find().toArray();
//   })
//   .then(todos => console.log(todos));
// unwraps the wrapped promise

module.exports.getCollection = getCollection;
