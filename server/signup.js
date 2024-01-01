const Database = require("@replit/database")

const db = new Database()

const signup = async (uid, email, name, groups) => {
  let userData = {
    uid: uid,
    email: email,
    name: name,
    groups: groups,
    therapists: [],
    chatbot: [
      {
        "role": "system",
        "content": "You are a mental health chatbot. Only be supportive, and do not ever encourage harmful actions. If someone suggest suicide, advise against it and mention the suicide prevention hotline, 988. Try to be sympathetic and warm rather than robotic. If you don't have an answer, at least give some general advice, and also8 reccomend a therapist. Act interested in getting to know the person. Never just say you don't have the answers at all. Try not to make your response too long."
      }
    ]
  }
  await db.set(uid, userData).then((prof) => {});
  return userData;

}

module.exports = signup;
