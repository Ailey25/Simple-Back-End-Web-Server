import * as Hapi from 'hapi';
import * as Server from 'http';

export default class MyServer {
  private host: string;
  private port: number;
  private server: Hapi.Server;

  constructor() {
    this.host = 'localhost';
    this.port = 8000;
    this.server = new Hapi.Server({
      host: this.host,
      port: this.port,
    });

    this.start();
    this.route();
  }

  // Start the server
  async start(): Promise<Hapi.Server> {
    try {
      await this.server.start();

      console.log('Server running at:', this.server.info.uri);
      return this.server;
    } catch (err) {
      console.log('Error at start() ' + err);
      throw err;
    }
  }

  // Routing
  async route(): Promise<Hapi.Server> {
    try {
      this.server.route({
          method: 'GET',
          path: '/hello',
          handler: function(request, h) {
              return 'hello world';
          }
      });

      return this.server;
    } catch (err) {
      console.log('Error at route() ' + err);
      throw err;
    }
  }
}

let testServer = new MyServer();
