'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: (~~process.env.PORT || 3000) 
});

// Add the route
server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {

         reply.file('./index.html');
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
