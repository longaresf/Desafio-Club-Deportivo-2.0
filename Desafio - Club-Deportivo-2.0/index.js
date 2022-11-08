// Importar módulos necesarios
const http = require('http');
const url = require('url');
const fs = require('fs');

// Crear servidor
const server = http
    .createServer((req,res) => {

        // Ruta raíz para disponibilizar el archivo index.html
        if(req.url == ('/')) {
            res.writeHead(200,{'Content-Type':'text:html'});
            fs.readFile('index.html','utf8',(err,html) => {
                res.end(html);
            })
        }

        // Array que contiene todos los datos desde el archivo
        let deportesJSON = JSON.parse(fs.readFileSync('./archivos/deportes.json','utf8'));
        let deportes = deportesJSON.deportes;

        // Ruta para disponibilizar los datos desde archivo deportes.json
        if(req.url.startsWith('/deportes') && req.method == 'GET'){
            res.end(JSON.stringify(deportesJSON,null,1));
          }

        // Ruta para agregar nuevos registros al archivo deportes.json
        if(req.url.startsWith('/agregar') && req.method == 'POST') {

            let body;

            req.on('data',(payload) => {
              body = JSON.parse(payload);
            })

            req.on('end',() => {
              deporte = {
                nombre: body.nombre,
                precio: body.precio
              };

              deportes.push(deporte);

              if(body.nombre == '' || body.precio == ''){
                console.log('Error: Ambos campos deben ser completados.')
              }
              else {
                fs.writeFileSync('./archivos/deportes.json',JSON.stringify(deportesJSON,null,1));
                res.end();
              }
            })
        }

        // Ruta para actualizar registros del archivo deportes.json
        if(req.url.startsWith('/editar') && req.method == 'PUT'){

            let body;

            req.on('data',(payload) => {
              body = JSON.parse(payload);
            });

            req.on('end', () => {
              deportesJSON.deportes = deportes.map((d) => {
                if ( d.nombre == body.nombre) {
                  return body;
                }
                else {
                    return d;
                }
              });

              if(body.nombre == '' || body.precio == ''){
                console.log('Error: Ambos campos deben ser completados.')
              }
              else {
                fs.writeFileSync('./archivos/deportes.json',JSON.stringify(deportesJSON,null,1));
              res.end();
              }
            })
        }

        // Ruta para borrar registros del archivo deportes.json
        if(req.url.startsWith('/eliminar') && req.method == 'DELETE'){

            // Query string desde la url
            const { nombre } = url.parse(req.url,true).query;

            deportesJSON.deportes = deportes.filter((d) => d.nombre !== nombre);

            fs.writeFileSync('./archivos/deportes.json',JSON.stringify(deportesJSON,null,1));
            res.end();
        }

    })
    .listen(3000,()=>console.log(`Server running on port 3000 and PID: ${process.pid}`))

    module.exports = server;