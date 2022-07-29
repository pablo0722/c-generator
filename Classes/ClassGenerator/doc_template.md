# SEPARATION_LINES: number
    Number of blank lines to separate each section 

# SECTIONS: section[]

## TITLE: string
    Any string to print as a section title (usually in capital letters)

## CATEGORY: string
    Categories are: Comment, Code
    To add/edit categories see:
        enum E_SectionCategory (Classes\ClassGenerator\index.ts:186)
        FileSection:getFunctionFromCategory (Classes\ClassGenerator\index.ts:211)
        FileC:getSection (Classes\ClassGenerator\index.ts:353)
### "Comment"
### "Code"

## CONTENT: content[]

### VALUE: string

### TYPE: string
    Types are: Header, DefUndefMacro, Define, Enum, Include, Typedef, Struct, FuncDecl, VarDecl, FuncDef, Footer
    To add/edit types see:
        Type:getFunctionFromType (Classes\ClassGenerator\index.ts:108)
    Each func typeFunc from Type class completes a categoryFunc from FileSection class

## SUBSECTIONS: subsection[]

### SUBTITLE: string

### SUBCONTENT: content[]