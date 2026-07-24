const $=id=>document.getElementById(id);
const SCREENS=['splash','mode','players','categories','randomizer','board','duel','result','champion'];
const COLORS=['#16a6ff','#ff3e72','#35d07f','#f4c83f','#9b5cff','#ff7a32','#19c5c8','#e85fd0','#7fc83b','#ff5656'];
const FOOD_ITEMS=[
    ['assets/food/pizza.jpg',['pizza']],
    ['assets/food/chicken-wings.jpg',['chicken wings','wings','fried chicken']],
    ['assets/food/grapes.jpg',['grapes','grape']],
    ['assets/food/cheese.jpg',['cheese']],
    ['assets/food/sushi.jpg',['sushi','sushi roll']],
    ['assets/food/shellfish.jpg',['shellfish','snails','escargot']],
    ['assets/food/steak.jpg',['steak','beef steak']],
    ['assets/food/burger.jpg',['burger','hamburger','cheeseburger']],
    ['assets/food/croissant.jpg',['croissant']],
    ['assets/food/mushroom.jpg',['mushroom','mushrooms']],
    ['assets/food/sandwich.jpg',['sandwich','sub','submarine sandwich']],
    ['assets/food/roast-chicken.jpg',['roast chicken','roasted chicken','whole chicken']],
    ['assets/food/eggs.jpg',['eggs','egg']],
    ['assets/food/french-fries.jpg',['french fries','fries','chips']],
    ['assets/food/pork-chop.jpg',['pork chop','pork']],
    ['assets/food/cheese-platter.jpg',['cheese platter','cheese board','cheese']],
    ['assets/food/hot-dog.jpg',['hot dog','hotdog']],
    ['assets/food/mixed-sushi.jpg',['sushi','sushi platter','sushi rolls']],
    ['assets/food/tomato-soup.jpg',['tomato soup','soup']],
    ['assets/food/brown-sandwich.jpg',['sandwich','brown bread sandwich']],
    ['assets/food/mushrooms.jpg',['mushrooms','mushroom']],
    ['assets/food/mussels.jpg',['mussels','mussel']],
    ['assets/food/pasta-salad.jpg',['pasta salad','salad']],
    ['assets/food/bread.jpg',['bread','bread roll','roll']],
    ['assets/food/baguette.jpg',['baguette','french bread']],
    ['assets/food/pasta.jpg',['pasta','macaroni','noodles']],
    ['assets/food/black-olives.jpg',['black olives','olives','olive']],
    ['assets/food/croissants.jpg',['croissants','croissant']],
    ['assets/food/coffee-beans.jpg',['coffee beans','coffee']],
    ['assets/food/avocado.jpg',['avocado']],
    ['assets/food/orange.jpg',['orange','oranges']],
    ['assets/food/kiwi.jpg',['kiwi','kiwi fruit']],
    ['assets/food/pear.jpg',['pear']],
    ['assets/food/pineapple.jpg',['pineapple']],
    ['assets/food/banana.jpg',['banana','bananas']],
    ['assets/food/coconut.jpg',['coconut']],
    ['assets/food/eggplant.jpg',['eggplant','aubergine']],
    ['assets/food/rambutan.jpg',['rambutan']],
    ['assets/food/bell-pepper.jpg',['bell pepper','capsicum','pepper']],
    ['assets/food/spring-onion.jpg',['spring onion','green onion','scallion','scallions']],
    ['assets/food/dragon-fruit.jpg',['dragon fruit','pitaya']],
    ['assets/food/potato.jpg',['potato','potatoes']],
    ['assets/food/tomato.jpg',['tomato','tomatoes']],
    ['assets/food/fig.jpg',['fig','figs']],
    ['assets/food/onion.jpg',['onion','onions']],
    ['assets/food/zucchini.jpg',['zucchini','courgette']],
    ['assets/food/walnuts.jpg',['walnuts','walnut']],
    ['assets/food/hazelnuts.jpg',['hazelnuts','hazelnut']],
    ['assets/food/fruit-salad.jpg',['fruit salad','mixed fruit','fruit']],
    ['assets/food/lime.jpg',['lime','limes']]
  ];
const pick=(...words)=>FOOD_ITEMS.filter(([p])=>words.some(w=>p.includes(w)));
const READY_CATEGORIES=[
{id:'food',name:'Common Foods',genre:'Life',items:FOOD_ITEMS},
{id:'fruit',name:'Fruit',genre:'Life',items:pick('grapes','orange','kiwi','pear','pineapple','banana','coconut','rambutan','dragon-fruit','fig','lime','fruit-salad')},
{id:'vegetables',name:'Vegetables',genre:'Life',items:pick('mushroom','avocado','eggplant','bell-pepper','spring-onion','potato','tomato','onion','zucchini','black-olives')},
{id:'fast-food',name:'Fast Food',genre:'Life',items:pick('pizza','chicken-wings','burger','sandwich','french-fries','hot-dog')},
{id:'bakery',name:'Bakery',genre:'Life',items:pick('croissant','bread','baguette')},
{id:'meals',name:'Meals',genre:'Life',items:pick('pizza','sushi','steak','burger','sandwich','roast-chicken','tomato-soup','pasta','pasta-salad')},
{id:'meat-seafood',name:'Meat & Seafood',genre:'Life',items:pick('chicken','shellfish','steak','pork-chop','mussels','sushi')},
{id:'nuts',name:'Nuts',genre:'Nature',items:pick('walnuts','hazelnuts')},
{id:'fresh-produce',name:'Fresh Produce',genre:'Nature',items:pick('grapes','mushroom','avocado','orange','kiwi','pear','pineapple','banana','coconut','eggplant','rambutan','bell-pepper','spring-onion','dragon-fruit','potato','tomato','fig','onion','zucchini','lime')},
{id:'food-mix',name:'Food Mix',genre:'Pop Culture',items:FOOD_ITEMS.filter((_,i)=>i%2===0)},
{id:'animals-sample',name:'Animals — Commons Sample',genre:'Science',items:[['assets/commons/animals/elephant.jpg',['elephant','african elephant']]]},
{id:'landmarks-sample',name:'Landmarks — Commons Sample',genre:'Geography',items:[['assets/commons/landmarks/taj-mahal.jpg',['taj mahal','the taj mahal']]]}
];
const GENRE_CATALOG={
'Entertainment':['Movies','TV Shows','Actors','Actresses','Sitcoms','Drama Series','Reality TV','Game Shows','Movie Characters','Famous Directors','Film Franchises','Streaming Shows','Musicals','Movie Posters','Award Winners','Action Movies','Comedy Movies','Horror Movies','Science Fiction','Fantasy Worlds'],
'Geography':['Countries','Capital Cities','World Flags','World Landmarks','European Cities','Asian Cities','African Countries','South American Countries','US States','Australian Cities','Islands','Mountains','Rivers','Lakes','Deserts','National Parks','World Maps','Famous Bridges','Airports','Skylines'],
'Science':['Animals','Birds','Fish','Insects','Dinosaurs','Planets','Space Objects','Human Body','Chemistry','Physics','Weather','Plants','Trees','Flowers','Reptiles','Mammals','Sea Life','Medical Equipment','Scientists','Lab Equipment'],
'History':['Ancient Egypt','Ancient Rome','Ancient Greece','World War I','World War II','Kings','Queens','World Leaders','Explorers','Inventors','Historic Buildings','Ancient Civilisations','Famous Battles','Historical Clothing','Presidents','Prime Ministers','Archaeology','Medieval Life','The Renaissance','Industrial Revolution'],
'Sport':['Football Clubs','Soccer Players','Basketball','Tennis','Golf','Cricket','Rugby','Baseball','Formula One','Olympic Sports','Sports Equipment','Stadiums','Combat Sports','Wrestling','Swimming','Athletics','Cycling','Winter Sports','Motorsport','Team Logos'],
'Pop Culture':['Brands','Logos','Video Games','Game Consoles','Superheroes','Villains','Anime','Internet Culture','Social Media','Memes','Famous Couples','Celebrities','Fashion Brands','Toys','Board Games','Comic Characters','Famous Hairstyles','Awards','Catchphrases','Reality Stars'],
'Cartoons':['Disney Characters','Pixar Characters','Looney Tunes','Nickelodeon','Cartoon Network','Classic Cartoons','Anime Characters','Animated Movies','Cartoon Animals','Superhero Cartoons','TV Animation','Comic Strips','Children’s TV','Animated Villains','Princesses','Sidekicks','Robots','Fantasy Creatures','Cartoon Families','Animated Objects'],
'Life':['Common Foods','Fruit','Vegetables','Fast Food','Bakery','Meals','Meat & Seafood','Drinks','Desserts','Breakfast','Kitchen Items','Furniture','Tools','Clothing','Shoes','Cars','Home Appliances','Jobs','School Items','Everyday Objects'],
'Nature':['Nuts','Fresh Produce','Wild Animals','Australian Animals','Farm Animals','Dog Breeds','Cat Breeds','Birds of Prey','Flowers','Trees','Mushrooms','Marine Mammals','Sharks','Snakes','Butterflies','Natural Wonders','Beaches','Volcanoes','Clouds','Weather Events'],
'Music':['Bands','Solo Artists','Pop Stars','Rock Bands','Albums','Musical Instruments','Song Titles','Music Videos','DJs','Rappers','Country Music','Classical Composers','Opera','Musicals','Boy Bands','Girl Groups','Album Covers','Concerts','Music Awards','Famous Singers']
};
let game={count:2,players:[],draftIndex:0,chosen:new Set(),tiles:[],cols:2,challenger:null,defender:null,duelCategory:null,duelNames:[],winner:null};
let itemQueue=[],itemIndex=0,activePlayer=0,clocks=[45,45],running=false,lastFrame=0,rafId=null,recognition=null,recognitionStarting=false,recognitionWanted=false,processing=false;
function show(id){SCREENS.forEach(s=>$(s).classList.toggle('active',s===id));window.scrollTo(0,0)}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function normalize(s){return s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/(a|an|the)/g,' ').replace(/\s+/g,' ').trim()}
function readyByName(name){return READY_CATEGORIES.find(c=>c.name===name)}
function renderModes(){$('modeGrid').innerHTML=[2,4,6,8,10].map(n=>`<button class="mode-card" data-count="${n}"><strong>${n===2?'DUEL 1v1':n+' PLAYERS'}</strong><span>${n===2?'Classic head-to-head voice duel':'Randomizer, adjacent challenges and territory capture'}</span></button>`).join('');document.querySelectorAll('.mode-card').forEach(b=>b.onclick=()=>setupPlayers(+b.dataset.count))}
function setupPlayers(count){game.count=count;game.players=Array.from({length:count},(_,i)=>({id:i,name:`PLAYER ${i+1}`,color:COLORS[i],category:null,active:true}));$('playerForm').innerHTML=game.players.map((p,i)=>`<div class="player-row"><button class="player-swatch" data-i="${i}" style="background:${p.color}" aria-label="Change colour"></button><input data-i="${i}" value="${p.name}" maxlength="14"></div>`).join('');document.querySelectorAll('.player-swatch').forEach(b=>b.onclick=()=>{let i=+b.dataset.i,ci=COLORS.indexOf(game.players[i].color);game.players[i].color=COLORS[(ci+1)%COLORS.length];b.style.background=game.players[i].color});show('players')}
function beginDraft(){document.querySelectorAll('#playerForm input').forEach(inp=>game.players[+inp.dataset.i].name=(inp.value.trim()||`PLAYER ${+inp.dataset.i+1}`).toUpperCase());game.draftIndex=0;game.chosen=new Set();renderGenres();renderDraft('Life');show('categories')}
function renderGenres(){$('genreTabs').innerHTML=Object.keys(GENRE_CATALOG).map((g,i)=>`<button class="genre-tab ${i===7?'active':''}" data-g="${g}">${g}</button>`).join('');document.querySelectorAll('.genre-tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.genre-tab').forEach(x=>x.classList.toggle('active',x===b));renderDraft(b.dataset.g)})}
function renderDraft(genre){let p=game.players[game.draftIndex];$('draftPlayer').textContent=p.name;let names=GENRE_CATALOG[genre];$('categoryGrid').innerHTML=names.map(name=>{let ready=readyByName(name);let used=ready&&game.chosen.has(ready.id);return `<button class="category ${ready&&!used?'ready':'locked'}" data-id="${ready&&!used?ready.id:''}"><strong>${name}</strong><small>${ready?(used?'Already chosen':ready.items.length+' local photos'):'Content pack planned'}</small></button>`}).join('');document.querySelectorAll('.category.ready').forEach(b=>b.onclick=()=>chooseCategory(b.dataset.id))}
function chooseCategory(id){let cat=READY_CATEGORIES.find(c=>c.id===id);game.players[game.draftIndex].category=id;game.chosen.add(id);game.draftIndex++;if(game.draftIndex>=game.players.length){buildBoard();runRandomizer()}else renderDraft('Life')}
function boardShape(n){return n===2?[2,1]:n===4?[2,2]:n===6?[3,2]:n===8?[4,2]:[5,2]}
function buildBoard(){let [cols,rows]=boardShape(game.count);game.cols=cols;game.tiles=game.players.map((p,i)=>({owner:i,category:p.category,index:i}));$('floorBoard').style.gridTemplateColumns=`repeat(${cols},1fr)`}
function activeOwners(){return [...new Set(game.tiles.map(t=>t.owner))]}
function runRandomizer(){show('randomizer');let owners=activeOwners(),ticks=0;let timer=setInterval(()=>{let id=owners[Math.floor(Math.random()*owners.length)];$('randomName').textContent=game.players[id].name;ticks++;if(ticks>16){clearInterval(timer);game.challenger=id;setTimeout(renderBoard,500)}},90)}
function neighbours(index){let c=index%game.cols,r=Math.floor(index/game.cols),out=[];if(c>0)out.push(index-1);if(c<game.cols-1&&index+1<game.tiles.length)out.push(index+1);if(r>0)out.push(index-game.cols);if(index+game.cols<game.tiles.length)out.push(index+game.cols);return out}
function selectableTiles(){let own=game.tiles.map((t,i)=>t.owner===game.challenger?i:-1).filter(i=>i>=0),set=new Set();own.forEach(i=>neighbours(i).forEach(n=>{if(game.tiles[n].owner!==game.challenger)set.add(n)}));return set}
function renderBoard(){show('board');$('challengerName').textContent=game.players[game.challenger].name;let selectable=selectableTiles();$('floorBoard').innerHTML=game.tiles.map((t,i)=>{let p=game.players[t.owner],cat=READY_CATEGORIES.find(c=>c.id===t.category);return `<button class="tile ${selectable.has(i)?'selectable':''}" data-i="${i}" style="background:linear-gradient(145deg,${p.color},#11183f)"><span class="owner">${p.name}</span><span class="cat">${cat?.name||'Category'}</span></button>`}).join('');document.querySelectorAll('.tile.selectable').forEach(b=>b.onclick=()=>challenge(+b.dataset.i));$('boardLegend').innerHTML=activeOwners().map(id=>`<span class="legend-chip" style="background:${game.players[id].color}">${game.players[id].name}</span>`).join('');if(!selectable.size){let others=activeOwners().filter(x=>x!==game.challenger);game.challenger=others[Math.floor(Math.random()*others.length)];setTimeout(renderBoard,300)}}
function challenge(tileIndex){game.defender=game.tiles[tileIndex].owner;game.duelCategory=game.tiles[tileIndex].category;startDuel()}
function startDuel(){stopListening();recognition=null;recognitionStarting=false;let a=game.players[game.challenger],d=game.players[game.defender],cat=READY_CATEGORIES.find(c=>c.id===game.duelCategory);game.duelNames=[a.name,d.name];itemQueue=shuffle(cat.items.length?cat.items:FOOD_ITEMS);itemIndex=0;activePlayer=0;clocks=[45,45];running=false;processing=false;$('duelCategory').textContent=cat.name;$('name0').textContent=a.name;$('name1').textContent=d.name;$('beginBtn').style.display='block';$('passBtn').disabled=true;$('manualCorrectBtn').disabled=true;$('voiceStatus').textContent='Tap BEGIN to activate voice';$('heardText').textContent='Your answer will appear here';updateClocks();updateTurn();renderCardBack();show('duel')}
function renderCardBack(){$('promptVisual').innerHTML='<div class="card-back-mark">?</div>';$('promptCard').classList.add('face-down')}
function renderPrompt(){$('promptCard').classList.remove('face-down');if(itemIndex>=itemQueue.length){itemQueue=shuffle(READY_CATEGORIES.find(c=>c.id===game.duelCategory).items);itemIndex=0}let [visual]=itemQueue[itemIndex];$('promptVisual').innerHTML=`<img class="prompt-photo" src="${visual}" alt="Question image">`}
function updateTurn(){[0,1].forEach(i=>$(`player${i}`).classList.toggle('active-player',i===activePlayer));$('turnBanner').textContent=game.duelNames[activePlayer]}
function updateClocks(){clocks.forEach((t,i)=>$(`clock${i}`).textContent=String(Math.ceil(Math.max(0,t))))}
function beginDuel(){$('beginBtn').style.display='none';$('passBtn').disabled=false;$('manualCorrectBtn').disabled=false;renderPrompt();running=true;lastFrame=performance.now();recognitionWanted=true;setupRecognition();startListening();tick(lastFrame)}
function tick(now){if(!running)return;let dt=(now-lastFrame)/1000;lastFrame=now;clocks[activePlayer]-=dt;updateClocks();if(clocks[activePlayer]<=0){clocks[activePlayer]=0;updateClocks();endDuel(1-activePlayer);return}rafId=requestAnimationFrame(tick)}
function setupRecognition(){if(recognition)return;let SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){setVoiceError('Voice recognition is unavailable. Use CORRECT and PASS.');return}recognition=new SR();recognition.lang='en-AU';recognition.interimResults=true;recognition.continuous=false;recognition.maxAlternatives=10;recognition.onstart=()=>{recognitionStarting=false;$('micDot').className='mic-dot listening';$('voiceStatus').textContent='Listening…'};recognition.onresult=e=>{let a=[];for(let i=e.resultIndex;i<e.results.length;i++)for(let j=0;j<e.results[i].length;j++)a.push(e.results[i][j].transcript);if(a.length){$('heardText').textContent=a[0];checkSpeech(a)}};recognition.onerror=e=>{recognitionStarting=false;if(e.error==='not-allowed'||e.error==='service-not-allowed'){recognitionWanted=false;setVoiceError('Microphone permission was blocked. Use CORRECT and PASS.')}};recognition.onend=()=>{recognitionStarting=false;$('micDot').className='mic-dot';if(recognitionWanted&&running&&!processing)setTimeout(startListening,120)}}
function startListening(){if(!recognition||recognitionStarting||!recognitionWanted||!running||processing)return;recognitionStarting=true;try{recognition.start()}catch(e){recognitionStarting=false;if(recognitionWanted&&running)setTimeout(startListening,220)}}
function stopListening(){recognitionWanted=false;recognitionStarting=false;if(recognition)try{recognition.abort()}catch(e){}if($('micDot'))$('micDot').className='mic-dot'}
function setVoiceError(m){$('micDot').className='mic-dot error';$('voiceStatus').textContent=m}
function checkSpeech(alts){if(processing||!running)return;let heard=alts.map(normalize);if(heard.some(t=>t==='pass'||t.endsWith(' pass'))){doPass();return}let answers=itemQueue[itemIndex][1].map(normalize),matched=heard.some(t=>answers.some(a=>t===a||(t.length>=3&&(t.includes(a)||a.includes(t)))||a.split(' ').every(w=>t.split(' ').includes(w))));if(matched)correctAnswer()}
function correctAnswer(){if(processing||!running)return;processing=true;stopListening();$('voiceStatus').textContent='Correct!';$('heardText').textContent='✓ '+itemQueue[itemIndex][1][0].toUpperCase();setTimeout(()=>{itemIndex++;activePlayer=1-activePlayer;updateTurn();renderPrompt();processing=false;recognitionWanted=true;startListening()},420)}
function doPass(){if(processing||!running)return;processing=true;stopListening();clocks[activePlayer]=Math.max(0,clocks[activePlayer]-3);updateClocks();$('passOverlay').classList.remove('hidden');if(clocks[activePlayer]<=0){setTimeout(()=>endDuel(1-activePlayer),500);return}setTimeout(()=>{$('passOverlay').classList.add('hidden');itemIndex++;renderPrompt();processing=false;recognitionWanted=true;startListening()},900)}
function endDuel(side){running=false;processing=false;cancelAnimationFrame(rafId);stopListening();$('passOverlay').classList.add('hidden');game.winner=side===0?game.challenger:game.defender;let loser=side===0?game.defender:game.challenger;$('winnerName').textContent=game.players[game.winner].name;$('resultCopy').textContent=`${game.players[game.winner].name} wins and takes all of ${game.players[loser].name}’s territory.`;game.tiles.forEach(t=>{if(t.owner===loser)t.owner=game.winner});game.players[loser].active=false;show('result')}
function continueBoard(){let owners=activeOwners();if(owners.length===1){$('championName').textContent=game.players[owners[0]].name;show('champion')}else runRandomizer()}
$('enterBtn').onclick=()=>show('mode');$('toCategoriesBtn').onclick=beginDraft;$('beginBtn').onclick=beginDuel;$('passBtn').onclick=doPass;$('manualCorrectBtn').onclick=correctAnswer;$('continueBoardBtn').onclick=continueBoard;$('newGameBtn').onclick=()=>show('mode');$('boardQuit').onclick=()=>show('mode');$('quitDuel').onclick=()=>{running=false;cancelAnimationFrame(rafId);stopListening();renderBoard()};document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>show(b.dataset.back));renderModes();
