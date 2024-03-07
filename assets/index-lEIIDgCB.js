(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const m of n.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&i(m)}).observe(document,{childList:!0,subtree:!0});function s(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=s(o);fetch(o.href,n)}})();const y=20,a=14,L=30,u={LEFT:"ArrowLeft",RIGHT:"ArrowRight",DOWN:"ArrowDown",UP:"ArrowUp",ROTATE:" ",REVERSE_ROTATE:"x",PUSH:"ArrowUp",PAUSE:"Escape",ENTER:"Enter",CONTROL:"Control"},O=[{name:"square",position:{x:a/2-1,y:0},shape:[[1,1],[1,1]],color:"red"},{name:"line",position:{x:a/2-2,y:0},shape:[[1,1,1,1]],color:"royalblue"},{name:"arrow",position:{x:a/2-1,y:0},shape:[[0,1,0],[1,1,1]],color:"orange"},{name:"snake",position:{x:a/2-1,y:0},shape:[[1,1,0],[0,1,1]],color:"green"},{name:"reverseSnake",position:{x:a/2-1,y:0},shape:[[0,1,1],[1,1,0]],color:"hotpink"},{name:"l",position:{x:a/2-1,y:0},shape:[[1,0],[1,0],[1,1]],color:"purple"},{name:"reverseL",position:{x:a/2-1,y:0},shape:[[0,1],[0,1],[1,1]],color:"brown"}],c=new Audio("tetris.mp3");c.volume=.5;const h=document.querySelector("canvas"),l=h.getContext("2d"),b=document.querySelector("#puntuation"),d=document.querySelector("section");let w=0,R=1e3;h.width=y*a;h.height=y*L;l.scale(y,y);const p={shape:N(a,L),position:{x:0,y:0},color:"yellow"};function N(e,r){return Array(r).fill().map(()=>Array(e).fill(0))}let t,E=0,x=0;function P(e=0){const r=e-x;x=e;const s=Math.max(1+Math.floor(e/78010)*.05,0);s!==c.playbackRate&&(c.playbackRate=s),R=Math.max(1e3-Math.floor(e/30)*.05,0),E+=r,E>R&&(T("ArrowDown"),E=0),k(),window.requestAnimationFrame(P)}function k(){l.fillStyle="#000",l==null||l.fillRect(0,0,h.width,h.height),A(p),A(t),b.innerText=w}function A(e){e.shape.forEach((r,s)=>{r.forEach((i,o)=>{i===1&&(l.fillStyle=e.color,l.fillRect(o+e.position.x,s+e.position.y,1,1))})})}function T(e){let r=[],s=null;switch(e){case u.LEFT:t.position.x--,f()&&t.position.x++;break;case u.RIGHT:t.position.x++,f()&&t.position.x--;break;case u.DOWN:t.position.y++,f()&&(t.position.y--,S(),v());break;case u.UP:t.position.y++,f()?(t.position.y--,S(),v()):T(e);break;case u.ROTATE:for(let i=0;i<t.shape[0].length;i++){const o=[];for(let n=t.shape.length-1;n>=0;n--)o.push(t.shape[n][i]);r.push(o)}s=t.shape,t.shape=r,f()&&(t.shape=s);break}}function f(){return t.shape.find((e,r)=>e.find((s,i)=>{var o;return s!==0&&((o=p.shape[r+t.position.y])==null?void 0:o[i+t.position.x])!==0}))}function S(){t.shape.forEach((e,r)=>{e.forEach((s,i)=>{s===1&&(p.shape[r+t.position.y][i+t.position.x]=1)})}),w+=5,g(),f()&&M()}function M(){c.pause(),c.playbackRate=.5,c.currentTime=0,window.alert("Game Over!!! Sorry!"),p.shape.forEach(e=>e.fill(0)),g()}function g(){t=JSON.parse(JSON.stringify({...O[Math.floor(Math.random()*O.length)]}))}function v(){const e=[];let r=0;p.shape.forEach((i,o)=>{i.every(n=>n===1)&&(e.push(o),r+=20)});const s=Math.max(e.length,1)-1;r+=s*25,e.forEach(i=>{p.shape.splice(i,1);const o=Array(a).fill(0);p.shape.unshift(o)}),w+=r}document.addEventListener("keydown",e=>{T(e.key)});d==null||d.addEventListener("click",()=>{g(),P(),c.loop=!0,c.play(),d.remove()});
