import { Router } from "express";
import users from "./users";
import messages from "./messages";
import conversations from "./conversations";

const routes = Router();

routes.use("/users", users);
routes.use("/messages", messages);
routes.use("/conversations", conversations);

export default routes;
