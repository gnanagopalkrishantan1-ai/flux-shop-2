const prices = { tech70: 69.99, basicfit: { '1m': 29.99, '1y': 249.99 }, redbull: 1.99 };

const state = {
tech70: false,
basicfit: { active: false, duration: '1m' },
redbull: { qty: 1, addedCount: 0 }
};

const fmt = (n) => n.toFixed(2).replace('.', ',') + ' €';

function toggleTech70(){
if(state.tech70) return;
state.tech70 = true;
const btn = document.getElementById('btn-tech70');
btn.disabled = true;
btn.innerText = 'Ajouté ✓';
showToast('Tech70 ajouté au panier');
renderHud();
}

function selectDuration(d){
state.basicfit.duration = d;
document.getElementById('seg-1m').classList.toggle('active', d === '1m');
document.getElementById('seg-1y').classList.toggle('active', d === '1y');
document.getElementById('basicfit-price').innerText = fmt(prices.basicfit[d]);
document.getElementById('basicfit-period').innerText = d === '1m' ? 'par mois' : 'par an';
if(state.basicfit.active) renderHud();
}

function toggleBasicfit(){
if(state.basicfit.active) return;
state.basicfit.active = true;
const btn = document.getElementById('btn-basicfit');
btn.disabled = true;
btn.innerText = 'Abonné ✓';
showToast('Abonnement Basicfit activé');
renderHud();
}

function changeQty(delta){
state.redbull.qty = Math.max(1, Math.min(99, state.redbull.qty + delta));
document.getElementById('redbull-qty').innerText = state.redbull.qty;
document.getElementById('redbull-price').innerText = fmt(prices.redbull * state.redbull.qty);
}

function addRedbull(){
state.redbull.addedCount += state.redbull.qty;
showToast(state.redbull.qty + ' Red Bull ajoutée(s)');
renderHud();
}

function renderHud(){
const itemsEl = document.getElementById('hud-items');
const items = [];
let total = 0;

if(state.tech70){
items.push(['Tech70', prices.tech70]);
total += prices.tech70;
}
if(state.basicfit.active){
const label = 'Basicfit · ' + (state.basicfit.duration === '1m' ? '1 Mois' : '1 An');
items.push([label, prices.basicfit[state.basicfit.duration]]);
total += prices.basicfit[state.basicfit.duration];
}
if(state.redbull.addedCount > 0){
const sub = prices.redbull * state.redbull.addedCount;
items.push(['Red Bull ×' + state.redbull.addedCount, sub]);
total += sub;
}

itemsEl.innerHTML = items.length
? items.map(([label, price]) => `<div class="flex justify-between"><span>${label}</span><span class="font-mono text-ink">${fmt(price)}</span></div>`).join('')
: '<p class="text-xs italic">Aucun article pour le moment.</p>';

document.getElementById('hud-total').innerText = fmt(total);
document.getElementById('nav-cart-count').innerText = items.length;
document.getElementById('checkout-btn').disabled = items.length === 0;

const hud = document.getElementById('cart-hud');
hud.classList.add('pulse-once');
setTimeout(() => hud.classList.remove('pulse-once'), 450);

if(items.length > 0) document.getElementById('hud-body').classList.remove('hidden');
}

function toggleHud(){
document.getElementById('hud-body').classList.toggle('hidden');
}

function checkout(){
showToast('Commande simulée — merci !');
}

let toastTimer;
function showToast(text){
const toast = document.getElementById('toast');
document.getElementById('toast-text').innerText = text;
toast.classList.remove('opacity-0', 'translate-y-[-10px]');
clearTimeout(toastTimer);
toastTimer = setTimeout(() => {
toast.classList.add('opacity-0', 'translate-y-[-10px]');
}, 2200);
}

// Marque que le JS a bien chargé (active l'effet de reveal en CSS)
document.body.classList.add('js-ready');

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
