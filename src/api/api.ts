import { Application, RequestHandler } from "express";

import userRoute from "../routes/user";
import { authenticate } from "../middleware/authMiddleware";

interface RouteConfig {
  path: String;
  isPrivate: Boolean;
  route: RequestHandler;
}

export function apiRoutes(app: Application): void {
  const paths: RouteConfig[] = [
    { path: "user", isPrivate: false, route: userRoute },
  ];

  return paths.forEach(({ path, route, isPrivate }) => {
    let middlewares: RequestHandler[] = [];
    if (isPrivate) middlewares.push(authenticate);

    app.use(`/api/${path}`, ...middlewares, route);
  });
}
