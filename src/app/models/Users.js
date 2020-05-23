const Sequelize = require('sequelize');
const sequelize = require('../../database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('Users', {
    cpf : {
        type : Sequelize.STRING,
        primaryKey : true
    },
    firstName : {
        type : Sequelize.STRING,
        allowNull : false
    },
    lastName : {
        type : Sequelize.STRING,
        allowNull : false
    },
    email : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : Sequelize.STRING,
        allowNull : false
    }
}, {timestamps : false});


User.beforeCreate(async (user) => {
    try {
        const salt = await bcrypt.genSalt(10); 
        user.password = await bcrypt.hash(user.password, salt)
    } catch (error) {
        console.log('Não foi possível gerar um hash para a senha do usuário');
    }
});

//a instrução abaixo deve ser executada apenas uma vez

const createTable = async () => {
    try {
        await User.sync({force : true});
    } catch (error) {
        console.log('Houve um erro ao criar a tabela de usuários, erro : ' + error);
    }
}

//createTable();


module.exports = User;