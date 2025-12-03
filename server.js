const express = require("express");
const url_model = require("./models/shorturl.js");
const mongoose = require("mongoose");
const app = express();

// constant
const PORT = process.env.PORT;
const LOCALHOST_IP = process.env.LOCALHOST_IP;
const MONGO_URI = process.env.MONGO_URI;

const connectMongoDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Successfully Connected to MongoDB !!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", async (req, res) => {
  const urlLists = await url_model.find();
  res.render("index", { shorturls: urlLists });
});

app.post("/shorturls", async (req, res) => {
  await url_model.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shorturl", async (req, res) => {
  const shorturl = await url_model.findOne({ short: req.params.shorturl });
  if (shorturl == null) return res.sendStatus(404);

  shorturl.clicks++;
  shorturl.save();

  await res.redirect(shorturl.full);
});

app.post("/:id", async (req, res) => {
  const id = req.params.id;
  const deleteAction = await url_model.findOneAndDelete({ _id: id });
  if (deleteAction == null) return res.sendStatus(404);

  res.redirect("/");
});

app.listen(PORT, () => {
  connectMongoDB(MONGO_URI);
  console.log(`Server is running on PORT ${PORT}`);
});
