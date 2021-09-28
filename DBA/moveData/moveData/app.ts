const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const goalArray = [
	'5f8fbac542e2e007207d72f6',
	'5f8fbb4742e2e007207d72f8',
	'5f8fb9604edb7260902e0dcf',
];

const updateAll = async (db) => {
	const table1 = db.db('GQ_data').collection('B_one');
	const table2 = db.db('GQ_data').collection('A_one');
	const result = await table1.find({}).toArray();
	result.forEach(async (doc) => {
		if (goalArray.includes(doc._id.toString())) {
			table2.insertOne(doc);
			table1.deleteOne({ _id: doc._id });
		}
	});
	return;
};

const findAll = async (db) => {
	const table = db.db('GQ_data').collection('B_one');
	const result = await table.find({}).toArray();
	result.forEach(async (doc) => {
		console.log(doc.ID + ':' + doc._id.toString());
	});
	return;
};

const main = async () => {
	const db = await mongoClient.connect('mongodb://localhost:27017/GQ_data', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	await updateAll(db);
	await findAll(db);
	db.close();
	process.exit(0);
};

main();
