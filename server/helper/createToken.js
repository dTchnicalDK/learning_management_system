import jwt from "jsonwebtoken";

const createToken = async (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  // console.log("token created", token);
  return token;
};

export default createToken;
