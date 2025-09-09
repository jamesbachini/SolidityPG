import express from "express";
import cors from "cors";

/*
mkdir proxy
nano proxy.mjs
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash
// exit and reload shell
nvm install 22.19.0
nvm use 22.19.0
crontab -e
@reboot cd /home/jimbachini/proxy && /home/jimbachini/.nvm/versions/node/v22.19.0/bin/node /home/jimbachini/proxy/proxy.mjs >> /home/jimbachini/proxy/cron.log 2>&1
*/

const app = express();
app.use(cors());
app.use(express.json());

// Define allowed hosts
const ALLOWED_HOSTS = [
  'api.openai.com',
  'api.anthropic.com', 
  'generativelanguage.googleapis.com'
];

// Function to validate if URL is allowed
function isUrlAllowed(url) {
  try {
    const urlObj = new URL(url);
    return ALLOWED_HOSTS.includes(urlObj.hostname);
  } catch (error) {
    return false;
  }
}

app.all("/p", async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: "Missing url query parameter" });
    }

    // Validate that the target URL is allowed
    if (!isUrlAllowed(targetUrl)) {
      return res.status(403).json({ 
        error: "Access denied. URL not in allowed hosts list.",
        allowedHosts: ALLOWED_HOSTS
      });
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined, // strip host to avoid mismatch
      },
      body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
    });

    // Add CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");

    // Stream back
    res.status(response.status);
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const port = 80;
app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
  console.log(`Allowed hosts: ${ALLOWED_HOSTS.join(', ')}`);
});