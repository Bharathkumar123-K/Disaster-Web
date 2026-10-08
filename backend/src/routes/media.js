const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ClassifiedEvent = require('../models/ClassifiedEvent');

const uploadsDir = path.join(__dirname, '../../uploads/incidents');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '_' + Math.floor(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `incident_${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm'
  ];
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, MP4, and WEBM files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter
});

// Middleware helper to execute multer and handle errors cleanly
const handleUploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, error: 'File size exceeds 50MB limit' });
      }
      return res.status(400).json({ success: false, error: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
};

// POST /api/incidents/upload-media (or standalone upload)
router.post('/upload-media', handleUploadMiddleware, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file provided for upload' });
  }

  const fileType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
  const url = `/uploads/incidents/${req.file.filename}`;
  const mediaId = `med_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const mediaObj = {
    mediaId,
    url,
    type: fileType,
    originalName: req.file.originalname,
    uploadedAt: new Date()
  };

  return res.json({
    success: true,
    mediaId: mediaObj.mediaId,
    url: mediaObj.url,
    type: mediaObj.type,
    originalName: mediaObj.originalName,
    data: mediaObj
  });
});

// POST /api/incidents/:incidentId/media (attach to specific incident)
router.post('/:incidentId/media', handleUploadMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file provided for upload' });
    }

    const { incidentId } = req.params;
    let event = null;
    if (incidentId && incidentId !== 'upload-media' && incidentId !== 'upload') {
      event = await ClassifiedEvent.findById(incidentId);
    }

    const fileType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    const url = `/uploads/incidents/${req.file.filename}`;
    const mediaId = `med_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const mediaObj = {
      mediaId,
      url,
      type: fileType,
      originalName: req.file.originalname,
      uploadedAt: new Date()
    };

    if (event) {
      if (!event.mediaEvidence) event.mediaEvidence = [];
      event.mediaEvidence.push(mediaObj);
      event.mediaUrl = url;
      await event.save();
    }

    return res.json({
      success: true,
      mediaId: mediaObj.mediaId,
      url: mediaObj.url,
      type: mediaObj.type,
      originalName: mediaObj.originalName,
      data: mediaObj,
      event: event || null
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  mediaRouter: router,
  handleUploadMiddleware
};
