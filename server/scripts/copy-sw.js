// scripts/copy-sw.js
const fs = require("fs");
const path = require("path");

const src = path.resolve(__dirname, "../server/public/serviceWorker.js");
const dest = path.resolve(__dirname, "../client/public/serviceWorker.js");

fs.copyFileSync(src, dest);
console.log("✅ Copied serviceWorker.js to client/public");
