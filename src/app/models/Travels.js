const Sequelize = require('sequelize');
const sequelize = require('../../database');


const Travel = sequelize.define('Travels', {
    travel_id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    stadium : {
        type : Sequelize.STRING,
        allowNull : false
    },
    country : {
        type : Sequelize.STRING,
        allowNull : false
    },
    city : {
        type : Sequelize.STRING,
        allowNull : false
    },
    cpf_user : {
        type : Sequelize.STRING,
        allowNull : false,
        references : {model : 'Users', key : 'cpf'},
        onUpdate : 'CASCADE',
        onDelete : 'CASCADE'
    }
});

//a instrução abaixo deve ser executada apenas uma vez

const createTable = async () => {
    try {
        await Travel.sync({force : true});
    } catch (error) {
        console.log('Houve um erro ao criar a tabela de viagens, erro : ' + error);
    }
}

createTable();

module.exports = Travel;
