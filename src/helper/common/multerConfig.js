import multer from "multer";
import path from "path";
import fs from "fs";


 
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    const folderName = req.params.type;
    const uploadPath = path.join("assets", folderName);
     if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueName =
        Date.now() +
        "_" +
        Math.random().toFixed(9) +
        path.extname(file.originalname);
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid =
      allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
      allowedTypes.test(file.mimetype);
    if (isValid) cb(null, true);
    else cb(new Error("Only image files are allowed!"));
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });

  
  export default upload;
