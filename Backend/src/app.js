const express = require("express");
const routes = require("./routes");
const mongoConnect = require("./db/db").mongoConnect;
const dotenv = require("dotenv");
dotenv.config();
const fileUpload = require("express-fileupload");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

require("./chatHandler")(io);

app.use(express.static(__dirname + "/images/"));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,AuthToken"
  );
  next();
});

routes.forEach((route) => app[route.method](route.path, route.handler));

mongoConnect(() => {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`Server is listening on Port ${PORT}`);
  });
});
