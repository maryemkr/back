const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../errors/errors');
const nodemailer = require('nodemailer');

//Register controller
module.exports.register = async (req,res)=>{
    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.mdp, salt)

    const user = new User({
        pseudo: req.body.pseudo,
        mdp: hashedPassword,
        email: req.body.email,
        prenom: req.body.prenom,
        nom:req.body.nom,        
        role:req.body.role,
        telephone:req.body.telephone
    })

    try{
        const savedUser = await user.save()
        res.send({savedUser})
    }catch(err){
        const errors = signUpErrors(err)
        res.status(400).json(errors)
    }
}


//Login controller
module.exports.login = async (req,res)=>{
    const msg = "Pseudo ou mot de passe invalide(s)"
    
    try {
        const user = await User.findOne({ pseudo: req.body.pseudo})
        if(!user) return res.status(400).send(msg)

        const validPass = await bcrypt.compare(req.body.mdp , user.mdp)    
        if(!validPass) return res.status(400).send(msg)
     
        const token = jwt.sign({_id:user._id,role:user.role , prenom:user.prenom}, process.env.TOKEN_SECRET , {expiresIn:86400})//24h
        
        res.status(200).send({token : token , role : user.role})
    }catch(err){
        
        res.status(400).json({err})
    }
 }




 //Logout controller
 module.exports.logout = (req,res) =>{
    res.cookie('jwt','', {expiresIn:1})
    res.redirect('/')
};

//Forget password controller
module.exports.forgetPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).send('Email invalide ')
        let transporter = nodemailer.createTransport(({
            service: "Outlook365",
            host: "smtp.office365.com",
            port: "587",
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
            auth: {
                user: 'maryemkraiem@outlook.fr',
                pass: 'mariem123'
            }
        }))


        //create one time link valid for 15 minutes
        const payload = {
            email: user.email,
            id: user._id
        }
        const secret = process.env.TOKEN_SECRET
        const token = jwt.sign(payload, secret, { expiresIn: '1m' })


        const email = user.email
        let info = {
            from: 'maryemkraiem@outlook.fr', // Sender address
            to: `${email}`, //Reciever address
            subject: "Mot de passe oublié", // Subject line
            html: `Vous avez demandé à changer le mot de passe de votre compte. Pour créér un nouveau mot de passe, cliquez sur le lien ci-dessous <br> http://localhost:4200/reset-password/${user.id}/${token}`, // html body
        };

        transporter.sendMail(info, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Message sent: ");
                res.json({ message: "Message sent" });

            }
        })
        await user.updateOne({ $set: { resetLink: token } })

    } catch (err) {
        console.log(err);
    }
};

//Reser password controller
module.exports.ResetPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ id: req.params.id, resetLink: req.params.resetLink })

        if (!user) return res.status(400).send('id invalide ')
        console.log(user.resetLink)

        //Validate pasword 
        const salt = await bcrypt.genSalt(10)
        const hPassword = await bcrypt.hash(req.body.mdp, salt)
        await user.updateOne({ mdp: hPassword, }).then((docs, err) => {
            if (!err) return res.json({ message: "Mot de passe changé" });

        })
    }catch (err) {
        console.log(err);
    }
};