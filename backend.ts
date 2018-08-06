import * as Hapi from 'hapi';
import * as fs from 'fs';

// Interfaces
interface MyLineNumberPhraseObject {
  id: string;
  phrase: string;
}

interface MyPhrasesObject {
  phrases: Array<MyLineNumberPhraseObject>;
}

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
          method: 'POST',
          path: '/write',
          handler: this.handleWrite,
      });

      this.server.route({
          method: 'GET',
          path: '/read',
          handler: this.handleRead,
      });

      this.server.route({
          method: 'DELETE',
          path: '/delete/{line}',
          handler: this.handleDelete,
      });

      return this.server;
  }

  // Handle Routing
  // TODO: Look into async write and read using promisify
  private handleWrite(request: Hapi.Request): string {
    try {
      const filename: string = 'storage.txt';

      // Get JSON parameter phrase
      // TODO: Look into JSON parse in tyepscript
      const myPayload: string = JSON.stringify(request.payload);
      const phrase: string = myPayload.replace(/"/g, '')
                                    .replace(/}/, '')
                                    .replace(/\s/, '')
                                    .replace(/\\/g, '').split(':')[1];

      // Write phrase to end of storage.txt
      fs.writeFileSync(filename, phrase + '\n', {flag: 'a+'});

      // Store phrases in file in a phrase array, filter out empty (last) line
      let phraseArray: Array<string> = fs.readFileSync(filename).toString().split('\n');
      phraseArray = phraseArray.filter((line: string) => line != '');

      return '{id: ' + phraseArray.length + '}';
    } catch (err) {
      console.log('Error at handleWrite() ' + err);
      throw err;
    }
  }

  private handleRead(): MyPhrasesObject {
    try {
      const filename: string = 'storage.txt';

      // Array of phrases where index 0 is line 1 etc, filter out empty (last) line
      let phraseArray: Array<string> = fs.readFileSync(filename).toString().split('\n');
      phraseArray = phraseArray.filter((line: string) => line != '');

      // Construct wrapper object for array of objects
      let myPhrasesObject: MyPhrasesObject = {
        phrases: [],
      };

      // Construct id phrase pair to put into phrases object
      for (let i = 0; i < phraseArray.length; i++) {
        const lineNumber: number = i + 1;
        let myPhraseObject: MyLineNumberPhraseObject = {
          id: lineNumber.toString(),
          phrase: phraseArray[i],
        };
        myPhrasesObject.phrases.push(myPhraseObject);
      }

      // Return wrapper object that contains the array of phrases
      return myPhrasesObject;
    } catch (err) {
      console.log('Error at handleRead() ' + err);
      throw err;
    }
  }

  private handleDelete(request: Hapi.Request): string {
    try {
      const filename: string = 'storage.txt';

      // Read file and store in array, no filtering out empty last line this time
      let phraseArray: Array<string> = fs.readFileSync(filename).toString().split('\n');

      // Remove phrase from Array, return if phrase doesn't exist at line
      const lineNumber: string = encodeURIComponent(request.params.line);
      let index: number = parseInt(lineNumber) - 1;
      if (phraseArray[index] === undefined || phraseArray[index] === '') {
        return '{success: false}';
      }
      phraseArray.splice(index, 1);

      // Write Array to file
      let newTextInFile: string = phraseArray.join('\n');
      fs.writeFileSync(filename, newTextInFile);

      return '{success: true}';
    } catch (err) {
      console.log('Error at handleRead() ' + err);
      throw err;
    }
  }
}

let testServer = new MyServer();
