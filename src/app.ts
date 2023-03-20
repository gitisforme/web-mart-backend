import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from 'helmet';
import multer from 'multer';
import compression from 'compression';
import cookieParser from "cookie-parser";

import config from "./config";
import routes from "./route";

const app = express();

app.set("port", config.PORT);

app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));

/**
 * https://github.com/expressjs/multer
 */
app.use(multer().array('test')); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', credentials: true }));
app.use(compression());

app.use("/", routes());

export default app;
