import jwt from "jsonwebtoken";

//Exporting "sign" which we need to create tokens
export const sign = (payload) => {
  return jwt.sign(payload, "SECRET");
};

//Exporting "verify" which we need to verify tokens
export const verify = (token) => {
  try{
    return jwt.verify(token, "SECRET");
  } catch(error){
    return
  }
};
 