const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const goalArray = [
	'5f88567b17fd124a0884cdf4',
	'5f8856f317fd124a0884cdf6',
	'5f88572117fd124a0884cdf8',
	'5f88572e17fd124a0884cdfa',
	'5f8fb5de1b45eb5eecb375af',
	'5f9598e31effbe50888f44bf',
	'5f985840a902a95460b15603',
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

const getList = async (db) => {
	const table = db.db('GQ_data').collection('B_one');
	const result: Array<any> = await table.find({}).toArray();
	const str =
		result.reduce((pre, cur) => {
			console.log(cur.data.length);
			if (cur.data.length > 238) return `${pre}"${cur._id.toString()}",`;
			return pre;
		}, '[') + ']';
	console.log(str);
	return;
};

const main = async () => {
	const db = await mongoClient.connect('mongodb://localhost:27017/GQ_data', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	//await updateAll(db);
	//await findAll(db);
	await getList(db);
	db.close();
	process.exit(0);
};

main();
