import { prisma } from "../../utils/prisma-service.js";
import bcrypt from "bcrypt";

//Registration
export const register = async (userData) => {
  try {
    const isExists = await prisma.user.findUnique({
      where: {
        username: userData.username,
      },
    });

    if (isExists) {
      throw new Error("Username already in use");
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashPassword,
      },
    });

    return user;
  } catch (e) {
    console.log("Registration Error: ", e);
    throw e;
  }
};

//Login
export const login = async (userData) => {
    let user = await prisma.user.findFirst({
      where: { username: userData.username },
    });

    if (!user) {
      return;
    }
    if (!bcrypt.compareSync(userData.password, user.password)) {
      return false;
    } else {
      return user;
    }
};

//Getting info about user
export const userInfo = async (id) => {
    let user = await prisma.user.findFirst({
      where: { id: Number(id) },
    });

    if (!user) {
      return null;
    }
    delete user.password;
    return user;
};
