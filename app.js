const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//templating engine
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    extname: ".handlebars",
    partialsDir: path.join(__dirname, "views/partials"),
  }),
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(port, () => console.log(`listening to port ${port}`));
