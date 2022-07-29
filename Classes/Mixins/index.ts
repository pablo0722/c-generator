/* MIXINS:
 *     - May contain state:
 *         * Can define instance variables
 *         * The state must be provided by the composing class
 *     - Use "implicit conflict resolution"
 *     - Are linearized:
 *         * Mixins has priority order.
 *             e.g.:Class C mixins A, B; MA has higher priority than B
 *             so methods of A replaces methods of B with same name.
 *
 * TRAITS:
 *     - Don't contain state
 *     - Use "explicit conflict resolution"
 *     - Are flattened
 */





/*****************************************************************************
 * IMPORTS
 *****************************************************************************/
 import { log, file, array } from '../../helpers/utils/index';





 /*****************************************************************************
  * DEFINITIONS
  *****************************************************************************/





 /*****************************************************************************
  * GLOBAL CONSTANTS
  *****************************************************************************/
 const all = file.readJSON('./Classes/Mixins/.json');





/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/
function readCurrent(): string[] {
    return file.readJSON('./assets/issuesJSON/private/currentIssues.json');
}





/*****************************************************************************
 * EXPORTS
 *****************************************************************************/
export {
};