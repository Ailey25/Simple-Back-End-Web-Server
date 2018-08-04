import * as Hapi from 'hapi';
import * as fs from 'fs';

class MyServer {
  private host: string;
  private port: number;
  private server: Hapi.Server;

  constructor() {
    this.host = 'localhost';
    this.port = 8080;
    this.server = new Hapi.Server({
      host: this.host,
      port: this.port,
    });

    this.start();
    this.route();
  }

  // Start the server
  private async start(): Promise<Hapi.Server> {
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
  private route(): Hapi.Server {
      this.server.route({
          method: 'GET',
          path: '/write',
          handler: this.handleWrite,
      });

      this.server.route({
          method: 'GET',
          path: '/read',
          handler: this.handleRead,
      });

      this.server.route({
          method: 'GET',
          path: '/delete',
          handler: this.handleDelete,
      });

      return this.server;
  }

  // Handle Routing
  private handleWrite(request: Hapi.Request): string {
    try {
      let filename: string = 'storage.txt';
      // Get JSON parameter phrase
      let phrase: string = 'PLACEHOLDER string 1'; // request.payload.phrase;

      // Write phrase to end of storage.txt
      fs.writeFileSync(filename, phrase + '\n', {flag: 'a+'});

      // Store phrases in file in a phrase array, filter out empty lines
      let phraseArray: Array<string> = fs.readFileSync(filename).toString().split('\n');
      phraseArray = phraseArray.filter((line: string) => line != '');

      return '{id: ' + phraseArray.length + '}';
    } catch (err) {
      console.log('Error at handleWrite() ' + err);
      throw err;
    }
  }

  private handleRead(): string {
    return 'hello world';
  }

  private handleDelete(): string {
    return 'hello world';
  }
}

let testServer = new MyServer();
