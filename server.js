// use the express framework
var callcounter = 0;
var express = require('express');
var app = express();
const bodyParser = require("body-parser");
var lastMsg = '';
var logs = [];

var fs = require('fs');
// var code_hash = fs.readFileSync('code_hash.txt','utf8');
// console.log (code_hash);
console.log('The IPADDRESS is:', process.env.IP);
console.log('The message is:', process.env.AZ);
// console.log('The hash is: %s', code_hash);

var ipaddress = process.env.IP;
var message = process.env.AZ;

// morgan: generate apache style logs to the console
var morgan = require('morgan')
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


// express-healthcheck: respond on /health route for LB checks
app.use('/health', require('express-healthcheck')());

app.get('/calls', function (req, res) {
  res.set({
    'Content-Type': 'text/plain'
  })
  res.send(`vladi test from ${message}, counter: ${callcounter}, last message: ${lastMsg}`);
  // res.send(`Hello World! from ${ipaddress} in AZ-${az} which has been up for ` + process.uptime() + 'ms');
});

app.get('/logs', function (req, res) {
  res.set({
    'Content-Type': 'text/html'
  });

  var clone = logs.slice(0);
  //  clone.forEach(a => {
  // res.write(a + '</br>');
  // });
  res.send(clone.join('</br>') + `vladi test from ${message}`);
  // res.send(`Hello World! from ${ipaddress} in AZ-${az} which has been up for ` + process.uptime() + 'ms');
});


app.post('/log', function (req, res) {
  logs.unshift(req.body.msg);
  res.end("yes");
});

app.get('/vladi', function (req, res) {
  callcounter++;
  res.set({
    'Content-Type': 'text/plain'
  })
  res.send(`vladi test from ${message}`);
  // res.send(`Hello World! from ${ipaddress} in AZ-${az} which has been up for ` + process.uptime() + 'ms');
});

// main route
app.get('/', function (req, res) {
  res.set({
    'Content-Type': 'text/plain'
  })
  res.send(`Node.js backend: Hello! from ${message}`);
  // res.send(`Hello World! from ${ipaddress} in AZ-${az} which has been up for ` + process.uptime() + 'ms');
});

// health route - variable subst is more pythonic just as an example
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Example app listening on port %s!', port);
});

// export the server to make tests work
module.exports = server;
