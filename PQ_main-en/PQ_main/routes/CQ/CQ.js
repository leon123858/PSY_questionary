'use strict';
var express = require('express');
var router = express.Router();
const { Get } = require('../GetConst');
var MongoClient = require('mongodb').MongoClient;
var SQ = require('./SQ');

const DQ_licence = [65, 84];
const SW_licence = ['SW1', 'SW2', 'SW3', 'SW4', 'SW5', 'SW6', 'SW7', 'SW8'];

/**********************
use sub route
 ***********************/
router.use('/SQ', SQ);

/**********************
 ./CQ/EQ
 ***********************/
router.post('/EQ', function (req, res) {
	res.render('CQ/EQ', { ID: req.body.ID, password: req.body.password });
});

/**********************
./CQ/DQ/: which
 ***********************/

router.post('/DQ/:which', function (req, res) {
	const whichNum = req.params.which.charCodeAt(0);
	if (whichNum >= DQ_licence[0] && whichNum <= DQ_licence[1])
		res.render('CQ/DQ/' + req.params.which, {
			ID: req.body.ID,
			password: req.body.password,
		});
	else res.render('warming', { message: '該操作不合法' });
});

/**********************
./CQ/SW/: which
 ***********************/

router.post('/SW/:which', function (req, res) {
	if (SW_licence.includes(req.params.which))
		res.render('CQ/SW/' + req.params.which, {
			ID: req.body.ID,
			password: req.body.password,
		});
	else res.render('warming', { message: '該操作不合法' });
});

/**********************
./CQ/GetDate
取得使用者過去填答時間
 ***********************/

function CheckPassword(db, ID, password) {
  return new Promise((resolve, reject) => {
    var table = db.db("EW").collection("personal_information");
    table.findOne(
      { ID: ID },
      { projection: { _id: 0 } },
      function (err, result) {
        if (err) {
          reject({ result: "Connection to server failed" });
          throw err;
        }
        if (result == null) reject({ result: "Account does not exist." });
        else if (result.password == password) resolve(1);
        else reject({ result: "Wrong Password" });
      }
    );
  });
}

function GetDate(db, ID) {
  return new Promise((resolve, reject) => {
    var table = db.db("CQ_personal").collection("personal_Date");
    table.findOne(
      { ID: ID },
      { projection: { _id: 0, ID: 0 } },
      function (err, result) {
        if (err) {
          reject({ result: "Connection to server failed" });
          throw err;
        }
        if (result == null) resolve({ result: "success", data: {} });
        else resolve({ result: "success", data: result });
      }
    );
  });
}

router.post("/GetDate", function (req, res) {
  var ID = req.body.ID;
  var password = req.body.password;

  MongoClient.connect(
    Get("mongoPath") + "EW",
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) {
        res.json({ result: "Connection to server failed" });
        throw err;
      }
      CheckPassword(db, ID, password)
        .then((pkg) => GetDate(db, ID))
        .then((pkg) => res.json(pkg))
        .catch((error) => res.json(error))
        .finally((pkg) => db.close());
    }
  );
});

/**********************
./CQ/GetHistory/:<questionary type>
取得使用者近9次填答score( or 特定欄位)
 ***********************/

const whichScore = {
  A: "Score",
  B: "Score",
  C: "Score",
  D: "Score",
  E: "Acc",
  F: "Score",
  G: "Score",
  H: "Score",
  J: "Score",
  K: "Score",
  L: "Score",
  M: "T_Taget",
  N: "Score",
  O: "Score",
  P: "Score",
  Q: "Score",
  R: "Score",
  S: "Score",
  T: "Score",
};
const haveDifferentMode = {
  M: "Level",
  Q: "Level",
  T: "Speed",
};

function GetLevel(db, ID, which) {
  return new Promise((resolve, reject) => {
    var table = db.db("CQ_data").collection(which + "_group");
    table
      .find({ ID: ID }, { projection: { _id: 0, ID: 0, Date: 0 } })
      .sort({ _id: -1 })
      .limit(1)
      .toArray(function (err, result) {
        if (err) {
          reject({ result: "Connection to server failed" });
          throw err;
        }
        resolve(result[0].data[haveDifferentMode[which]]);
      });
  });
}

function GetScore(db, ID, which, filterValue) {
  return new Promise((resolve, reject) => {
    var table = db.db("CQ_data").collection(which + "_group");
    let filter = { ID: ID };
    if (filterValue) {
      const key = `data.${haveDifferentMode[which]}`;
      const value = filterValue;
      const tmp = {};
      tmp[key] = value;
      filter = {
        $and: [{ ID: ID }, tmp],
      };
    }
    table
      .find(filter, { projection: { _id: 0, ID: 0, Date: 0 } })
      .sort({ _id: -1 })
      .limit(10)
      .toArray(function (err, result) {
        if (err) {
          reject({ result: "Connection to server failed" });
          throw err;
        }
        result.shift();
        let reArr = result.map((pkg) => {
          return pkg.data[whichScore[which]];
        });
        for (let i = reArr.length; i < 9; i++) {
          reArr.push("NA");
        }
        resolve({ result: "success", data: reArr });
      });
  });
}

router.post("/GetHistory/:which", function (req, res) {
  var ID = req.body.ID;
  var password = req.body.password;
  var which = req.params.which;
  if (!Object.keys(whichScore).includes(which)) {
    res.json({ result: "Illegal parameter" });
    return;
  }
  MongoClient.connect(
    Get("mongoPath") + "EW",
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) {
        res.json({ result: "Connection to server failed" });
        throw err;
      }
      if (Object.keys(haveDifferentMode).includes(which)) {
        CheckPassword(db, ID, password)
          .then((pkg) => GetLevel(db, ID, which))
          .then((filterValue) => GetScore(db, ID, which, filterValue))
          .then((pkg) => res.json(pkg))
          .catch((err) => res.json(err))
          .finally((pkg) => db.close());
        return;
      }
      CheckPassword(db, ID, password)
        .then((pkg) => GetScore(db, ID, which))
        .then((pkg) => res.json(pkg))
        .catch((err) => res.json(err))
        .finally((pkg) => db.close());
    }
  );
});

module.exports = router;
