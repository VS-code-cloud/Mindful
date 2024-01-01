const Database = require("@replit/database")
const db = new Database()

async function createData(data) {
  var result
  try {
    db.set(data.uid, data).then((setVal) => {
      result = setVal
    })
  } catch (error) {
    console.error('Err ', error);
  }
  return result;
}

async function findByUid(uid) {
  var user
  try {
    await db.get(uid).then(value => {
      user=value})

  } catch (err) {
    console.error('Error:', err);
  }
  return user
}
async function findByGroup(group, collectionName) {
  var users
  try {
    await db.list(collectionName).then(async matches => {
      let allUsers = []
      for (let i=0; i<matches.length; i++) {
        let user = await findByUid(matches[i])
        allUsers.push(user)
      }
      users = allUsers.filter(match => match?.group?.includes(group))
      })
    return users
  } catch (err) {
    console.error('Error:', err);
  }
  
}
async function findByEmail(email, collectionName) {
  var user
  try {
    db.list(collectionName).then(matches => {
      user = matches.find(match => match.email === email)[0]
      })
  } catch (err) {
    console.error('Error:', err);
  }

  return user
}

async function updateData(uid, data) {
  var result
  try {
    db.set(uid, data).then((setVal) => {
      result = setVal
    })
  } catch (error) {
    console.error('Err ', error);
  }
  return result;
}

module.exports.createData = createData;
module.exports.updateData = updateData;
module.exports.findByUid = findByUid;
module.exports.findByEmail = findByEmail;
module.exports.findByGroup = findByGroup