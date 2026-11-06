const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class El{constructor(){this.value='65';this.style={};this.dataset={};this.listeners={};this.classList={toggle(){}}}setAttribute(){}replaceChildren(){}appendChild(){}addEventListener(k,f){this.listeners[k]=f}blur(){}}
const elements=new Map(),events={};const get=k=>{if(!elements.has(k))elements.set(k,new El());return elements.get(k)};
const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},cancelAndHoldAtTime(){},setTargetAtTime(){}});
class AudioContext{constructor(){this.currentTime=0;this.state='running';this.destination={}}createGain(){return{gain:param(),connect(){},disconnect(){}}}createDynamicsCompressor(){return{connect(){}}}createOscillator(){return{frequency:param(),connect(){},disconnect(){},start(){},stop(){},addEventListener(){}}}}
const context=vm.createContext({AudioContext,document:{querySelector:get,createElement:()=>new El(),addEventListener(){}},window:{addEventListener(k,f){events[k]=f}},console,assert});vm.runInContext(fs.readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1],context);
let passed=0;function test(s){vm.runInContext(s,context);passed++}
const event=code=>({code,preventDefault(){},target:{matches:()=>false,closest:()=>false}});
test('assert.equal(bindings.size,47);assert.equal(computerKeys.size,47);assert.equal(new Set(codes).size,47)');
for(const code of ['KeyZ','KeyA','KeyQ','Digit1'])events.keydown(event(code));
test('assert.equal(held.size,4);assert.equal(new Set([...held.values()].map(v=>v.midi)).size,4)');
events.keydown({...event('KeyZ'),repeat:true});test('assert.equal(held.size,4)');
for(const code of ['KeyZ','KeyA','KeyQ','Digit1'])events.keyup(event(code));
test('assert.equal(held.size,0);assert.ok([...voices].every(v=>v.released))');
events.keydown(event('Space'));events.keydown(event('KeyQ'));events.keyup(event('KeyQ'));
test('assert.ok([...voices].some(v=>!v.released))');events.keyup(event('Space'));test('assert.ok([...voices].every(v=>v.released))');
test("var covered=new Set();for(let b=21;b<=maxBase;b++){setRange(b);for(const m of bindings.values())covered.add(m)}assert.equal(covered.size,88);assert.equal(Math.min(...covered),21);assert.equal(Math.max(...covered),108)");
test("setRange(-100);assert.equal(base,21);assert.equal(bindings.get('KeyZ'),21);assert.equal(document.querySelector('#lower').disabled,true)");
test("setRange(200);assert.equal(base,maxBase);assert.equal(bindings.get('Equal'),108);assert.equal(document.querySelector('#higher').disabled,true)");
test("setRange(36);press('KeyZ',36);latched=true;release('KeyZ');setRange(48);assert.ok([...voices].every(v=>v.released));assert.equal(held.size,0);assert.equal(latched,false)");
events.keydown(event('ArrowLeft'));test('assert.equal(base,36)');events.keydown(event('ArrowRight'));test('assert.equal(base,48)');
events.keydown(event('KeyZ'));events.blur();test('assert.equal(held.size,0);assert.ok([...voices].every(v=>v.released))');
for(const row of vm.runInContext('rows',context))for(const code of row){events.keydown(event(code));events.keyup(event(code))}test('assert.equal(held.size,0);assert.ok([...voices].every(v=>v.released))');
console.log(passed+' passed, 0 failed');
