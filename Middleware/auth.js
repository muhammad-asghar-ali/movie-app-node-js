const jwt = require('jsonwebtoken')

const verifyToken = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (authHeader) {
            const token = authHeader.split(" ")[1]
            if (token) {
                jwt.verify(token, process.env.SECERTKEY, (err, user) => {
                    if (err) res.status(401).json({ message: "You are not authorized" })
                    res.locals.userInfo = user
                    next();
                })
            } else {
                return res.status(401).json({ message: "You are not authenicated" })
            }
        } else {
            return res.status(401).json({ message: "token is missing in the headers" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports = verifyToken