// Importar módulos necesarios
const chai = require('chai');
const chaiHttp = require('chai-http');

// Importar servidor
const server = require('../index');

// Instalar plugin de chai-http
chai.use(chaiHttp);

// Crear una suite de test y un test unitario
describe('Probando API REST con Mocha - Chai', function(){
    it('Probando GET - La data debe contener una propiedad llamada deportes y esta debe ser un arreglo', function(){
        
        // Utilizar un método de chai llamado 'request' pasándole como parámetro el servidor
        chai
            .request(server)
            // Método 'get' con la ruta a testear
            .get('/deportes')
            // Método 'end' con función callback que contiene el error y la data de la consukta al servidor
            .end(function (err,res) {

                // Guardar en una variable la data de la respuesta en su propiedad “text” con el JSON.parse()
                let data = JSON.parse(res.text)

                // Método expect para corroborar la propiedad deportes en la data
                chai.expect(data).to.have.property('deportes')

                // Método expect para corroborar que la propiedad deportes sea un string
                chai.expect(data.deportes).to.be.an('array')
            })
    })
})