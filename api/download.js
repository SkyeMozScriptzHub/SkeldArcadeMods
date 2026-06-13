import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const fileKey = req.query.file;

  const files = {
    Marathon: "Marathon.zip",
    FarmXp: "FarmXp.zip",
    ExtremeChaos: "ExtremeChaos.zip",
  };

  const filename = files[fileKey];

  if (!filename) {
    return res.status(404).send("File not found");
  }

  const filePath = path.join(process.cwd(), "files", filename);

  const fileBuffer = fs.readFileSync(filePath);

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );

  res.send(fileBuffer);
}
