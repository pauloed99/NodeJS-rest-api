const express = require('express');
const router = express.Router();
const Travel = require('../models/Travels');
const auth = require('../middlewares/auth');

router.use(auth);


router.get('/', async (req,res) => {
    try {
        const travels = await Travel.findAll();

        res.status(206).send({travels});

    } catch (error) {
        res.status(404).send({error : 'Não foi possível obter todas as viagens'});
    }
});

router.get('/:travel_id', async (req,res) => {
    try {
        const travel = await Travel.findOne({where : {
            travel_id : req.params.travel_id
        }})

        res.status(200).send({travel});
        
    } catch (error) {
        res.status(404).send({error : 'a viagem que você procura não existe'});
    }
});


router.post('/', async (req,res) => {
    try {
        var {stadium, country, city, cpf_user} = req.body;

        await Travel.create({stadium, country, city, cpf_user});

        res.status(201).send({message : 'O usuário foi criado com sucesso'});

    } catch (error) {
        res.status(409).send({error : 'Não foi possível registrar a viagem, ela já existe'});
    }
}); 


router.put('/:travel_id', async (req,res) => {
    try {
        var {stadium, country, city} = req.body;
        
        await Travel.update({
            stadium,
            country,
            city
        }, {
            where : {
                travel_id : req.params.travel_id
            }
        });

        res.status(204).send({message : 'Os dados da viagem foram atualizados com sucesso'});

    } catch (error) {
        res.status(404).send({error : 'Não foi possível atualizar os dados da viagem'});
    }
});


router.delete('/:travel_id', async (req,res) => {
    try {

        await Travel.destroy({where : {
            travel_id : req.params.travel_id
        }});

        res.status(204).send({message : 'Os dados da viagem foram deletados'});

    } catch (error) {
        res.status(404).send({message : 'Não foi possível deletar os dados da viagem'});
    }
});


module.exports = router;