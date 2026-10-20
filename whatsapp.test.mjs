import test from 'node:test';
import assert from 'node:assert/strict';
import {whatsappUrl,requestMessage} from '../whatsapp.js';
const data={name:'José & Ana',company:'Maderas Ñ',phone:'+506 8888 8888',email:'qa@example.com'};
test('WhatsApp encodes accents, ampersands, multiline text and contact details',()=>{
  const text=requestMessage({language:'es',type:'quote',data,details:'120 × 100 × 15 cm\n20 unidades'});
  const url=new URL(whatsappUrl('50600000000',text));
  assert.equal(url.hostname,'wa.me');
  assert.equal(url.searchParams.get('text'),text);
  assert.match(text,/José & Ana de la empresa Maderas Ñ/);
  assert.match(text,/cotización personalizada/);
  assert.match(text,/qa@example.com/);
  assert.match(text,/120 × 100 × 15 cm/);
});
test('distinguishes in-person, virtual and contact inquiries in both languages',()=>{
  for(const [type,es,en] of [['physical','visita física','in-person'],['virtual','visita virtual','virtual visit'],['contact','consulta de contacto','general inquiry']]){
    assert.ok(requestMessage({language:'es',type,data}).includes(es));
    assert.ok(requestMessage({language:'en',type,data}).includes(en));
  }
});
test('omits empty optional company without undefined text',()=>{
  const text=requestMessage({language:'es',type:'contact',data:{...data,company:''}});
  assert.ok(!text.includes('undefined'));assert.ok(!text.includes('de la empresa'));
});
test('normalizes international numbers and rejects invalid numbers',()=>{
  assert.ok(whatsappUrl('+506 0000-0000','Hola').startsWith('https://wa.me/50600000000?'));
  for(const n of ['','123','javascript:alert(1)','0000'])assert.throws(()=>whatsappUrl(n,'Hi'));
});
