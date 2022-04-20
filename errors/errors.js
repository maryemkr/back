module.exports.signUpErrors = (err) => {
    let errors = { pseudo: "", mdp: "", email: "" };

    if (err.message.includes("pseudo"))
        errors.pseudo = "Pseudo incorrect ou déjà pris";

    if (err.message.includes("mdp"))
        errors.mdp = "Le mot de passe doit avoir 6 caractères minimum";

    if (err.message.includes("email")) errors.email = "Email incorrect";


    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
        errors.pseudo = "Ce pseudo est déjà pris";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = "Cet email est déjà enregistré";

    return errors;
};

