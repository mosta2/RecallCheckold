/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');

    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        console.log('hello');
        try{
            getfile();
        } catch (e) { alert(e); }
        readfile('vehicles.txt');
    }

};


function getfile() {
    check3("RecallsFile.csv");

}
var countfail = 0;


function check3(fileName) {
    store = cordova.file.dataDirectory;

    window.resolveLocalFileSystemURL(store + fileName, appStart, downloadAsset);
}
function appStart(entry) {
    //alert('ead' + ".txt" + JSON.stringify(entry.File()));
    var file = entry.file(gotfile, downloadAsset);

    //store = cordova.file.dataDirectory;
    ////cordova.file.dataDirectory.getFile(store + "test.txt", { create: false }, gotfile, downloadAsset); //of requestFileSystem
    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
    //    alert("directory filesystem = " + fs.root.toURL());
    //}, function () {
    //    alert("failed to get file system")
    //});

}
function downloadAsset() {

    var fileTransfer = new FileTransfer();

    var uri = encodeURI("http://www.leadyourweb.com/RecallsFile.csv");
    file_path = cordova.file.dataDirectory;
    alert("About to start transfer");
    fileTransfer.download(uri, file_path + 'RecallsFile.csv',
    	function (entry) {
    	    alert("Success!" + file_path + 'RecallsFile.csv');
    	    //checkfileexist(file_path + 'test.txt');
    	    appStart(entry);
    	},
    	function (err) {
    	    console.log("Error");
    	    //alert(JSON.stringify(err));
    	});
}
function gotfile(entry) {
   // alert(entry.lastModifiedDate);
    var d = new Date();
    var filedate = entry.lastModifiedDate;
    var now = d.getTime();
    var diff = now - filedate;

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var days = diff / msPerDay;
    if (days < 7) {
        alert('refres');
        downloadAsset();

    }
    else {
       // alert('opening');
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            //alert("read success");
            try {
                //data = $.csv2Array(evt.target.result);
                // Parse CSV string
               // alert(evt.target.result);
                var bet = Papa.parse(evt.target.result.toString(), { header: true });
                //alert(JSON.stringify(bet));
                vm.isloading(true);
                //var m = processData(evt.target.result);
                //alert(bet.data);

                if (!bet.data & countfail < 2) {
                    countfail += 1;
                    downloadAsset();
                }
                if (countfail >= 2)
                    alert("Error Occured!");
                //
                try{
                    vm.recalls(bet.data);
                    vm.getmans(bet.data);
                //alert(JSON.stringify(vm.mans()));
                } catch (e) { alert(e) }
                //ko.mapping.fromJS(mans, vm.mans());
                //alert(data.length);
                //vm.recalls(data);
                //alert(vm.mans().length);
                vm.isloading(false);
                //var csvAsArray = evt.target.result.csvToArray();
                // alert(JSON.stringify(data));
            } catch (e) { alert(e) }
        };
        reader.readAsText(entry);

    }

}
function writefile(fileName, data) {
    //store = cordova.file.dataDirectory;
    //alert("trywrote");
    //createdir(fileName, fileName);
    //window.resolveLocalFileSystemURL(store + fileName, writeme, writeme);
    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) { return gotFS(fileSystem, fileName, data); }, fail);
    // window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function (fs) {
    //    fs.root.getFile(fileName, { create: true, exclusive: false },
    //      function (entry) {
    //          fileTransfer.download(
    //                  store+fileName, // the filesystem uri you mentioned
    //                  entry.fullPath,
    //                  function (entry) {
    //                      // do what you want with the entry here
    //                      console.log("download complete: " + entry.fullPath);
    //                  },
    //                  function (error) {
    //                      console.log("error source " + error.source);
    //                      console.log("error target " + error.target);
    //                      console.log("error code " + error.code);
    //                  },
    //                  false,
    //                  null
    //          );
    //      }, function () {
    //          alert("file create error");
    //      });
    //}, null);


    function gotFS(fileSystem, fileName, data) {
        store = cordova.file.dataDirectory;
        //alert(fileName);
        //alert(data);
        fileSystem.root.getFile("/RecallCheck/" + fileName, { create: true, exclusive: false }, function (gotfile) { return gotFileEntry(gotfile, fileName, data); }, fail);
        function gotFileEntry(fileEntry, fileName, data) {

            fileEntry.createWriter(function (writer) { return gotFileWriter(writer, fileName, data); }, fail);
        }
        function gotFileWriter(writer, fileName, data) {
           // alert(fileName);
           // alert(data);
            writer.onwriteend = function (evt) {
               // alert("contents of file now 'some sample text'");
                //writer.truncate(11);
                writer.onwriteend = function (evt) {
                    //console.log("contents of file now 'some sample'");
                    //writer.seek(4);
                    //writer.write(" different text");
                    writer.onwriteend = function (evt) {
                        console.log("contents of file now 'some different text'");
                    }
                };
            };
            writer.write(data);
        }

    }
    function fail() { }

}

function writefile(fileName, data) {
    store = cordova.file.dataDirectory;
    //alert(store);
    window.resolveLocalFileSystemURI(store, onSuccess, onError);
    try {
        function onSuccess(entry) {
            entry.getDirectory("", { create: true, exclusive: false }, function (dir) { return direxist(dir, fileName, data); }, nodir);
        }
        function onError(error) {
            console.log(error);
        }
        function direxist(entry, fileName, data) {
            //alert("gettingfile" + fileName);
            entry.getFile(fileName, { create: true, exclusive: false }, function (file) { return myfile(file, fileName, data); }, nodir);

            //alert(JSON.stringify(entry));
        }
        function myfile(entry, fileName, data) {

            entry.createWriter(function (writer) { return writenow(writer, fileName, data); }, nodir);

        }
        function writenow(writer, fileName, data) {
            alert('writing now' + data);
            writer.onwriteend = function (evt) {
               // alert("contents of file now 'some sample text'");
                //writer.truncate(11);
                writer.onwriteend = function (evt) {
                    //console.log("contents of file now 'some sample'");
                    //writer.seek(4);
                    //writer.write(" different text");
                    writer.onwriteend = function (evt) {
                        console.log("contents of file now 'some different text'");
                    }
                };
            };
            writer.write(data);
           
        }
        function nodir(entry) {

            alert("Error Occured!");
        }
    } catch (e) { alert(e); }
}

function processData(allText) {
    var record_num = 14;  // or however many elements there are in each row
    var allTextLines = allText.split(/\r\n|\n/);
    //alert(allTextLines.length + 'line');
    var entries = allTextLines[0].split(',');
    //alert(entries.length + 'hhead');
    var lines = [];

    var headings = entries.splice(0, record_num);
    while (entries.length > 0) {
        var tarr = [];
        for (var j = 0; j < record_num; j++) {
            tarr.push(headings[j] + ":" + entries.shift());
        }
        lines.push(tarr);
    }
    return lines;
}


function readfile(fileName) {
    try{
        store = cordova.file.dataDirectory;
    } catch (e) { alert(e);}
    window.resolveLocalFileSystemURL(store + fileName, function (reader) { return openfile(reader, fileName); }, filenotfound);
}
function openfile(entry, fileName) {
    //alert('ead' + ".txt" + JSON.stringify(entry.File()));
    var file = entry.file(function (reader) { return readthis(reader, fileName); }, downloadAsset);
}
function filenotfound() {
    alert("file not found!");
}
function readthis(entry,fileName) {

    //alert('opening');
    var reader = new FileReader();
    reader.onloadend = function (evt) {
        //alert("read success");
        try {
            var son = ko.utils.parseJson(evt.target.result);
            //ko.mapping.fromJS(son, vm.searchresult());
            //alert(evt.target.result);
            var i ;
            for (i = 0; i < son.length; i++)
            {
                if (!son[i]) {

                    son.splice(i, 1);
                    //writefile(fileName, son);
                }
            }
            ko.mapping.fromJS(son, vm.searchresult);
            //vm.searchresult(son);
            //alert('afte reaad:'+vm.searchresult().length);
            //alert(JSON.stringify(vm.searchresult()));
            //alert(JSON.stringify(vm.searchresult()));
            //alert(son);
            $('.help').addClass("hidden");
        } catch (e) { alert(e) }
    };
    reader.readAsText(entry);



}