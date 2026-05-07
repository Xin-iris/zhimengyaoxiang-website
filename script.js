const grid = document.querySelector("#wovenGrid");
const patternButtons = document.querySelectorAll("[data-pattern]");
const paletteButtons = document.querySelectorAll("[data-palette]");
const useSelect = document.querySelector("#useSelect");
const timeSelect = document.querySelector("#timeSelect");
const price = document.querySelector("#price");
const designName = document.querySelector("#designName");
const designNote = document.querySelector("#designNote");
const saveDesign = document.querySelector("#saveDesign");
const toast = document.querySelector("#toast");

const names = {
  flower: "八角花 · 守护纹",
  butterfly: "蝴蝶 · 纳福纹",
  lion: "狮头 · 辟邪纹",
  field: "田字 · 丰收纹",
};

const notes = {
  flower: "八角花常见于瑶锦几何纹样表达，适合礼盒织片、手账封面和家居装饰。",
  butterfly: "蝴蝶纹在民间寓意纳福与灵动，适合香包、挂件和年轻化配饰。",
  lion: "狮头纹常被解释为守护、辟邪和力量，适合门厅挂画、礼赠和节庆产品。",
  field: "田字纹强调秩序、土地与丰收，适合家居织片、乡村研学纪念品。",
};

const palettes = {
  classic: ["#15233a", "#a92a21", "#fffaf0", "#d7a94d"],
  spring: ["#b51523", "#1d8f49", "#f6efe2", "#0d1b25"],
  festival: ["#ca2f86", "#16a8bd", "#231717", "#f8e5c4"],
  ink: ["#111111", "#f7f2e8", "#111111", "#ffffff"],
};

const patterns = {
  flower: [
    "00011100011100000",
    "00122210122210000",
    "01211121211121000",
    "12133323233312100",
    "01211121211121000",
    "00122210122210000",
    "00011100011100000",
    "00122210122210000",
    "01211121211121000",
    "12133323233312100",
    "01211121211121000",
    "00011100011100000",
  ],
  butterfly: [
    "00010000000010000",
    "00121000000121000",
    "01232100001232100",
    "12303210012303210",
    "00123210123210000",
    "00012323210000000",
    "00001232100000000",
    "00012323210000000",
    "00123210123210000",
    "12303210012303210",
    "01232100001232100",
    "00121000000121000",
  ],
  lion: [
    "00033330333300000",
    "00311113111130000",
    "03122212122213000",
    "31230333303221300",
    "31203310133021300",
    "03123000032130000",
    "00312323213000000",
    "03123000032130000",
    "31203310133021300",
    "31230333303221300",
    "03122212122213000",
    "00033330333300000",
  ],
  field: [
    "11111111111111111",
    "10000001000000101",
    "10222221222220101",
    "10200001000020101",
    "10203333333020101",
    "10203000003020101",
    "10203333333020101",
    "10200001000020101",
    "10222221222220101",
    "10000001000000101",
    "11111111111111111",
    "00000000000000000",
  ],
};

let activePattern = "flower";
let activePalette = "classic";

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderGrid() {
  if (!grid) return;
  grid.innerHTML = "";
  patterns[activePattern].forEach((row) => {
    row.split("").forEach((value) => {
      const cell = document.createElement("span");
      cell.className = "cell";
      cell.style.setProperty("--c", palettes[activePalette][Number(value)]);
      grid.appendChild(cell);
    });
  });
  designName.textContent = names[activePattern];
  designNote.textContent = notes[activePattern];
}

function updatePrice() {
  if (!price || !useSelect || !timeSelect) return;
  const total = 288 + Number(useSelect.value) + Number(timeSelect.value);
  price.textContent = `¥${total}`;
}

patternButtons.forEach((button) => {
  button.addEventListener("click", () => {
    patternButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activePattern = button.dataset.pattern;
    renderGrid();
  });
});

paletteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    paletteButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activePalette = button.dataset.palette;
    renderGrid();
  });
});

[useSelect, timeSelect].forEach((select) => select?.addEventListener("change", updatePrice));

saveDesign?.addEventListener("click", () => {
  const order = {
    pattern: names[activePattern],
    palette: activePalette,
    use: useSelect.options[useSelect.selectedIndex].text,
    time: timeSelect.options[timeSelect.selectedIndex].text,
    price: price.textContent,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem("yunjike-order", JSON.stringify(order));
  showToast("定织单已保存，等待织娘确认。");
});

const reserveForm = document.querySelector("#reserveForm");
const reserveType = document.querySelector("#reserveType");
const reservePeople = document.querySelector("#reservePeople");
const reservePrice = document.querySelector("#reservePrice");

function updateReservePrice() {
  if (!reserveType || !reservePeople || !reservePrice) return;
  const total = Number(reserveType.value) * Number(reservePeople.value || 1);
  reservePrice.textContent = `¥${total}`;
}

[reserveType, reservePeople].forEach((field) => field?.addEventListener("input", updateReservePrice));

reserveForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = {
    name: document.querySelector("#guestName").value,
    phone: document.querySelector("#guestPhone").value,
    type: reserveType.options[reserveType.selectedIndex].text,
    date: document.querySelector("#reserveDate").value,
    people: reservePeople.value,
    note: document.querySelector("#reserveNote").value,
    estimate: reservePrice.textContent,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem("yunjike-reservation", JSON.stringify(data));
  reserveForm.reset();
  reservePeople.value = 2;
  updateReservePrice();
  showToast("预约已保存，稍后由工作人员确认。");
});

renderGrid();
updatePrice();
updateReservePrice();
