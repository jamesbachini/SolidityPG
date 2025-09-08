import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.all("/p", async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: "Missing url query parameter" });
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

const port = 8081;
app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
