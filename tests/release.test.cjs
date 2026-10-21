const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=['index.html','reader.html'].map(file=>fs.readFileSync(path.join(root,file),'utf8')).join('\n');
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){const ref=match[1];if(ref.startsWith('data:')||ref.startsWith('#'))continue;assert(!/^(?:https?:|\/)/.test(ref),'non-relative runtime asset '+ref);assert(fs.existsSync(path.join(root,ref)),'missing '+ref);}
const cssFiles=['book.css','activities.css','polish.css','library.css'];
for(const name of cssFiles){const css=fs.readFileSync(path.join(root,'styles',name),'utf8');for(const m of css.matchAll(/url\(['"]?([^)'"\s]+)/g)){assert(!/^https?:/.test(m[1]),'external CSS asset');assert(fs.existsSync(path.resolve(root,'styles',m[1])),'missing CSS asset');}}
for(const name of ['objects.png','walkers.png','cockpit-clean.jpg','mars-clean.jpg',...['02','07','08','14','16'].map(n=>'page-'+n+'-clean.jpg')])assert(fs.statSync(path.join(root,'assets','activities',name)).size>1000,'missing activity art');
assert(fs.existsSync(path.join(root,'.nojekyll')),'Pages marker missing');
assert(!html.includes('coming next'),'stale prototype message');
console.log('PASS static release: relative runtime references, local assets, stylesheets, Pages marker, final copy');

