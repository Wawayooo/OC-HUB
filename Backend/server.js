const { Hono } = require("hono");
const { serve } = require("@hono/node-server");
const { serveStatic } = require("@hono/node-server/serve-static");
const fs = require("fs");
const path = require("path");

const app = new Hono();

app.get("/", (c) => {
  const filePath = path.join(__dirname, "../Frontend", "login_page.html");
  console.log("📂 Attempting to load:", filePath);
  try {
    const html = fs.readFileSync(filePath, "utf8");
    console.log("✅ HTML successfully loaded");
    return c.html(html);
  } catch (err) {
    console.error("❌ Error loading HTML:", err.message);
    return c.text("Internal Server Error", 500);
  }
});

app.use("/*", serveStatic({ root: "../Frontend" }));

serve(app, (info) => {
  console.log(`🚀 Server running at http://localhost:${info.port}`);
});
