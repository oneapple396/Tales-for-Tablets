const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname;
http.createServer((req,res)=>{
 let file;
 try {file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));} catch {res.writeHead(400).end();return;}
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end('Not found');return;}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png'})[path.extname(file)]||'application/octet-stream');
 res.end(data);});
}).listen(4173,'127.0.0.1',()=>console.log('Book preview: http://127.0.0.1:4173/'));
