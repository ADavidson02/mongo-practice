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
 await createMultileListings(client, [
   {
     name: 'Infinite Views',
     summary: 'Modern home with infinite views from the pool',
     bedrooms: 5,
     bathrooms: 4.5,
     beds: 5,
   },
   {
     name: 'Private room in London',
     property_type: 'Apartment',
     bedrooms: 1,
     bathrooms: 0,
   },
   {
     name: 'Beautiful Beach House',
     property_type:
       'Enjoy relaxed beach living in this house with a private beach',
     bedrooms: 4,
     bathrooms: 2,
     last_review: new Date(),
   },
 ]);
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




