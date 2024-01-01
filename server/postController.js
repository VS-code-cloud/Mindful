const { v4: uuidv4 } = require('uuid');
const { createData, updateData, findByUid, findByGroup}=require('./helpers.js')
//createPost receives title and description, plus authoruid and county
const createPost = async (data) => {
  var uid = uuidv4();
  data.uid = 'posts:'+uid
  data.timestamp = new Date()
  let post = await createData(data, "posts")
  return post
}
const updatePost = async (uid, data) => {
  //typically data updates community
  let updated = await updateData(uid, "posts", data)
  return updated
}
const findPostByUid = async (uid) => {
  let post = await findByUid(uid);
  return post
}
const filterPostsByGroup = async (group) => {
  let posts = await findByGroup(group, 'posts')
  return posts;
}
module.exports.filterPostsByGroup = filterPostsByGroup
module.exports.createPost = createPost;
module.exports.updatePost = updatePost;
module.exports.findPostByUid = findPostByUid;