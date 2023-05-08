// functions for manipulating the DOM


/**gets and returns an elements parentNode. */
function getParentNode(element, level=1) {
    while(level-- > 0) {
        element = element.parentNode;
        if (!element) {
            return null;
        }
    }
    return element
}

/**gets a node at an index within a nodes children array.*/
function getChildNodeAtIndex(node, index) {
    return node.children[index];
}

/**removes child nodes from elements children.
 * 
 * if beginStart is true removal starts from the firstChild, else
 * removal starts from the lastChild.
 */
function childRemover(element, childNum, beginStart = false) {  
    while (element.children.length > 1 && childNum > 0) {

        if (beginStart) {
            element.removeChild(element.firstChild);
        } 
        else {
            element.removeChild(element.lastChild)
        }

        childNum--;
    }
}


/**appends children to element */
function appendChildren(element, children = []) {
    children.forEach(ch => {
        element.appendChild(ch);
    })
}


/**creates and returns an element of type. */
function createElement(type, text=undefined, classes=[], id=undefined, onclick = []) {
    const element = document.createElement(type);

    if (text) {
        element.innerHTML = text;
    }

    if (id) {
        element.id = id;
    }

    classes.forEach(c => {
        element.classList.add(c)
    });

    onclick.forEach(eh => {
        element.addEventListener("click", eh)
    })

    return element
}


/**creates tr elements using a 2D array called records.
 * 
 * returns an array of tr elements.
 */
function createRecords(records = [], classes = []) {
    const rows = [];

    records.forEach(rec => {
        const tr = createElement("tr");

        classes.forEach(cls => {
            tr.classList.add(cls);
        })

        rec.forEach(val => {
            const td = createElement("td", val);
            tr.appendChild(td);
        })
        
        rows.push(tr);
    })
    
    return rows;
}

/**creates a html table.
 * 
 * table_id : id of table.
 * 
 * headers : array of strings to be used for th text.
 * 
 * classes : css classes.
*/
function createTable(table_id = undefined, headers = [], classes = []) {
    const table = createElement("table", classes=classes, id=table_id);

    const thead  = createElement("thead");
    const headRow = createElement("tr");
    thead.appendChild(headRow);
    headers.forEach(hdr => {
        const th = createElement("th", hdr);
        headRow.appendChild(th);
    })
    table.appendChild(table);
}



