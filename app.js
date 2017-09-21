const http = require('http');
const port = 3000;
const server = http.createServer((req,res) => {
  console.log(req.url);
  switch(req.url) {
    case '/index':
      res.end('index page');
      break;
    case '/about':
      res.end('about page');
      break;
    default:
      res.statusCode = 404;
      res.end('Not found');
  }
});
server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});