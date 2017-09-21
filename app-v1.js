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
    case '/test':
      res.end('test');
      break; 
    default:
      const powUrl = '/powoftwo/';
      if ( req.url.indexOf(powUrl) !== -1 ) {
        const num = parseInt(req.url.split(powUrl)[1]);
        if ( !Number.isNaN(num) ) {
          res.end(String(Math.pow(num,2)));
        } else {
          res.statusCode = 400;
          res.end('Bad request');
        }
      } else {
        res.statusCode = 404;
        res.end('Not found');
      }
  }
});
server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});