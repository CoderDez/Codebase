
/**responsible for getting data from elements with class of 'category'.
 * 
 * returns an Object in the following format:
 * 
 * category name (String): {cost (Number) }
 */
function getCategories() {
    lookup = {}
    const cats = document.querySelectorAll(".category");
    cats.forEach(cat => {
        lookup[cat.dataset.name] = cat.dataset.cost;
    })
    return lookup;
}

/** returns a font size based on the width of the window. */
function getChartFont() {
    if (window.outerWidth <= 576) {
        return 8;
    }
    else if (window.outerWidth <= 768) {
        return 10;
    }
    else{
        return 12;
    }
} 

function createPieChart(element) {
    return new Chart(element, {
        type: 'pie',
        data: {
        labels: Object.keys(categories),
        datasets: [{
            data: Object.values(categories)
        }]
        },
        options: {
            reponsive: true,
            plugins: {
                legend: {
                    position: "left",
                    labels: {
                        font: {
                            size : getChartFont()
                        }
                    }
                }
            }
        }
    })
}

const categories = getCategories()
const chart = createPieChart(document.getElementById("pie_chart"));

