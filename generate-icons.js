const fs=require('fs'), zlib=require('zlib');

function crc32(buf){
  let c=0xffffffff;
  for(let i=0;i<buf.length;i++){
    c^=buf[i];
    for(let k=0;k<8;k++) c=(c>>>1) ^ (c & 1 ? 0xedb88320 : 0);
  }
  return (c ^ 0xffffffff)>>>0;
}
function chunk(type, data){
  const len=Buffer.alloc(4); len.writeUInt32BE(data.length,0);
  const t=Buffer.from(type);
  const b=Buffer.concat([t,data]);
  const crc=Buffer.alloc(4); crc.writeUInt32BE(crc32(b),0);
  return Buffer.concat([len,t,data,crc]);
}
function makePNG(w,h, rgba){
  // rgba = [r,g,b,a] solid
  const rowLen = 1 + w*4;
  const raw = Buffer.alloc(rowLen * h);
  for(let y=0;y<h;y++){
    raw[y*rowLen]=0; // filter 0
    for(let x=0;x<w;x++){
      const o=y*rowLen+1+x*4;
      raw[o]=rgba[0]; raw[o+1]=rgba[1]; raw[o+2]=rgba[2]; raw[o+3]=rgba[3];
    }
  }
  const comp=zlib.deflateSync(raw);
  const sig=Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]);
  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(w,0); ihdr.writeUInt32BE(h,4);
  ihdr[8]=8; ihdr[9]=6; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0;
  const png=Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', comp), chunk('IEND', Buffer.alloc(0))]);
  return png;
}
// Generate solid pink icon #ff6b9d + white heart overlay not needed for now, solid is enough for PWA
const pink=[0xff,0x6b,0x9d,0xff];
fs.writeFileSync('icon-192.png', makePNG(192,192,pink));
fs.writeFileSync('icon-512.png', makePNG(512,512,pink));
console.log('icons generated 192 & 512 pink #ff6b9d');
// Also generate a more cute icon with heart text via SVG fallback - we keep PNG as solid, but also create icon.svg for better look
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<rect width="512" height="512" rx="110" fill="#ff6b9d"/>
<text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="220" fill="white">♡</text>
<text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="36" font-weight="700" fill="white">Cheki Timer</text>
</svg>`;
fs.writeFileSync('icon.svg', svg);
console.log('icon.svg generated');
