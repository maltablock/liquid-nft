import HealthController from "./controller/HealthController";
import LogController from "./controller/LogController";
import UserController from "./controller/UserController";

export const Routes = [
  {
    method: "get",
    route: "/health",
    controller: HealthController,
    action: "version",
  },
  {
    method: "get",
    route: "/logs-N1ZXJZz3jA7eldkmtMJk6ciRlw31UJdvGHyaWxmYTVI",
    controller: LogController,
    action: "logs",
  },
  {
    requiresAuth: true,
    method: "post",
    route: "/user",
    controller: UserController,
    action: "login",
  },
  {
    requiresAuth: true,
    method: "post",
    // may not start with /user for some reason, bodyparser <> fileupload issue?
    route: "/upload",
    controller: UserController,
    action: "uploadFile",
  },
];
