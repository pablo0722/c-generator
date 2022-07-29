"use strict";
/*
 */
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
exports.writeToC = exports.fromJSON = void 0;
/*****************************************************************************
 * IMPORTS
 *****************************************************************************/
const index_1 = require("../../helpers/utils/index");
const fs = __importStar(require("fs"));
class Type {
    constructor(type) {
        this.type = type;
        this.toString = this.getFunctionFromType();
    }
    getFunctionFromType() {
        if (this.type.type == 'Header') {
            return this.headerFunc;
        }
        else if (this.type.type == 'Define') {
            return this.defineFunc;
        }
        else if (this.type.type == 'Enum') {
            return this.enumFunc;
        }
        else if (this.type.type == 'Include') {
            return this.includeFunc;
        }
        else if (this.type.type == 'Typedef') {
            return this.typedefFunc;
        }
        else if (this.type.type == 'Struct') {
            return this.structFunc;
        }
        else if (this.type.type == 'FuncDecl') {
            return this.funcDeclFunc;
        }
        else if (this.type.type == 'VarDecl') {
            return this.varDeclFunc;
        }
        else if (this.type.type == 'FuncDef') {
            return this.funcDefFunc;
        }
        else if (this.type.type == 'Footer') {
            return this.footerFunc;
        }
        else {
            throw new Error(`type ${this.type.type} not defined`);
        }
    }
    headerFunc() {
        return ` * ${this.type.value}`;
    }
    defineFunc() {
        return `#define ${this.type.value}`;
    }
    enumFunc() {
        return `${this.type.value}`;
    }
    includeFunc() {
        return `#include ${this.type.value}`;
    }
    typedefFunc() {
        return `${this.type.value}`;
    }
    structFunc() {
        return `${this.type.value}`;
    }
    funcDeclFunc() {
        return `${this.type.value}`;
    }
    varDeclFunc() {
        return `${this.type.value}`;
    }
    funcDefFunc() {
        return `${this.type.value}`;
    }
    footerFunc() {
        return ` * ${this.type.value}`;
    }
}
var E_SectionCategory;
(function (E_SectionCategory) {
    E_SectionCategory[E_SectionCategory["COMMENT"] = 0] = "COMMENT";
    E_SectionCategory[E_SectionCategory["CODE"] = 1] = "CODE";
})(E_SectionCategory || (E_SectionCategory = {}));
// FileC class has an instance of FileSection<> for each type.
// FileC will load each instance with it's respective section loaded from JSON file
// Also FileC has a generic instance of FileSection to include all sections in order
class FileSection {
    constructor(typestr, category) {
        this.lineWidth = 80;
        this.title = typestr;
        this.content = [];
        this.subsections = [];
        this.category = category;
        this.toString = this.getFunctionFromCategory();
    }
    getFunctionFromCategory() {
        if (this.category == E_SectionCategory.COMMENT) {
            return this.commentFunc;
        }
        else if (this.category == E_SectionCategory.CODE) {
            return this.codeFunc;
        }
        else {
            throw new Error(`category ${this.category} not defined`);
        }
    }
    commentFunc() {
        let str = '';
        str += `/${'*'.repeat(this.lineWidth - 1)}\n`;
        str += ` *${' '.repeat((this.lineWidth - this.title.length) / 2)}${this.title}\n`;
        str += ` ${'*'.repeat(this.lineWidth - 2)}/\n`;
        str += `/*\n`;
        this.content.forEach((e) => {
            str += `${e.toString()}\n`;
        });
        str += ` */\n`;
        return str;
    }
    codeFunc() {
        let str = '';
        str += `/${'*'.repeat(this.lineWidth - 1)}\n`;
        str += ` *${' '.repeat((this.lineWidth - this.title.length) / 2)}${this.title}\n`;
        str += ` ${'*'.repeat(this.lineWidth - 2)}/\n`;
        this.content.forEach((e) => {
            str += `${e.toString()}\n`;
        });
        this.subsections.forEach((ss) => {
            str += `\n`;
            str += `// ${ss.subtitle}\n`;
            ss.subcontent.forEach((e) => {
                str += `${e.toString()}\n`;
            });
        });
        return str;
    }
}
class FileC {
    constructor(filename) {
        this.comments = [];
        this.codes = [];
        this.sections = [];
        let hasError = false;
        let content = index_1.file.readJSON(filename);
        if (!content.sections) {
            index_1.log.e(`'sections' key is missing`);
            hasError = true;
        }
        let nSection = 1;
        this.separation_lines = content.separation_lines;
        content.sections.forEach((s) => {
            if (!s.title) {
                index_1.log.e(`'name' key is missing in section ${nSection}`);
                hasError = true;
            }
            if (!s.category) {
                index_1.log.e(`'type' key is missing in section ${nSection}`);
                hasError = true;
            }
            else {
                let _section = this.getSection(s.category, s.title);
                if (null == _section) {
                    index_1.log.e(`category '${s.category}' in section ${nSection} is not valid`);
                    hasError = true;
                }
                else {
                    let section = _section;
                    if (s.content) {
                        s.content.forEach((e) => {
                            section.content.push(new Type(e));
                        });
                    }
                    if (s.subsections) {
                        for (let ss of s.subsections) {
                            let new_subsection = {
                                subtitle: ss.subtitle,
                                subcontent: []
                            };
                            for (let sc of ss.subcontent) {
                                new_subsection.subcontent.push(new Type(sc));
                            }
                            section.subsections.push(new_subsection);
                        }
                    }
                    this.sections.push(section);
                }
            }
            nSection += 1;
        });
        if (hasError) {
            throw new Error('Resolve errors in JSON format');
        }
        index_1.log.d(`JSON file '${filename}' is valid`);
    }
    dump() {
        let t = '   '; // 1 tab
        let t2 = t.repeat(2); // 2 tabs
        let t3 = t.repeat(3); // 3 tabs
        let t4 = t.repeat(4); // 4 tabs
        let t5 = t.repeat(5); // 5 tabs
        let t6 = t.repeat(6); // 6 tabs
        index_1.log.d(`separation_lines: ${this.separation_lines}`);
        index_1.log.d(`number sections: ${this.sections.length}`);
        index_1.log.d(`[`);
        this.sections.forEach((s) => {
            index_1.log.d(`${t}{`);
            index_1.log.d(`${t2}section name: ${s.title}`);
            index_1.log.d(`${t2}section category: ${s.category}`);
            index_1.log.d(`${t4}number subcontent: ${s.content.length}`);
            index_1.log.d(`${t4}[`);
            s.content.forEach((content) => {
                index_1.log.d(`${t5}{`);
                index_1.log.d(`${t6}content: ${content.toString()}`);
                index_1.log.d(`${t5}}`);
            });
            index_1.log.d(`${t4}]`);
            index_1.log.d(`${t2}number sub-sections: ${s.subsections.length}`);
            index_1.log.d(`${t2}[`);
            s.subsections.forEach((ss) => {
                index_1.log.d(`${t3}{`);
                index_1.log.d(`${t4}subtitle: ${ss.subtitle}`);
                index_1.log.d(`${t4}number subcontent: ${ss.subcontent.length}`);
                index_1.log.d(`${t4}[`);
                ss.subcontent.forEach((subcontent) => {
                    index_1.log.d(`${t5}{`);
                    index_1.log.d(`${t6}subcontent: ${subcontent.toString()}`);
                    index_1.log.d(`${t5}}`);
                });
                index_1.log.d(`${t4}]`);
                index_1.log.d(`${t3}}`);
            });
            index_1.log.d(`${t2}]`);
            index_1.log.d(`${t}}`);
        });
        index_1.log.d(`]`);
    }
    toString() {
        let str = '';
        this.sections.forEach((s) => {
            str += s.toString();
            str += `\n`.repeat(this.separation_lines);
        });
        return str;
    }
    getSection(category, title) {
        let sections;
        let cat;
        if (category == 'Comment') {
            sections = this.comments;
            cat = E_SectionCategory.COMMENT;
        }
        else if (category == 'Code') {
            sections = this.codes;
            cat = E_SectionCategory.CODE;
        }
        else {
            return null;
        }
        for (let s of sections) {
            if (s.title == title) {
                return s;
            }
        }
        let section = new FileSection(title, cat);
        sections.push(section);
        return section;
    }
}
;
/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/
/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/
function fromJSON(filename) {
    let c = new FileC(filename);
    c.dump();
    return c;
}
exports.fromJSON = fromJSON;
function writeToC(c, filename) {
    let content = c.toString();
    fs.writeFile(filename, content, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
}
exports.writeToC = writeToC;
