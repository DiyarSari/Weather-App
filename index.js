const Key = "112f58c0e2626c1a33d65b1be13336e9";
const Lang = "tr";
const Units = "metric";

const Pop = ["İstanbul","Ankara","İzmir","Bursa","Antalya","Adana","Trabzon","Gaziantep","Kayseri","Konya","Mersin","Diyarbakır","Tekirdağ"];

const Provinces = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir",
  "Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli",
  "Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari",
  "Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir",
  "Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir",
  "Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat",
  "Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman",
  "Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce"
];

let i = 0;
let Batch = 12;

if (window.innerWidth <= 700) {
  Batch = 8;
}


const form = document.querySelector("#searchForm");
const input = document.querySelector("#searchInput");
const popularButtons = document.querySelector("#popularButtons");
const grid = document.querySelector("#provinceGrid");
const info = document.querySelector("#gridInfo");
const moreButton = document.querySelector("#loadMore");
const details = document.querySelector("#details");
const dTitle = document.querySelector("#detailsTitle");
const closeButton = document.querySelector("#closeDetails");
const nowBox = document.querySelector("#currentBox");
const fBox = document.querySelector("#forecast5Box");


function icon(iconCode){
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

async function jsonFetch(url){
  const response = await fetch(url);
  if(!response.ok) throw new Error("İstek hatası: " + response.status);
  return await response.json();
}

async function geo(city){
  const q = encodeURIComponent(city);
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${q},TR&limit=1&appid=${Key}`;
  const data = await jsonFetch(url);
  if(!data || data.length === 0) return null;
  return { name: data[0].name, lat: data[0].lat, lon: data[0].lon };
}

async function current(lat, lon){
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Key}&lang=${Lang}&units=${Units}`;
  return await jsonFetch(url);
}

async function forecast(city){
  const q = encodeURIComponent(city);
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${q},TR&appid=${Key}&lang=${Lang}&units=${Units}`;
  return await jsonFetch(url);
}

function popularTag(city){
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = city;
  b.onclick = () => openCity(city);
  return b;
}

function gridCard(name, c){
  const temp = Math.round(c.main.temp);
  const iconCode = c.weather?.[0]?.icon || "01d";
  const description = c.weather?.[0]?.description || "-";

  const d = document.createElement("div");
  d.className = "gridCard";
  d.innerHTML = `
    <div class="gridLine">
      <div class="iconWrap">
        <img src="${icon(iconCode)}" width="42" height="42" alt="icon">
        <div style="min-width:0">
          <div class="provName">${name}</div>
          <div class="miniInfo">${description}</div>
        </div>
      </div>
      <div class="temp">${temp}°</div>
    </div>
  `;
  d.onclick = () => openCity(name);
  return d;
}

function renderNow(name, c){
  const temp = Math.round(c.main.temp);
  const feels = Math.round(c.main.feels_like);
  const desc = c.weather?.[0]?.description || "-";
  const ic = c.weather?.[0]?.icon || "01d";
  const wind = Math.round(c.wind?.speed ?? 0);
  const hum = c.main?.humidity ?? 0;

  nowBox.innerHTML = `
    <div>
      <div style="font-weight:800;font-size:16px">${name}</div>
      <div style="opacity:.8;font-size:12px;margin-top:2px">${desc}</div>
      <div style="opacity:.8;font-size:12px;margin-top:2px">Hissedilen: ${feels}°C • 💨 ${wind} m/s • 💧 %${hum}</div>
    </div>
    <div style="text-align:right">
      <div style="font-weight:900;font-size:28px;line-height:1">${temp}°C</div>
      <img src="${icon(ic)}" width="60" height="60" alt="icon">
    </div>
  `;
}

function forecast5Days(list){ 
  if(!Array.isArray(list) || list.length=== 0) return [];

  const picked = [];
  const seen = new Set();

  for(const x of list){
    const dt = new Date(x.dt * 1000);
    const dayKey = dt.toISOString().slice(0,10);
    const hour = dt.getHours();

    if(seen.has(dayKey)) continue;
    if(hour !== 9 && hour !== 12 && hour !== 15)continue;

    seen.add(dayKey);
    picked.push(x);
    if(picked.length === 5) break;
  }

  if(picked.length < 5){
    for(let idx = 0; idx < list.length && picked.length < 5; idx += 8){
      const x = list[idx];
      const dt = new Date(x.dt * 1000);
      const dayKey = dt.toISOString().slice(0,10);
      if(seen.has(dayKey)) continue;
      seen.add(dayKey);
      picked.push(x);
    }
  }

  return picked.slice(0,5);
}

function renderForecast5(data){
  fBox.innerHTML = "";
  if(!data?.list) return;

  const items = forecast5Days(data.list);

  items.forEach(x => {
    const date = new Date(x.dt * 1000);
    const day = date.toLocaleDateString("tr-TR", { weekday: "short" });
    const ic = x.weather?.[0]?.icon || "01d";
    const desc = x.weather?.[0]?.description || "-";
    const temp = Math.round(x.main.temp);

    const d = document.createElement("div");
    d.className = "day";
    d.innerHTML = `
      <b>${day}</b>
      <img src="${icon(ic)}" width="45" height="45" alt="icon">
      <div><b>${temp}°C</b></div>
      <div style="opacity:.8;font-size:12px">${desc}</div>
    `;
    fBox.appendChild(d);
  });
}

async function openCity(city){
  details.classList.remove("hidden");
  dTitle.textContent = city + " - Detay";
  nowBox.textContent = "Yükleniyor...";
  fBox.innerHTML = "";

  try{
    const loc = await geo(city);
    if(!loc){
      nowBox.textContent = "Şehir bulunamadı";
      return;
    }

    const c = await current(loc.lat, loc.lon);
    renderNow(loc.name, c);

    const f = await forecast(loc.name);
    renderForecast5(f);

    details.scrollIntoView({ behavior: "smooth", block: "start" });
  }catch(e){
    nowBox.textContent = "Hata: " + e.message;
  }
}

async function loadPopular(){
  popularButtons.innerHTML = "";
  Pop.forEach(city => {
    popularButtons.appendChild(popularTag(city));
  });
}

async function loadMore(){
  const left = Provinces.length - i;

  if(left <= 0){
    info.textContent = "Hepsi yüklendi";
    moreButton.style.display = "none";
    return;
  }

  moreButton.disabled = true;
  info.textContent = `Yüklendi: ${i}/${Provinces.length}`;

  const slice = Provinces.slice(i, i + Batch);
  i += slice.length;

  for(const city of slice){
    try{
      const loc = await geo(city);
      if(!loc) continue;
      const c = await current(loc.lat, loc.lon);
      grid.appendChild(gridCard(loc.name, c));
    }catch(_){}
  }

  info.textContent = `Yüklendi: ${i}/${Provinces.length}`;
  moreButton.disabled = false;

  if(i >= Provinces.length){
    info.textContent = "Hepsi yüklendi";
    moreButton.style.display = "none";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if(city){ 
    openCity(city);
  }
});

closeButton.onclick = () => details.classList.add("hidden");
moreButton.onclick = loadMore;

(async function(){
  await loadPopular();
  await loadMore();
})();
