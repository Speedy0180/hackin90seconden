// ---- Content: voeg je afleveringen hier toe ----
const EPISODES = [
  {
    slug: "wannacry-2017",
    title: "WannaCry (2017) — NSA-lek, 200k systemen plat",
    date: "2017-05-12",
    duration: "90s",
    tags: ["ransomware","NSA","worm"],
    summary: "Wat gebeurde er, hoe verspreidde het zo snel, en 3 lessen om morgen toe te passen.",
    videoEmbed: `<iframe class="video" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="WannaCry" allowfullscreen></iframe>`,
    actions: [
      { label: "Bronnen", href: "https://en.wikipedia.org/wiki/WannaCry_ransomware_attack" }
    ]
  },
  {
    slug: "stuxnet",
    title: "Stuxnet — hoe je centrifuges kapot 'programmeert'",
    date: "2010-06-01",
    duration: "90s",
    tags: ["stuxnet","ics","iran"],
    summary: "Zero-days, PLC’s en fysieke schade: kort en krachtig uitgelegd.",
    videoEmbed: `<iframe class="video" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Stuxnet" allowfullscreen></iframe>`,
    actions: []
  },
  // Voeg hier makkelijk nieuwe afleveringen toe ↑
];

// ---- App logic ----
const $ = sel => document.querySelector(sel);
const grid = $("#grid");
const empty = $("#empty");
const search = $("#search");
const modal = $("#modal");
const modalContent = $("#modalContent");
const closeModal = $("#closeModal");
const year = $("#year");
year.textContent = new Date().getFullYear();

const allTags = [...new Set(EPISODES.flatMap(e => e.tags))].sort();
const tagsEl = $("#tags");
let activeTag = null;

function tagChip(tag){
  const el = document.createElement("button");
  el.className = "tag";
  el.textContent = `#${tag}`;
  el.onclick = () => {
    activeTag = (activeTag === tag) ? null : tag;
    render();
  };
  return el;
}

function card(ep){
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <div class="meta">${new Date(ep.date).toLocaleDateString("nl-NL")} · ${ep.duration} · ${ep.tags.map(t=>`#${t}`).join(" ")}</div>
    <h3>${ep.title}</h3>
    <p>${ep.summary}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn" data-slug="${ep.slug}">Bekijk aflevering</button>
      ${ep.actions.map(a=>`<a class="btn secondary" href="${a.href}" target="_blank" rel="noopener">${a.label}</a>`).join("")}
    </div>
  `;
  el.querySelector("button[data-slug]").onclick = () => openModal(ep);
  return el;
}

function openModal(ep){
  modalContent.innerHTML = `
    <h3>${ep.title}</h3>
    <div class="meta">${new Date(ep.date).toLocaleDateString("nl-NL")} · ${ep.duration} · ${ep.tags.map(t=>`#${t}`).join(" ")}</div>
    <div style="margin:12px 0 16px">${ep.videoEmbed}</div>
    <p>${ep.summary}</p>
  `;
  modal.showModal();
}
closeModal.onclick = () => modal.close();
modal.addEventListener("click", (e)=>{ if (e.target === modal) modal.close(); });

function render(){
  // tags
  tagsEl.innerHTML = "";
  const allBtn = document.createElement("button");
  allBtn.className = "tag" + (activeTag ? "" : " active");
  allBtn.textContent = "#alles";
  allBtn.onclick = () => { activeTag = null; render(); };
  tagsEl.appendChild(allBtn);
  allTags.forEach(t=>{
    const el = tagChip(t);
    if (activeTag === t) el.classList.add("active");
    tagsEl.appendChild(el);
  });

  // filter
  const q = search.value.trim().toLowerCase();
  const list = EPISODES.filter(ep => {
    const hitText = [ep.title, ep.summary, ...ep.tags].join(" ").toLowerCase().includes(q);
    const hitTag = !activeTag || ep.tags.includes(activeTag);
    return hitText && hitTag;
  });

  // render
  grid.innerHTML = "";
  list.forEach(ep => grid.appendChild(card(ep)));
  empty.classList.toggle("hidden", list.length>0);
}

search.addEventListener("input", render);
render();

// Over modal
const overModal = document.getElementById("overModal");
const openOver = document.getElementById("openOver");
const closeOver = document.getElementById("closeOver");

openOver.addEventListener("click", () => overModal.showModal());
closeOver.addEventListener("click", () => overModal.close());
overModal.addEventListener("click", e => { if(e.target === overModal) overModal.close(); });

