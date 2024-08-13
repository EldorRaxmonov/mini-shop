import Joi from "joi";
import { sign } from "../../utils/jwt-service.js";
import { verify } from "../../utils/jwt-service.js";
import { register } from "./auth-service.js";
import { login } from "./auth-service.js";
import { userInfo } from "./auth-service.js";

//Schema of registration
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  fullName: Joi.string().min(2).max(20).required(),
  password: Joi.string().min(4).max(20).required(),
  email: Joi.string().email().required(),
});

//Registration
export const registerHandler = async (req, res, next) => {
  try {
    const body = req.body;
    const result = registerSchema.validate(body, { abortEarly: false });

    if (result.error) {
      return res.status(400).send({
        message: result.error,
      });
    }
    const user = await register(body);
    const token = sign({ userId: user.id });

    res.send({
      token,
    });
  } catch (e) {
    next(e);
  }
};

//Login
export const loginHandler = async (req, res, next) => {
  try {
    const body = req.body;
    const user = await login(body);
    if (typeof user == "undefined") {
      return res.status(404).send({
        message: "User not found",
      });
    }
    if (!user) {
      return res.status(401).send({
        message: "Password is incorrect",
      });
    }
    const token = sign({ userId: user.id });
    res.send({
      token,
    });
  } catch (e) {
    next(e);
  }
};

//Getting user info
export const userInfoHandler = async (req, res, next) => {
  try {
    let userToken = req.headers.authorization.split(" ")[1];
    let userPayload = verify(userToken);
    const user = await userInfo(userPayload.userId);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    if (!userToken || !userPayload) {
      return res.status(401).send({
        message: "Token is invalid",
      });
    }
    res.send({
      user,
    });
  } catch (e) {
    next(e);
  }
};
