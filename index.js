'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server(+process.env.PORT, '0.0.0.0');
// var server = new Hapi.Server()

// add server’s connection information
server.connection({  
  host: '0.0.0.0',
  port: process.env.PORT || 3000
});
server.register({
  register: require('inert')
}, function(err) {
  if (err) throw err;

  server.start(function(err) {
    console.log('Server started at: ' + server.info.uri);
  });
});
// Add the route
server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {

         reply.file('index.html');
    }
});

server.route(
    {
    method: 'GET',
    path:'/assets/{file*}', 
    handler:{
        directory: {
            path:  "assets/",
            listing:true
        }
    }
    });


// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
