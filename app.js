const express = require("express");
const { default: getData } = require("./scraper");

const app = express();

app.get("/", (req, res) => res.send("Hello world!"));

const port = process.env.PORT || 8082;

app.listen(port, () => console.log("Server running on port ${port}"));

