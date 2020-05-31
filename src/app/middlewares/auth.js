const jwt = require('jsonwebtoken');
const key = require('../../config/auth.json');

module.exports = (req,res,next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(400).send({error : 'Nenhum token foi enviado'});

    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({error : 'tokem mal-formado'});

    const [scheme, token] = parts;
    
    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({error : 'Token mal-formado'});

    jwt.verify(token, key.secret, (err, decoded) => {
        if(err)
            return res.status(401).send({error : 'Token inválido'});
        
        req.user = decoded; //variavel global contendo o payload decodificado
        return next();    
    })    
}