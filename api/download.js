import fs from "fs";
import path from "path";

function normalize(name) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-zA-Z0-9]/g, "-")   // EVERYTHING → dash
    .replace(/-+/g, "-")             // collapse ---
    .toLowerCase()
    .replace(/^-|-$/g, "");          // trim dashes
}

export default function handler(req, res) {
  const rawKey = req.query.file;

  if (!rawKey) return res.status(400).send("Missing file");

  const fileKey = normalize(rawKey);
  const filesDir = path.join(process.cwd(), "files");

  if (!fs.existsSync(filesDir)) {
    return res.status(500).send("Files folder not found");
  }

  const foundFile = fs.readdirSync(filesDir).find(file => {
    if (!file.toLowerCase().endsWith(".zip")) return false;

    const name = path.parse(file).name;
    return normalize(name) === fileKey;
  });

  if (!foundFile) {
    return res.status(404).send("File not found");
  }

  const filePath = path.join(filesDir, foundFile);
  const data = fs.readFileSync(filePath);

  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${foundFile}"`
  );

  res.status(200).end(data);
}
