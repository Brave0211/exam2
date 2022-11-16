import jwt from "jsonwebtoken"
import sha256 from "sha256"
import { read } from "../utils/FS.js"
import { loginPost } from "../validate/validate.js"
import { errorHandler } from "../errors/errorHandler.js"

const LOGIN = async (req, res, next) => {
   const { error, value } = loginPost.validate(req.body);

   if(error) {
      return next(new errorHandler(error.message, 400));
   }

   const { username, password } = value;

   const user = await read("user.model.json").catch((error) =>
      next(new errorHandler(error, 401))
  );

  const newUser = user.find(
      (e) => e.username == username && e.password == sha256(password)
  );

  if (!newUser) {
      return next(new errorHandler("Username or password wrong", 500));
  }

  if (newUser) {
      res.status(200).json({
      message: "Success",
      token: jwt.sign(1, process.env.SECRET_KEY),
      status: 200,
      });
  }
}

export { LOGIN };