/* Carousel, skill cards, project galleries and image viewer, sticky nav, scroll-to-top */
(function(){
 var $=function(q,r){return (r||document).querySelector(q)},$$=function(q,r){return Array.prototype.slice.call((r||document).querySelectorAll(q))};
 function swipe(el,cb){var x0=null;el.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});el.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40)cb(dx<0?1:-1)},{passive:true})}

 /* hero carousel */
 var slides=$('#slides'),items=slides.children,n=items.length,i=0,t,dots=$('#dots'),capTxt=$('#capTxt'),capIco=$('#capIco');
 function buildDots(){dots.innerHTML='';for(var k=0;k<n;k++){(function(k){var b=document.createElement('button');b.setAttribute('aria-label','Go to slide '+(k+1));b.onclick=function(){go(k);restart()};dots.appendChild(b)})(k)}}
 buildDots();
 function go(x){
  i=(x+n)%n;slides.style.transform='translateX(-'+(i*100)+'%)';
  var s=items[i];capTxt.textContent=s.getAttribute('data-cap');
  capIco.firstElementChild.setAttribute('href','#'+s.getAttribute('data-ico'));
  for(var k=0;k<n;k++)dots.children[k].className=k===i?'on':'';
 }
 function restart(){clearInterval(t);if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)t=setInterval(function(){go(i+1)},4500)}
 $('#prev').onclick=function(){go(i-1);restart()};
 $('#next').onclick=function(){go(i+1);restart()};
 var c=$('#carousel');c.onmouseenter=function(){clearInterval(t)};c.onmouseleave=restart;
 swipe(c,function(d){go(i+d);restart()});
 go(0);restart();

 /* optional real photos: used automatically when the image file exists, otherwise the illustration stays */
 var pBoxes=$$('[data-photo]'),pend=pBoxes.length;
 function pDone(){
  if(--pend)return;
  if($$('.slide[data-ok]').length){
   $$('.slide').forEach(function(f){if(!f.hasAttribute('data-ok'))f.parentNode.removeChild(f)});
   items=slides.children;n=items.length;buildDots();go(0);restart();
   if(n<2){$('.nav').style.display='none';dots.style.display='none'}
  }
 }
 pBoxes.forEach(function(box){var im=new Image();
  im.onload=function(){var sv=box.querySelector('svg');im.className='ph';im.alt=((sv&&sv.getAttribute('aria-label'))||'').replace('Illustration of','AI-generated image of');box.appendChild(im);box.setAttribute('data-ok','1');pDone()};
  im.onerror=pDone;im.src=box.getAttribute('data-photo')});

 /* skill cards */
 $$('.skill>button').forEach(function(b){b.addEventListener('click',function(){var a=b.parentNode,o=a.classList.toggle('open');b.setAttribute('aria-expanded',o)})});

 /* image viewer */
 var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Image viewer');
 lb.innerHTML='<img alt=""><button type="button" aria-label="Close image"><svg class="i"><use href="#close"/></svg></button>';document.body.appendChild(lb);
 var lbi=$('img',lb),lbb=$('button',lb),last=null;
 function openLb(src,alt,from){lbi.src=src;lbi.alt=alt;lb.classList.add('show');last=from;lbb.focus();document.body.style.overflow='hidden'}
 function closeLb(){lb.classList.remove('show');document.body.style.overflow='';if(last)last.focus()}
 lb.addEventListener('click',function(e){if(e.target!==lbi)closeLb()});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('show'))closeLb()});

 /* project galleries */
 $$('.gal').forEach(function(g){
  var th=$$('.thumbs button',g),im=$$('.main img',g),m=$('.main',g),cur=0;
  function show(x){cur=(x+im.length)%im.length;th.forEach(function(e,k){e.classList.toggle('on',k===cur)});im.forEach(function(e,k){e.classList.toggle('on',k===cur)})}
  th.forEach(function(b,k){b.addEventListener('click',function(){show(k)})});
  swipe(m,function(d){show(cur+d)});
  function open(){openLb(im[cur].currentSrc||im[cur].src,im[cur].alt,m)}
  m.addEventListener('click',open);
  m.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}else if(e.key==='ArrowRight'){show(cur+1)}else if(e.key==='ArrowLeft'){show(cur-1)}});
 });

 /* sticky nav + scroll to top */
 var nv=$('#topnav'),ls=$$('.nl a',nv),secs=['about','skills','projects','contact'].map(function(d){return document.getElementById(d)}),fab=$('#fab');
 function spy(){var y=window.scrollY;nv.classList.toggle('show',y>380);fab.classList.toggle('show',y>500);var cur='';secs.forEach(function(e){if(e&&e.getBoundingClientRect().top<=140)cur=e.id});if(window.innerHeight+y>=document.body.scrollHeight-4)cur='contact';ls.forEach(function(a){a.classList.toggle('act',a.getAttribute('data-s')===cur)})}
 window.addEventListener('scroll',spy,{passive:true});spy();
 fab.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
})();
