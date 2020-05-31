const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const auth = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const key = require('../../config/auth.json'); 
const bcrypt = require('bcryptjs');



router.use(auth);

//A parte de criação de um usuário será feita no controller de autenticação

router.get('/', async (req,res) => {
    try {
        var users = await User.findAll();

        res.status(206).send({users});

    } catch (error) {
        res.status(404).send({error : 'Não foi possível obter todos os usuários'});
    }
});


router.get('/:email', async (req,res) => {
    try {
        var user = await User.findOne({where : {
            email : req.params.email
        }});

        user.password = undefined;

        res.status(200).send({user});

    } catch (error) {
        res.status(404).send({error : 'O usuário que você procura não existe'});
    }
});


router.put('/:email', async (req,res) => {
    try {

        var {firstName, lastName, email, password, password2, password3} = req.body;

        if((firstName || lastName || email)){
            if(firstName)
                await User.update({firstName},{where : { email : req.params.email}});
            if(lastName)
                await User.update({lastName},{where : { email : req.params.email}});
            if(email)
                await User.update({email},{where : { email : req.params.email}});            
            
            var user = {firstName, lastName, email};    

            const token = jwt.sign({firstName : user.firstName,
            lastName : user.lastName, email : user.email}, key.secret, {expiresIn : 86400}); 

            return res.status(200).send({user, token});    
        }

        if((password && password2 && password3)){
            var user = await User.findOne({where : {
                email : req.params.email
            }});

            if(!await bcrypt.compare(password,user.password))
                return res.status(400).send({error : 'A senha antiga foi digitada incorretamente'});

            if(password2.length > 7 && password2 == password3){
                const salt = await bcrypt.genSalt(10); 
                password2 = await bcrypt.hash(password2, salt);

                await User.update({password : password2},
                {where : { email : req.params.email}});

                return res.status(200).send({user});
            }
            return res.status(400)
            .send({error : 'Não foi possível alterar a senha, pois a nova senha não tem mais de 7 dígitos ou a nova senha não foi reconfirmada direito'})
        }        
        
        if(!((firstName && lastName && email) || (password && password2 && password3)))
            return res.status(400)
            .send({error : 'altere algum campo para alterar os dados'});



    } catch (error) {
        res.status(404).send({error : 'Não foi possível atualizar os dados do usuário'});
    }
});


router.delete('/:email', async (req,res) => {
    try {
        await User.destroy({where : {
            email : req.params.email
        }});

        res.status(204).send({message : 'Os dados do usuário foram deletados'});

    } catch (error) {
        res.status(404).send({message : 'Não foi possível deletar os dados do usuário'});
    }
});



module.exports = router;



