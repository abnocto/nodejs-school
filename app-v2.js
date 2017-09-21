const http = require('http');
const port = 3000;
const express = require('express');
const app = express();

app.use( (req, res, next) => {
  console.log(`URL: ${ req.url }`);
  next();
});

app.get('/index', (req, res) => {
  res.end('index page');
});

app.get('/about', (req, res) => {
  res.end('about page');
});

app.get('/powoftwo/:base', (req, res) => {
  const num = req.params.base;
  const result = Math.pow(num, 2);
  res.end(String(result));
});

app.use(function(req, res){
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});