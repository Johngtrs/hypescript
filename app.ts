require("dotenv").config();
import express from "express";
import * as http from "http";
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';
import { RoutesConfig } from "./v1/common/routes.config";
import { MovieRoutesV1 } from "./v1/movies/movie.routes.v1";
import { HttpError } from "./v1/common/http.error";
import { Tools } from "./tools";

const app: express.Application = express();
const port = process.env.NODE_DOCKER_PORT;
const server: http.Server = http.createServer(app);
const routes: Array<RoutesConfig> = [];
const log: debug.IDebugger = debug('app');

app.use(express.json());
app.use(cors());

// Routes Logger
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    )
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));

// Check API-KEY for all routes
app.use((req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization != process.env.API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
});


// Trimmer
app.use((req, res, next) => {
    Tools.trimAll(req, res, next);
});

routes.push(new MovieRoutesV1(app));

// Handle errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof HttpError) {
        res.status(err.status).json({error: err.message});
      } else if (err instanceof Error) {
        res.status(500).json({error: err.message});
      } else {
        res.status(500).send("Internal Server Error");
      }
});

const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage);
});

server.listen(port, () => {
    routes.forEach((route: RoutesConfig) => {
        log(`Routes configured for ${route.getName()}`);
    });
    console.log(runningMessage);
});