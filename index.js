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
    await createListing(client,
      {
        name: 'Lovely Loft',
        summary: 'A lovely Loft in Paris',
        bedrooms: 1,
        bathrooms: 1
      },
    );
  } catch(e) {
    console.error(e)
  }finally {
    await client.close();
  }
}

main().catch(console.error)


async

async function createListing(client, newListing) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing)
  console.log(`New listing created with the following id: ${result.insertedId}`)
}
async function listDatabases(client){
  const databasesList = await client.db().admin().listDatabases()

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`))
}




