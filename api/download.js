import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const fileKey = req.query.file;

  const filePath = path.join(
    process.cwd(),
    "files",
    `${fileKey}.zip`
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  const fileBuffer = fs.readFileSync(filePath);

  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${fileKey}.zip"`
  );

  res.status(200).send(fileBuffer);
}
