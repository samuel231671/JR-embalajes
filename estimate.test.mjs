import test from 'node:test';
import assert from 'node:assert/strict';
import { estimate } from '../estimate.js';
import { config } from '../config.js';
import { content } from '../content.js';
const input={product:'pallet',length:120,width:100,height:15,quantity:20,wood:'pine',treatment:'heat',reinforcement:false};
test('scales total by quantity and preserves unit price',()=>{
  const a=estimate(input,config.pricing),b=estimate({...input,quantity:40},config.pricing);
  assert.equal(b.low,a.low*2);assert.equal(b.unit,a.unit);assert.ok(a.high>a.low);
});
test('dimensions and reinforcement affect the estimate',()=>{
  const a=estimate(input,config.pricing);
  assert.ok(estimate({...input,length:200},config.pricing).unit>a.unit);
  assert.ok(estimate({...input,reinforcement:true},config.pricing).unit>a.unit);
});
test('rejects invalid or incomplete dimensions and quantities',()=>{
  for(const changes of [{length:''},{height:0},{width:-3},{quantity:1.5},{quantity:10001},{length:Infinity}])
    assert.equal(estimate({...input,...changes},config.pricing),null);
});
test('does not invent chemical treatment or unknown wood prices',()=>{
  assert.deepEqual(estimate({...input,treatment:'chemical'},config.pricing),{review:true});
  assert.deepEqual(estimate({...input,wood:'advice'},config.pricing),{review:true});
});
test('English and Spanish have matching translation keys and sections',()=>{
  assert.deepEqual(Object.keys(content.es).sort(),Object.keys(content.en).sort());
  for(const key of ['faqs','steps','reasons','galleryNames','galleryAlt'])assert.equal(content.es[key].length,content.en[key].length);
});
