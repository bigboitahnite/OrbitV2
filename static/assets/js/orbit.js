/* =====================
   ORBIT v2 — Main Script
   Proxy engine: Scramjet
   ===================== */

// ── Starfield ──
(function () {
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let stars = [];
  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  function initStars() {
    stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2, alpha: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.015 + 0.003, phase: Math.random() * Math.PI * 2,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000;
    for (const s of stars) {
      const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed * 10 + s.phase));
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,190,255,${a})`; ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener("resize", () => { resize(); initStars(); });
  resize(); initStars(); draw();
})();

// ── Scramjet Service Worker Registration ──
(async function registerSW() {
  if (!navigator.serviceWorker) {
    console.warn("Service Workers not supported — proxy may not work.");
    return;
  }
  try {
    await navigator.serviceWorker.register("/scramjet/sw.js", { scope: "/scramjet/" });
    console.log("🚀 Scramjet SW registered");
  } catch (e) {
    console.error("SW registration failed:", e);
  }
})();

// ── bare-mux + libcurl transport setup ──
async function setupTransport() {
  try {
    if (typeof BareMux !== "undefined" && typeof LibcurlTransport !== "undefined") {
      const transport = new LibcurlTransport.LibcurlTransport();
      await BareMux.SetTransport(transport, "/wisp/");
      console.log("⚡ libcurl transport connected via Wisp");
    }
  } catch (e) {
    console.warn("Transport setup failed:", e);
  }
}
setupTransport();

// ── Page Navigation ──
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");

function goToPage(name) {
  pages.forEach(p => p.classList.remove("active"));
  navLinks.forEach(l => l.classList.remove("active"));
  document.getElementById(`page-${name}`)?.classList.add("active");
  document.querySelector(`[data-page="${name}"]`)?.classList.add("active");
}

navLinks.forEach(link => {
  link.addEventListener("click", e => { e.preventDefault(); goToPage(link.dataset.page); });
});

// ── Proxy ──
function normalizeURL(input) {
  input = input.trim();
  if (!input) return null;
  const isURL = /^(https?:\/\/|www\.)/.test(input) || /\.[a-z]{2,}(\/|$)/i.test(input);
  return isURL
    ? (input.startsWith("http") ? input : `https://${input}`)
    : `https://www.google.com/search?q=${encodeURIComponent(input)}`;
}

function scramjetEncode(url) {
  // Scramjet uses /scramjet/ prefix with encoded URL
  try {
    return `/scramjet/${btoa(url)}`;
  } catch {
    return `/scramjet/${encodeURIComponent(url)}`;
  }
}

function launchProxy() {
  const raw = document.getElementById("proxy-input").value;
  const url = normalizeURL(raw);
  if (!url) return;

  const container = document.getElementById("proxy-frame-container");
  const iframe = document.getElementById("proxy-iframe");
  const display = document.getElementById("frame-url-display");

  iframe.src = scramjetEncode(url);
  display.textContent = url;
  container.style.display = "block";
  container.scrollIntoView({ behavior: "smooth" });
}

function closeFrame() {
  document.getElementById("proxy-iframe").src = "about:blank";
  document.getElementById("proxy-frame-container").style.display = "none";
}

document.getElementById("proxy-input").addEventListener("keydown", e => {
  if (e.key === "Enter") launchProxy();
});

// ── Games ──
const games = [
  { name: "1v1.LOL",        emoji: "🎯", tag: "Battle",   url: "https://1v1.lol" },
  { name: "Agar.io",        emoji: "🦠", tag: "Survival", url: "https://agar.io" },
  { name: "Slither.io",     emoji: "🐍", tag: "Arcade",   url: "https://slither.io" },
  { name: "Krunker",        emoji: "🔫", tag: "FPS",      url: "https://krunker.io" },
  { name: "Shell Shockers", emoji: "🥚", tag: "FPS",      url: "https://shellshock.io" },
  { name: "Mope.io",        emoji: "🦁", tag: "Survival", url: "https://mope.io" },
  { name: "Paper.io",       emoji: "📄", tag: "Strategy", url: "https://paper-io.com" },
  { name: "Diep.io",        emoji: "💣", tag: "Arcade",   url: "https://diep.io" },
  { name: "2048",           emoji: "🔢", tag: "Puzzle",   url: "https://2048.la" },
  { name: "Slope",          emoji: "⛷️", tag: "Arcade",   url: "https://slope-game.com" },
  { name: "Run 3",          emoji: "🏃", tag: "Endless",  url: "https://www.coolmathgames.com/0-run-3" },
  { name: "Geometry Dash",  emoji: "🎵", tag: "Rhythm",   url: "https://www.geometrydash.io" },
  { name: "Minecraft",      emoji: "⛏️", tag: "Sandbox",  url: "https://classic.minecraft.net" },
  { name: "Friday Night",   emoji: "🎤", tag: "Rhythm",   url: "https://fridaynightfunkin.net" },
  { name: "Tetris",         emoji: "🟪", tag: "Classic",  url: "https://tetris.com/play-tetris" },
  { name: "Wordle",         emoji: "🟩", tag: "Word",     url: "https://www.nytimes.com/games/wordle" },
  { name: "Chess",          emoji: "♟️", tag: "Strategy", url: "https://chess.com" },
  { name: "Skribbl",        emoji: "✏️", tag: "Party",    url: "https://skribbl.io" },
  { name: "Gartic Phone",   emoji: "📞", tag: "Party",    url: "https://garticphone.com" },
  { name: "Among Us",       emoji: "👾", tag: "Party",    url: "https://www.innersloth.com" },
];

// ── Apps ──
const apps = [
  { name: "YouTube",   emoji: "▶️",  tag: "Video",  url: "https://youtube.com" },
  { name: "Discord",   emoji: "💬",  tag: "Chat",   url: "https://discord.com/app" },
  { name: "Reddit",    emoji: "🤖",  tag: "Social", url: "https://reddit.com" },
  { name: "Twitter/X", emoji: "✖️",  tag: "Social", url: "https://twitter.com" },
  { name: "Spotify",   emoji: "🎵",  tag: "Music",  url: "https://open.spotify.com" },
  { name: "Instagram", emoji: "📸",  tag: "Social", url: "https://instagram.com" },
  { name: "TikTok",    emoji: "🎬",  tag: "Video",  url: "https://tiktok.com" },
  { name: "Twitch",    emoji: "🟣",  tag: "Stream", url: "https://twitch.tv" },
  { name: "Netflix",   emoji: "🎞️", tag: "Stream", url: "https://netflix.com" },
  { name: "Google",    emoji: "🔍",  tag: "Search", url: "https://google.com" },
  { name: "GitHub",    emoji: "🐙",  tag: "Dev",    url: "https://github.com" },
  { name: "ChatGPT",   emoji: "🤖",  tag: "AI",     url: "https://chat.openai.com" },
];

// ── Render Cards ──
function renderCards(data, gridId) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = "";
  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.name = item.name.toLowerCase();
    card.innerHTML = `
      <div class="card-thumb">${item.emoji}</div>
      <div class="card-info">
        <div class="card-name">${item.name}</div>
        <div class="card-tag">${item.tag}</div>
      </div>`;
    card.addEventListener("click", () => {
      goToPage("proxy");
      document.getElementById("proxy-input").value = item.url;
      setTimeout(launchProxy, 100);
    });
    grid.appendChild(card);
  });
}

renderCards(games, "games-grid");
renderCards(apps,  "apps-grid");

function filterCards(query, gridId) {
  const q = query.toLowerCase();
  document.querySelectorAll(`#${gridId} .card`).forEach(card => {
    card.style.display = card.dataset.name.includes(q) ? "" : "none";
  });
}

// ── Tab Cloak ──
function toggleCloak() {
  const title = prompt("Fake tab title (blank to reset):", document.title);
  if (title !== null) document.title = title || "Orbit";
}

// ── About:Blank ──
function aboutBlank() {
  const w = window.open("about:blank", "_blank");
  const doc = w.document;
  doc.open();
  doc.write(`<!DOCTYPE html><html><head><title>New Tab</title>
  <style>body{margin:0;background:#fff}iframe{width:100vw;height:100vh;border:none}</style></head>
  <body><iframe src="${location.href}"></iframe></body></html>`);
  doc.close();
}
