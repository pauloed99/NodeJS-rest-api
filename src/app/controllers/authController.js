const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const key = require('../../config/auth.json'); 
const auth = require('../middlewares/auth');


router.post('/register', async(req,res) => {
    try {

        var {firstName, lastName, cpf, email, password, password2} = req.body;

        if(!(firstName && lastName && cpf && email && password && password2))
            res.status(400).send({error : 'Preencha todos os campos disponíveis !'});
        
        
        if(password.length < 8)
            res.status(400).send({error : 'A senha deve ter no mínimo 8 dígitos !'});
        

        if(password !== password2)
            res.status(400).send({error : 'erro ao confirmar a senha, senhas incorretas !'});
        

        var user = await User.findOne({where : {
            cpf
        }});

        if(user)
            res.status(400).send({error : 'já existe um usuário com esse cpf cadastrado !'});
        

        var user = await User.findOne({where : {
            email
        }});

        if(user)
            res.status(400).send({error : 'já existe um usuário com esse email cadastrado !'})
        

        var user = await User.create({firstName, lastName, cpf, email, password});

        const token = jwt.sign({firstName : user.firstName,
        lastName : user.lastName, email : user.email}, key.secret, {expiresIn : 86400});

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
        
        const token = jwt.sign({firstName : user.firstName,
        lastName : user.lastName, email : user.email}, key.secret, {expiresIn : 86400});

        user.password = undefined;
        
        res.status(200).send({user, token});


    } catch (error) {
        res.status(401).send({error : 'Você não possui uma conta para efetuar login'});
    }
});

router.get('/dashboard', auth, (req,res) => {
    const user = req.user;

    if(!user)
        res.status(400).send({error : 'Falha ao obter os dados do usuário'});

    res.status(200).send({user});
     
});


module.exports = router;