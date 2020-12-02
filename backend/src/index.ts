import "./dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { Routes } from "./routes";
import { logger } from "./logger";
import connect from "./connect";
import { logRequest } from "./middlewares/log-request";
import { checkAuth } from "./middlewares/eosio-auth";
import { getStorageClient } from "./eos/storage";

async function start() {
  const db = process.env.MONGO_URL || "mongodb://localhost:27017/hoster";
  connect({ db });

  const app = express();
  app.enable("trust proxy");
  app.use(cors());
  app.use(bodyParser.json({
    limits: `20mb`,
  }));
  app.use(bodyParser.urlencoded({ extended: true, limits: `20mb` }));
  app.use(fileUpload({
    limits: {
      // doesn't work correctly?
      fileSize: 100 * 1024 * 1024,
      // fields: 50,
      // files: 1,
      // parts: 51,
      abortOnLimit: true,
    }
  }));
  app.use(logRequest);

  // register express routes from defined application routes
  Routes.forEach((route) => {
    (app as any)[route.method](
      route.route,
      route.requiresAuth ? checkAuth : (_, __, next) => next(),
      async (req: Request, res: Response, next: Function) => {
        try {
          const result = await new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          return res.json(result);
        } catch (err) {
          logger.error(err.stack);
          next(err);
        }
      }
    );
  });

  // custom error handler
  app.use(function (err, req, res, next) {
    res.statusCode = res.statusCode >= 300 ? res.statusCode : 500;
    res.send(err.message);
  });

  await getStorageClient().init()

  // start express server
  const PORT = process.env.PORT || 3003;
  const VERSION = process.env.npm_package_version;
  const NAME = process.env.npm_package_name;
  app.set("views", __dirname + "/views");
  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");
  app.listen(PORT);

  logger.info(
    `${NAME} v${VERSION}: Express server has started on port ${PORT}. Open http://localhost:${PORT}/logs`
  );
}

start().catch((error) => logger.error(`main error:`, error.message || error));

process.on("unhandledRejection", function (reason: any, p) {
  let message = reason ? (reason as any).stack : reason;
  logger.error(`Possibly Unhandled Rejection at: ${message}`);

  process.exit(1);
});
