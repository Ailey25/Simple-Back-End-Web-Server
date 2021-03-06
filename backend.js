"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Hapi = __importStar(require("hapi"));
var fs = __importStar(require("fs"));
var MyServer = /** @class */ (function () {
    function MyServer() {
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
    MyServer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.server.start()];
                    case 1:
                        _a.sent();
                        console.log('Server running at:', this.server.info.uri);
                        return [2 /*return*/, this.server];
                    case 2:
                        err_1 = _a.sent();
                        console.log('Error at start() ' + err_1);
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Routing
    MyServer.prototype.route = function () {
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
    };
    // Handle Routing
    // TODO: Look into async write and read using promisify
    MyServer.prototype.handleWrite = function (request) {
        try {
            var filename = 'storage.txt';
            // Get JSON parameter phrase
            // TODO: Look into JSON parse in tyepscript
            var myPayload = JSON.stringify(request.payload);
            var phrase = myPayload.replace(/"/g, '')
                .replace(/}/, '')
                .replace(/\s/, '')
                .replace(/\\/g, '').split(':')[1];
            // Write phrase to end of storage.txt
            fs.writeFileSync(filename, phrase + '\n', { flag: 'a+' });
            // Store phrases in file in a phrase array, filter out empty (last) line
            var phraseArray = fs.readFileSync(filename).toString().split('\n');
            phraseArray = phraseArray.filter(function (line) { return line != ''; });
            return '{id: ' + phraseArray.length + '}';
        }
        catch (err) {
            console.log('Error at handleWrite() ' + err);
            throw err;
        }
    };
    MyServer.prototype.handleRead = function () {
        try {
            var filename = 'storage.txt';
            // Array of phrases where index 0 is line 1 etc, filter out empty (last) line
            var phraseArray = fs.readFileSync(filename).toString().split('\n');
            phraseArray = phraseArray.filter(function (line) { return line != ''; });
            // Construct wrapper object for array of objects
            var myPhrasesObject = {
                phrases: [],
            };
            // Construct id phrase pair to put into phrases object
            for (var i = 0; i < phraseArray.length; i++) {
                var lineNumber = i + 1;
                var myPhraseObject = {
                    id: lineNumber.toString(),
                    phrase: phraseArray[i],
                };
                myPhrasesObject.phrases.push(myPhraseObject);
            }
            // Return wrapper object that contains the array of phrases
            return myPhrasesObject;
        }
        catch (err) {
            console.log('Error at handleRead() ' + err);
            throw err;
        }
    };
    MyServer.prototype.handleDelete = function (request) {
        try {
            var filename = 'storage.txt';
            // Read file and store in array, no filtering out empty last line this time
            var phraseArray = fs.readFileSync(filename).toString().split('\n');
            // Remove phrase from Array, return if phrase doesn't exist at line
            var lineNumber = encodeURIComponent(request.params.line);
            var index = parseInt(lineNumber) - 1;
            if (phraseArray[index] === undefined || phraseArray[index] === '') {
                return '{success: false}';
            }
            phraseArray.splice(index, 1);
            // Write Array to file
            var newTextInFile = phraseArray.join('\n');
            fs.writeFileSync(filename, newTextInFile);
            return '{success: true}';
        }
        catch (err) {
            console.log('Error at handleRead() ' + err);
            throw err;
        }
    };
    return MyServer;
}());
var testServer = new MyServer();
