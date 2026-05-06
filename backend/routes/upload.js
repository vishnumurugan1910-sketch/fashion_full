const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_BASE_URL = process.env.UPLOAD_BASE_URL || 'http://localhost:5000';

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configure multer for different entities
const createStorage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `${uploadDir}/${folder}`;
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'));
};

// Upload endpoints for different entities
const uploadFields = [
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'banner', maxCount: 1 },
  { name: 'avatar', maxCount: 1 }
];

// Generic upload endpoint
router.post('/image', (req, res) => {
  const storage = createStorage('images');
  const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter
  });
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      url: `${UPLOAD_BASE_URL}/uploads/images/${req.file.filename}`,
      filename: req.file.filename
    });
  });
});

// Upload multiple images
router.post('/images', (req, res) => {
  const storage = createStorage('images');
  const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter
  });
  
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    res.json({
      images: req.files.map(file => ({
        url: `${UPLOAD_BASE_URL}/uploads/images/${file.filename}`,
        filename: file.filename
      }))
    });
  });
});

// Product image upload
router.post('/product', (req, res) => {
  const storage = createStorage('products');
  const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter
  });
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      url: `${UPLOAD_BASE_URL}/uploads/products/${req.file.filename}`,
      filename: req.file.filename
    });
  });
});

// Category image upload
router.post('/category', (req, res) => {
  const storage = createStorage('categories');
  const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter
  });
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      url: `${UPLOAD_BASE_URL}/uploads/categories/${req.file.filename}`,
      filename: req.file.filename
    });
  });
});

// Banner image upload
router.post('/banner', (req, res) => {
  const storage = createStorage('banners');
  const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter
  });
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      url: `${UPLOAD_BASE_URL}/uploads/banners/${req.file.filename}`,
      filename: req.file.filename
    });
  });
});

// Story image upload
router.post('/story', (req, res) => {
  const storage = createStorage('stories');
  const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter
  });
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      url: `${UPLOAD_BASE_URL}/uploads/stories/${req.file.filename}`,
      filename: req.file.filename
    });
  });
});

// User avatar upload
router.post('/avatar', (req, res) => {
  const storage = createStorage('avatars');
  const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for avatars
    fileFilter
  });
  
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      url: `${UPLOAD_BASE_URL}/uploads/avatars/${req.file.filename}`,
      filename: req.file.filename
    });
  });
});

module.exports = router;
