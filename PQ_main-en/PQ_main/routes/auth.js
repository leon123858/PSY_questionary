var MongoClient = require("mongodb").MongoClient;
const { Get } = require("./GetConst");
const refuseTable = {
  TRY: [],
  GENERAL: [],
  OTHER: [],
  ALL: [], //填入路由關鍵字可進行屏蔽, 應由上層往下層進行屏蔽, 盡量減少陣列長度。
};

const getIdAuth = (ID) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      Get("mongoPath") + "EW",
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) {
          reject("Connection to server failed");
          throw err;
        }
        var table = db.db("EW").collection("personal_information");
        table.findOne(
          { ID: ID },
          { projection: { _id: 0 } },
          function (err, result) {
            if (err) {
              reject("Connection to server failed");
              throw err;
            }
            db.close();
            if (result == null) {
              reject("Account does not exist.");
              return;
            } else if (result.auth) {
              resolve(result.auth);
              return;
            }
            reject("The account does not have access to this operation");
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
    res.render("warming", {
      message: "Your Account Does Not Have Permission To Access.",
    });
    return;
  }
  next();
  return;
};
