import multer from "multer";

const fileFilter = (req,file,cb)=>{
    const allowedTypes = ["image/jpeg", "image/png", "image/webp","image/jpg"];

    if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Invalid file type. Only JPEG, JPG, PNG, and WEBP allowed."),
      false
    );
  }
    cb(null, true);
}

const upload = multer({
    storage: multer.memoryStorage(), // store in memory → upload to Cloudinary
    fileFilter,
    limits:{ fileSize: 5 * 1024 * 1024 } //5MB Max
});

export default upload;