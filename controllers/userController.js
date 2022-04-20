const User = require('../models/User');
const bcrypt = require("bcryptjs");


module.exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json(users)
}

module.exports.userInfo = (req, res) => {
    console.log(req.params)

    User.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs)
        else console.log('ID unknown : ' + err)
    })
};

module.exports.updateUser = async (req, res) => {

    try {
        await User.findByIdAndUpdate(
            { _id: req.params.id }, {
            prenom: req.body.prenom,
            nom: req.body.nom,
            telephone:req.body.telephone
        },
        ).then((docs, err) => {
            if (!err) return res.json( { message: "Succefully updated" });

        })
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id }).exec();//.executer
        res.status(200).json({ message: "Succefully deleted" })
    } catch (err) {
        return res.status(500).json({ message: err })
    }
};