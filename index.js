'use strict'

const Hapi = require('@hapi/hapi') 
const contact = require('./contact.js') 

const init = async () => { 
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  server.route([
    {
      method: 'GET',
      path: '/contacts',
      handler: (request, h) => {
        return h.response({message: "List of Contacts", data: contact}).code(200);
      }
    }, 
    {
      method: 'POST',
      path: '/contacts',
      handler: (request, h) => {
        const payload = request.payload;
        contact.push(payload);
        return h.response({message: "Create new contacts", data: payload}).code(201);
      }
    }, 
    {
      method: 'DELETE',
      path: '/contacts/{id}',
      handler: (request, h) => {
        const { id } = request.params;
        const filteredContacts = contact.filter(item => item.id !== id); // filter the contact without the requested deleted id
        contact.length = 0; // clear the contact to be reassign
        contact.push(...filteredContacts); // assign the filtered contact
        return h.response({message: `Delete contacts with id ${id}`});
      }
    }, 
  ]);

  await server.start();
  console.log('the server is running %s', server.info.uri);
};

process.on('unhandledRejection', (err) => { 
  console.log(err);
  process.exit(1);
});

init();

