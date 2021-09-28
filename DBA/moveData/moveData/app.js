var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const goalArray = [
    '5f8fbac542e2e007207d72f6',
    '5f8fbb4742e2e007207d72f8',
    '5f8fb9604edb7260902e0dcf',
];
const updateAll = (db) => __awaiter(this, void 0, void 0, function* () {
    const table1 = db.db('GQ_data').collection('B_one');
    const table2 = db.db('GQ_data').collection('A_one');
    const result = yield table1.find({}).toArray();
    result.forEach((doc) => __awaiter(this, void 0, void 0, function* () {
        if (goalArray.includes(doc._id.toString())) {
            table2.insertOne(doc);
            table1.deleteOne({ _id: doc._id });
        }
    }));
    return;
});
const findAll = (db) => __awaiter(this, void 0, void 0, function* () {
    const table = db.db('GQ_data').collection('B_one');
    const result = yield table.find({}).toArray();
    result.forEach((doc) => __awaiter(this, void 0, void 0, function* () {
        console.log(doc.ID + ':' + doc._id.toString());
    }));
    return;
});
const main = () => __awaiter(this, void 0, void 0, function* () {
    const db = yield mongoClient.connect('mongodb://localhost:27017/GQ_data', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    //await updateAll(db);
    yield findAll(db);
    db.close();
    process.exit(0);
});
main();
//# sourceMappingURL=app.js.map