const { MongoClient } = require('mongodb');

async function main() {
  const uri = ""
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  try {
    //Connect to MongoDB cluster
    await client.connect()
    //Make appropriate DB calls
    await findOneListingByName(client, 'Cozy Cottage')
    await upsertListingByName(client, 'Cozy Cottage', {
      beds: 2
    })
  } catch(e) {
    console.error(e)
  }finally {
    await client.close();
  }
}

main().catch(console.error)

async function upsertListingByName(client, nameOfListing, updatedListing) {
    const result = await client
      .db('sample_airbnb')
      .collection('listingsAndReviews')
      .updateOne({ name: nameOfListing }, { $set: updatedListing },
        { upsert: true}
        );
    console.log(`${result.matchedCount} documents matched the query criteria`)
    if (result.upsertCount > 0) {
      console.log(`One document was inserted with the id of ${result.upsertedId._id}`)
    } else {
      console.log(`${result.modifiedCount} documents was/were updated`)
    }
}

async function findListingWithMinimumBedroomsBathroomsAndMostRecentReviews(
  client,
  { minumumNumberOfBedrooms = 0,
   minumumNumberOfBathrooms = 0, 
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER } = {}
) {
  const cursor = client.db('sample_airbnb').collection('listingsAndReviews').find({
    bedrooms: { $gte: minumumNumberOfBedrooms}, //$gte = mongodb comparise operator greater than or equal to
    bathrooms: { $gte: minumumNumberOfBathrooms}
  })
  .sort( { last_review: -1 }).limit( maximumNumberOfResults)

  const results = await cursor.toArray()
  if(results.length> 0) {
    console.log(`Found listing(s) with at least ${minumumNumberOfBedrooms} bedrooms and ${minumumNumberOfBathrooms} bathrroms`)
    results.forEach((result, i) => {
      date = new Date(result.last_review).toDateString();

      console.log();
      console.log(`${i + 1}. name: ${result.name}`)
      console.log(` _id: ${result._id}`)
      console.log(` bedrooms: ${result.bedrooms}`)
      console.log(` bathrooms: ${result.bathrooms}`)
      console.log(` most recent review date: ${new Date(result.last_review)}`)
    })
  }
}

async function updateListingByName(client, nameOfListing, updatedListing) {
  const result = await client.db('sample_airbnb').collection('listingsAndReviews').updateOne(
    { name: nameOfListing}, 
    { $set: updatedListing}
  )

  console.log(`${result.matchedCount} documents matched the query criteria`)
  console.log(` ${result.modifiedCount} documents was/were updated`)

}

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




