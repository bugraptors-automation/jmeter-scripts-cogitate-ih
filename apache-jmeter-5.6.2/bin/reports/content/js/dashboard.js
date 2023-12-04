/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.25, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Select New Business"], "isController": false}, {"data": [0.0, 500, 1500, "Drivers"], "isController": false}, {"data": [0.0, 500, 1500, "Login   NewBusiness"], "isController": false}, {"data": [0.0, 500, 1500, "Underwriting"], "isController": false}, {"data": [1.0, 500, 1500, "BeanShell Sampler - Vehicles"], "isController": false}, {"data": [0.0, 500, 1500, "Transaction Controller -  New Business"], "isController": true}, {"data": [1.0, 500, 1500, "BeanShell Sampler - Driver"], "isController": false}, {"data": [0.5, 500, 1500, "Get Login "], "isController": false}, {"data": [0.0, 500, 1500, "Get Vehicles"], "isController": false}, {"data": [0.0, 500, 1500, "Policy Info"], "isController": false}, {"data": [0.0, 500, 1500, "Vehicles"], "isController": false}, {"data": [0.0, 500, 1500, "Coverages"], "isController": false}, {"data": [0.0, 500, 1500, "Make Payment"], "isController": false}, {"data": [0.0, 500, 1500, "Upload Document"], "isController": false}, {"data": [0.0, 500, 1500, "Order Reports"], "isController": false}, {"data": [0.5, 500, 1500, "Ineligible Risks"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15, 0, 0.0, 3621.9333333333334, 2, 19625, 2606.0, 12077.000000000004, 19625.0, 19625.0, 0.2620774001921901, 5.7705314438280775, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Select New Business", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 72.86922895728642, 0.0], "isController": false}, {"data": ["Drivers", 1, 0, 0.0, 2606.0, 2606, 2606, 2606.0, 2606.0, 2606.0, 2606.0, 0.3837298541826554, 7.155587466423638, 0.0], "isController": false}, {"data": ["Login   NewBusiness", 1, 0, 0.0, 3957.0, 3957, 3957, 3957.0, 3957.0, 3957.0, 3957.0, 0.25271670457417234, 7.132830269143291, 0.0], "isController": false}, {"data": ["Underwriting", 1, 0, 0.0, 7045.0, 7045, 7045, 7045.0, 7045.0, 7045.0, 7045.0, 0.14194464158977999, 5.178761533002129, 0.0], "isController": false}, {"data": ["BeanShell Sampler - Vehicles", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 0.0, 0.0], "isController": false}, {"data": ["Transaction Controller -  New Business", 1, 0, 0.0, 53355.0, 53355, 53355, 53355.0, 53355.0, 53355.0, 53355.0, 0.0187423859057258, 6.0860407295473715, 0.0], "isController": true}, {"data": ["BeanShell Sampler - Driver", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 0.0, 0.0], "isController": false}, {"data": ["Get Login ", 1, 0, 0.0, 974.0, 974, 974, 974.0, 974.0, 974.0, 974.0, 1.026694045174538, 5.7039672099589325, 0.0], "isController": false}, {"data": ["Get Vehicles", 1, 0, 0.0, 2263.0, 2263, 2263, 2263.0, 2263.0, 2263.0, 2263.0, 0.44189129474149363, 13.33570964980115, 0.0], "isController": false}, {"data": ["Policy Info", 1, 0, 0.0, 4761.0, 4761, 4761, 4761.0, 4761.0, 4761.0, 4761.0, 0.21003990758244065, 7.865830445284604, 0.0], "isController": false}, {"data": ["Vehicles", 1, 0, 0.0, 1578.0, 1578, 1578, 1578.0, 1578.0, 1578.0, 1578.0, 0.6337135614702154, 12.619192609315588, 0.0], "isController": false}, {"data": ["Coverages", 1, 0, 0.0, 3801.0, 3801, 3801, 3801.0, 3801.0, 3801.0, 3801.0, 0.26308866087871613, 7.40784703038674, 0.0], "isController": false}, {"data": ["Make Payment", 1, 0, 0.0, 3642.0, 3642, 3642, 3642.0, 3642.0, 3642.0, 3642.0, 0.2745744096650192, 7.889992191790225, 0.0], "isController": false}, {"data": ["Upload Document", 1, 0, 0.0, 3000.0, 3000, 3000, 3000.0, 3000.0, 3000.0, 3000.0, 0.3333333333333333, 10.951497395833334, 0.0], "isController": false}, {"data": ["Order Reports", 1, 0, 0.0, 19625.0, 19625, 19625, 19625.0, 19625.0, 19625.0, 19625.0, 0.050955414012738856, 1.3375298566878981, 0.0], "isController": false}, {"data": ["Ineligible Risks", 1, 0, 0.0, 869.0, 869, 869, 869.0, 869.0, 869.0, 869.0, 1.1507479861910241, 26.842545310701958, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
