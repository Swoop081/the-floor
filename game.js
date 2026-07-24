const CATEGORIES = [
  { id:'animals', name:'Animals', icon:'🦁', items:[
    ['🐘',['elephant']],['🦒',['giraffe']],['🦘',['kangaroo','roo']],['🐼',['panda','panda bear']],['🦓',['zebra']],['🦉',['owl']],['🐊',['crocodile','alligator']],['🦏',['rhinoceros','rhino']],['🐙',['octopus']],['🦚',['peacock']],['🦥',['sloth']],['🦩',['flamingo']]
  ]},
  { id:'food', name:'Food', icon:'assets/food/pizza.jpg', iconType:'image', items:[
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
  ]},
  { id:'places', name:'World Landmarks', icon:'🗼', items:[
    ['🗼',['eiffel tower','the eiffel tower']],['🗽',['statue of liberty','the statue of liberty']],['🏛️',['parthenon','the parthenon']],['🏰',['castle']],['🎡',['london eye','the london eye','ferris wheel']],['🌉',['golden gate bridge','the golden gate bridge']],['🕌',['taj mahal','the taj mahal']],['🗿',['easter island','moai','easter island statue']],['⛩️',['torii gate','japanese gate']],['🏯',['japanese castle','pagoda']],['🕍',['synagogue']],['⛲',['trevi fountain','fountain']]
  ]}
];

const $ = id => document.getElementById(id);
const screens = ['home','duel','result'];
let selectedCategory = null;
let itemQueue = [];
let itemIndex = 0;
let activePlayer = 0;
let clocks = [45,45];
let running = false;
let lastFrame = 0;
let rafId = null;
let recognition = null;
let recognitionWanted = false;
let processing = false;
let names = ['PLAYER 1','PLAYER 2'];

function showScreen(id){ screens.forEach(s=>$(s).classList.toggle('active',s===id)); }
function shuffle(arr){ return [...arr].sort(()=>Math.random()-.5); }
function normalize(s){ return s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\b(a|an|the)\b/g,' ').replace(/\s+/g,' ').trim(); }
function categoryById(id){ return CATEGORIES.find(c=>c.id===id); }

function renderCategories(){
  const grid=$('categoryGrid');
  grid.innerHTML='';
  CATEGORIES.forEach(cat=>{
    const b=document.createElement('button');
    b.className='category'; b.dataset.id=cat.id;
    b.innerHTML=cat.iconType==='image' ? `<img class="cat-image" src="${cat.icon}" alt=""><span>${cat.name}</span>` : `<span class="cat-icon">${cat.icon}</span><span>${cat.name}</span>`;
    b.onclick=()=>{ selectedCategory=cat.id; [...grid.children].forEach(x=>x.classList.toggle('selected',x.dataset.id===cat.id)); $('startBtn').disabled=false; };
    grid.appendChild(b);
  });
}

function startSetup(){
  names=[($('p1Name').value.trim()||'PLAYER 1').toUpperCase(),($('p2Name').value.trim()||'PLAYER 2').toUpperCase()];
  const cat=categoryById(selectedCategory);
  itemQueue=shuffle(cat.items); itemIndex=0; activePlayer=0; clocks=[45,45]; running=false; processing=false;
  $('duelCategory').textContent=cat.name; $('name0').textContent=names[0]; $('name1').textContent=names[1];
  $('beginBtn').style.display='block'; $('beginBtn').disabled=false; $('passBtn').disabled=true; $('manualCorrectBtn').disabled=true;
  $('voiceStatus').textContent='Tap BEGIN to activate voice'; $('heardText').textContent='Your answer will appear here';
  updateClocks(); updateTurn(); renderPrompt(); showScreen('duel');
}

function renderPrompt(){
  if(itemIndex>=itemQueue.length){ itemQueue=shuffle(categoryById(selectedCategory).items); itemIndex=0; }
  const [visual]=itemQueue[itemIndex];
  const prompt=$('promptEmoji');
  if(/^assets\//.test(visual)){ prompt.innerHTML=`<img class="prompt-photo" src="${visual}" alt="Food item">`; }
  else { prompt.textContent=visual; }
  $('promptHint').textContent='';
}

function updateTurn(){
  [0,1].forEach(i=>{$(`player${i}`).classList.toggle('active-player',i===activePlayer);});
  $('turnBanner').textContent=names[activePlayer];
}
function updateClocks(){
  clocks.forEach((t,i)=>{ $(`clock${i}`).textContent=Math.max(0,t).toFixed(1); $(`player${i}`).classList.toggle('danger',t<=10&&running&&i===activePlayer); });
}

function beginDuel(){
  $('beginBtn').style.display='none'; $('passBtn').disabled=false; $('manualCorrectBtn').disabled=false;
  running=true; lastFrame=performance.now(); recognitionWanted=true; setupRecognition(); startListening(); tick(lastFrame);
}

function tick(now){
  if(!running)return;
  const dt=(now-lastFrame)/1000; lastFrame=now; clocks[activePlayer]-=dt; updateClocks();
  if(clocks[activePlayer]<=0){ clocks[activePlayer]=0; updateClocks(); endDuel(1-activePlayer); return; }
  rafId=requestAnimationFrame(tick);
}

function setupRecognition(){
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRecognition){ setVoiceError('Voice recognition is unavailable. Use CORRECT and PASS.'); return; }
  recognition=new SpeechRecognition(); recognition.lang='en-AU'; recognition.interimResults=true; recognition.continuous=false; recognition.maxAlternatives=5;
  recognition.onstart=()=>{ $('micDot').className='mic-dot listening'; $('voiceStatus').textContent='Listening…'; };
  recognition.onresult=e=>{
    const alternatives=[];
    for(let i=e.resultIndex;i<e.results.length;i++) for(let j=0;j<e.results[i].length;j++) alternatives.push(e.results[i][j].transcript);
    if(alternatives.length){ $('heardText').textContent=alternatives[0]; checkSpeech(alternatives); }
  };
  recognition.onerror=e=>{
    if(e.error==='not-allowed'||e.error==='service-not-allowed') setVoiceError('Microphone permission was blocked. Use CORRECT and PASS.');
    else if(e.error!=='aborted'&&e.error!=='no-speech') $('voiceStatus').textContent='Listening paused — restarting…';
  };
  recognition.onend=()=>{
    $('micDot').className='mic-dot';
    if(recognitionWanted&&running&&!processing) setTimeout(startListening,180);
  };
}

function startListening(){
  if(!recognition||!recognitionWanted||!running||processing)return;
  try{ recognition.start(); }catch(e){ setTimeout(startListening,250); }
}
function stopListening(){ recognitionWanted=false; if(recognition){ try{recognition.abort();}catch(e){} } $('micDot').className='mic-dot'; }
function setVoiceError(msg){ $('micDot').className='mic-dot error'; $('voiceStatus').textContent=msg; }

function checkSpeech(alternatives){
  if(processing||!running)return;
  const normalized=alternatives.map(normalize);
  if(normalized.some(t=>t==='pass'||t.endsWith(' pass'))){ doPass(); return; }
  const answers=itemQueue[itemIndex][1].map(normalize);
  const matched=normalized.some(t=>answers.some(a=>t===a||t.includes(a)||a.includes(t)&&t.length>=4));
  if(matched) correctAnswer();
}

function correctAnswer(){
  if(processing||!running)return; processing=true; stopListening();
  $('voiceStatus').textContent='Correct!'; $('heardText').textContent='✓ '+itemQueue[itemIndex][1][0].toUpperCase();
  setTimeout(()=>{ itemIndex++; activePlayer=1-activePlayer; updateTurn(); renderPrompt(); processing=false; recognitionWanted=true; startListening(); },420);
}

function doPass(){
  if(processing||!running)return; processing=true; stopListening();
  clocks[activePlayer]=Math.max(0,clocks[activePlayer]-3); updateClocks(); $('passOverlay').classList.remove('hidden'); $('voiceStatus').textContent='Pass — 3 second penalty';
  if(clocks[activePlayer]<=0){ setTimeout(()=>endDuel(1-activePlayer),500); return; }
  setTimeout(()=>{ $('passOverlay').classList.add('hidden'); itemIndex++; renderPrompt(); processing=false; recognitionWanted=true; startListening(); },900);
}

function endDuel(winner){
  running=false; processing=false; cancelAnimationFrame(rafId); stopListening();
  $('passOverlay').classList.add('hidden'); $('winnerName').textContent=names[winner];
  $('resultCopy').textContent=`${names[winner]} wins the ${categoryById(selectedCategory).name} duel and takes the tile.`;
  [0,1].forEach(i=>{ $(`finalName${i}`).textContent=names[i]; $(`finalClock${i}`).textContent=Math.max(0,clocks[i]).toFixed(1); });
  showScreen('result');
}

$('startBtn').onclick=startSetup;
$('beginBtn').onclick=beginDuel;
$('passBtn').onclick=doPass;
$('manualCorrectBtn').onclick=correctAnswer;
$('quitBtn').onclick=()=>{ running=false; cancelAnimationFrame(rafId); stopListening(); showScreen('home'); };
$('playAgainBtn').onclick=()=>showScreen('home');
renderCategories();
