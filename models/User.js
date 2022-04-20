const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        min: 3,
        max: 255,
        unique: true,
        trim: true
    },

    mdp: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },

    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        validate: [isEmail],
        unique: true
    },

    prenom: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },

    nom: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    role: {
        type: String,
        default:"adherent",
       
        
    },
    telephone: {
        type: Number,
        required: true,
      
    },
    resetLink: {
        info: String,
        default:''
    }
    },
    {
    timestamps: true,
    });

module.exports = mongoose.model("User",userSchema);