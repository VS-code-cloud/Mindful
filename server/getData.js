const Database = require("@replit/database")

const db = new Database()

const getData = async (uid) => {

  var userData;

  await db.get(uid).then(value => {
    userData = value;
  });

  return userData;

}

module.exports = getData;