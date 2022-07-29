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
import { log, file, date } from './helpers/utils/index';
import * as gen from './Classes/ClassGenerator/index';





/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/





/*****************************************************************************
 * MAIN
 *****************************************************************************/
// Read from json
// Read all mixins and traits
// generate C code

log.d("Start main");

let c = gen.fromJSON("./class_example.json");
log.d("writing class to file");
gen.writeToC(c, "./class_example.c");

log.d("End main");
