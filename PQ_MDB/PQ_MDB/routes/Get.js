'use strict';
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const { Get } = require('./GetConst');
const core_ID = Get('ID');
const core_password = Get('password');

/**************************************
./Get/table
1. 測帳密
2. find collection(2 種 type)
  **************************************/

function FindCollection(db, DB, collection, fillterKey, fillterValue, type) {
	return new Promise((resolve, reject) => {
		var table = db.db(DB).collection(collection);
		var findThing = {};
		if (type == 1 || type == 2 || type == 3)
			findThing[fillterKey] = fillterValue;
		var projection = { _id: 0 };
		if (type == 5) projection = { filepath: 1, Difficulty: 1 };
		if (type == 3) projection['data'] = 0;
		var set = { projection: projection };
		if (type == 1)
			table.findOne(findThing, set, function (err, result) {
				if (err) {
					reject({ result: '伺服器連線錯誤' });
					throw err;
				}
				resolve({ result: 'success', data: result });
			});
		else
			table
				.find(findThing, set)
				.sort({ _id: 1 })
				.toArray(function (err, result) {
					if (err) {
						reject({ result: '伺服器連線錯誤' });
						throw err;
					}
					resolve({ result: 'success', data: result });
				});
	});
}

router.post('/table', function (req, res) {
	var ID = req.body.ID;
	var password = req.body.password;
	var DB = req.body.DB;
	var collection = req.body.collection;
	var fillterKey = req.body.fillterKey;
	var fillterValue = req.body.fillterValue;
	var type = req.body.type;
	//console.log(req.body);
	if (core_ID == ID && core_password == password) {
		MongoClient.connect(
			Get('mongoPath') + DB,
			{ useNewUrlParser: true, useUnifiedTopology: true },
			function (err, db) {
				if (err) {
					res.json({ result: '伺服器連線錯誤' });
					throw err;
				}
				FindCollection(db, DB, collection, fillterKey, fillterValue, type)
					.then((pkg) => res.json(pkg))
					.catch((error) => res.json(error))
					.finally((pkg) => db.close());
			}
		);
	} else res.json({ result: '帳號或密碼錯誤' });
});

/********************************
 * ./Get/MtableWithDiff
 * 專門給 GQ.M table 用的特殊路由
 * 1. 抓取影片難度
 * 2. 把影片難度和併進 Mtable 的全體資料
 * 注: 標出全體資料內各影片的難度
 * ******************************/

router.post('/MtableWithDiff', function (req, res) {
	var ID = req.body.ID;
	var password = req.body.password;
	var type = req.body.type;
	//console.log(req.body);
	if (type != 'one' && type != 'video') {
		res.json({ result: '參數錯誤' });
		return;
	}
	if (core_ID == ID && core_password == password) {
		MongoClient.connect(
			Get('mongoPath') + 'data',
			{ useNewUrlParser: true, useUnifiedTopology: true },
			async function (err, db) {
				if (err) {
					res.json({ result: '伺服器連線錯誤' });
					throw err;
				}
				try {
					const filepathToDifficulty = {};
					const videoResource = FindCollection(
						db,
						'data',
						'Mtable',
						'NA',
						'NA',
						5
					);
					const MtableData = FindCollection(
						db,
						'GQ_data',
						'M_' + type,
						'NA',
						'NA',
						0
					);
					const allResult = await Promise.all([
						videoResource.then(async (result) => {
							result.data.map((value) => {
								const { filepath, Difficulty } = value;
								filepathToDifficulty[filepath] = Difficulty;
							});
							return;
						}),
						MtableData,
					]);
					db.close();
					const union =
						type == 'one'
							? allResult[1].data.map((element) => {
									const newData = element.data.map((value) => {
										const tmp = {
											...value,
											difficulty: filepathToDifficulty[value.file],
										};
										return tmp;
									});
									element.data = newData;
									return element;
							  })
							: allResult[1].data.map((element) => {
									const tmp = {
										...element,
										difficulty: filepathToDifficulty[element.pathname],
									};
									return tmp;
							  });
					res.json({ result: 'success', data: union });
				} catch (err) {
					console.log(err);
					res.json({ result: '伺服器連線錯誤' });
				}
			}
		);
	} else res.json({ result: '帳號或密碼錯誤' });
});

module.exports = router;
