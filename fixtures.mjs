import { createServer } from 'http-server';

let server;

const startServer = () => {
  server = createServer({
    root: '.'
  });
  server.listen('8080', '127.0.0.1');

  return server;
};

export const mochaGlobalSetup = () => {
  server = startServer({port: '8080'});
  console.log('server started at 8080');
};

export const mochaGlobalTeardown = async () => {
  await server.close();
  console.log('server stopped');
};
