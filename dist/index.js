/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/lokijs/src/loki-fs-structured-adapter.js":
/*!***************************************************************!*\
  !*** ./node_modules/lokijs/src/loki-fs-structured-adapter.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;\n/*\n  Loki (node) fs structured Adapter (need to require this script to instance and use it).\n\n  This adapter will save database container and each collection to separate files and\n  save collection only if it is dirty.  It is also designed to use a destructured serialization \n  method intended to lower the memory overhead of json serialization.\n  \n  This adapter utilizes ES6 generator/iterator functionality to stream output and\n  uses node linereader module to stream input.  This should lower memory pressure \n  in addition to individual object serializations rather than loki's default deep object\n  serialization.\n*/\n\n(function (root, factory) {\n    if (true) {\n        // AMD\n        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    } else {}\n}(this, function () {\n  return (function() {\n\n    const fs = __webpack_require__(/*! fs */ \"fs\");\n    const readline = __webpack_require__(/*! readline */ \"readline\");\n    const stream = __webpack_require__(/*! stream */ \"stream\");\n\n    /**\n     * Loki structured (node) filesystem adapter class.\n     *     This class fulfills the loki 'reference' abstract adapter interface which can be applied to other storage methods. \n     *\n     * @constructor LokiFsStructuredAdapter\n     *\n     */\n    function LokiFsStructuredAdapter()\n    {\n        this.mode = \"reference\";\n        this.dbref = null;\n        this.dirtyPartitions = [];\n    }\n\n    /**\n     * Generator for constructing lines for file streaming output of db container or collection.\n     *\n     * @param {object=} options - output format options for use externally to loki\n     * @param {int=} options.partition - can be used to only output an individual collection or db (-1)\n     *\n     * @returns {string|array} A custom, restructured aggregation of independent serializations.\n     * @memberof LokiFsStructuredAdapter\n     */\n    LokiFsStructuredAdapter.prototype.generateDestructured = function*(options) {\n      var idx, sidx;\n      var dbcopy;\n\n      options = options || {};\n\n      if (!options.hasOwnProperty(\"partition\")) {\n        options.partition = -1;\n      }\n\n      // if partition is -1 we will return database container with no data\n      if (options.partition === -1) {\n        // instantiate lightweight clone and remove its collection data\n        dbcopy = this.dbref.copy();\n        \n        for(idx=0; idx < dbcopy.collections.length; idx++) {\n          dbcopy.collections[idx].data = [];\n        }\n\n        yield dbcopy.serialize({\n          serializationMethod: \"normal\"\n        });\n\n        return;\n      }\n\n      // 'partitioned' along with 'partition' of 0 or greater is a request for single collection serialization\n      if (options.partition >= 0) {\n        var doccount,\n          docidx;\n\n        // dbref collections have all data so work against that\n        doccount = this.dbref.collections[options.partition].data.length;\n\n        for(docidx=0; docidx<doccount; docidx++) {\n          yield JSON.stringify(this.dbref.collections[options.partition].data[docidx]);\n        }\n      }\n    };\n\n    /**\n     * Loki persistence adapter interface function which outputs un-prototype db object reference to load from.\n     *\n     * @param {string} dbname - the name of the database to retrieve.\n     * @param {function} callback - callback should accept string param containing db object reference.\n     * @memberof LokiFsStructuredAdapter\n     */\n    LokiFsStructuredAdapter.prototype.loadDatabase = function(dbname, callback)\n    {\n      var instream,\n        outstream,\n        rl,\n        self=this;\n\n      this.dbref = null;\n\n      // make sure file exists\n      fs.stat(dbname, function (err, stats) {\n        if (!err && stats.isFile()) {\n          instream = fs.createReadStream(dbname);\n          outstream = new stream();\n          rl = readline.createInterface(instream, outstream);\n\n          // first, load db container component\n          rl.on('line', function(line) {\n            // it should single JSON object (a one line file)\n            if (self.dbref === null && line !== \"\") {\n              self.dbref = JSON.parse(line);\n            }\n          });\n\n          // when that is done, examine its collection array to sequence loading each\n          rl.on('close', function() {\n            if (self.dbref.collections.length > 0) {\n              self.loadNextCollection(dbname, 0, function() {\n                callback(self.dbref);\n              });\n            }\n          });\n        }\n        else {\n          // file does not exist, so callback with null\n          callback(null);\n        }\n      });\n    };\n\n    /**\n     * Recursive function to chain loading of each collection one at a time. \n     * If at some point i can determine how to make async driven generator, this may be converted to generator.\n     *\n     * @param {string} dbname - the name to give the serialized database within the catalog.\n     * @param {int} collectionIndex - the ordinal position of the collection to load.\n     * @param {function} callback - callback to pass to next invocation or to call when done\n     * @memberof LokiFsStructuredAdapter\n     */\n    LokiFsStructuredAdapter.prototype.loadNextCollection = function(dbname, collectionIndex, callback) {\n      var instream = fs.createReadStream(dbname + \".\" + collectionIndex);\n      var outstream = new stream();\n      var rl = readline.createInterface(instream, outstream);\n      var self=this,\n        obj;\n\n      rl.on('line', function (line) {\n        if (line !== \"\") {\n          obj = JSON.parse(line);\n          self.dbref.collections[collectionIndex].data.push(obj);\n        }\n      });\n\n      rl.on('close', function (line) {\n        instream = null;\n        outstream = null;\n        rl = null;\n        obj = null;\n\n        // if there are more collections, load the next one\n        if (++collectionIndex < self.dbref.collections.length) {\n          self.loadNextCollection(dbname, collectionIndex, callback);\n        }\n        // otherwise we are done, callback to loadDatabase so it can return the new db object representation.\n        else {\n          callback();\n        }\n      });\n    };\n\n    /**\n     * Generator for yielding sequence of dirty partition indices to iterate.\n     *\n     * @memberof LokiFsStructuredAdapter\n     */\n    LokiFsStructuredAdapter.prototype.getPartition = function*() {\n      var idx,\n        clen = this.dbref.collections.length;\n\n      // since database container (partition -1) doesn't have dirty flag at db level, always save\n      yield -1;\n      \n      // yield list of dirty partitions for iterateration\n      for(idx=0; idx<clen; idx++) {\n        if (this.dbref.collections[idx].dirty) {\n          yield idx;\n        }\n      }\n    };\n\n    /**\n     * Loki reference adapter interface function.  Saves structured json via loki database object reference.\n     *\n     * @param {string} dbname - the name to give the serialized database within the catalog.\n     * @param {object} dbref - the loki database object reference to save.\n     * @param {function} callback - callback passed obj.success with true or false\n     * @memberof LokiFsStructuredAdapter\n     */\n    LokiFsStructuredAdapter.prototype.exportDatabase = function(dbname, dbref, callback)\n    {\n      var idx;\n\n      this.dbref = dbref;\n\n      // create (dirty) partition generator/iterator\n      var pi = this.getPartition();\n\n      this.saveNextPartition(dbname, pi, function() {\n        callback(null);\n      });\n      \n    };\n\n    /**\n     * Utility method for queueing one save at a time\n     */\n    LokiFsStructuredAdapter.prototype.saveNextPartition = function(dbname, pi, callback) {\n      var li;\n      var filename;\n      var self = this;\n      var pinext = pi.next();\n\n      if (pinext.done) {\n        callback();\n        return;\n      }\n\n      // db container (partition -1) uses just dbname for filename,\n      // otherwise append collection array index to filename\n      filename = dbname + ((pinext.value === -1)?\"\":(\".\" + pinext.value));\n\n      var wstream = fs.createWriteStream(filename);\n      //wstream.on('finish', function() {\n      wstream.on('close', function() {\n        self.saveNextPartition(dbname, pi, callback);\n      });\n\n      li = this.generateDestructured({ partition: pinext.value });\n\n      // iterate each of the lines generated by generateDestructured()\n      for(var outline of li) {\n        wstream.write(outline + \"\\n\");\n      }\n\n      wstream.end();\n    };\n    \n    return LokiFsStructuredAdapter;\n\n  }());\n}));\n\n\n//# sourceURL=webpack:///./node_modules/lokijs/src/loki-fs-structured-adapter.js?");

/***/ }),

/***/ "./src/api/collaborators.ts":
/*!**********************************!*\
  !*** ./src/api/collaborators.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\n    result[\"default\"] = mod;\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst app_1 = __webpack_require__(/*! ../app */ \"./src/app.ts\");\nconst collectionUtils_1 = __webpack_require__(/*! ../utils/collectionUtils */ \"./src/utils/collectionUtils.ts\");\nconst fs = __importStar(__webpack_require__(/*! fs-extra */ \"fs-extra\"));\n//Get all collaborators\napp_1.app.get(\"/api/collaborators\", (req, res, next) => __awaiter(this, void 0, void 0, function* () {\n    //TODO move this to higher order function\n    try {\n        const cCollaborators = yield collectionUtils_1.loadCollection(\"collaborators\", app_1.db);\n        const docs = cCollaborators.find();\n        if (docs) {\n            return res\n                .contentType(\"json\")\n                .status(200)\n                .send(docs);\n        }\n    }\n    catch (err) {\n        res.status(404).send(err);\n    }\n}));\n//Save collaborator\napp_1.app.post(\"/api/collaborators\", app_1.upload.single(\"avatar\"), (req, res, next) => __awaiter(this, void 0, void 0, function* () {\n    try {\n        const formFields = req.body;\n        //console.log(\"File\", req.file);\n        // console.log(\"Form\", formField);\n        const cCollaborators = yield collectionUtils_1.loadCollection(\"collaborators\", app_1.db);\n        let insertDoc = {\n            email: formFields.email,\n            responses: JSON.parse(formFields.userRespones),\n            file: req.file\n        };\n        const doc = cCollaborators.insert(insertDoc);\n        if (doc) {\n            return res\n                .contentType(\"json\")\n                .status(200)\n                .send(doc);\n        }\n    }\n    catch (err) {\n        res.status(404).send(err);\n    }\n}));\n//Delete collaborator\napp_1.app.delete(\"/api/collaborators/:email\", (req, res, next) => __awaiter(this, void 0, void 0, function* () {\n    //TODO move this to higher order function\n    const email = req.params[\"email\"];\n    //console.log(\"Delete by email \", email);\n    try {\n        const cCollaborators = yield collectionUtils_1.loadCollection(\"collaborators\", app_1.db);\n        const doc = cCollaborators.findOne({ email });\n        if (doc) {\n            try {\n                const fileName = doc.file.filename;\n                //console.log(\"Delete Avatar File Name:\", fileName);\n                if (fileName) {\n                    yield fs.remove(`${app_1.app.get(\"uploadsPath\")}/${fileName}`);\n                }\n                cCollaborators.remove(doc);\n                return res.status(204).send();\n            }\n            catch (err) {\n                console.log(\"Error while delete\", err);\n                return res.status(500).send(err);\n            }\n        }\n        else {\n            return res\n                .status(404)\n                .send(`No collaborator exists with email ${email}`);\n        }\n    }\n    catch (err) {\n        res.status(404).send(err);\n    }\n}));\n//Delete collaborator\napp_1.app.delete(\"/api/collaborators\", (req, res, next) => __awaiter(this, void 0, void 0, function* () {\n    //console.log(\"Deleting all \");\n    try {\n        const cCollaborators = yield collectionUtils_1.loadCollection(\"collaborators\", app_1.db);\n        cCollaborators.clear({ removeIndices: true });\n        try {\n            yield fs.emptyDir(`${app_1.app.get(\"uploadsPath\")}`);\n        }\n        catch (err) {\n            console.log(\"Error while delete\", err);\n            return res.status(500).send(err);\n        }\n        return res.status(204).send();\n    }\n    catch (err) {\n        res.status(404).send(err);\n    }\n}));\n\n\n//# sourceURL=webpack:///./src/api/collaborators.ts?");

/***/ }),

/***/ "./src/api/frames.ts":
/*!***************************!*\
  !*** ./src/api/frames.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst app_1 = __webpack_require__(/*! ../app */ \"./src/app.ts\");\nconst collectionUtils_1 = __webpack_require__(/*! ../utils/collectionUtils */ \"./src/utils/collectionUtils.ts\");\n//Get all frames\napp_1.app.get(\"/api/frames\", (req, res, next) => __awaiter(this, void 0, void 0, function* () {\n    //TODO move this to higher order function\n    try {\n        const qCollection = yield collectionUtils_1.loadCollection(\"frames\", app_1.db);\n        const docs = qCollection.find();\n        if (docs) {\n            return res\n                .contentType(\"json\")\n                .status(200)\n                .send(docs);\n        }\n    }\n    catch (err) {\n        res.status(404).send(err);\n    }\n}));\n//Load Frames\napp_1.app.post(\"/api/frames\", (req, res, next) => __awaiter(this, void 0, void 0, function* () {\n    //TODO move this to higher order function\n    let frames = req.body;\n    try {\n        const cFrame = yield collectionUtils_1.loadCollection(\"frames\", app_1.db);\n        if (frames) {\n            frames.forEach((f) => {\n                cFrame.insert(f);\n            });\n            return res\n                .contentType(\"json\")\n                .status(200)\n                .send(frames);\n        }\n    }\n    catch (err) {\n        res.status(404).send(err);\n    }\n}));\n//Get one Frame by Id\napp_1.app.get(\"/api/frames/:id\", (req, res, next) => __awaiter(this, void 0, void 0, function* () {\n    let id = req.params[\"id\"];\n    console.log(\"Searching Frame by id = \", id);\n    //TODO move this to higher order function\n    try {\n        const framesCollection = yield collectionUtils_1.loadCollection(\"frames\", app_1.db);\n        const doc = framesCollection.findOne({ id: id });\n        console.log(\"Got Frame to Doc \", doc);\n        if (doc) {\n            return res\n                .contentType(\"json\")\n                .status(200)\n                .send(doc);\n        }\n    }\n    catch (err) {\n        res.status(404).send(`No Frame with id ${id} found`);\n    }\n}));\n//Update Frame Data\napp_1.app.patch(\"/api/frames/:id\", (req, res, next) => __awaiter(this, void 0, void 0, function* () {\n    let id = req.params[\"id\"];\n    //console.log(\"Updating Frame by id = \", id);\n    let updatedDoc = req.body;\n    //console.log(\"Doc to be updated \", updatedDoc);\n    //TODO move this to higher order function\n    try {\n        const framesCollection = yield collectionUtils_1.loadCollection(\"frames\", app_1.db);\n        const doc = framesCollection.findOne({ id });\n        //console.log(\"Got Frame to update \", doc);\n        if (doc) {\n            Object.assign(doc, updatedDoc);\n            //console.log(\"Updated Doc \", doc);\n            framesCollection.update(doc);\n            return res\n                .contentType(\"json\")\n                .status(200)\n                .send(updatedDoc);\n        }\n    }\n    catch (err) {\n        console.log(err);\n        res.status(404).send(`No Frame with id ${id} found`);\n    }\n}));\n\n\n//# sourceURL=webpack:///./src/api/frames.ts?");

/***/ }),

/***/ "./src/api/questions.ts":
/*!******************************!*\
  !*** ./src/api/questions.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst app_1 = __webpack_require__(/*! ../app */ \"./src/app.ts\");\nconst collectionUtils_1 = __webpack_require__(/*! ../utils/collectionUtils */ \"./src/utils/collectionUtils.ts\");\n//Get all questions\napp_1.app.get(\"/api/questions\", (req, res, next) => __awaiter(this, void 0, void 0, function* () {\n    //TODO move this to higher order function\n    try {\n        const qCollection = yield collectionUtils_1.loadCollection(\"questions\", app_1.db);\n        const docs = qCollection.find();\n        if (docs) {\n            return res\n                .contentType(\"json\")\n                .status(200)\n                .send(docs);\n        }\n    }\n    catch (err) {\n        res.status(404).send(err);\n    }\n}));\n\n\n//# sourceURL=webpack:///./src/api/questions.ts?");

/***/ }),

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\n    result[\"default\"] = mod;\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ \"dotenv\"));\ndotenv_1.default.config();\nconst cors = __importStar(__webpack_require__(/*! cors */ \"cors\"));\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ \"body-parser\"));\nconst multer_1 = __importDefault(__webpack_require__(/*! multer */ \"multer\"));\nconst collectionUtils_1 = __webpack_require__(/*! ./utils/collectionUtils */ \"./src/utils/collectionUtils.ts\");\nconst lokijs_1 = __importDefault(__webpack_require__(/*! lokijs */ \"lokijs\"));\nconst loki_fs_structured_adapter_1 = __importDefault(__webpack_require__(/*! lokijs/src/loki-fs-structured-adapter */ \"./node_modules/lokijs/src/loki-fs-structured-adapter.js\"));\n//Set up express\nexports.app = express_1.default();\nexports.app.set(\"port\", process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);\nexports.app.set(\"ip\", process.env.IP || process.env.OPENSHIFT_NODEJS_IP || \"0.0.0.0\");\n//DB Config\nexports.app.set(\"dbPath\", process.env.DB_PATH || \"/tmp\");\nexports.app.set(\"dbName\", process.env.DB_NAME || \"eventdb\");\nexports.app.set(\"uploadsPath\", process.env.UPLOADS_PATH || \"/tmp/uploads\");\n//DB Init\nexports.upload = multer_1.default({\n    dest: `${exports.app.get(\"uploadsPath\")}`\n});\nconsole.log(\"Using DB\", `${exports.app.get(\"dbPath\")}${exports.app.get(\"dbName\")}`);\nconst lokiFsStructAdapter = new loki_fs_structured_adapter_1.default();\nexports.db = new lokijs_1.default(`${exports.app.get(\"dbPath\")}${exports.app.get(\"dbName\")}`, {\n    adapter: lokiFsStructAdapter,\n    autoload: true,\n    autoloadCallback: databaseInitialize,\n    autosave: true,\n    autosaveInterval: 4000\n});\nfunction databaseInitialize() {\n    let collectionName = \"questions\";\n    let collection = exports.db.getCollection(collectionName);\n    let data = __webpack_require__(/*! ./data/questions_data.json */ \"./src/data/questions_data.json\");\n    collection =\n        exports.db.getCollection(collectionName) || exports.db.addCollection(collectionName);\n    collectionUtils_1.loadData(collection, data)\n        .then((s) => {\n        console.log(\"Successfully Loaded default questions\");\n    })\n        .catch((err) => console.log(\"Error loading data\", err));\n    collectionName = \"frames\";\n    data = __webpack_require__(/*! ./data/frame_data.json */ \"./src/data/frame_data.json\");\n    collection =\n        exports.db.getCollection(collectionName) || exports.db.addCollection(collectionName);\n    collectionUtils_1.loadData(collection, data)\n        .then((s) => {\n        console.log(\"Successfully Loaded default Frames\");\n    })\n        .catch((err) => console.log(\"Error loading Frames data\", err));\n    exports.db.getCollection(\"collaborators\") || exports.db.addCollection(\"collaborators\");\n}\n//Middlware\nexports.app.use(cors.default({ origin: \"*\" }));\nexports.app.use(body_parser_1.default.json());\n//Questions routes\n__webpack_require__(/*! ./api/questions */ \"./src/api/questions.ts\");\n//Frames routes\n__webpack_require__(/*! ./api/frames */ \"./src/api/frames.ts\");\n//Collaborator routes\n__webpack_require__(/*! ./api/collaborators */ \"./src/api/collaborators.ts\");\n//Start the server\nexports.app.listen(exports.app.get(\"port\"), () => {\n    console.log(\"\\n  App is running at http://localhost:%d in %s mode.\", exports.app.get(\"port\"), exports.app.get(\"env\"));\n    console.log(\"\\n  Press CTRL-C to stop\\n\");\n});\n\n\n//# sourceURL=webpack:///./src/app.ts?");

/***/ }),

/***/ "./src/data/frame_data.json":
/*!**********************************!*\
  !*** ./src/data/frame_data.json ***!
  \**********************************/
/*! exports provided: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, default */
/***/ (function(module) {

eval("module.exports = [{\"id\":\"frame1\",\"filename\":\"frame1-A.png\",\"settings\":{\"left\":60,\"top\":-25,\"angle\":0,\"selectable\":false,\"hoverCursor\":\"default\"},\"scaleWidth\":512,\"scaleHeight\":0,\"isBackground\":false},{\"id\":\"frame2\",\"filename\":\"frame1-B.png\",\"settings\":{\"left\":60,\"top\":-25,\"angle\":0,\"selectable\":false,\"hoverCursor\":\"default\"},\"scaleWidth\":512,\"scaleHeight\":0,\"isBackground\":false},{\"id\":\"frame3\",\"filename\":\"frame1-C.png\",\"settings\":{\"left\":60,\"top\":-25,\"angle\":0,\"selectable\":false,\"hoverCursor\":\"default\"},\"scaleWidth\":512,\"scaleHeight\":0,\"isBackground\":false},{\"id\":\"frame4\",\"filename\":\"frame2-A.png\",\"settings\":{\"left\":20,\"top\":300,\"angle\":0,\"selectable\":false,\"hoverCursor\":\"default\"},\"scaleWidth\":200,\"scaleHeight\":200,\"isBackground\":false},{\"id\":\"frame5\",\"filename\":\"frame2-B.png\",\"settings\":{\"left\":20,\"top\":300,\"angle\":0,\"selectable\":false,\"hoverCursor\":\"default\"},\"scaleWidth\":200,\"scaleHeight\":200,\"isBackground\":false},{\"id\":\"frame6\",\"filename\":\"frame2-C.png\",\"settings\":{\"left\":20,\"top\":300,\"angle\":0,\"selectable\":false,\"hoverCursor\":\"default\"},\"scaleWidth\":200,\"scaleHeight\":200,\"isBackground\":false},{\"id\":\"frame7\",\"filename\":\"frame2-D.png\",\"settings\":{\"left\":20,\"top\":300,\"angle\":0,\"selectable\":false,\"hoverCursor\":\"default\"},\"scaleWidth\":200,\"scaleHeight\":200,\"isBackground\":false},{\"id\":\"frame8\",\"filename\":\"frame3-A.png\",\"settings\":{\"left\":280,\"top\":-25,\"angle\":30,\"selectable\":false,\"hoverCursor\":\"default\"},\"scaleWidth\":200,\"scaleHeight\":200,\"isBackground\":false},{\"id\":\"frame9\",\"filename\":\"frame3-B.png\",\"settings\":{\"left\":280,\"top\":-25,\"angle\":30,\"selectable\":false,\"hoverCursor\":\"default\"},\"scaleWidth\":200,\"scaleHeight\":200,\"isBackground\":false},{\"id\":\"frame10\",\"filename\":\"frame3-A.png\",\"settings\":{\"left\":280,\"top\":-25,\"angle\":30,\"selectable\":false,\"hoverCursor\":\"default\"},\"scaleWidth\":200,\"scaleHeight\":200,\"isBackground\":false},{\"id\":\"frame11\",\"filename\":\"frame3-B.png\",\"settings\":{\"left\":280,\"top\":-25,\"angle\":30,\"selectable\":false,\"hoverCursor\":\"default\"},\"scaleWidth\":200,\"scaleHeight\":200,\"isBackground\":false}];\n\n//# sourceURL=webpack:///./src/data/frame_data.json?");

/***/ }),

/***/ "./src/data/questions_data.json":
/*!**************************************!*\
  !*** ./src/data/questions_data.json ***!
  \**************************************/
/*! exports provided: 0, 1, 2, default */
/***/ (function(module) {

eval("module.exports = [{\"question\":\"Do you love open source?\",\"options\":[{\"index\":\"A\",\"text\":\"Yes, of course!\",\"frame\":\"frame1\"},{\"index\":\"B\",\"text\":\"Not sure yet, I’m still learning.\",\"frame\":\"frame2\"},{\"index\":\"C\",\"text\":\"No, I don’t like sharing.\",\"frame\":\"frame3\"}]},{\"question\":\"What’s your favorite type of hat?\",\"options\":[{\"index\":\"A\",\"text\":\"Fedora\",\"frame\":\"frame4\"},{\"index\":\"B\",\"text\":\"Baseball cap\",\"frame\":\"frame5\"},{\"index\":\"C\",\"text\":\"Beret\",\"frame\":\"frame6\"},{\"index\":\"D\",\"text\":\"Cowboy hat\",\"frame\":\"frame7\"}]},{\"question\":\"Who is your favorite superhero?\",\"options\":[{\"index\":\"A\",\"text\":\"ENIAC women, 6 women who programmed the world’s first electronic computer\",\"frame\":\"frame8\"},{\"index\":\"B\",\"text\":\"Grace Hopper, the Navy admiral known as the “mother of computing”\",\"frame\":\"frame9\"},{\"index\":\"C\",\"text\":\"Annie Easley, developed technology leading to battery used in hybrid cars\",\"frame\":\"frame10\"},{\"index\":\"D\",\"text\":\"Katherine Johnson, NASA “human computer” instrumental in putting the first American in space\",\"frame\":\"frame11\"}]}];\n\n//# sourceURL=webpack:///./src/data/questions_data.json?");

/***/ }),

/***/ "./src/utils/collectionUtils.ts":
/*!**************************************!*\
  !*** ./src/utils/collectionUtils.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nfunction loadData(collection, docs) {\n    return __awaiter(this, void 0, void 0, function* () {\n        return new Promise((resolve, reject) => {\n            if (docs) {\n                collection.clear();\n                docs.forEach((q) => {\n                    collection.insert(q);\n                });\n                resolve(\"success\");\n            }\n        });\n    });\n}\nexports.loadData = loadData;\nfunction loadCollection(collectionName, db) {\n    return new Promise(resolve => {\n        db.loadDatabase({}, () => {\n            const collection = db.getCollection(collectionName) || db.addCollection(collectionName);\n            resolve(collection);\n        });\n    });\n}\nexports.loadCollection = loadCollection;\n\n\n//# sourceURL=webpack:///./src/utils/collectionUtils.ts?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "fs-extra":
/*!***************************!*\
  !*** external "fs-extra" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs-extra\");\n\n//# sourceURL=webpack:///external_%22fs-extra%22?");

/***/ }),

/***/ "lokijs":
/*!*************************!*\
  !*** external "lokijs" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lokijs\");\n\n//# sourceURL=webpack:///external_%22lokijs%22?");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"multer\");\n\n//# sourceURL=webpack:///external_%22multer%22?");

/***/ }),

/***/ "readline":
/*!***************************!*\
  !*** external "readline" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"readline\");\n\n//# sourceURL=webpack:///external_%22readline%22?");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"stream\");\n\n//# sourceURL=webpack:///external_%22stream%22?");

/***/ })

/******/ });