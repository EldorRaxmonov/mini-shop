import { Router } from "express";
import { registerHandler } from "./auth-controller.js";
import { loginHandler } from "./auth-controller.js";
import { userInfoHandler } from "./auth-controller.js";

const router = Router();

//Routers
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/info", userInfoHandler);

export default router;
