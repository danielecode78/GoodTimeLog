if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utilities/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const connectMongo = require("connect-mongo");

const expRoutes = require("./routes/expRoutes");
const comRoutes = require("./routes/comRoutes");
const userRoutes = require("./routes/usersRoutes");

const setCurrentPage = require("./middlewares/setCurrentPage");

// mongoose.connect("mongodb://localhost:27017/goodtimelog");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connessione riuscita"))
  .catch((err) => console.error("Errore connessione:", err.message));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// ------------------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(setCurrentPage);

app.use(methodOverride("_method"));
app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist")
);

const sessionConfig = {
  name: "sessiongoodtimelog",
  secret: "cipollina",
  resave: false,
  saveUninitialized: true,
  store: connectMongo.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 1000 * 60 * 60 * 24 * 7,
  }),
  cookie: {
    httpOnly: true,
    secure: false, // Da rivedere in fase di pubblicazione reale
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/experiences", expRoutes);
app.use("/", comRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Pagina non trovata", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Ops, qualcosa è andato storto!!!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Il server è in ascolto sulla porta 3000");
});
