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

    var data = {"OkPercent": 66.66666666666667, "KoPercent": 33.333333333333336};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Select New Business"], "isController": false}, {"data": [0.0, 500, 1500, "Login   NewBusiness"], "isController": false}, {"data": [0.0, 500, 1500, "Transaction Controller -  New Business"], "isController": true}, {"data": [0.0, 500, 1500, "Get Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3, 1, 33.333333333333336, 7925.333333333334, 1134, 16624, 6018.0, 16624.0, 16624.0, 16624.0, 0.12420817289777666, 0.9053611352627003, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Select New Business", 1, 1, 100.0, 1134.0, 1134, 1134, 1134.0, 1134.0, 1134.0, 1134.0, 0.8818342151675485, 3.685791446208113, 0.0], "isController": false}, {"data": ["Login   NewBusiness", 1, 0, 0.0, 16624.0, 16624, 16624, 16624.0, 16624.0, 16624.0, 16624.0, 0.060153994225216556, 0.7183232826034649, 0.0], "isController": false}, {"data": ["Transaction Controller -  New Business", 1, 1, 100.0, 17758.0, 17758, 17758, 17758.0, 17758.0, 17758.0, 17758.0, 0.05631264782070053, 0.9078214748282465, 0.0], "isController": true}, {"data": ["Get Login", 1, 0, 0.0, 6018.0, 6018, 6018, 6018.0, 6018.0, 6018.0, 6018.0, 0.16616816218012628, 0.9548178381522101, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/element click intercepted: Element &lt;img class=&quot;svg align-baseline&quot; src=&quot;images/sidebar-newApplication.svg&quot; alt=&quot;New Business&quot;&gt; is not clickable at point (38, 185). Other element would receive the click: &lt;div id=&quot;nprogress&quot;&gt;...&lt;/div&gt;\\n  (Session info: chrome=118.0.5993.71)\\nBuild info: version: '4.10.0', revision: 'c14d967899'\\nSystem info: os.name: 'Windows 10', os.arch: 'amd64', os.version: '10.0', java.version: '11.0.16.1'\\nDriver info: org.openqa.selenium.chrome.ChromeDriver\\nCommand: [5040af046e6765b1c617960f8317461a, clickElement {id=D041161BF6366EADB68431ABF6956916_element_24}]\\nCapabilities {acceptInsecureCerts: false, browserName: chrome, browserVersion: 118.0.5993.71, chrome: {chromedriverVersion: 117.0.5938.88 (be6afae47212..., userDataDir: C:\\\\Users\\\\KUMARV~1\\\\AppData\\\\L...}, fedcm:accounts: true, goog:chromeOptions: {debuggerAddress: localhost:50217}, networkConnectionEnabled: false, pageLoadStrategy: normal, platformName: windows, proxy: Proxy(system), se:cdp: ws://localhost:50217/devtoo..., se:cdpVersion: 118.0.5993.71, setWindowRect: true, strictFileInteractability: false, timeouts: {implicit: 0, pageLoad: 300000, script: 30000}, unhandledPromptBehavior: dismiss and notify, webauthn:extension:credBlob: true, webauthn:extension:largeBlob: true, webauthn:extension:minPinLength: true, webauthn:extension:prf: true, webauthn:virtualAuthenticators: true}\\nElement: [[ChromeDriver: chrome on windows (5040af046e6765b1c617960f8317461a)] -&gt; xpath: //img[@alt='New Business']]\\nSession ID: 5040af046e6765b1c617960f8317461a", 1, 100.0, 33.333333333333336], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3, 1, "500/element click intercepted: Element &lt;img class=&quot;svg align-baseline&quot; src=&quot;images/sidebar-newApplication.svg&quot; alt=&quot;New Business&quot;&gt; is not clickable at point (38, 185). Other element would receive the click: &lt;div id=&quot;nprogress&quot;&gt;...&lt;/div&gt;\\n  (Session info: chrome=118.0.5993.71)\\nBuild info: version: '4.10.0', revision: 'c14d967899'\\nSystem info: os.name: 'Windows 10', os.arch: 'amd64', os.version: '10.0', java.version: '11.0.16.1'\\nDriver info: org.openqa.selenium.chrome.ChromeDriver\\nCommand: [5040af046e6765b1c617960f8317461a, clickElement {id=D041161BF6366EADB68431ABF6956916_element_24}]\\nCapabilities {acceptInsecureCerts: false, browserName: chrome, browserVersion: 118.0.5993.71, chrome: {chromedriverVersion: 117.0.5938.88 (be6afae47212..., userDataDir: C:\\\\Users\\\\KUMARV~1\\\\AppData\\\\L...}, fedcm:accounts: true, goog:chromeOptions: {debuggerAddress: localhost:50217}, networkConnectionEnabled: false, pageLoadStrategy: normal, platformName: windows, proxy: Proxy(system), se:cdp: ws://localhost:50217/devtoo..., se:cdpVersion: 118.0.5993.71, setWindowRect: true, strictFileInteractability: false, timeouts: {implicit: 0, pageLoad: 300000, script: 30000}, unhandledPromptBehavior: dismiss and notify, webauthn:extension:credBlob: true, webauthn:extension:largeBlob: true, webauthn:extension:minPinLength: true, webauthn:extension:prf: true, webauthn:virtualAuthenticators: true}\\nElement: [[ChromeDriver: chrome on windows (5040af046e6765b1c617960f8317461a)] -&gt; xpath: //img[@alt='New Business']]\\nSession ID: 5040af046e6765b1c617960f8317461a", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Select New Business", 1, 1, "500/element click intercepted: Element &lt;img class=&quot;svg align-baseline&quot; src=&quot;images/sidebar-newApplication.svg&quot; alt=&quot;New Business&quot;&gt; is not clickable at point (38, 185). Other element would receive the click: &lt;div id=&quot;nprogress&quot;&gt;...&lt;/div&gt;\\n  (Session info: chrome=118.0.5993.71)\\nBuild info: version: '4.10.0', revision: 'c14d967899'\\nSystem info: os.name: 'Windows 10', os.arch: 'amd64', os.version: '10.0', java.version: '11.0.16.1'\\nDriver info: org.openqa.selenium.chrome.ChromeDriver\\nCommand: [5040af046e6765b1c617960f8317461a, clickElement {id=D041161BF6366EADB68431ABF6956916_element_24}]\\nCapabilities {acceptInsecureCerts: false, browserName: chrome, browserVersion: 118.0.5993.71, chrome: {chromedriverVersion: 117.0.5938.88 (be6afae47212..., userDataDir: C:\\\\Users\\\\KUMARV~1\\\\AppData\\\\L...}, fedcm:accounts: true, goog:chromeOptions: {debuggerAddress: localhost:50217}, networkConnectionEnabled: false, pageLoadStrategy: normal, platformName: windows, proxy: Proxy(system), se:cdp: ws://localhost:50217/devtoo..., se:cdpVersion: 118.0.5993.71, setWindowRect: true, strictFileInteractability: false, timeouts: {implicit: 0, pageLoad: 300000, script: 30000}, unhandledPromptBehavior: dismiss and notify, webauthn:extension:credBlob: true, webauthn:extension:largeBlob: true, webauthn:extension:minPinLength: true, webauthn:extension:prf: true, webauthn:virtualAuthenticators: true}\\nElement: [[ChromeDriver: chrome on windows (5040af046e6765b1c617960f8317461a)] -&gt; xpath: //img[@alt='New Business']]\\nSession ID: 5040af046e6765b1c617960f8317461a", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
