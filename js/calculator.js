
var displayInput;

/**responsible for registering click event handlers for the 
 * different types of buttons within the calculator.
 */
function calculatorEventRegistration() {
    displayInput = document.getElementById("display_input");
    const buttons = document.querySelector("#calculator-buttons").querySelectorAll("button");
    buttons.forEach(btn => {
        if (btn.dataset.value == "equals") {
            btn.addEventListener("click", handleComputation)
        }
        else if (btn.dataset.value == "clear") {
            btn.addEventListener("click", clearDisplayInput)
        }
        else if (btn.dataset.value == "backspace") {
            btn.addEventListener("click", performBackSpace)
        }
        if (btn.dataset.value == "equals") {
            btn.addEventListener("click", handleComputation)
        }
        else if (btn.dataset.value == "clear") {
            btn.addEventListener("click", clearDisplayInput)
        }
        else if (btn.dataset.value == "backspace") {
            btn.addEventListener("click", performBackSpace)
        }
        else {
            btn.addEventListener("click", handleDisplayValue)
        }
    })
}

/**event handler for = button. */
function handleComputation() {
    if (CalculationSyntaxChecker()) {
        compute();

    } 
    else {
        displayInput.value = "SYNTAX ERROR"
    }
}

function compute() {
    let value = insertMultSigns(displayInput.value);
    displayInput.value = resolver(value);
}


function resolver(value) {
    value = replacer(value, [ ["++", "+"], ["--", "+"], ["-+", "-"], ["+-", "-"] ]);

    let pair = getBracketPair(value);

    while(pair) {
        value = replaceAt(
            value,
            pair.startInd,
            pair.endInd,
            resolver(
                value.substring(pair.startInd+1, pair.endInd)
            )
        )
        pair = getBracketPair(value); 
    }

    return calculation(value);
}

/**returns the first pair of brackets in value.
 * 
 * format of returning object:
 * 
 * {
 *     startInd: Number, endInd: Number
 * }
 */
function getBracketPair(value) {
    let openInds = findIndexes("(", value);
    let closeInds = findIndexes(")", value);

    if (!openInds.length) {
        return undefined;
    }
    else {
        // create object, startInd will be first index in openInds
        const obj = {
            "startInd": openInds[0],
            "endInd": undefined
        }
        
        // find the right closeInd
        let closeInd;
        for (let i=0; i < closeInds.length; i++) {
            closeInd = closeInds[i];
            if (i != closeInds.length -1) {
                let nextOpenInd = openInds[i+1];
                // when the closeInd is less than the next openInd (in terms of index):
                // break
                if (closeInd < nextOpenInd) {
                    break;
                }
            }
        }
        
        obj["endInd"] = closeInd;
        return obj
    }
}


/**responsible for inserting x signs before opening brackets in cases
 * where the opening bracket is preceeded by a number or ) bracket.
 */
function insertMultSigns(value) {
    let openInd = value.indexOf("(", 1);
    let preChar = value[openInd-1];

    while(openInd > -1) {
        // if previous char was ) or number
        if (preChar == ")" || !isNaN(preChar)) {
            value = replaceAt(
                value,
                openInd,
                openInd,
                "x("
            )
            openInd = value.indexOf("(", openInd + 2)
        }
        else {
            openInd = value.indexOf("(", openInd + 1)

        }
        preChar = value[openInd-1];
    }

    return value;
}

/**performs mathemathical calculation on value.
 * 
 * expects value to be a valid mathematical expression that is composed of:
 * - numerical values
 * - . (optional)
 * - operators: [+, -, *, x]
 * 
 * `does not accept brackets.`
 * 
 * returns calculated value from expression.
 */
function calculation(value) {
    // returns smallest non negative number in nums
    let lowestNonNeg = (nums) => nums.filter(n => n > -1).sort((x,y) => x-y)[0];

    let numPair, numBefore, numAfter, result;

    // First deal with x and /
    let multInd = value.indexOf("x");
    let divInd = value.indexOf("/");

    while(multInd > -1 || divInd > -1) {
        let ind = lowestNonNeg([multInd, divInd])

        numPair = getClosestNumberPair(value, ind);

        numBefore = numPair.numberBefore;
        numAfter = numPair.numberAfter;

        result = multInd == ind ? (numBefore.value * numAfter.value) : (numBefore.value / numAfter.value);
        value = replaceAt(value, numBefore.index,numAfter.index, result);
        
        multInd = value.indexOf("x");
        divInd = value.indexOf("/");
    }

    // then deal with + and -

    let addInd = value.indexOf("+");
    let subInd = value.indexOf("-", 1);

    while(addInd > -1 || subInd > -1) {
        let ind = lowestNonNeg([addInd, subInd]);

        numPair = getClosestNumberPair(value, ind);
        numBefore = numPair.numberBefore;
        numAfter = numPair.numberAfter;

        result = addInd == ind ? (numBefore.value + numAfter.value) : (numBefore.value - numAfter.value);
        value = replaceAt(value, numBefore.index, numAfter.index, result);

        addInd = value.indexOf("+");
        subInd = value.indexOf("-", 1);
    }
    return value;
}

/**replaces characters within value.
 * expects replaceMatrix to be a 2D array with each sub array in the following format:
 * [value, replacement].
 * 
 * returns value with values replaced by replacements.
 */
function replacer(value, replaceMatrix) {
    replaceMatrix.forEach(rp => {
        let [v, r] = rp;
        while(value.indexOf(v) > -1) {
            value = replaceAt(
                value, 
                value.indexOf(v),
                value.indexOf(v) + v.length - 1,
                r
            )
        }
    })
    return value;
}

/**responsible for replacing chars within argument for str.
 * 
 * inserts the replacement from startIndex up to but not including endIndex.
 * 
 * returns str after replacement has been performed.
 */
function replaceAt(str, startIndex, endIndex, replacement) {
    return str.substring(0, startIndex) + replacement + str.substring(endIndex+1)
}

/**returns the closest number pair to an index in value in the form of an object.
 * 
 * format of object: 
 * 
 * "numberBefore" : {
 *      "value": Number,
 *      "index": Number
 * }, 
 * 
 * "numberAfter" : {
 *      "value": Number,
 *      "index": Number
 * }
 */
function getClosestNumberPair(value, index) {
    let result = {
        "numberBefore": {"value": "","index": index },
        "numberAfter": {"value": "","index": index }
    }

    let char;

    // get the number before the operator at index (numberBefore)
    for (let i=index -1; i >= 0; i--) {
        char = value[i];
        // if value is numeric or . concatenate
        if (!isNaN(char) || char == ".") {
            result.numberBefore.value += char;
            result.numberBefore.index = result.numberBefore.index - 1;
        }
        else if (char == "-") {
            let preChar = value[i-1];
            if (isNaN(preChar) || preChar == undefined) {
                result.numberBefore.value += char;
                result.numberBefore.index = result.numberBefore.index - 1;
            }
            else {
                break;
            }
        }
        else {
            break;
        }
    }
    result.numberBefore.value = Number(result.numberBefore.value.split("").reverse().join(""));

    for (let i=index+1; i < value.length; i++) {
        char = value[i];
        // if value is numeric or . concatenate
        if (!isNaN(char) || char == ".") {
            result.numberAfter.value += char;
            result.numberAfter.index = result.numberAfter.index + 1;
        }
        else if (char == "-") {
            // if char is first char after operator at index
            if (i == index+1) {
                result.numberAfter.value += char;
                result.numberAfter.index = result.numberAfter.index + 1;
            }
            else {
                break;
            }
        }
        else {
            break;
        }
    }
    result.numberAfter.value = Number(result.numberAfter.value);
    return result;
}

/**peforms syntax check for displayInput.value.
 * 
 * invokes:
 * 
 * - startAndEndCharCheck,
 * - bracketCheck,
 * - operatorCheck
 */
function CalculationSyntaxChecker() {
    if (!startAndEndCharCheck()) {
        return false;
    }
    else if (!bracketCheck()) {
        return false;
    }
    else if (!operatorCheck()) {
        return false;
    }

    return true;
}

/**performs validation for start and end characters.
 * returns true if validation was succesful, else false.
*/
function startAndEndCharCheck() {
    let firstChar = displayInput.value[0]

    // can't start with: ), x, /, 
    if ([")", "x", "/"].indexOf(firstChar) > -1) {
        return false;
    } 
    
    // must end with digit or )
    let lastChar = displayInput.value[displayInput.value.length - 1];
    if (isNaN(lastChar) && lastChar != ")") {
        return false;
    }

    return true;
}

/**performs validation for brackets
 * returns true if validation was successful, else false
 */
function bracketCheck() {
    let openingIndexes = findIndexes("(", displayInput.value);
    let closingIndexes = findIndexes(")", displayInput.value);

    // () is not allowed
    if (displayInput.value.indexOf("()") > -1) {
        return false;
    }

    // must be equal amount of opening and closing brackets
    if (openingIndexes.length != closingIndexes.length) {
        return false;
    }

    let charsSucceedingOpening = ["x", "/"];
    let charsPreceedingOpening = ["."];
    let inpLastInd = displayInput.value.length -1;

    // opening brackets must not be succeeded by x and /
    // opening brackets must not be preeceded by .
    for (let i=0; i < openingIndexes.length; i++) {
        let openInd = openingIndexes[i];

        if (openInd != inpLastInd) {
            if (charsSucceedingOpening.indexOf(displayInput.value[openInd + 1]) > -1) {
                return false;
            }
        }
        if (openInd != 0) {
            if (charsPreceedingOpening.indexOf(displayInput.value[openInd-1]) > -1) {
                return false;
            }
        }
    }

    let charsPreceedingClosing = ["x", "/", "+", "-", "."]

    for (let i=0; i < closingIndexes.length; i++) {
        let closeInd = closingIndexes[i];

        // closing brackets must not be preceeded by x, /, +, -, or (
        // () is already checked above.
        if (charsPreceedingClosing.indexOf(displayInput.value[closeInd-1]) > -1) {
            return false;
        }
        
        if (closeInd != inpLastInd) {
            let ch = displayInput.value[closeInd + 1]
            // closing brackets must not be succeeded by a digit or .
            if (!isNaN(ch) || ch == ".") {
                return false;
            }
        }
    }

    return true;
}

/**performs validation for operators
 * returns true if validation was successful, else False
 */
function operatorCheck() {
    // each operator must not be succeeded by x or /
    const operators = ["x", "/", "-", "+"];

    for (let i=0; i < operators.length; i++) {
        let oper = operators[i];
        if (displayInput.value.indexOf(`${oper}x`) > -1) {
            return false;
        }
        else if (displayInput.value.indexOf(`${oper}/`) > -1) {
            return false;
        }
    }
    return true;
}

/**finds all indexes of part in string input.
 * returns an array.
 */
function findIndexes(part, input) {
    indexes = []
    if (typeof(input) != "string") {
        return indexes
    }
    else {
        for (let i=0; i < input.length; i++) {
            if (input[i] == part) {
                indexes.push(i)
            }
        }
    }
    return indexes
}

/**sets displayInput.value to 0 */
function clearDisplayInput() {
    displayInput.value = "0"
}

/**performs backspace by removing last character from displayInput.value. */
function performBackSpace() {
    displayInput.value = displayInput.value.slice(0, -1)
    if (!displayInput.value) {
        clearDisplayInput();
    }
}

function handleDisplayValue() {
    if (displayInput.value == "0" || displayInput.value == "SYNTAX ERROR") {
        displayInput.value = ""
    }
    displayInput.value += this.dataset.value;
}
