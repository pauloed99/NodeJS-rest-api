const express = require('express');
const router = express.Router();
const Travel = require('../models/Travels');
const User = require('../models/Users');
const auth = require('../middlewares/auth');

router.use(auth);


router.get('/', async (req,res) => {
    try {
        var user = await User.findOne({where : {email : req.userEmail}});

        const travels = await Travel.findAll({where : {cpf_user : user.cpf}});

        res.status(200).send({travels});

    } catch (error) {
        res.status(400).send({error : 'Não foi possível obter todas as viagens do usuário'});
    }
});

router.get('/:travel_id', async (req,res) => {
    try {

        var user = await User.findOne({where : {email : req.userEmail}});

        const travel = await Travel.findOne({where : {
            travel_id : req.params.travel_id,
            cpf_user : user.cpf
        }});

        res.status(200).send({travel});
        
    } catch (error) {
        res.status(400).send({error : 'a viagem que você procura não existe'});
    }
});


router.post('/', async (req,res) => {
    try {

        var user = await User.findOne({where : {email : req.userEmail}})


        var {stadium, country, city} = req.body;

        var travels = await Travel.findAll({where : {cpf_user : user.cpf}});

        const found = travels.find((item)=>item.stadium == stadium);

        if(found)
            return res.status(400).send({error : 'Você já cadastrou esse estádio, cadastre outro diferente'});
        
        var travel = await Travel.create({stadium, country, city, cpf_user : user.cpf});

        res.status(200).send({travel});

    } catch (error) {
        res.status(400).send({error : 'Não foi possível registrar a viagem'});
    }
}); 


router.put('/:travel_id', async (req,res) => {
    try {
        var {stadium, country, city} = req.body;

        if((stadium || country || city)){
            if(stadium)
                await Travel.update({stadium},{where : { travel_id : req.params.travel_id}});
            if(country)
                await Travel.update({country},{where : { travel_id : req.params.travel_id}});
            if(city)
                await Travel.update({city},{where : { travel_id : req.params.travel_id}});   
                
            return res.status(200).send({message : 'Os dados da viagem foram atualizados com sucesso'});    
        }

        return res.status(400).send({error : 'Altere algum dado para atualizar os dados da viagem'});

    } catch (error) {
        res.status(400).send({error : 'Não foi possível atualizar os dados da viagem'});
    }
});


router.delete('/:travel_id', async (req,res) => {
    try {

        await Travel.destroy({where : {
            travel_id : req.params.travel_id
        }});

        res.status(200).send({message : 'Os dados da viagem foram deletados'});

    } catch (error) {
        res.status(400).send({message : 'Não foi possível deletar os dados da viagem'});
    }
});


module.exports = router;