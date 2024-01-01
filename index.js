//============= INITIALIZE FIREBASE =============\\
const firebase = require("@firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyBCl9ofom-aAS--QLRpEPL8ryoRXn32QkA",
  authDomain: "therapy-92ac2.firebaseapp.com",
  projectId: "therapy-92ac2",
  storageBucket: "therapy-92ac2.appspot.com",
  messagingSenderId: "83184674075",
  appId: "1:83184674075:web:ff32343fc2e8f6a0819fbe",
  measurementId: "G-MY9M225VEE"
};

const fbApp = firebase.initializeApp(firebaseConfig);

const {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} = require('firebase/auth')
const auth = getAuth();

//================= SERVER CODE =================\\
const signupProcess = require('./server/signup')
const getUserData = require('./server/getData');
const {filterPostsByGroup, createPost, updatePost, findPostByUid} = require('./server/postController.js');



//================== RUN SERVER ==================\\

var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser'); 
var ejs = require("ejs");

const sendMsg = require("./server/sendMessage")

/*
const signupProcess = require('./server/signup')
const getUserData = require('./server/getData');
*/

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use('/static', express.static('static'))

app.use(express.urlencoded({ extended: true }))

//==================== PAGES ====================\\

app.get('/', (req, res) => {
  res.render("index.html", {})
})


app.get('/signup', (req, res) => {
  error = req.query.error || 0;
  isError = (error) ? (true) : false;
  res.render('signup.html', {
    error: error,
    isError: isError
  })
})


app.get('/login', (req, res) => {
  let error = req.query.error || undefined;
  let isError = (error) ? true : false;
  res.render("login.html", {
    error: error,
    isError: isError
  })
})

app.get('/home', (req, res) => {
  res.render("home.html", {})
})

app.get('/chat', (req, res) => {
  res.render("chat.html", {})
})

app.get('/community', (req, res) => {
  res.render("community.html", {})
})
app.get('/post', (req, res) => {
  res.render("post.html", {})
})
//================== UPDATE ====================\\

app.get('/update', async (req,res) => {
  let uid = req.query.uid;
  let strict = Boolean(req.query.strict);
  if (!uid) {
    res.redirect("/signup")
  }
  let bypass = false;
  if (strict && (!auth.currentUser)) {
    res.redirect("/login")
  } else if (strict && auth.currentUser) {
    bypass = true;
  }

  let userData = await getUserData(uid);

  res.render('autologin.html', {
    uid: uid,
    userData: JSON.stringify(userData),
    bypass: bypass
  })
})

app.post('/loginuser', (req, res) => {

  email = req.body.email;
  password = req.body.password;

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    uid = user.uid;

    res.redirect(`update?uid=${uid}`)
  })
  .catch((error) => {
    const errorCode = error.code;
    res.redirect(`/login?error=${errorCode}`)
  });
})
app.post('/api/post', async (req, res) => {
  data = await JSON.parse(JSON.stringify(req.body));
  let post = await createPost(data);
  res.send(post);
})
app.get('/api/post/group/:group', async function(req, res) {
    let posts = await filterPostsByGroup(req.params.group)
    res.send(posts)
})
//==================== API ====================\\
app.post('/createUser', (req, res) => {

  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  var groups = req.body.groups;
  var confirmPassword = req.body.confirmPassword;

  if (password != confirmPassword) {
    res.redirect(`/signup?error=Passwords do not match`)
  }

  if (!name) {
    res.redirect(`/signup?error=Name field required`)
  }

  createUserWithEmailAndPassword(auth, email,password)
  .then(async function success(userRecord)
  {
    let user = userRecord.user
    let newUData = await signupProcess(user.uid, user.email, name, groups)
    res.redirect(`update?uid=${user.uid}`)
  })
  .catch(function error(error)
  {
    if (error.code) {
      res.redirect(`/signup?error=${error.code}`)
    }
  });

})

app.post('/sendChat', async (req, res) => {
  console.log('c', req.body, typeof req.body, JSON.stringify(req.body))
  let strData = JSON.stringify(req.body)
  let str2 = strData/*.replace("arrS","[").replace("arrD","]").replace("dictS", "{").replace("dictD", "}").replace("\\","")*/;
  let data = (JSON.parse(str2))
  data.chatbot = data.chatbot.replace("arrS","[").replace("arrD","]").replace("dictS", "{").replace("dictD", "}").replace("\\","")
  data.chatbot=JSON.parse(data.chatbot)
  data.groups = JSON.parse(data.groups)
  console.log('data', data)
  var uid = data.uid;
  await sendMsg(uid, data);
  res.send(data);
})


//================== RUN SERVER ==================\\

app.listen(3000, () => {
  console.log("Server Running")
})