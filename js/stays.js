'use strict';
// null means unverified, never unavailable. Resolve these fields with the owner
// before treating results as guaranteed occupancy or amenity matches.
const stays = [
  {id:'pine',name:'松園',en:'Pine Garden',area:'bay',station:'弁天町',folder:'stay-05_Pine Garden',photo:1,capacity:5,url:'pine2025'},
  {id:'literature',name:'文園',en:'Literature Garden',area:'bay',station:'弁天町',folder:'stay-04_Literature Garden',photo:1,capacity:6,url:'literaturegarden'},
  {id:'tea',name:'茶園',en:'Tea Garden',area:'south',station:'天下茶屋',folder:'stay-01_Tea Garden',photo:3,capacity:5,url:'teagarden2024'},
  {id:'art',name:'芸',en:'Art Home',area:'bay',station:'朝潮橋',folder:'stay-03_Art Home',photo:5,capacity:null,url:'arthome2025'},
  {id:'furukawa',name:'古川の家',en:'Furukawa House',area:'kaizuka',station:'三ツ松',folder:'stay-06_Furukawa House',photo:8,capacity:null,url:'furukawa'},
  {id:'zen',name:'禪園',en:'Zen Garden',area:'south',station:'花園町',folder:'stay-02_Zen Garden',photo:1,capacity:null,url:'zen2025'},
  {id:'harmony',name:'和の園',en:'Harmony Garden',area:'bay',station:'弁天町',folder:'stay-07_Harmony Garden',photo:1,capacity:5,url:'2026harmony'}
].map(stay=>({...stay,amenities:{kitchen:null,laundry:null,bath:null,parking:null}}));
const $=id=>document.getElementById(id);
const form=$('filters'),dialog=$('dialog');
const i18n=window.YuseiI18n;
let resultMode='preview'; // 'preview' | 'filtered' | 'all'
let lastRenderedItems=stays.slice(0,3);
let dialogContext=null; // {type:'stay',stay} | {type:'faqContact',kind} | {type:'inquiry'}
function ages(){
  const previous=[...$('ages').querySelectorAll('select')].map(el=>el.value);
  const count=Number($('children').value);
  $('ages').replaceChildren();
  for(let i=0;i<count;i++){
    const label=document.createElement('label');label.textContent=i18n.t('ages.label',{n:i+1});
    const select=document.createElement('select');select.setAttribute('aria-describedby','age-note');
    select.add(new Option(i18n.t('ages.selectPlaceholder'),''));
    for(let age=0;age<=17;age++)select.add(new Option(i18n.t('ages.optionYears',{age}),String(age)));
    select.value=previous[i]||'';label.append(select);$('ages').append(label);
  }
  $('age-note').hidden=count===0;
}
function syncSteppers(){document.querySelectorAll('[data-step]').forEach(button=>{const [id,delta]=button.dataset.step.split(':');const input=$(id);button.disabled=Number(delta)<0?Number(input.value)<=Number(input.min):Number(input.value)>=Number(input.max);});}
document.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>{const [id,delta]=button.dataset.step.split(':');const input=$(id);input.value=Math.min(Number(input.max),Math.max(Number(input.min),(Number(input.value)||Number(input.min))+Number(delta)));if(id==='children')ages();syncSteppers();}));
['adults','children'].forEach(id=>$(id).addEventListener('change',()=>{const input=$(id);input.value=Math.min(Number(input.max),Math.max(Number(input.min),Math.trunc(Number(input.value)||0)));if(id==='children')ages();syncSteppers();}));
function render(items){
  lastRenderedItems=items;
  $('cards').replaceChildren();
  for(const stay of items){
    const card=document.createElement('article');card.className='card';
    const img=document.createElement('img');img.src=`assets/properties/${stay.folder}/room_picture_${stay.photo}.jpeg`;img.alt=i18n.t('card.imageAlt',{name:stay.name});img.loading='lazy';
    const body=document.createElement('div');body.className='card-body';
    const title=document.createElement('h3');title.textContent=stay.name;const en=document.createElement('small');en.textContent=stay.en;title.append(en);
    const bottom=document.createElement('div');bottom.className='card-bottom';
    const location=document.createElement('span');location.textContent=`⌖ ${i18n.station(stay.station)}`;
    const button=document.createElement('button');button.type='button';button.textContent=i18n.t('cta.viewDetails');button.setAttribute('aria-label',i18n.t('card.detailsAriaLabel',{name:stay.name}));button.addEventListener('click',()=>details(stay));
    bottom.append(location,button);body.append(title,bottom);card.append(img,body);$('cards').append(card);
  }
  if(!items.length){const p=document.createElement('p');p.className='empty';p.textContent=i18n.t('results.empty');$('cards').append(p);}
}
function updateResultStatus(){
  if(resultMode==='filtered')$('result-status').textContent=i18n.t('results.status.candidates',{count:lastRenderedItems.length});
  else if(resultMode==='all')$('result-status').textContent=i18n.t('results.status.all',{count:stays.length});
  else $('result-status').textContent=i18n.t('results.status.initial');
}
function updateFilterNote(){
  if(resultMode==='filtered'){$('filter-note').hidden=false;$('filter-note').textContent=i18n.t('filters.note');}
  else $('filter-note').hidden=true;
}
form.addEventListener('submit',event=>{
  event.preventDefault();resultMode='filtered';
  const selected=[...form.querySelectorAll('[name=amenity]:checked')].map(input=>input.value);
  // Child occupancy rules are not approved. Do not infer that every child uses
  // an adult bed; retain these candidates for individual confirmation.
  const list=stays.filter(stay=>(!$('area').value||stay.area===$('area').value)&&(stay.capacity===null||stay.capacity>=Number($('adults').value))&&selected.every(key=>stay.amenities[key]!==false));
  render(list);$('show-all').hidden=true;updateResultStatus();
  updateFilterNote();
});
form.addEventListener('reset',()=>{setTimeout(()=>{resultMode='preview';$('ages').replaceChildren();ages();syncSteppers();render(stays.slice(0,3));$('show-all').hidden=false;updateFilterNote();updateResultStatus();},0);});
$('show-all').addEventListener('click',()=>{resultMode='all';render(stays);$('show-all').hidden=true;updateResultStatus();});
function openDialog(title){$('dialog-title').textContent=title;$('dialog-body').replaceChildren();dialog.showModal();}
function paragraph(text){const p=document.createElement('p');p.textContent=text;$('dialog-body').append(p);}
function bookingLink(stay){const a=document.createElement('a');a.className='primary';a.href=`https://www.airbnb.com/h/${stay.url}`;a.target='_blank';a.rel='noopener noreferrer';a.textContent=i18n.t('dialog.stay.airbnbLink',{name:stay.name});$('dialog-body').append(a);}
function renderStayDetails(stay){
  dialogContext={type:'stay',stay};
  openDialog(`${stay.name} · ${stay.en}`);
  paragraph(i18n.t('dialog.stay.station',{station:i18n.station(stay.station)}));
  paragraph(i18n.t('dialog.stay.airbnbNote'));
  bookingLink(stay);
}
function details(stay){renderStayDetails(stay);}
$('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
function renderFaqContact(kind){
  dialogContext={type:'faqContact',kind};
  openDialog(kind==='faq'?i18n.t('nav.faq'):i18n.t('nav.contact'));
  paragraph(i18n.t('dialog.stays.faqContactBody'));
  for(const stay of stays)bookingLink(stay);
}
document.querySelectorAll('[data-info]').forEach(button=>button.addEventListener('click',()=>{renderFaqContact(button.dataset.info==='faq'?'faq':'contact');}));
/* TEMP DISABLED: stay-date/calendar inquiry feature is not implemented yet (no availability/booking
   integration). Everything below that depends on #dates, #checkin or #checkout is block-commented
   so it can be restored later without rewriting it from scratch.

function localDate(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
$('checkin').min=localDate(new Date());$('checkout').min=localDate(new Date());
$('checkin').addEventListener('change',()=>{const date=new Date(`${$('checkin').value}T12:00:00`);if(!Number.isNaN(date.valueOf())){date.setDate(date.getDate()+1);$('checkout').min=localDate(date);}validateDates();});
function validateDates(){$('checkout').setCustomValidity($('checkin').value&&$('checkout').value&&$('checkout').value<=$('checkin').value?i18n.t('dates.validity.checkoutAfterCheckin'):'');}
$('checkout').addEventListener('change',validateDates);
function renderInquiry(){
  dialogContext={type:'inquiry'};
  openDialog(i18n.t('dialog.inquiry.title'));
  paragraph(i18n.t('dialog.inquiry.intro'));
  const text=document.createElement('textarea');text.readOnly=true;text.setAttribute('aria-label',i18n.t('dialog.inquiry.textareaAriaLabel'));
  const childAges=[...$('ages').querySelectorAll('select')].map(el=>el.value===''?i18n.t('ages.unselected'):i18n.t('ages.optionYears',{age:el.value}));
  const agesText=childAges.length?i18n.t('inquiry.agesWrapper',{list:childAges.join(i18n.t('inquiry.listSeparator'))}):'';
  const lines=[
    i18n.t('inquiry.intro'),
    i18n.t('inquiry.line.checkin',{value:$('checkin').value}),
    i18n.t('inquiry.line.checkout',{value:$('checkout').value}),
    i18n.t('inquiry.line.adults',{count:$('adults').value}),
    i18n.t('inquiry.line.children',{count:$('children').value,ages:agesText}),
    i18n.t('inquiry.question')
  ];
  text.value=lines.join('\n');
  $('dialog-body').append(text);
  const copy=document.createElement('button');copy.className='outline';copy.textContent=i18n.t('inquiry.copyButton');
  copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text.value);copy.textContent=i18n.t('inquiry.copied');}catch{text.focus();text.select();copy.textContent=i18n.t('inquiry.copyFallback');}});
  $('dialog-body').append(copy);
  paragraph(i18n.t('inquiry.chooseStay'));for(const stay of stays)bookingLink(stay);
}
$('dates').addEventListener('submit',event=>{
  event.preventDefault();validateDates();if(!$('dates').reportValidity()||!form.reportValidity())return;
  renderInquiry();
});
*/
document.addEventListener('yusei:langchange',()=>{
  ages();syncSteppers();updateResultStatus();updateFilterNote();
  render(lastRenderedItems);
  if(dialog.open&&dialogContext){
    if(dialogContext.type==='stay')renderStayDetails(dialogContext.stay);
    else if(dialogContext.type==='faqContact')renderFaqContact(dialogContext.kind);
    /* TEMP DISABLED: inquiry dialog re-render skipped while the date feature is disabled. */
  }
});
$('year').textContent=new Date().getFullYear();ages();syncSteppers();render(stays.slice(0,3));updateResultStatus();
