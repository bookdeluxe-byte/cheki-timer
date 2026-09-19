const http=require('http'), fs=require('fs'), path=require('path');
const root=__dirname;
const PORT=8000;
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon'};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]);
  if(p==='/') p='/index.html';
  let fp=path.join(root,p);
  if(!fp.startsWith(root)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(fp,(err,data)=>{
    if(err){
      res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});
      return res.end('Not found: '+p);
    }
    const ext=path.extname(fp);
    res.writeHead(200,{'Content-Type': mime[ext]||'text/html; charset=utf-8','Cache-Control':'no-cache','Access-Control-Allow-Origin':'*'});
    res.end(data);
  });
}).listen(PORT,'0.0.0.0',()=>{
  console.log(`✅ Server running!`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Network: http://192.168.1.38:${PORT}`);
  console.log(`   เปิดบน iPhone ด้วยลิงก์ Network ข้างบน (ต้อง WiFi เดียวกัน)`);
});
