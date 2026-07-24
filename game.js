const $=id=>document.getElementById(id);
const SCREENS=['splash','hostIntro','mode','players','categories','randomizer','board','hostDecision','duel','result','champion'];
const COLORS=['#16a6ff','#ff3e72','#35d07f','#f4c83f','#9b5cff','#ff7a32','#19c5c8','#e85fd0','#7fc83b','#ff5656','#3d65ff','#ffb225','#00a88f','#d642ff','#ef5350','#7e57c2','#26a69a','#ec407a','#8d6e63','#78909c'];
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

const makeText=(prompt,answers,type='text')=>({type,prompt,answers:Array.isArray(answers)?answers:[answers]});
const makeQuestions=pairs=>pairs.map(([p,a])=>makeText(p,a,'question'));
const NUMBER_WORDS=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
const numAnswers=n=>[String(n),NUMBER_WORDS[n]||String(n)];
const mathPack=(kind,count=35)=>Array.from({length:count},(_,i)=>{let a,b,n,p;if(kind==='easy'){a=2+i%18;b=1+(i*3)%12;n=a+b;p=`${a} + ${b}`}else if(kind==='medium'){a=15+i%35;b=2+(i*5)%14;n=i%2?a-b:a+b;p=i%2?`${a} − ${b}`:`${a} + ${b}`}else if(kind==='times'){a=2+i%11;b=2+(i*3)%10;n=a*b;p=`${a} × ${b}`}else if(kind==='division'){b=2+i%10;n=2+(i*4)%11;a=b*n;p=`${a} ÷ ${b}`}else{a=10+i%21;b=2+i%8;let c=1+(i*3)%9;n=(a+b)*c;p=`(${a} + ${b}) × ${c}`}return makeText(p,numAnswers(n),'math')});
const ROMAN={I:1,II:2,III:3,IV:4,V:5,VI:6,VII:7,VIII:8,IX:9,X:10,XI:11,XII:12,XIII:13,XIV:14,XV:15,XVI:16,XVII:17,XVIII:18,XIX:19,XX:20,XXV:25,XXX:30,XL:40,L:50,LX:60,LXX:70,LXXX:80,XC:90,C:100};
const ROMAN_ITEMS=Object.entries(ROMAN).map(([r,n],i)=>i%2?makeText(`Write ${n} as a Roman numeral`,[r,r.toLowerCase()],'question'):makeText(r,numAnswers(n),'math'));
const CAPITALS=makeQuestions([
['What is the capital of Australia?',['canberra']],['What is the capital of New Zealand?',['wellington']],['What is the capital of Japan?',['tokyo']],['What is the capital of France?',['paris']],['What is the capital of Italy?',['rome']],['What is the capital of Spain?',['madrid']],['What is the capital of Germany?',['berlin']],['What is the capital of Canada?',['ottawa']],['What is the capital of the United States?',['washington','washington dc']],['What is the capital of Brazil?',['brasilia']],['What is the capital of Argentina?',['buenos aires']],['What is the capital of Egypt?',['cairo']],['What is the capital of Kenya?',['nairobi']],['What is the capital of India?',['new delhi','delhi']],['What is the capital of China?',['beijing']],['What is the capital of South Korea?',['seoul']],['What is the capital of Thailand?',['bangkok']],['What is the capital of Greece?',['athens']],['What is the capital of Portugal?',['lisbon']],['What is the capital of Ireland?',['dublin']],['What is the capital of Norway?',['oslo']],['What is the capital of Sweden?',['stockholm']],['What is the capital of Finland?',['helsinki']],['What is the capital of Denmark?',['copenhagen']],['What is the capital of Mexico?',['mexico city']]]);
const COUNTRIES=makeQuestions([
['The Eiffel Tower is in which country?',['france']],['The Great Pyramid of Giza is in which country?',['egypt']],['Kyoto is in which country?',['japan']],['Machu Picchu is in which country?',['peru']],['Barcelona is in which country?',['spain']],['The Taj Mahal is in which country?',['india']],['Rio de Janeiro is in which country?',['brazil']],['The Serengeti is mainly in which country?',['tanzania']],['Dubrovnik is in which country?',['croatia']],['Marrakech is in which country?',['morocco']],['Auckland is in which country?',['new zealand']],['Vancouver is in which country?',['canada']],['Munich is in which country?',['germany']],['Florence is in which country?',['italy']],['Cape Town is in which country?',['south africa']],['Istanbul is in which country?',['turkey','turkiye']],['Reykjavik is in which country?',['iceland']],['Amsterdam is in which country?',['netherlands','the netherlands']],['Geneva is in which country?',['switzerland']],['Hanoi is in which country?',['vietnam']]]);
const SCIENCE_Q=makeQuestions([
['What planet is known as the Red Planet?',['mars']],['What gas do humans need to breathe?',['oxygen']],['How many planets are in our solar system?',['eight','8']],['What is H2O commonly called?',['water']],['What force pulls objects toward Earth?',['gravity']],['What is the closest star to Earth?',['sun','the sun']],['What organ pumps blood around the body?',['heart']],['What is the largest organ of the human body?',['skin']],['What do bees collect from flowers?',['nectar','pollen']],['What is the freezing point of water in Celsius?',['zero','0']],['What is the centre of an atom called?',['nucleus']],['Which animal is the largest mammal?',['blue whale','whale']],['What is the process by which plants make food?',['photosynthesis']],['How many bones are in an adult human body?',['206','two hundred and six']],['What instrument measures temperature?',['thermometer']],['Which blood cells fight infection?',['white blood cells','white cells']],['What is the hardest natural substance?',['diamond']],['Which planet has prominent rings?',['saturn']],['What is molten rock below Earth’s surface called?',['magma']],['What is the chemical symbol for gold?',['au']]]);
const HISTORY_Q=makeQuestions([
['Who was the first person to walk on the Moon?',['neil armstrong','armstrong']],['Which ancient civilisation built the Colosseum?',['romans','ancient rome']],['In which country did the Renaissance begin?',['italy']],['Which ship sank in 1912 after hitting an iceberg?',['titanic','the titanic']],['Who was known as the Maid of Orléans?',['joan of arc']],['Who discovered penicillin?',['alexander fleming','fleming']],['Which city was buried by Mount Vesuvius?',['pompeii']],['Who was the first emperor of Rome?',['augustus','caesar augustus']],['Which civilisation built Machu Picchu?',['inca','incas']],['What wall fell in 1989?',['berlin wall','the berlin wall']],['Who painted the Mona Lisa?',['leonardo da vinci','da vinci']]]);
const SPORT_Q=makeQuestions([
['How many players are on the field for one soccer team?',['eleven','11']],['Which sport uses a shuttlecock?',['badminton']],['In tennis, what word means zero?',['love']],['How many rings are on the Olympic symbol?',['five','5']],['What sport is played at Wimbledon?',['tennis']],['What colour card sends a soccer player off?',['red','red card']],['How many points is a try worth in rugby union?',['five','5']],['Which sport uses a pommel horse?',['gymnastics']],['What is three strikes in a row in bowling called?',['turkey']],['Which sport uses wickets?',['cricket']],['How many holes are in a standard golf round?',['eighteen','18']],['What sport features the Stanley Cup?',['ice hockey','hockey']],['Which swimming stroke is named after an insect?',['butterfly']]]);
const ENTERTAINMENT_Q=makeQuestions([
['Who is the wizard hero of Hogwarts?',['harry potter']],['What is the name of Batman’s city?',['gotham','gotham city']],['Which toy cowboy appears in Toy Story?',['woody']],['What is Superman’s home planet?',['krypton']],['Which princess has a pet tiger named Rajah?',['jasmine','princess jasmine']],['Who lives in a pineapple under the sea?',['spongebob','spongebob squarepants']],['Which hero carries a shield with a star?',['captain america']],['What is the name of Shrek’s wife?',['fiona','princess fiona']],['Which film series features the DeLorean time machine?',['back to the future']],['Which cartoon cat chases Jerry?',['tom']],['Which Disney character has a long wooden nose?',['pinocchio']]]);
const OPPOSITES=[['HOT','cold'],['UP','down'],['FAST','slow'],['DAY','night'],['BIG','small'],['OLD','young'],['OPEN','closed'],['HAPPY','sad'],['LIGHT','dark'],['EARLY','late'],['FULL','empty'],['HIGH','low'],['WET','dry'],['LEFT','right'],['BEGIN','end'],['BUY','sell'],['PUSH','pull'],['IN','out'],['ABOVE','below'],['WIN','lose']].map(([p,a])=>makeText(p,[a]));

const READY_CATEGORIES=[
{id:'food',name:'Common Foods',genre:'Life',items:FOOD_ITEMS},
{id:'fruit',name:'Fruit',genre:'Life',items:pick('grapes','orange','kiwi','pear','pineapple','banana','coconut','rambutan','dragon-fruit','fig','lime','fruit-salad')},
{id:'tropical-fruit',name:'Tropical Fruit',genre:'Life',items:pick('pineapple','banana','coconut','rambutan','dragon-fruit','lime','avocado')},
{id:'orchard-fruit',name:'Orchard Fruit',genre:'Life',items:pick('orange','kiwi','pear','fig','lime','grapes')},
{id:'vegetables',name:'Vegetables',genre:'Life',items:pick('mushroom','avocado','eggplant','bell-pepper','spring-onion','potato','tomato','onion','zucchini','black-olives')},
{id:'root-bulb',name:'Root & Bulb Vegetables',genre:'Life',items:pick('potato','onion','spring-onion')},
{id:'fast-food',name:'Fast Food',genre:'Life',items:pick('pizza','chicken-wings','burger','sandwich','french-fries','hot-dog')},
{id:'pizza-burgers',name:'Pizza & Burgers',genre:'Life',items:pick('pizza','burger','french-fries','hot-dog','chicken-wings')},
{id:'sandwiches',name:'Sandwiches',genre:'Life',items:pick('sandwich','brown-sandwich','hot-dog','burger')},
{id:'bakery',name:'Bakery',genre:'Life',items:pick('croissant','bread','baguette')},
{id:'bread-pastries',name:'Bread & Pastries',genre:'Life',items:pick('croissant','croissants','bread','baguette')},
{id:'meals',name:'Meals',genre:'Life',items:pick('pizza','sushi','steak','burger','sandwich','roast-chicken','tomato-soup','pasta','pasta-salad')},
{id:'italian-food',name:'Italian Food',genre:'Life',items:pick('pizza','pasta','pasta-salad','tomato-soup','tomato')},
{id:'asian-food',name:'Asian Food',genre:'Life',items:pick('sushi','mixed-sushi','spring-onion','rambutan','dragon-fruit')},
{id:'meat-seafood',name:'Meat & Seafood',genre:'Life',items:pick('chicken','shellfish','steak','pork-chop','mussels','sushi')},
{id:'seafood',name:'Seafood',genre:'Life',items:pick('shellfish','mussels','sushi','mixed-sushi')},
{id:'meat-dishes',name:'Meat Dishes',genre:'Life',items:pick('chicken-wings','steak','roast-chicken','pork-chop','burger')},
{id:'breakfast',name:'Breakfast Foods',genre:'Life',items:pick('eggs','croissant','bread','baguette','coffee-beans','fruit-salad')},
{id:'snacks',name:'Snacks',genre:'Life',items:pick('french-fries','chicken-wings','walnuts','hazelnuts','fruit-salad','cheese-platter')},
{id:'healthy-foods',name:'Healthy Foods',genre:'Life',items:pick('grapes','avocado','orange','kiwi','pear','banana','eggplant','bell-pepper','tomato','zucchini','walnuts','hazelnuts','fruit-salad','lime')},
{id:'ingredients',name:'Cooking Ingredients',genre:'Life',items:pick('tomato','onion','spring-onion','bell-pepper','mushroom','eggplant','potato','black-olives','cheese')},
{id:'nuts',name:'Nuts',genre:'Nature',items:pick('walnuts','hazelnuts')},
{id:'fresh-produce',name:'Fresh Produce',genre:'Nature',items:pick('grapes','mushroom','avocado','orange','kiwi','pear','pineapple','banana','coconut','eggplant','rambutan','bell-pepper','spring-onion','dragon-fruit','potato','tomato','fig','onion','zucchini','lime')},
{id:'food-mix',name:'Food Mix',genre:'Pop Culture',items:FOOD_ITEMS.filter((_,i)=>i%2===0)},
{id:'animals-sample',name:'Animals — Commons Sample',genre:'Science',items:[['assets/commons/animals/elephant.jpg',['elephant','african elephant']]]},
{id:'landmarks-sample',name:'Landmarks — Commons Sample',genre:'Geography',items:[['assets/commons/landmarks/taj-mahal.jpg',['taj mahal','the taj mahal']]]},
{id:'capitals',name:'Capital Cities',genre:'Geography',items:CAPITALS},{id:'countries',name:'Countries',genre:'Geography',items:COUNTRIES},
{id:'science-trivia',name:'Science',genre:'Science',items:SCIENCE_Q},{id:'history-trivia',name:'World History',genre:'History',items:HISTORY_Q},{id:'sport-trivia',name:'Sport',genre:'Sport',items:SPORT_Q},{id:'entertainment-trivia',name:'Entertainment',genre:'Entertainment',items:ENTERTAINMENT_Q},
{id:'roman',name:'Roman Numerals',genre:'History',items:ROMAN_ITEMS},{id:'maths-easy',name:'Maths — Easy',genre:'Science',items:mathPack('easy',40)},{id:'maths-medium',name:'Maths — Medium',genre:'Science',items:mathPack('medium',40)},{id:'times-tables',name:'Times Tables',genre:'Science',items:mathPack('times',50)},{id:'division',name:'Division',genre:'Science',items:mathPack('division',40)},{id:'maths-hard',name:'Maths — Hard',genre:'Science',items:mathPack('hard',35)},{id:'opposites',name:'Opposites',genre:'Life',items:OPPOSITES}
];
const GENRE_CATALOG={
'Entertainment':['Entertainment','Movies','TV Shows','Actors','Actresses','Sitcoms','Drama Series','Reality TV','Game Shows','Movie Characters','Famous Directors','Film Franchises','Streaming Shows','Musicals','Movie Posters','Award Winners','Action Movies','Comedy Movies','Horror Movies','Science Fiction','Fantasy Worlds'],
'Geography':['Countries','Capital Cities','Capital Cities','World Flags','World Landmarks','European Cities','Asian Cities','African Countries','South American Countries','US States','Australian Cities','Islands','Mountains','Rivers','Lakes','Deserts','National Parks','World Maps','Famous Bridges','Airports','Skylines'],
'Science':['Maths — Easy','Maths — Medium','Times Tables','Division','Maths — Hard','Science','Animals','Birds','Fish','Insects','Dinosaurs','Planets','Space Objects','Human Body','Chemistry','Physics','Weather','Plants','Trees','Flowers','Reptiles','Mammals','Sea Life','Medical Equipment','Scientists','Lab Equipment'],
'History':['Roman Numerals','World History','Ancient Egypt','Ancient Rome','Ancient Greece','World War I','World War II','Kings','Queens','World Leaders','Explorers','Inventors','Historic Buildings','Ancient Civilisations','Famous Battles','Historical Clothing','Presidents','Prime Ministers','Archaeology','Medieval Life','The Renaissance','Industrial Revolution'],
'Sport':['Sport','Football Clubs','Soccer Players','Basketball','Tennis','Golf','Cricket','Rugby','Baseball','Formula One','Olympic Sports','Sports Equipment','Stadiums','Combat Sports','Wrestling','Swimming','Athletics','Cycling','Winter Sports','Motorsport','Team Logos'],
'Pop Culture':['Food Mix','Brands','Logos','Video Games','Game Consoles','Superheroes','Villains','Anime','Internet Culture','Social Media','Memes','Famous Couples','Celebrities','Fashion Brands','Toys','Board Games','Comic Characters','Famous Hairstyles','Awards','Catchphrases','Reality Stars'],
'Cartoons':['Disney Characters','Pixar Characters','Looney Tunes','Nickelodeon','Cartoon Network','Classic Cartoons','Anime Characters','Animated Movies','Cartoon Animals','Superhero Cartoons','TV Animation','Comic Strips','Children’s TV','Animated Villains','Princesses','Sidekicks','Robots','Fantasy Creatures','Cartoon Families','Animated Objects'],
'Life':['Opposites','Common Foods','Fruit','Tropical Fruit','Orchard Fruit','Vegetables','Root & Bulb Vegetables','Fast Food','Pizza & Burgers','Sandwiches','Bakery','Bread & Pastries','Meals','Italian Food','Asian Food','Meat & Seafood','Seafood','Meat Dishes','Breakfast Foods','Snacks','Healthy Foods'],
'Nature':['Nuts','Fresh Produce','Wild Animals','Australian Animals','Farm Animals','Dog Breeds','Cat Breeds','Birds of Prey','Flowers','Trees','Mushrooms','Marine Mammals','Sharks','Snakes','Butterflies','Natural Wonders','Beaches','Volcanoes','Clouds','Cooking Ingredients'],
'Music':['Bands','Solo Artists','Pop Stars','Rock Bands','Albums','Musical Instruments','Song Titles','Music Videos','DJs','Rappers','Country Music','Classical Composers','Opera','Musicals','Boy Bands','Girl Groups','Album Covers','Concerts','Music Awards','Famous Singers']
};
let game={count:2,players:[],draftIndex:0,chosen:new Set(),tiles:[],cols:2,challenger:null,defender:null,duelCategory:null,duelNames:[],winner:null};
let itemQueue=[],itemIndex=0,activePlayer=0,clocks=[45,45],running=false,lastFrame=0,rafId=null,recognition=null,recognitionStarting=false,recognitionWanted=false,processing=false;
function show(id){SCREENS.forEach(s=>$(s).classList.toggle('active',s===id));window.scrollTo(0,0)}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function normalize(s){return s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/(a|an|the)/g,' ').replace(/\s+/g,' ').trim()}
function readyByName(name){return READY_CATEGORIES.find(c=>c.name===name)}
function renderModes(){$('modeGrid').innerHTML=Array.from({length:20},(_,i)=>{let n=i+1;return `<button class="mode-card" data-n="${n}"><strong>${n}</strong>${n===1?'Solo Practice':n===2?'Duel 1v1':'Players'}</button>`}).join('');document.querySelectorAll('.mode-card').forEach(b=>b.onclick=()=>setupPlayers(+b.dataset.n))}
function setupPlayers(count){game.count=count;game.players=Array.from({length:count},(_,i)=>({id:i,name:`PLAYER ${i+1}`,color:COLORS[i],category:null,active:true}));$('playerForm').innerHTML=game.players.map((p,i)=>`<div class="player-row"><button class="player-swatch" data-i="${i}" style="background:${p.color}" aria-label="Change colour"></button><input data-i="${i}" value="${p.name}" maxlength="14"></div>`).join('');document.querySelectorAll('.player-swatch').forEach(b=>b.onclick=()=>{let i=+b.dataset.i,ci=COLORS.indexOf(game.players[i].color);game.players[i].color=COLORS[(ci+1)%COLORS.length];b.style.background=game.players[i].color});show('players')}
function beginDraft(){document.querySelectorAll('#playerForm input').forEach(inp=>game.players[+inp.dataset.i].name=(inp.value.trim()||`PLAYER ${+inp.dataset.i+1}`).toUpperCase());game.draftIndex=0;game.chosen=new Set();renderGenres();renderDraft('Life');show('categories')}
function renderGenres(){$('genreTabs').innerHTML=Object.keys(GENRE_CATALOG).map((g,i)=>`<button class="genre-tab ${i===7?'active':''}" data-g="${g}">${g}</button>`).join('');document.querySelectorAll('.genre-tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.genre-tab').forEach(x=>x.classList.toggle('active',x===b));renderDraft(b.dataset.g)})}
function renderDraft(genre){let p=game.players[game.draftIndex];$('draftPlayer').textContent=p.name;let names=GENRE_CATALOG[genre];$('categoryGrid').innerHTML=names.map(name=>{let ready=readyByName(name);let used=ready&&game.chosen.has(ready.id);return `<button class="category ${ready&&!used?'ready':'locked'}" data-id="${ready&&!used?ready.id:''}"><strong>${name}</strong><small>${ready?(used?'Already chosen':ready.items.length+' local photos'):'Content pack planned'}</small></button>`}).join('');document.querySelectorAll('.category.ready').forEach(b=>b.onclick=()=>chooseCategory(b.dataset.id))}
function chooseCategory(id){let cat=READY_CATEGORIES.find(c=>c.id===id);game.players[game.draftIndex].category=id;game.chosen.add(id);game.draftIndex++;if(game.draftIndex>=game.players.length){buildBoard();game.solo?startSolo():runRandomizer()}else renderDraft('Life')}
function boardShape(n){if(n<=1)return[1,1];let cols=Math.ceil(Math.sqrt(n));return[cols,Math.ceil(n/cols)]}
function buildBoard(){let [cols,rows]=boardShape(game.count);game.cols=cols;game.tiles=game.players.map((p,i)=>({owner:i,category:p.category,index:i}));$('floorBoard').style.gridTemplateColumns=`repeat(${cols},1fr)`}
function activeOwners(){return [...new Set(game.tiles.map(t=>t.owner))]}
function runRandomizer(){show('randomizer');let owners=activeOwners(),ticks=0;let timer=setInterval(()=>{let id=owners[Math.floor(Math.random()*owners.length)];$('randomName').textContent=game.players[id].name;ticks++;if(ticks>16){clearInterval(timer);game.challenger=id;setTimeout(renderBoard,500)}},90)}
function neighbours(index){let c=index%game.cols,r=Math.floor(index/game.cols),out=[];if(c>0)out.push(index-1);if(c<game.cols-1&&index+1<game.tiles.length)out.push(index+1);if(r>0)out.push(index-game.cols);if(index+game.cols<game.tiles.length)out.push(index+game.cols);return out}
function selectableTiles(){let own=game.tiles.map((t,i)=>t.owner===game.challenger?i:-1).filter(i=>i>=0),set=new Set();own.forEach(i=>neighbours(i).forEach(n=>{if(game.tiles[n].owner!==game.challenger)set.add(n)}));return set}
function renderBoard(){show('board');$('challengerName').textContent=game.players[game.challenger].name;let selectable=selectableTiles();$('floorBoard').innerHTML=game.tiles.map((t,i)=>{let p=game.players[t.owner],cat=READY_CATEGORIES.find(c=>c.id===t.category);return `<button class="tile ${selectable.has(i)?'selectable':''}" data-i="${i}" style="background:linear-gradient(145deg,${p.color},#11183f)"><span class="owner">${p.name}</span><span class="cat">${cat?.name||'Category'}</span></button>`}).join('');document.querySelectorAll('.tile.selectable').forEach(b=>b.onclick=()=>challenge(+b.dataset.i));$('boardLegend').innerHTML=activeOwners().map(id=>`<span class="legend-chip" style="background:${game.players[id].color}">${game.players[id].name}</span>`).join('');if(!selectable.size){let others=activeOwners().filter(x=>x!==game.challenger);game.challenger=others[Math.floor(Math.random()*others.length)];setTimeout(renderBoard,300)}}
function challenge(tileIndex){game.defender=game.tiles[tileIndex].owner;game.duelCategory=game.tiles[tileIndex].category;startDuel()}
function startSolo(){game.challenger=0;game.defender=0;game.duelCategory=game.players[0].category;startDuel()}
function startDuel(){stopListening();recognition=null;recognitionStarting=false;let a=game.players[game.challenger],d=game.solo?a:game.players[game.defender],cat=READY_CATEGORIES.find(c=>c.id===game.duelCategory);game.duelNames=game.solo?[a.name,'THE CLOCK']:[a.name,d.name];itemQueue=shuffle(cat.items.length?cat.items:FOOD_ITEMS);itemIndex=0;activePlayer=0;clocks=game.solo?[60,999]:[45,45];running=false;processing=false;$('duelCategory').textContent=cat.name;$('name0').textContent=a.name;$('name1').textContent=game.solo?'SOLO':d.name;$('player1').style.display=game.solo?'none':'';$('beginBtn').style.display='block';$('passBtn').disabled=true;$('manualCorrectBtn').disabled=true;$('voiceStatus').textContent='Tap BEGIN to activate voice';$('heardText').textContent='Your answer will appear here';updateClocks();updateTurn();renderCardBack();show('duel')}
function renderCardBack(){$('promptVisual').innerHTML='<div class="card-back-mark">?</div>';$('promptCard').classList.add('face-down')}
function renderPrompt(){$('promptCard').classList.remove('face-down');let cat=READY_CATEGORIES.find(c=>c.id===game.duelCategory);if(itemIndex>=itemQueue.length){itemQueue=shuffle(cat.items);itemIndex=0}let it=itemQueue[itemIndex];if(Array.isArray(it)){let [visual]=it;$('promptVisual').innerHTML=`<img class="prompt-photo" src="${visual}" alt="Question image">`}else if(it.type==='image'){$('promptVisual').innerHTML=`<img class="prompt-photo" src="${it.src}" alt="Question image">`}else{$('promptVisual').innerHTML=`<div class="${it.type==='question'?'prompt-question':'prompt-text'}">${it.prompt}</div>`}}
function updateTurn(){[0,1].forEach(i=>$(`player${i}`).classList.toggle('active-player',i===activePlayer));$('turnBanner').textContent=game.duelNames[activePlayer]}
function updateClocks(){clocks.forEach((t,i)=>$(`clock${i}`).textContent=String(Math.ceil(Math.max(0,t))))}
function beginDuel(){$('beginBtn').style.display='none';$('passBtn').disabled=false;$('manualCorrectBtn').disabled=false;renderPrompt();running=true;lastFrame=performance.now();recognitionWanted=true;setupRecognition();startListening();tick(lastFrame)}
function tick(now){if(!running)return;let dt=(now-lastFrame)/1000;lastFrame=now;clocks[activePlayer]-=dt;updateClocks();if(clocks[activePlayer]<=0){clocks[activePlayer]=0;updateClocks();game.solo?endSolo():endDuel(1-activePlayer);return}rafId=requestAnimationFrame(tick)}
function setupRecognition(){if(recognition)return;let SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){setVoiceError('Voice recognition is unavailable. Use CORRECT and PASS.');return}recognition=new SR();recognition.lang='en-AU';recognition.interimResults=true;recognition.continuous=false;recognition.maxAlternatives=10;recognition.onstart=()=>{recognitionStarting=false;$('micDot').className='mic-dot listening';$('voiceStatus').textContent='Listening…'};recognition.onresult=e=>{let a=[];for(let i=e.resultIndex;i<e.results.length;i++)for(let j=0;j<e.results[i].length;j++)a.push(e.results[i][j].transcript);if(a.length){$('heardText').textContent=a[0];checkSpeech(a)}};recognition.onerror=e=>{recognitionStarting=false;if(e.error==='not-allowed'||e.error==='service-not-allowed'){recognitionWanted=false;setVoiceError('Microphone permission was blocked. Use CORRECT and PASS.')}};recognition.onend=()=>{recognitionStarting=false;$('micDot').className='mic-dot';if(recognitionWanted&&running&&!processing)setTimeout(startListening,120)}}
function startListening(){if(!recognition||recognitionStarting||!recognitionWanted||!running||processing)return;recognitionStarting=true;try{recognition.start()}catch(e){recognitionStarting=false;if(recognitionWanted&&running)setTimeout(startListening,220)}}
function stopListening(){recognitionWanted=false;recognitionStarting=false;if(recognition)try{recognition.abort()}catch(e){}if($('micDot'))$('micDot').className='mic-dot'}
function setVoiceError(m){$('micDot').className='mic-dot error';$('voiceStatus').textContent=m}
function checkSpeech(alts){if(processing||!running)return;let heard=alts.map(normalize);if(heard.some(t=>t==='pass'||t.endsWith(' pass'))){doPass();return}let current=itemQueue[itemIndex],raw=Array.isArray(current)?current[1]:current.answers;let answers=raw.map(normalize),matched=heard.some(t=>answers.some(a=>t===a||(t.length>=3&&(t.includes(a)||a.includes(t)))||a.split(' ').every(w=>t.split(' ').includes(w))));if(matched)correctAnswer()}
function correctAnswer(){if(processing||!running)return;processing=true;stopListening();$('voiceStatus').textContent='Correct!';$('heardText').textContent='✓ '+(Array.isArray(itemQueue[itemIndex])?itemQueue[itemIndex][1][0]:itemQueue[itemIndex].answers[0]).toUpperCase();setTimeout(()=>{itemIndex++;if(!game.solo)activePlayer=1-activePlayer;updateTurn();renderPrompt();processing=false;recognitionWanted=true;startListening()},420)}
function doPass(){if(processing||!running)return;processing=true;stopListening();clocks[activePlayer]=Math.max(0,clocks[activePlayer]-3);updateClocks();$('passOverlay').classList.remove('hidden');if(clocks[activePlayer]<=0){setTimeout(()=>game.solo?endSolo():endDuel(1-activePlayer),500);return}setTimeout(()=>{$('passOverlay').classList.add('hidden');itemIndex++;renderPrompt();processing=false;recognitionWanted=true;startListening()},900)}
function endSolo(){running=false;processing=false;cancelAnimationFrame(rafId);stopListening();$('winnerName').textContent=game.players[0].name;$('resultCopy').textContent='Solo round complete. Choose another category or play again.';$('continueBoardBtn').textContent='CHOOSE CATEGORY';show('result')}
function endDuel(side){running=false;processing=false;cancelAnimationFrame(rafId);stopListening();$('passOverlay').classList.add('hidden');game.winner=side===0?game.challenger:game.defender;let loser=side===0?game.defender:game.challenger;$('winnerName').textContent=game.players[game.winner].name;$('resultCopy').textContent=`${game.players[game.winner].name} wins and takes all of ${game.players[loser].name}’s territory.`;game.tiles.forEach(t=>{if(t.owner===loser)t.owner=game.winner});game.players[loser].active=false;if(game.winner===game.defender)game.players[game.winner].category=game.players[game.challenger].category;game.challenger=game.winner;$('continueBoardBtn').textContent='CONTINUE';show('result')}
function continueBoard(){if(game.solo){game.draftIndex=0;game.chosen=new Set();renderGenres();renderDraft('Science');show('categories');return}let owners=activeOwners();if(owners.length===1){$('championName').textContent=game.players[owners[0]].name;show('champion')}else{$('decisionWinner').textContent=game.players[game.winner].name;show('hostDecision')}}
$('enterBtn').onclick=()=>show('hostIntro');$('hostContinue').onclick=()=>show('mode');$('toCategoriesBtn').onclick=beginDraft;$('beginBtn').onclick=beginDuel;$('passBtn').onclick=doPass;$('manualCorrectBtn').onclick=correctAnswer;$('continueBoardBtn').onclick=continueBoard;$('stayBtn').onclick=renderBoard;$('returnBtn').onclick=runRandomizer;$('newGameBtn').onclick=()=>show('mode');$('boardQuit').onclick=()=>show('mode');$('quitDuel').onclick=()=>{running=false;cancelAnimationFrame(rafId);stopListening();renderBoard()};document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>show(b.dataset.back));renderModes();
