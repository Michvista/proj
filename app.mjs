import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import mongodbStore from 'connect-mongodb-session'; 
import db from "./database/database.cjs"

// import passport from 'passport'
// import passport from 'passport';
// import passportConfig from './routes/passportConfig.mjs';

// passportConfig(passport);


// app.use(passport.initialize())
// app.use(passport.session())
 
dotenv.config()

const MongoDBStore = mongodbStore(session)
const sessionStore = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/',
    databaseName: "project",
    collection: 'usersSessions'
});

 
const app = express();
import routes from "./routes/router.mjs"

const __filename = fileURLToPath(import.meta.url)

// app.get(
//     "/auth/google",
//     passport.authenticate("google", { scope: ["email", "profile"] })
//   );
//   app.get(
//     "/auth/google/callback",
//     passport.authenticate("google", { session: false }),
//     (req, res) => {
//       res.redirect("/success");
//     }
//   );

app.use(express.json())
app.use(cors())
// app.use(express.urlencoded({extended: true}))
app.use(bodyParser.urlencoded({ extended: true }));

let port = 3080;     

app.use(session({
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore
  }));

const __dirname = path.dirname(__filename);
  
app.use(express.static('css'));
app.use(express.static('images'));
app.set('view engine', 'ejs')


app.use(routes)

app.use((req, res) => {
    res.send("<p> 404 page not found </p>");
})
   
db.connectDatabase().then(function () {
    app.listen(port)
    console.log("listening")
})
