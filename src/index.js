import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { WispServer } from "@mercuryworkshop/wisp-js/server";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8080;

const app = Fastify({ logger: false });

// Serve static files
await app.register(fastifyStatic, {
  root: join(__dirname, "../static"),
  prefix: "/",
});

// Serve Scramjet assets from node_modules
await app.register(fastifyStatic, {
  root: join(__dirname, "../node_modules/@mercuryworkshop/scramjet/dist"),
  prefix: "/scramjet/",
  decorateReply: false,
});

// Serve bare-mux assets
await app.register(fastifyStatic, {
  root: join(__dirname, "../node_modules/@mercuryworkshop/bare-mux/dist"),
  prefix: "/baremux/",
  decorateReply: false,
});

// Serve libcurl-transport assets
await app.register(fastifyStatic, {
  root: join(__dirname, "../node_modules/@mercuryworkshop/libcurl-transport/dist"),
  prefix: "/libcurl/",
  decorateReply: false,
});

// SPA fallback — always return index.html
app.setNotFoundHandler((_req, reply) => {
  reply.sendFile("index.html");
});

// Build the raw HTTP server so we can handle WebSocket upgrades for Wisp
const server = createServer(app.server ? undefined : app.routing);

const wispServer = new WispServer({ logLevel: 0 });

// Start
await app.ready();

const httpServer = createServer((req, res) => {
  app.routing(req, res);
});

httpServer.on("upgrade", (req, socket, head) => {
  if (req.url?.startsWith("/wisp/")) {
    wispServer.routeRequest(req, socket, head);
  } else {
    socket.destroy();
  }
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`
  ░█▀█░█▀▄░█▀▄░▀█▀░▀█▀
  ░█░█░█▀▄░█▀▄░░█░░░█░
  ░▀▀▀░▀░▀░▀▀░░▀▀▀░░▀░

  🌑 Orbit v2 running on http://localhost:${PORT}
  ⚡ Engine: Scramjet (Wisp transport)
  `);
});
