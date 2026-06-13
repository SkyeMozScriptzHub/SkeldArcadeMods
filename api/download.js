const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const rawKey = req.query.file;

  if (!rawKey) {
    return res.status(400).send("Missing file name");
  }

  const fileKey = String(rawKey).normalize("NFKC").trim();
  const filesDir = path.join(process.cwd(), "files");

  if (!fs.existsSync(filesDir)) {
    return res.status(500).send("Files folder not found");
  }

  const foundFile = fs.readdirSync(filesDir).find((file) => {
    if (!file.toLowerCase().endsWith(".zip")) return false;

    const nameWithoutExt = path.parse(file).name;

    return (
      nameWithoutExt.normalize("NFKC").toLowerCase().trim() ===
      fileKey.toLowerCase().trim()
    );
  });

  if (!foundFile) {
    return res.status(404).send("File not found");
  }

  const filePath = path.join(filesDir, foundFile);
  const fileBuffer = fs.readFileSync(filePath);

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${foundFile}"`);
  res.setHeader("Content-Length", fileBuffer.length);
  res.status(200).end(fileBuffer);
};
