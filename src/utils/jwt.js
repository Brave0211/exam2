import jwt from "jsonwebtoken";

export default {
    sing: (payload) => jwt.sign(payload, process.env.SECRET_KEY),
    verify: (token) => jwt.verify(token, process.env.SECRET_KEY)
}