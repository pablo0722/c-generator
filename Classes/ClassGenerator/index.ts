/*
 */





/*****************************************************************************
 * IMPORTS
 *****************************************************************************/
 import { log, file, array } from '../../helpers/utils/index';
 import * as fs from 'fs';
import { ENOTSOCK } from 'constants';





 /*****************************************************************************
  * DEFINITIONS
  *****************************************************************************/
type header_t = {
    value: string;
    type: string;
}

type define_t = {
    cmd: string;
    name: string;
    value: string;
    type: string;
}

type undef_t = {
    value: string;
    type: string;
}

type macro_t = {
    value: string;
    type: string;
}

type enum_t = {
    value: string;
    type: string;
}

type include_t = {
    value: string;
    type: string;
}

type typedef_t = {
    value: string;
    type: string;
}

type struct_t = {
    value: string;
    type: string;
}

type funcDecl_t = {
    value: string;
    type: string;
}

type varDecl_t = {
    value: string;
    type: string;
}

type funcDef_t = {
    value: string;
    type: string;
}

type footer_t = {
    value: string;
    type: string;
}

type type_t = (
    header_t |
    define_t |
    undef_t |
    macro_t |
    enum_t |
    include_t |
    typedef_t |
    struct_t |
    funcDecl_t |
    varDecl_t |
    funcDef_t |
    footer_t
)

class Type<type extends type_t> {
    type: type_t;
    toString: () => string;
    
    constructor(type: type_t) {
        this.type = type;
        this.toString = this.getFunctionFromType();
    }
    
    private getFunctionFromType(): () => string {
        if(this.type.type == 'Header') {
            return this.headerFunc;
        } else if(this.type.type == 'Define') {
            return this.defineFunc;
        } else if(this.type.type == 'Enum') {
            return this.enumFunc;
        } else if(this.type.type == 'Include') {
            return this.includeFunc;
        } else if(this.type.type == 'Typedef') {
            return this.typedefFunc;
        } else if(this.type.type == 'Struct') {
            return this.structFunc;
        } else if(this.type.type == 'FuncDecl') {
            return this.funcDeclFunc;
        } else if(this.type.type == 'VarDecl') {
            return this.varDeclFunc;
        } else if(this.type.type == 'FuncDef') {
            return this.funcDefFunc;
        } else if(this.type.type == 'Footer') {
            return this.footerFunc;
        } else {
            throw new Error(`type ${this.type.type} not defined`);
        }
    }
    
    headerFunc(): string {
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

type fileSubsection_t<type extends type_t> = {
    subtitle: string,
    subcontent: Type<type>[]
}

enum E_SectionCategory {
    COMMENT,
    CODE
}

// FileC class has an instance of FileSection<> for each type.
// FileC will load each instance with it's respective section loaded from JSON file
// Also FileC has a generic instance of FileSection to include all sections in order
class FileSection {
    readonly lineWidth = 80;
    
    title: string; // Name to put in C-file's comment as a title 
    readonly category:E_SectionCategory;
    content: Type<type_t>[];
    subsections: fileSubsection_t<type_t>[];
    toString: () => string;
    
    constructor(typestr:string, category:E_SectionCategory) {
        this.title = typestr;
        this.content = [];
        this.subsections = [];
        this.category = category;
        this.toString = this.getFunctionFromCategory();
    }
    
    private getFunctionFromCategory(): () => string {
        if(this.category == E_SectionCategory.COMMENT) {
            return this.commentFunc;
        } else if(this.category == E_SectionCategory.CODE) {
            return this.codeFunc;
        } else {
            throw new Error(`category ${this.category} not defined`);
        }
    }
    
    commentFunc(): string {
        let str: string = '';
        
        str += `/${'*'.repeat(this.lineWidth-1)}\n`
        str += ` *${' '.repeat((this.lineWidth-this.title.length)/2)}${this.title}\n`
        str += ` ${'*'.repeat(this.lineWidth-2)}/\n`
        str += `/*\n`
        this.content.forEach((e:Type<type_t>) => {
            str += `${e.toString()}\n`;
        });
        str += ` */\n`
        
        return str;
    }
    PROBAR TODAS LAS SECCIONES Y SUBSECCIONES (COMPLETAR class_example.json CON CODIGO FAMAR)
    codeFunc() {
        let str: string = '';
        
        str += `/${'*'.repeat(this.lineWidth-1)}\n`
        str += ` *${' '.repeat((this.lineWidth-this.title.length)/2)}${this.title}\n`
        str += ` ${'*'.repeat(this.lineWidth-2)}/\n`
        this.content.forEach((e:Type<type_t>) => {
            str += `${e.toString()}\n`;
        });
        this.subsections.forEach((ss:fileSubsection_t<type_t>) => {
            str += `\n`;
            str += `// ${ss.subtitle}\n`;
            ss.subcontent.forEach((e:Type<type_t>) => {
                str += `${e.toString()}\n`;
            });
        });
        
        return str;
    }
}

// Only to read JSON file in FileC constructor
type fileSection_t<type extends type_t> = {
    title: string;
    category: string;
    content: type[];
    subsections: {
        subtitle: string,
        subcontent: type[]
    }[];
}

class FileC {
    comments: FileSection[] = [];
    codes   : FileSection[] = [];
    sections: FileSection[] = [];
    separation_lines: number;
    
    constructor(filename: string) {
        let hasError: boolean = false;
        let content = file.readJSON(filename);
        
        if(!content.sections) {log.e(`'sections' key is missing`); hasError = true;}
        let nSection = 1;
        this.separation_lines = content.separation_lines;
        content.sections.forEach((s: fileSection_t<type_t>) => {
            if(!s.title) {
                log.e(`'name' key is missing in section ${nSection}`);
                hasError = true;
            }
            if(!s.category) {
                log.e(`'type' key is missing in section ${nSection}`);
                hasError = true;
            } else {
                let _section = this.getSection(s.category, s.title);
                if(null == _section) {
                    log.e(`category '${s.category}' in section ${nSection} is not valid`);
                    hasError = true;
                } else {
                    let section:FileSection = _section;
                    if(s.content) {
                        s.content.forEach((e:type_t) => {
                            section.content.push(new Type<type_t>(e));
                        });
                    }
                    if(s.subsections) {
                        for(let ss of s.subsections) {
                            let new_subsection: fileSubsection_t<type_t> = {
                                subtitle: ss.subtitle,
                                subcontent: []
                            };
                            for(let sc of ss.subcontent) {
                                new_subsection.subcontent.push(new Type<type_t>(sc));
                            }
                            section.subsections.push(new_subsection);
                        }
                    }
                    this.sections.push(section);
                }
            }
            nSection += 1;
        });
        
        if(hasError)
        {
            throw new Error('Resolve errors in JSON format');
        }
        
        log.d(`JSON file '${filename}' is valid`);
    }
    
    dump(): void {
        let t = '   ';        // 1 tab
        let t2 = t.repeat(2); // 2 tabs
        let t3 = t.repeat(3); // 3 tabs
        let t4 = t.repeat(4); // 4 tabs
        let t5 = t.repeat(5); // 5 tabs
        let t6 = t.repeat(6); // 6 tabs
        
        log.d(`separation_lines: ${this.separation_lines}`);
        log.d(`number sections: ${this.sections.length}`);
        log.d(`[`);
        this.sections.forEach( (s) => {
            log.d(`${t}{`);
                log.d(`${t2}section name: ${s.title}`);
                log.d(`${t2}section category: ${s.category}`);
                log.d(`${t4}number subcontent: ${s.content.length}`);
                log.d(`${t4}[`);
                s.content.forEach( (content: Type<type_t>) => {
                    log.d(`${t5}{`);
                        log.d(`${t6}content: ${content.toString()}`);
                    log.d(`${t5}}`);
                });
                log.d(`${t4}]`);
                log.d(`${t2}number sub-sections: ${s.subsections.length}`);
                log.d(`${t2}[`);
                s.subsections.forEach( (ss) => {
                    log.d(`${t3}{`);
                        log.d(`${t4}subtitle: ${ss.subtitle}`);
                        log.d(`${t4}number subcontent: ${ss.subcontent.length}`);
                        log.d(`${t4}[`);
                        ss.subcontent.forEach( (subcontent: Type<type_t>) => {
                            log.d(`${t5}{`);
                                log.d(`${t6}subcontent: ${subcontent.toString()}`);
                            log.d(`${t5}}`);
                        });
                        log.d(`${t4}]`);
                    log.d(`${t3}}`);
                });
                log.d(`${t2}]`);
            log.d(`${t}}`);
        });
        log.d(`]`);
    }
    
    toString(): string {
        let str: string = '';
        
        this.sections.forEach( (s) => {
            str += s.toString();
            str += `\n`.repeat(this.separation_lines);
        });
        
        return str;
    }
    
    private getSection(category: string, title: string): FileSection|null {
        let sections: FileSection[];
        let cat: E_SectionCategory;
        if(category == 'Comment') {
            sections = this.comments;
            cat = E_SectionCategory.COMMENT;
        } else if(category == 'Code') {
            sections = this.codes;
            cat = E_SectionCategory.CODE;
        } else {
            return null;
        }
        for (let s of sections) {
            if(s.title == title) {
                return s;
            }
        }
        let section: FileSection = new FileSection(title, cat);
        sections.push(section);
        
        return section;
    }
};





 /*****************************************************************************
  * GLOBAL CONSTANTS
  *****************************************************************************/





/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/
function fromJSON(filename: string): FileC|any {
    let c: FileC = new FileC(filename);
    c.dump();
    
    return c;
}

function writeToC(c: FileC, filename: string) {
    let content: string = c.toString();

    fs.writeFile(filename, content, err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
}





/*****************************************************************************
 * EXPORTS
 *****************************************************************************/
export {
    fromJSON,
    writeToC
};