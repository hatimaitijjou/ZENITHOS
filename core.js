const OS={
 z:10,
 apps:{},

 boot(){
  this.stars();
  this.clock();
  setInterval(this.clock,1000);
  this.renderDesktop();
 },

 stars(){
  for(let i=0;i<120;i++){
   const s=document.createElement("div");
   s.className="star";
   s.style.width=s.style.height=Math.random()*2+1+"px";
   s.style.left=Math.random()*100+"vw";
   s.style.top=Math.random()*100+"vh";
   space.appendChild(s);
  }
 },

 clock(){
  const d=new Date();
  clock.textContent=d.toLocaleTimeString();
 },

 registerApp(app){
  this.apps[app.name]=app;
 },

 renderDesktop(){
  desktop.innerHTML="";
  Object.values(this.apps).forEach(app=>{
   desktop.innerHTML+=`
    <div class="icon" ondblclick="OS.open('${app.name}')">
      <i class="fas ${app.icon}"></i>
      <span>${app.name}</span>
    </div>`;
  });
 },

 open(name){
  if(document.getElementById(name))return;
  const app=this.apps[name];

  const w=document.createElement("div");
  w.className="window";
  w.id=name;
  w.style.zIndex=++this.z;
  w.style.top="10vh";
  w.style.left="10vw";

  w.innerHTML=`
   <div class="bar" onmousedown="OS.drag(event,this)">
    <span>${name}</span>
    <span style="cursor:pointer" onclick="this.closest('.window').remove()">✖</span>
   </div>
   <div style="flex:1;padding:20px">${app.render()}</div>
  `;

  document.body.appendChild(w);
 },

 drag(e,bar){
  const w=bar.parentElement;
  const ox=e.clientX-w.offsetLeft;
  const oy=e.clientY-w.offsetTop;
  document.onmousemove=ev=>{
   w.style.left=ev.clientX-ox+"px";
   w.style.top=ev.clientY-oy+"px";
  };
  document.onmouseup=()=>document.onmousemove=null;
 }
}
