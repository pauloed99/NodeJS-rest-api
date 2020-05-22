const Sequelize = require('sequelize');

const sequelize = new Sequelize('stadium_tour', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });


const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso');
    } catch (error) {
        console.log('Erro ao se conectar com o banco de dados, erro : ' + error);
    }
}  

connection();

module.exports = sequelize;




