import { Application, RequestHandler } from "express";

import userRoute from "../routes/user";
import aclsRoute from "../routes/acls";
import fetchDataFromAnotherServiceRoute from "../routes/fetchDataFromAnotherService";
import AuthMiddleware from "../middleware/authMiddleware";

interface RouteConfig {
  path: String;
  isPrivate: Boolean;
  route: RequestHandler;
}

export function apiRoutes(app: Application): void {
  const paths: RouteConfig[] = [
    { path: "user", isPrivate: false, route: userRoute },
    { path: "acls", isPrivate: true, route: aclsRoute },
    {
      path: "service",
      isPrivate: true,
      route: fetchDataFromAnotherServiceRoute,
    },
  ];

  return paths.forEach(({ path, route, isPrivate }) => {
    let middlewares: RequestHandler[] = [];
    if (isPrivate) middlewares.push(AuthMiddleware.authenticate);

    app.use(`/api/${path}`, ...middlewares, route);
  });
}
