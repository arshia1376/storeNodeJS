const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const winston = require('winston');
const app = express();
const mongoose = require("mongoose");
require("express-async-errors");
require("winston-mongodb");
const CustomerRoutes = require("./routes/CustomerRoutes");
const UserRoutes = require("./routes/UserRoutes");
const HomeRoutes = require("./routes/HomeRoutes");
const Error = require("./http/middleware/Error");



class Application {
    constructor() {
        this.setupExpressServer();
        this.setupMongoose();
        this.setupRoutesAndMiddleware();
        this.setupConfigs();
    }

    setupExpressServer() {
        const port = process.env.myPort || 3001;
        app.listen(port, (err) => {
            if (err) console.log(err);
            else console.log("app listen to port 3001");
        })
    }

    setupMongoose() {
        mongoose.connect("mongodb://localhost:27017/toplearn", {
        }).then(() => {
            console.log("db connected");
        }).catch(err => {
            console.log("db not connected", err);
        })
    }

    setupRoutesAndMiddleware() {
        app.use(express.json());
        //data teq url
        app.use(express.urlencoded({ extended: true }))
        //download img and text and...
        app.use(express.static("public"))
        //format log debug
        if (app.get("env") === "development") {
            app.use(morgan("tiny"));
        }
        //secret req port
        app.use(cors())
        app.use(CustomerRoutes)
        app.use(HomeRoutes)
        app.use(UserRoutes)
        app.use(Error)
    }

    setupConfigs() {
        winston.add(new winston.transports.File({ filename: 'error-log.log' }));
        winston.add(new winston.transports.MongoDB({
            db: "mongodb://localhost:27017/toplearn",
            level: "error"
        }));
    }
}
//template html pug
app.set("view engine", "pug")
app.set("views", "./views") //default

module.exports = Application;




