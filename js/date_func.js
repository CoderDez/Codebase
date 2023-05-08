// functions for date functionality

var startDate, endDate;


/**returns a string representation of a date object.
 * 
 * format of returning string: 'YYYY-mm-dd'
 */
function getDateString(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;

    if (month.toString().length == 1) {
        month = `0${month}`;
    }

    let day = date.getDate();

    if (day.toString().length == 1) {
        day = `0${day}`;
    }
    return `${year}-${month}-${day}`;
}


/**function to set the start and end date */
function setDates(start=undefined, end=undefined) {
    startDate = document.querySelector(".start-date");
    endDate = document.querySelector(".end-date");

    if (!start && !end) {
        startDate.value = "";
        endDate.value = "";
    }
    else {
        startDate.value = start;
        endDate.value = end;
    }
}


function dateInput() {
    startDate = document.querySelector(".start-date");
    endDate = document.querySelector(".end-date");

    startDate.addEventListener("input", startDateHandler);
    endDate.addEventListener("input", endDateHandler)
}

function startDateHandler() {
    if (endDate.value != "") {
        // start value can't be greater than end value
        if (this.value > endDate.value) {
            endDate.value = this.value;
        }
    }
}

function endDateHandler() {
    if (startDate.value != "") {
        // end value can't be less than start value
        if (this.value < startDate.value) {
            startDate.value = this.value;
        } 
    }
}
