import multer from 'multer';

const config: multer.Options = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_, file, callback) => {
    const allowedMime = 'application/pdf';

    if (file.mimetype === allowedMime) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type'));
    }
  },
};

export default config;
