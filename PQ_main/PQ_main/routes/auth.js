var MongoClient = require('mongodb').MongoClient;
const { Get } = require('./GetConst');
const refuseTable = {
	TRY: [],
	GENERAL: [],
	OTHER: [],
	ALL: [], //填入路由關鍵字可進行屏蔽, 應由上層往下層進行屏蔽, 盡量減少陣列長度。
};

const getIdAuth = (ID) => {
	return new Promise((resolve, reject) => {
		MongoClient.connect(
			Get('mongoPath') + 'EW',
			{ useNewUrlParser: true, useUnifiedTopology: true },
			function (err, db) {
				if (err) {
					reject('伺服器連線錯誤');
					throw err;
				}
				var table = db.db('EW').collection('personal_information');
				table.findOne(
					{ ID: ID },
					{ projection: { _id: 0 } },
					function (err, result) {
						if (err) {
							reject('伺服器連線錯誤');
							throw err;
						}
						db.close();
						if (result == null) {
							reject('不存在此帳號');
							return;
						} else if (result.auth) {
							resolve(result.auth);
							return;
						}
						reject('帳號不具有權限設置');
					}
				);
			}
		);
	});
};

const isAuthHaveLicence = (path, auth) => {
	if (!Object.keys(refuseTable).includes(auth)) return false;
	for (let i of refuseTable[auth]) {
		if (path.indexOf(i) > -1) return false;
	}
	return true;
};

const isRefused = async (req) => {
	const id = req.body.ID;
	if (!id) {
		//沒有Id 就留給後面的路由檢察 這邊直接給過
		return false;
	}
	let idAuth;
	try {
		idAuth = await getIdAuth(id);
	} catch (err) {
		return true;
	}
	if (!isAuthHaveLicence(req.path, idAuth)) {
		//path 沒在該權限級別內
		return true;
	}
	return false;
};

module.exports = async (req, res, next) => {
	if (await isRefused(req)) {
		res.render('warming', { message: '本帳號無此操作權限' });
		return;
	}
	next();
	return;
};
