# 🌑 Orbit v2

Dark web proxy powered by **Scramjet** + Wisp transport. No card required to deploy.

---

## What's different from v1

| | v1 | v2 |
|---|---|---|
| Engine | Ultraviolet (deprecated) | **Scramjet** (active) |
| Transport | Bare Server | **Wisp / libcurl** |
| Server | Express | **Fastify** |
| CAPTCHA support | ❌ | ✅ |

---

## Deploy to Leapcell (free, no card)

1. Go to [leapcell.io](https://leapcell.io) → sign up with GitHub
2. Click **New Project** → **Import from GitHub**
3. Select your `orbit` repo
4. It auto-detects the Dockerfile — hit **Deploy**
5. Done ✅ — you get a free `*.leapcell.dev` URL

---

## Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/orbit
cd orbit
npm install
npm start
# → http://localhost:8080
```

> Requires Node.js 18+, python3, make, g++ (for native Scramjet deps)
> On Mac: `xcode-select --install`
> On Ubuntu: `sudo apt install python3 make g++`

---

## How it works

- **Scramjet** rewrites page content inside a Service Worker so the network sees normal requests
- **Wisp protocol** multiplexes TCP connections over a single WebSocket — looks like regular traffic
- **libcurl transport** handles the encrypted fetch layer between the SW and Wisp server

---

## Credits

Built on [Scramjet](https://github.com/MercuryWorkshop/scramjet) by Mercury Workshop
and the [Titanium Network](https://github.com/titaniumnetwork-dev) ecosystem.
