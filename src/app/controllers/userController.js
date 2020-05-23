const express = require('express');
const router = express.Router();
const User = require('../models/Users');

//A parte de criação de um usuário será feita no controller de autenticação

router.get('/', async (req,res) => {
    try {
        var users = await User.findAll();

        res.status(206).send({users});

    } catch (error) {
        res.status(404).send({error : 'Não foi possível obter todos os usuários'});
    }
});


router.get('/:cpf', async (req,res) => {
    try {
        var user = await User.findOne({where : {
            cpf : req.params.cpf
        }});

        res.status(200).send({user});

    } catch (error) {
        res.status(404).send({error : 'O usuário que você procura não existe'});
    }
});


router.put('/:cpf', async (req,res) => {
    try {
        await User.update(req.body, {
            where : {
                cpf : req.params.cpf
            }
        });
        
        res.status(200).send({message : 'Os dados do usuário foram atualizados'});

    } catch (error) {
        res.status(404).send({error : 'Não foi possível atualizar os dados do usuário'});
    }
});


router.delete('/:cpf', async (req,res) => {
    try {
        await User.destroy({where : {
            cpf : req.params.cpf
        }});

        res.status(204).send({message : 'Os dados do usuário foram deletados'});

    } catch (error) {
        res.status(404).send({message : 'Não foi possível deletar os dados do usuário'});
    }
});



module.exports = router;



