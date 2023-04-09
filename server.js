const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8077;

// Enable CORS
app.use(cors());

// Set the MIME types
app.use(
  express.static("dist/goldencross", {
    setHeaders: (res, filePath) => {
      if (path.extname(filePath) === ".css") {
        res.setHeader("Content-Type", "text/css");
      } else if (path.extname(filePath) === ".js") {
        res.setHeader("Content-Type", "application/javascript");
      } else if (path.extname(filePath) === ".ico") {
        res.setHeader("Content-Type", "image/x-icon");
      }
    },
  })
);

// Serve the Angular app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/goldencross", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
