import jwt from "jsonwebtoken";

const isUserAuthenticated = async (req, res, next) => {
  //   console.log("token", req.cookies.token);
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(400).json({ message: "no token found!" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded token", decoded);
    req.userId = decoded._id;
    // console.log("middleware isTokenVerified", decoded._id);
    next();
  } catch (error) {
    console.log("middleware error", error.message || "something went wrong");
    res.status(400).json({ message: error.message || "internal server error" });
  }
};
export default isUserAuthenticated;
