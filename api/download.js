import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const rawKey = req.query.file;

  if (!rawKey) {
    return res.status(400).send("Missing file name");
  }

  const fileKey = String(rawKey).trim();

  const filesDir = path.join(process.cwd(), "files");

  if (!fs.existsSync(filesDir)) {
    return res.status(500).send("Files folder not found");
  }

  const foundFile = fs
    .readdirSync(filesDir)
    .find((name) => path.parse(name).name.toLowerCase() === fileKey.toLowerCase() && name.toLowerCase().endsWith(".zip"));

  if (!foundFile) {
    return res.status(404).send("File not found");
  }

  const filePath = path.join(filesDir, foundFile);
  const fileBuffer = fs.readFileSync(filePath);

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${foundFile}"`);
  res.status(200).send(fileBuffer);
}
