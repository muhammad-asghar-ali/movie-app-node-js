const UserModel = require('../Models/UserModel')
const CryptoJS = require("crypto-js");

module.exports.UpdateUser = async(req, res) => {
    try {
        const { id } = req.params
        const { userId, isAdmin } = res.locals.userInfo
        const data = req.body

        if (userId === id || isAdmin) {
            if (data.password) {
                data.password = CryptoJS.AES.encrypt(data.password, process.env.SECERTKEY).toString()
            }
            const updateUser = await UserModel.findByIdAndUpdate(id, { $set: data }, { new: true })
            res.status(200).json(updateUser)
        } else {
            res.status(403).json({ message: "you are only update your account" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports.DeleteUser = async(req, res) => {
    try {
        const { id } = req.params
        const { userId, isAdmin } = res.locals.userInfo

        if (userId === id || isAdmin) {
            await UserModel.findByIdAndDelete({ _id: id })
            return res.status(200).json({ message: "user deleted successfully" })
        } else {
            return res.status(403).json({ message: "you can only delete your account" })
        }
    } catch (err) {
        res.status(500).json(err.message)
    }
}

module.exports.GetUser = async(req, res) => {
    try {
        const { id } = req.params
        const user = await UserModel.findById({ _id: id })
        const { password, ...info } = user._doc
        res.status(200).json(info)
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports.getAllahUsers = async(req, res) => {
    try {
        const query = req.query.new
        const { isAdmin } = res.locals.userInfo

        if (isAdmin) {
            const user = query ? await UserModel.find().sort({ _id: -1 }).limit(2) : await UserModel.find().lean()
            res.status(200).json(user)
        } else {
            res.status(403).json({ message: "you are not allowed to see all users" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports.getStat = async(req, res) => {
    try {
        const today = new Date()
        const lastYear = today.setFullYear(today.setFullYear() - 1)

        const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const data = await UserModel.aggregate([{
            $project: {
                month: { $month: "$createdAt" }
            }
        }, {
            $group: {
                _id: '$month',
                total: { $sum: 1 }
            }
        }])
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
}