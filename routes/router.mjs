import express from 'express';
import bcrypt from 'bcryptjs';
import db from "../database/database.cjs"
import crypto from "crypto" 
import sendEmail from "../sendEmail/sendEmail.cjs"

const clientURL = "http://localhost:3080";
  

const router = express.Router();



router.get('/', async (req, res) => {
    res.render("index")
})
router.get('/success', async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).render("401")
  }

   let inputSessionData = req.session.user
    res.render("success")
})
router.get('/logIn', async (req, res) => {
    let inputSessionData = req.session.inputData

    if (!inputSessionData) {
      inputSessionData = {
        hasError: false,
        email: "",
        password: ""
      }
    }
  
    req.session.inputData = null
  
    res.render("logIn", {inputData: inputSessionData});
})
router.post('/logIn', async (req, res) => {
    const userData = req.body
    const enteredEmail = userData.email
    const enteredPassword = userData.password


    const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({email: enteredEmail})

    if (!existingUser) {
      req.session.inputData = {
        hasError:true,
        message: "Could not log in user doesn't exist",
        email:enteredEmail,
        password: enteredPassword
      }
      req.session.save(function () {
         res.redirect("/logIn");
      }) 
      return;
    }

    const equalPasswords =   await bcrypt.compare(enteredPassword, existingUser.password)

    if (!equalPasswords) {
      req.session.inputData = {
        hasError:true,
        message: "Could not logIn - passwords are not equal",
        email:enteredEmail,
        password: enteredPassword
      }
      req.session.save(function () {
         res.redirect("/logIn");
      }) 
      return;
    }
else{
  console.log("loggedIn")
  req.session.user = {
    id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email
  }
  req.session.isAuthenticated = true
  req.session.save(() => {
    res.redirect("/success")
  })
  return;
}
})
router.get('/signup', async (req, res) => {
    let inputSessionData = req.session.inputData

    if (!inputSessionData) {
      inputSessionData = {
        hasError: false,
        email: "",
        password: ""
      }
    }

    req.session.inputData = null

    res.render("signup", {inputData: inputSessionData});
})
router.post('/signup', async (req, res) => {
    const userData = req.body
    const enteredEmail = userData.email
    const enteredName = userData.name
    const enteredUserName = userData.username

    const enteredPassword = userData.password
    const confirmEnteredPassword = userData.ConfirmPassword
 


    if (enteredPassword !==  confirmEnteredPassword) {
      req.session.inputData = {
        hasError:true,
        message: "Passwords must be equal",
        name: enteredName,
        userName: enteredUserName,
        email:enteredEmail,
        password: enteredPassword,
        confirmPassword: confirmEnteredPassword
      }
      req.session.save(function () {
         res.redirect("/signup");
      }) 
        return;
    }

    if (enteredPassword.length < 6 || enteredName.trim().length < 1) {
      req.session.inputData = {
        hasError:true,
        message: "Invalid lenght of data",
        name: enteredName,
        userName: enteredUserName,
        email:enteredEmail,
        password: enteredPassword,
        confirmPassword: confirmEnteredPassword
      }
      req.session.save(function () {
         res.redirect("/signup");
      }) 
        return;
    }

    const existingUser = await db.getDb().collection("users").findOne({email: enteredEmail})
    const existingUserName = await db.getDb().collection("users").findOne({userName: enteredUserName})

    if(existingUserName) {
      console.log("userName exists!")
      req.session.inputData = {
        hasError:true,
        userName: enteredUserName,
        message: "UserName in use!"
      }
      req.session.save(function () {
         res.redirect("/signup");
      }) 
      return;
    } 

    if(existingUser) {
      console.log("user exists!")
      req.session.inputData = {
        hasError:true,
        message: "User Exists!"
      }
      req.session.save(function () {
         res.redirect("/logIn");
      }) 
      return;
    } 


          const hashedPassword = await bcrypt.hash(enteredPassword, 12);
         
          const user = {
            name: enteredName,
            userName: enteredUserName,
            email: enteredEmail,
            password: hashedPassword
          }
        await db.getDb().collection("users").insertOne(user)
        console.log("successful sign Up")
         res.redirect("/success");
})
router.get("/forgot", async (req, res) => {
  
  res.render("forgot")
})
router.post("/forgot", async (req, res) => {
  const userData = req.body;
  const enteredEmail =  userData.email
  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({email: enteredEmail}) 

    if (!existingUser) {
      throw new Error("User does not exist");
  }
  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 6);

  const token = {
    userId: existingUser.userName,
    token: hash,
    createdAt: Date.now()
  }

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${existingUser._id}`;
  sendEmail(existingUser.email,"Password Reset Request",{name: existingUser.name, link: link,},"../templates/requestResetPassword.handlebars");
  return link;
  
})



export default router;