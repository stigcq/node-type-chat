/**
 *
 */
var http = require('http');
var request = require('request');
var hostname = '127.0.0.1';
//const port = 3000;
var server = http.createServer(function (req, res) {
    var headers = req.headers, method = req.method, url = req.url;
    console.log(url);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World test\n');
    console.log("Request");
});
var stdin = process.openStdin();
console.log("Enter port:");
stdin.addListener("data", function (d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    //console.log("you entered: [" + 
    //    d.toString().trim() + "]");
    var port = d.toString().trim();
    server.listen(port, hostname, function () {
        console.log("Server running at http://" + hostname + ":" + port + "/");
    });
});
/*request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});*/
