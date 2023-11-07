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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Select New Business"], "isController": false}, {"data": [0.0, 500, 1500, "Login   NewBusiness"], "isController": false}, {"data": [0.0, 500, 1500, "Transaction Controller -  New Business"], "isController": true}, {"data": [0.5, 500, 1500, "Get Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3, 1, 33.333333333333336, 1998.6666666666665, 270, 4893, 833.0, 4893.0, 4893.0, 4893.0, 0.4601226993865031, 6.202370111196319, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Select New Business", 1, 1, 100.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 15.686487268518517, 0.0], "isController": false}, {"data": ["Login   NewBusiness", 1, 0, 0.0, 4893.0, 4893, 4893, 4893.0, 4893.0, 4893.0, 4893.0, 0.20437359493153484, 6.263731350909463, 0.0], "isController": false}, {"data": ["Transaction Controller -  New Business", 1, 1, 100.0, 5163.0, 5163, 5163, 5163.0, 5163.0, 5163.0, 5163.0, 0.19368584156498161, 6.756496041545613, 0.0], "isController": true}, {"data": ["Get Login", 1, 0, 0.0, 833.0, 833, 833, 833.0, 833.0, 833.0, 833.0, 1.2004801920768307, 6.669464660864346, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/no such element: Unable to locate element: {&quot;method&quot;:&quot;css selector&quot;,&quot;selector&quot;:&quot;#nprogress&quot;}\\r\\n  (Session info: chrome=119.0.6045.105)\\r\\nFor documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#no-such-element-exception\\r\\nBuild info: version: '4.10.0', revision: 'c14d967899'\\r\\nSystem info: os.name: 'Linux', os.arch: 'amd64', os.version: '5.10.0-26-cloud-amd64', java.version: '11.0.21'\\r\\nDriver info: org.openqa.selenium.chrome.ChromeDriver\\r\\nCommand: [2fff8a5218d9661e1697529c4408b640, findElement {using=id, value=nprogress}]\\r\\nCapabilities {acceptInsecureCerts: true, browserName: chrome, browserVersion: 119.0.6045.105, chrome: {chromedriverVersion: 119.0.6045.105 (38c72552c5e..., userDataDir: /tmp/.org.chromium.Chromium...}, fedcm:accounts: true, goog:chromeOptions: {debuggerAddress: localhost:36503}, networkConnectionEnabled: false, pageLoadStrategy: normal, platformName: linux, proxy: Proxy(system), se:cdp: ws://localhost:36503/devtoo..., se:cdpVersion: 119.0.6045.105, setWindowRect: true, strictFileInteractability: false, timeouts: {implicit: 0, pageLoad: 300000, script: 30000}, unhandledPromptBehavior: dismiss and notify, webauthn:extension:credBlob: true, webauthn:extension:largeBlob: true, webauthn:extension:minPinLength: true, webauthn:extension:prf: true, webauthn:virtualAuthenticators: true}\\r\\nSession ID: 2fff8a5218d9661e1697529c4408b640", 1, 100.0, 33.333333333333336], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3, 1, "500/no such element: Unable to locate element: {&quot;method&quot;:&quot;css selector&quot;,&quot;selector&quot;:&quot;#nprogress&quot;}\\r\\n  (Session info: chrome=119.0.6045.105)\\r\\nFor documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#no-such-element-exception\\r\\nBuild info: version: '4.10.0', revision: 'c14d967899'\\r\\nSystem info: os.name: 'Linux', os.arch: 'amd64', os.version: '5.10.0-26-cloud-amd64', java.version: '11.0.21'\\r\\nDriver info: org.openqa.selenium.chrome.ChromeDriver\\r\\nCommand: [2fff8a5218d9661e1697529c4408b640, findElement {using=id, value=nprogress}]\\r\\nCapabilities {acceptInsecureCerts: true, browserName: chrome, browserVersion: 119.0.6045.105, chrome: {chromedriverVersion: 119.0.6045.105 (38c72552c5e..., userDataDir: /tmp/.org.chromium.Chromium...}, fedcm:accounts: true, goog:chromeOptions: {debuggerAddress: localhost:36503}, networkConnectionEnabled: false, pageLoadStrategy: normal, platformName: linux, proxy: Proxy(system), se:cdp: ws://localhost:36503/devtoo..., se:cdpVersion: 119.0.6045.105, setWindowRect: true, strictFileInteractability: false, timeouts: {implicit: 0, pageLoad: 300000, script: 30000}, unhandledPromptBehavior: dismiss and notify, webauthn:extension:credBlob: true, webauthn:extension:largeBlob: true, webauthn:extension:minPinLength: true, webauthn:extension:prf: true, webauthn:virtualAuthenticators: true}\\r\\nSession ID: 2fff8a5218d9661e1697529c4408b640", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Select New Business", 1, 1, "500/no such element: Unable to locate element: {&quot;method&quot;:&quot;css selector&quot;,&quot;selector&quot;:&quot;#nprogress&quot;}\\r\\n  (Session info: chrome=119.0.6045.105)\\r\\nFor documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#no-such-element-exception\\r\\nBuild info: version: '4.10.0', revision: 'c14d967899'\\r\\nSystem info: os.name: 'Linux', os.arch: 'amd64', os.version: '5.10.0-26-cloud-amd64', java.version: '11.0.21'\\r\\nDriver info: org.openqa.selenium.chrome.ChromeDriver\\r\\nCommand: [2fff8a5218d9661e1697529c4408b640, findElement {using=id, value=nprogress}]\\r\\nCapabilities {acceptInsecureCerts: true, browserName: chrome, browserVersion: 119.0.6045.105, chrome: {chromedriverVersion: 119.0.6045.105 (38c72552c5e..., userDataDir: /tmp/.org.chromium.Chromium...}, fedcm:accounts: true, goog:chromeOptions: {debuggerAddress: localhost:36503}, networkConnectionEnabled: false, pageLoadStrategy: normal, platformName: linux, proxy: Proxy(system), se:cdp: ws://localhost:36503/devtoo..., se:cdpVersion: 119.0.6045.105, setWindowRect: true, strictFileInteractability: false, timeouts: {implicit: 0, pageLoad: 300000, script: 30000}, unhandledPromptBehavior: dismiss and notify, webauthn:extension:credBlob: true, webauthn:extension:largeBlob: true, webauthn:extension:minPinLength: true, webauthn:extension:prf: true, webauthn:virtualAuthenticators: true}\\r\\nSession ID: 2fff8a5218d9661e1697529c4408b640", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
