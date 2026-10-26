const w = window.WEDDING;
const $ = id => document.getElementById(id);
const target = new Date(w.date);
const validDate = Number.isFinite(target.getTime());
const format = options => validDate ? new Intl.DateTimeFormat('en-IN', {timeZone:w.timeZone,...options}).format(target) : 'Date to be announced';
document.title = `${w.groom} & ${w.bride} — Wedding Invitation`;
document.querySelectorAll('[data-groom]').forEach(el => el.textContent=w.groom);
document.querySelectorAll('[data-bride]').forEach(el => el.textContent=w.bride);
document.querySelectorAll('.monogram,.seal').forEach(el => {
  el.replaceChildren(document.createTextNode(`${w.groom[0] || ''} `));
  const amp = document.createElement('i'); amp.textContent='&'; el.append(amp,` ${w.bride[0] || ''}`);
});
$('hero-date').textContent=format({day:'2-digit',month:'long',year:'numeric'}).toUpperCase();
$('event-month').textContent=format({month:'long',year:'numeric'}).toUpperCase();
$('event-day').textContent=validDate?format({day:'2-digit'}):'—';
$('event-weekday').textContent=validDate?format({weekday:'long'}).toUpperCase():'';
$('event-time').textContent=validDate?`${format({hour:'numeric',minute:'2-digit',timeZoneName:'short'})} onwards`:'';
for (const [id,key] of [['invitation-copy','invitation'],['venue','venue'],['address','address'],['ceremony','ceremony'],['closing','closing']]) $(id).textContent=w[key];
$('map-link').href=w.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(w.venue+' '+w.address)}`;
// Countdown uses the date and timezone offset in config.js. It stops at zero.
function tick(){
  const remaining=validDate?Math.max(0,Math.floor((target.getTime()-Date.now())/1000)):0;
  const values=[Math.floor(remaining/86400),Math.floor(remaining/3600)%24,Math.floor(remaining/60)%60,remaining%60];
  ['days','hours','minutes','seconds'].forEach((id,i)=>$(id).textContent=String(values[i]).padStart(2,'0'));
  if(!validDate) $('countdown-note').textContent='Our date will be announced soon.';
  else if(remaining===0) $('countdown-note').textContent='Our beautiful beginning is here. Keep us in your duas.';
}
tick();setInterval(tick,1000);
const entrance=$('entrance'),main=$('invitation');
document.body.classList.add('locked');
let openingTimer;
$('open').addEventListener('click',()=>{
  entrance.classList.add('open'); main.inert=false; document.body.classList.remove('locked');
  document.querySelector('.monogram').focus({preventScroll:true});
  openingTimer=setTimeout(()=>{entrance.hidden=true;entrance.style.display='none'},2200);
});
$('replay').addEventListener('click',()=>{
  clearTimeout(openingTimer); window.scrollTo({top:0,behavior:'instant'});
  entrance.hidden=false;entrance.style.display='grid';entrance.classList.remove('open');main.inert=true;
  document.body.classList.add('locked');$('open').focus({preventScroll:true});
});
// Each section gently reveals once as it enters the viewport.
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
