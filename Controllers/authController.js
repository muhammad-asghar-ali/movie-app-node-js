const UserModel = require('../Models/UserModel')
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")
    // const { verify } = require("crypto")
    // const { userInfo } = require("os")

module.exports.Register = async(req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ message: "username or email or password is missing" })
        }
        const userFind = await UserModel.findOne({ email: email })
        if (userFind) {
            return res.status(400).json({ message: "User already exist" })
        }
        const user = await UserModel.create({
            username,
            email,
            password: CryptoJS.AES.encrypt(password, process.env.SECERTKEY).toString()
        })
        if (!user) {
            return res.status(200).json({ message: "user not found" })
        }
        res.status(200).json(user)
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err)
    }
}

module.exports.Login = async(req, res) => {
    try {
        const { email, pass } = req.body
        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return res.status(401).json({ message: "Wrong username or password" })
        }

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECERTKEY)
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8)

        if (originalPassword !== pass) {
            return res.status(401).json({ message: "Wrong username or password" })
        }

        const accessToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.SECERTKEY, {
            expiresIn: "5d"
        })

        const { password, ...info } = user._doc
        res.status(200).json({...info, accessToken })
    } catch (err) {
        res.status(500).json(err.message)
    }
}