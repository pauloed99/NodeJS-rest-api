const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const key = require('../../config/auth.json'); 


router.post('/register', async(req,res) => {
    try {
        var user = await User.create(req.body);

        const token = jwt.sign({cpf : user.cpf}, key.secret, {expiresIn : 86400});

        user.password = undefined;
        
        res.status(200).send({user, token});
    } catch (error) {
        res.status(400).send({error : 'Não foi possível registrar o usuário'});
    }

});


router.post('/login', async(req,res) => {
    try {    
        var {email,password} = req.body;

        var user = await User.findOne({where : {
            email
        }});

        if(!user)
            res.status(400).send({error : 'O email foi digitado incorretamente'});
        
        if(!await bcrypt.compare(password,user.password))
            res.status(400).send({error : 'A senha foi digitada incorretamente'});    
        
        const token = jwt.sign({cpf : user.cpf}, key.secret, {expiresIn : 86400});

        user.password = undefined;
        
        res.status(200).send({user, token});


    } catch (error) {
        res.status(401).send({error : 'Você não possui uma conta para efetuar login'});
    }
});



module.exports = router;