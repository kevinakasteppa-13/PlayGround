import * as THREE from 'three';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const colors={air:0x9debd9,water:0x65baff,earth:0xd9a653,fire:0xff7048};
const names={air:'AIRBENDER',water:'WATERBENDER',earth:'EARTHBENDER',fire:'FIREBENDER'};
const captions={air:'TEMPEST STRIKE',water:'TIDAL SURGE',earth:'STONEFIST',fire:'ASHES TO ASHES'};
const scene=new THREE.Scene(); scene.background=new THREE.Color(0x10232b); scene.fog=new THREE.Fog(0x10232b,24,62);
const camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,120); camera.position.set(0,8.5,17.8);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false}); renderer.setPixelRatio(Math.min(devicePixelRatio,1.8)); renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.15; $('#viewport').appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xbde9ed,0x29302a,2.1)); const sun=new THREE.DirectionalLight(0xffdfb1,3.2); sun.position.set(-7,13,7); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-18;sun.shadow.camera.right=18;sun.shadow.camera.top=18;sun.shadow.camera.bottom=-18;scene.add(sun);
const tealLight=new THREE.PointLight(0x4bcabf,35,18);tealLight.position.set(-5,5,-3);scene.add(tealLight);const fireLight=new THREE.PointLight(0xff6339,38,16);fireLight.position.set(5,4,0);scene.add(fireLight);
const mat=(color,rough=.72,metal=0)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});
const groundMat=mat(0x243b3d,.92), stoneMat=mat(0x455657,.85), trimMat=mat(0x91aa9e,.5,.25), goldMat=mat(0xc29d5c,.48,.55);
const ground=new THREE.Mesh(new THREE.CircleGeometry(17,80),groundMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.7;ground.receiveShadow=true;scene.add(ground);
const platform=new THREE.Mesh(new THREE.CylinderGeometry(8.7,9.3,.75,12,1),stoneMat);platform.position.y=-.52;platform.receiveShadow=true;platform.castShadow=true;scene.add(platform);
const rim=new THREE.Mesh(new THREE.TorusGeometry(8.28,.08,8,90),trimMat);rim.rotation.x=Math.PI/2;rim.position.y=-.1;scene.add(rim);
const floor=new THREE.Mesh(new THREE.CircleGeometry(8.25,12),mat(0x344849,.9));floor.rotation.x=-Math.PI/2;floor.position.y=-.12;floor.receiveShadow=true;scene.add(floor);
// Arena mandala and four nation sigils
for(let r of [2.4,4.4,6.6]){let ring=new THREE.Mesh(new THREE.TorusGeometry(r,.018,5,96),mat(0x9aa78e,.62,.2));ring.rotation.x=Math.PI/2;ring.position.y=-.105;scene.add(ring)}
for(let i=0;i<12;i++){const a=i*Math.PI/6,x=Math.cos(a)*7.9,z=Math.sin(a)*7.9;const p=new THREE.Mesh(new THREE.BoxGeometry(.32,.08,.32),goldMat);p.position.set(x,-.1,z);p.rotation.y=a;scene.add(p)}
for(let i=0;i<4;i++){let a=i*Math.PI/2+Math.PI/4,x=Math.cos(a)*12,z=Math.sin(a)*12;const pl=new THREE.Mesh(new THREE.CylinderGeometry(.13,.25,3,7),mat(i===0?0x4d9d9a:0x565c55));pl.position.set(x,.8,z);pl.castShadow=true;scene.add(pl);let flame=new THREE.Mesh(new THREE.IcosahedronGeometry(.45,1),new THREE.MeshBasicMaterial({color:[0x70e2d0,0x5fa9ff,0xd3a857,0xff7846][i]}));flame.position.set(x,2.5,z);scene.add(flame);flame.userData.baseY=2.5;flame.userData.phase=i*2;const glow=new THREE.PointLight([0x70e2d0,0x5fa9ff,0xd3a857,0xff7846][i],8,5);glow.position.set(x,2.1,z);scene.add(glow)}
// distant atmospheric pillars
for(let i=0;i<16;i++){let a=i*Math.PI/8,x=Math.cos(a)*18,z=Math.sin(a)*18;let tower=new THREE.Mesh(new THREE.CylinderGeometry(.25,.55,4+Math.random()*3,6),mat(i%2?0x273b3b:0x3c4741));tower.position.set(x,1.6,z);tower.rotation.z=(Math.random()-.5)*.11;tower.castShadow=true;scene.add(tower)}

function sphere(parent,color,pos,scale,geo=new THREE.SphereGeometry(1,14,12),rough=.7){let o=new THREE.Mesh(geo,mat(color,rough));o.position.set(...pos);o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function limb(parent,color,a,b,r1,r2){const d=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));let o=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,d.length(),9),mat(color,.7));o.position.copy(new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());o.castShadow=true;parent.add(o);return o}
function makeFighter(isPlayer){const root=new THREE.Group();scene.add(root);const body=new THREE.Group();root.add(body);const robe=isPlayer?0xc1ddd3:0x7d2827, dark=isPlayer?0x527f81:0x322c34, skin=isPlayer?0xd9b89c:0xc99272;
  const torso=sphere(body,robe,[0,1.23,0],[.44,.62,.31]);sphere(body,dark,[0,1.48,.04],[.46,.24,.325]); // sash
  limb(body,isPlayer?0xf0d495:0xd79554,[.35,1.45,.18],[-.27,.9,.29],.065,.07);
  sphere(body,skin,[0,2.03,0],[.31,.34,.3]);sphere(body,isPlayer?0x263e43:0x231e24,[0,2.32,-.01],[.36,.1,.34]);
  if(isPlayer){ // air nomad arrow marking
    const mark=new THREE.Mesh(new THREE.ConeGeometry(.055,.31,3),mat(0x4ba8a0));mark.position.set(0,2.07,.294);mark.rotation.z=Math.PI;body.add(mark);
  }else{sphere(body,0x742f2b,[-.17,2.08,.245],[.14,.095,.08]);}
  // robe skirt and legs
  const skirt=new THREE.Mesh(new THREE.ConeGeometry(.46,.5,8),mat(robe));skirt.position.set(0,.63,0);skirt.castShadow=true;body.add(skirt);
  for(const s of [-1,1]){limb(body,dark,[s*.18,.55,0],[s*.2,.12,0],.14,.115);sphere(body,isPlayer?0xe5e2d4:0x8d3c2c,[s*.2,.08,.06],[.16,.11,.25]);}
  // jointed arms + animated sleeves
  const arms=[];for(const s of [-1,1]){let arm=new THREE.Group();arm.position.set(s*.39,1.62,0);body.add(arm);limb(arm,robe,[0,0,0],[s*.31,-.27,.04],.17,.12);limb(arm,skin,[s*.31,-.27,.04],[s*.43,-.47,.16],.105,.075);sphere(arm,skin,[s*.43,-.47,.16],[.09,.09,.09]);arms.push(arm)}
  root.userData={body,arms,isPlayer,hit:0,walk:0};root.scale.setScalar(isPlayer?1:1.04);return root}
const player=makeFighter(true),enemy=makeFighter(false);player.position.set(-2.2,0,2.4);enemy.position.set(2.2,0,-1.7);player.rotation.y=Math.atan2(enemy.position.x-player.position.x,enemy.position.z-player.position.z);enemy.rotation.y=Math.atan2(player.position.x-enemy.position.x,player.position.z-enemy.position.z);

// projectile/effect system
const effects=[],particles=[];const particleGeo=new THREE.IcosahedronGeometry(.13,0);
function burst(pos,color,count=14,power=3){for(let i=0;i<count;i++){const m=new THREE.Mesh(particleGeo,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.95}));m.position.copy(pos);scene.add(m);const v=new THREE.Vector3(Math.random()-.5,Math.random()*.85,Math.random()-.5).normalize().multiplyScalar(power*(.35+Math.random()*.7));particles.push({mesh:m,vel:v,life:.45+Math.random()*.48,max:.9})}}
function projectile(from,to,element,damage,speed=14){let color=colors[element],geo=element==='earth'?new THREE.DodecahedronGeometry(.34,0):element==='water'?new THREE.SphereGeometry(.31,16,12):new THREE.IcosahedronGeometry(.28,1);const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:element==='earth'?.25:1.25,roughness:.28,transparent:true,opacity:.94}));mesh.position.copy(from);scene.add(mesh);const glow=new THREE.PointLight(color,element==='fire'?7:4,3);mesh.add(glow);effects.push({mesh,from:from.clone(),to:to.clone(),element,damage,speed,age:0,life:from.distanceTo(to)/speed});}
let hp=100,enemyHp=100,chi=100,charge=0,selected='air',active=false,paused=false,ended=false,seconds=90,lastAttack=0,enemyAttack=1.2,dodge=0,invuln=0,avatarTime=0,toastTimer=0;
const keys=new Set(),mobile=new Set();const clock=new THREE.Clock();
function select(el){selected=el;$$('.element').forEach(b=>b.classList.toggle('active',b.dataset.element===el));$('#toast strong').textContent=names[el];$('#toast em').textContent=captions[el];$('#toast').classList.add('show');toastTimer=1.05}
$$('.element').forEach(b=>b.addEventListener('click',()=>select(b.dataset.element)));
function hurtPlayer(amount){if(invuln>0||ended)return;hp=Math.max(0,hp-amount);$('#player-hp').style.width=hp+'%';$('#player-hp-text').textContent=Math.ceil(hp);$('#game-shell').classList.add('damage-flash');setTimeout(()=>$('#game-shell').classList.remove('damage-flash'),130);burst(player.position.clone().add(new THREE.Vector3(0,1,0)),0xff8064,7,2);if(hp<=0)finish(false)}
function hurtEnemy(amount,element){if(ended)return;enemyHp=Math.max(0,enemyHp-amount);$('#enemy-hp').style.width=enemyHp+'%';$('#enemy-hp-text').textContent=Math.ceil(enemyHp);$('#enemy-status').textContent=element.toUpperCase()+' IMPACT';enemy.userData.hit=.18;burst(enemy.position.clone().add(new THREE.Vector3(0,1.1,0)),colors[element],10,2.5);if(enemyHp<=0)finish(true)}
function fireAttack(){if(!active||paused||ended||performance.now()/1000-lastAttack<.32)return;lastAttack=performance.now()/1000;let dist=player.position.distanceTo(enemy.position);if(dist<1.85){hurtEnemy(selected==='earth'?13:11,selected);chi=Math.max(0,chi-4)}else{let start=player.position.clone().add(new THREE.Vector3(0,1.45,0));let target=enemy.position.clone().add(new THREE.Vector3(0,1.05,0));projectile(start,target,selected,selected==='earth'?17:selected==='fire'?15:13,selected==='air'?19:14);chi=Math.max(0,chi-6)}updateMeters()}
function special(){if(!active||paused||ended||charge<100)return;charge=0;avatarTime=3.8;$('#special-btn').classList.remove('ready');burst(player.position.clone().add(new THREE.Vector3(0,1,0)),0xb5fff2,40,5);const ring=new THREE.Mesh(new THREE.TorusGeometry(.8,.09,8,48),new THREE.MeshBasicMaterial({color:0xb8fff0,transparent:true,opacity:.9}));ring.rotation.x=Math.PI/2;ring.position.copy(player.position);ring.position.y=.12;scene.add(ring);effects.push({mesh:ring,from:ring.position.clone(),to:ring.position.clone(),life:.75,age:0,ring:true});hurtEnemy(Math.min(45,enemyHp),selected);chi=100;updateMeters();showToast('AVATAR STATE','ALL ELEMENTS · ONE SPIRIT')}
$('#special-btn').addEventListener('click',special);
function updateMeters(){$('#chi-bar').style.width=chi+'%';$('#chi-text').textContent=Math.ceil(chi)+'%';$('#special-fill').style.width=charge+'%';$('#special-btn').classList.toggle('ready',charge>=100)}
function showToast(a,b){$('#toast strong').textContent=a;$('#toast em').textContent=b;$('#toast').classList.add('show');toastTimer=1.4}
function finish(win){ended=true;active=false;$('#result-title').textContent=win?'VICTORY':'DEFEAT';$('#result-title').style.color=win?'#a1e6d8':'#ff967d';$('#result-copy').textContent=win?'The elements answered your call. The arena is yours.':'The Fire Nation claims this round. Rise again.';$('#result-overlay').classList.remove('hidden')}
function reset(){hp=enemyHp=100;chi=100;charge=0;seconds=90;ended=false;paused=false;active=true;player.position.set(-2.2,0,2.4);enemy.position.set(2.2,0,-1.7);player.rotation.y=Math.atan2(enemy.position.x-player.position.x,enemy.position.z-player.position.z);enemy.rotation.y=Math.atan2(player.position.x-enemy.position.x,player.position.z-enemy.position.z);$('#player-hp').style.width=$('#enemy-hp').style.width='100%';$('#player-hp-text').textContent=$('#enemy-hp-text').textContent='100';$('#timer').textContent='01:30';$('#result-overlay').classList.add('hidden');$('#pause-overlay').classList.add('hidden');updateMeters();select('air');lastAttack=0;enemyAttack=1.2}
$('#start-btn').addEventListener('click',()=>{$('#overlay').classList.add('hidden');reset()});$('#rematch-btn').addEventListener('click',reset);
function togglePause(){if(!active||ended)return;paused=!paused;$('#pause-overlay').classList.toggle('hidden',!paused)}$('#pause-btn').addEventListener('click',togglePause);$('#resume-btn').addEventListener('click',togglePause);
addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys.add(e.code);if(e.repeat)return;if(e.code==='Digit1')select('air');if(e.code==='Digit2')select('water');if(e.code==='Digit3')select('earth');if(e.code==='Digit4')select('fire');if(e.code==='Space'||e.code==='Enter')fireAttack();if(e.code==='KeyR')special();if(e.code==='ShiftLeft'||e.code==='ShiftRight')dodge=.3;if(e.code==='Escape')togglePause()});addEventListener('keyup',e=>keys.delete(e.code));
$$('[data-move]').forEach(b=>{const dir=b.dataset.move;b.addEventListener('pointerdown',e=>{e.preventDefault();mobile.add(dir)});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>mobile.delete(dir)))});
$$('[data-action]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();if(b.dataset.action==='attack')fireAttack();else dodge=.35}));
let prevTime=0;
function loop(){requestAnimationFrame(loop);let dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;if(!paused){
  if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)$('#toast').classList.remove('show')}
  for(const f of [player,enemy]){const u=f.userData;u.walk=Math.max(0,u.walk-dt*3);if(u.hit>0){u.hit-=dt;u.body.position.x=Math.sin(t*60)*.035}}
  if(active&&!ended){
    seconds-=dt;if(seconds<=0){seconds=0;finish(hp>=enemyHp)}let m=Math.floor(seconds/60),ss=Math.floor(seconds%60);$('#timer').textContent=`${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
    chi=Math.min(100,chi+dt*(selected==='air'?8:6));charge=Math.min(100,charge+dt*1.25);if(avatarTime>0){avatarTime-=dt;player.children[0].traverse(o=>{if(o.isMesh&&o.material&&o.material.emissive)o.material.emissive.setHex(0x429989)})}updateMeters();invuln=Math.max(0,invuln-dt);
    // Arena movement, normalized camera-relative controls
    let x=(keys.has('KeyD')||keys.has('ArrowRight')||mobile.has('right')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')||mobile.has('left')?1:0),z=(keys.has('KeyS')||keys.has('ArrowDown')||mobile.has('back')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')||mobile.has('forward')?1:0);let move=new THREE.Vector3(x,0,z);if(move.lengthSq()>0){move.normalize();let speed=dodge>0?13:5.2;player.position.addScaledVector(move,speed*dt);player.userData.walk=1;player.rotation.y=Math.atan2(move.x,move.z);}
    dodge=Math.max(0,dodge-dt);if(dodge>0)invuln=.22;player.position.x=THREE.MathUtils.clamp(player.position.x,-7.2,7.2);player.position.z=THREE.MathUtils.clamp(player.position.z,-7.2,7.2);
    // Opponent tracks the avatar and mixes close strikes with ranged fire
    let toP=player.position.clone().sub(enemy.position);let dist=toP.length();enemy.rotation.y=Math.atan2(toP.x,toP.z);if(dist>2.7){toP.normalize();enemy.position.addScaledVector(toP,Math.min(2.25*dt,dist-2.5));enemy.userData.walk=1}else if(dist<2.1){enemy.position.addScaledVector(toP.normalize(),-1.6*dt)}
    enemyAttack-=dt;if(enemyAttack<=0){enemyAttack=1.1+Math.random()*.65;if(dist<3.25){hurtPlayer(8+Math.random()*5);burst(enemy.position.clone().add(new THREE.Vector3(0,1.3,0)),colors.fire,8,2)}else if(dist<9.5){projectile(enemy.position.clone().add(new THREE.Vector3(0,1.45,0)),player.position.clone().add(new THREE.Vector3(0,1,0)),'fire',10,10)}}
  }
  // Brawler animation
  for(const f of [player,enemy]){const u=f.userData,walk=u.walk;u.body.position.y=Math.abs(Math.sin(t*10+(u.isPlayer?0:1)))*.07*walk;u.body.rotation.z=Math.sin(t*7)*.035*walk;u.arms.forEach((a,i)=>{a.rotation.x=Math.sin(t*10+i*Math.PI+(u.isPlayer?0:1))*.42*walk+(u.hit>0?-.3:0);a.rotation.z=Math.sin(t*4+i)*.08})}
  // particles and bending projectiles
  for(let i=effects.length-1;i>=0;i--){let e=effects[i];e.age+=dt;if(e.ring){let p=e.age/e.life;e.mesh.scale.setScalar(1+p*7);e.mesh.material.opacity=1-p}else{let p=Math.min(1,e.age/e.life);e.mesh.position.lerpVectors(e.from,e.to,p);e.mesh.rotation.x+=dt*4;e.mesh.rotation.y+=dt*6;if(e.element==='fire'||e.element==='air')e.mesh.scale.setScalar(1+Math.sin(t*18)*.14);if(p>=1){if(e.damage&&active&&player.position.distanceTo(enemy.position)<10)hurtEnemy(e.damage,e.element);burst(e.to,colors[e.element]||0xbaffef,7,1.6)}}if(e.age>=e.life){scene.remove(e.mesh);e.mesh.geometry.dispose();if(e.mesh.material.dispose)e.mesh.material.dispose();effects.splice(i,1)}}
  for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.life-=dt;p.mesh.position.addScaledVector(p.vel,dt);p.vel.y-=5*dt;p.mesh.scale.multiplyScalar(.96);p.mesh.material.opacity=Math.max(0,p.life/p.max);if(p.life<=0){scene.remove(p.mesh);p.mesh.material.dispose();particles.splice(i,1)}}
  // slow orbital camera, oriented behind the player and centered on the duel
  let center=player.position.clone().lerp(enemy.position,.45);let want=new THREE.Vector3(center.x*.25,8.5,center.z*.2+18.2);camera.position.lerp(want,1-Math.exp(-dt*2));camera.lookAt(center.x,1.15,center.z-.15);
  for(const o of scene.children)if(o.userData.baseY){o.position.y=o.userData.baseY+Math.sin(t*2+o.userData.phase)*.13;o.rotation.y=t*.45}
  fireLight.intensity=37+Math.sin(t*11)*4;
 }renderer.render(scene,camera)}
loop();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8))});
