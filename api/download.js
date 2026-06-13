import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const rawKey = req.query.file;

  if (!rawKey) return res.status(400).send("Missing file");

  const fileKey = String(rawKey).toLowerCase().trim();
  const filesDir = path.join(process.cwd(), "files");

  const foundFile = fs.readdirSync(filesDir).find(file => {
    return (
      file.toLowerCase().endsWith(".zip") &&
      path.parse(file).name.toLowerCase().trim() === fileKey
    );
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
