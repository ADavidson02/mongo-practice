const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://Amanda:720Stonehaven@cluster0.igsx0.mongodb.net/sample_airbnb?retryWrites=true&w=majority"
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  try {
    //Connect to MongoDB cluster
    await client.connect()
    //Make appropriate DB calls
 await findOneListingByName(client, 'Infinite Views');
  } catch(e) {
    console.error(e)
  }finally {
    await client.close();
  }
}

main().catch(console.error)


async function findOneListingByName(client, nameOfListing) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .findOne({ name: nameOfListing });
  if (result) {
    console.log(`Found a listing in the collenctionw with the name ${nameOfListing}`)
    console.log(result)
  } else {
    console.log(`No listings found with the name ${nameOfListing}`)
  }
} 

async function createListing(client, newListing) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing)
  console.log(`New listing created with the following id: ${result.insertedId}`)
}

async function createMultileListings(client, newListings) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .insertMany(newListings);
  console.log(
    `${result.insertedCount} new listing(s) crated with the following id(s):`
  );
  console.log(result.insertedIds);
}

async function listDatabases(client){
  const databasesList = await client.db().admin().listDatabases()

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`))
}




