const express = require("express");
const app = express();
const cors = require("cors");
const bp = require("body-parser");

const winston = require("winston");
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: "ova.log"})
    ]
});

const jsonParser = bp.json();

app.use(cors());

app.post('/', jsonParser, (req, res) => {
    try {
        logger.info(req.body);
        res.status(200).json({message: "Success"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.listen(8080);