import express from 'express';
import multer from 'multer';
import cors from 'cors';

const app = express();
const port = 9100;

const TARGET = "uploads/";
const MAX_FILE = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * The destination folder is hardcoded, but you can pass it from the client
 * The easy way is to get the 'file.fieldname' and then create a folder with it
 */
const destination = (req, file, cb) => cb(null, TARGET);
const filename = (req, file, cb) => cb(null, file.originalname); // You can change the name of output file here

const storage = multer.diskStorage({ destination, filename });

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: MAX_FILE,
    fileSize: MAX_FILE_SIZE,
  }
});

app.use(cors());
app.post("/uploads", upload.array("images", MAX_FILE), (req, res) => {
  try {
    const numFiles = req.files?.length;

    if (numFiles > 0) {
      return res.send({ "done": `Uploaded ${numFiles} image(s) successfully!` });
    }

    res.status(400).send("No files uploaded!");
  } catch (err) {
    if (err instanceof multer.MulterError) { res.status(400).send(err.message); }
    else { res.status(500).send(err.message); }
  }
});

// Start the server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

function fileFilter(req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") { cb(null, true); }
  else { cb(null, false); }
}