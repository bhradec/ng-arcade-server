const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mysql = require("promise-mysql");
const path = require("path");
const config = require("./config");
const apiRouter = require("./api/api-router");

const init = async () => {
    try {
        let connectionPool = await mysql.createPool(config.connectionPoolData);
        let app = express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cors());
        app.use(morgan("dev"));

        app.use("/api", apiRouter(express, connectionPool));
        app.use(express.static(path.join(__dirname, "./public/front")));

        /* Ruta za posluživanje statičnih datoteka. */
        app.get("/public/uploads/:fileName", async (req, res) => {
            let fileName = req.params.fileName;
            res.sendFile(path.join(__dirname, config.uploadPath + fileName));
        });

        app.get("*", (req, res) => {
            res.sendFile(path.join(__dirname, "./public/front/index.html"));
        });

        app.listen(config.port);
        console.log("Server running on port:", config.port);
    } catch (err) {
        console.error(err);
    }
}

init();
