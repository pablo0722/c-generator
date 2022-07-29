"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* TODO: Implement:
       - Typestates
       - Locks
       - attributes:
           - NotNull
           - Const
           - Accessors
           - Restrict: An method's argument is not aliased
           - traits, mixins, interfaces, labels
           - Threadable: Avoid multiple access from many threads, to classes and methods. This mean a class, instance or method is not aliased
*/
/*****************************************************************************
 * IMPORTS
 *****************************************************************************/
const index_1 = require("./helpers/utils/index");
const gen = __importStar(require("./Classes/ClassGenerator/index"));
/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/
/*****************************************************************************
 * MAIN
 *****************************************************************************/
// Read from json
// Read all mixins and traits
// generate C code
index_1.log.d("Start main");
let c = gen.fromJSON("./class_example.json");
index_1.log.d("writing class to file");
gen.writeToC(c, "./class_example.c");
index_1.log.d("End main");
