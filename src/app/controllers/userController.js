const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const auth = require('../middlewares/auth');


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
        await User.update(req.body, {
            where : {
                email : req.params.email
            }
        });
        
        res.status(200).send({message : 'Os dados do usuário foram atualizados'});

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



