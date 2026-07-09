import { Router } from "express";
import multer from "multer";
import { authMiddleware, adminMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// Configure multer for video upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // 5GB max
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only video files are allowed."));
    }
  },
});

// Upload video
router.post(
  "/video",
  authMiddleware,
  adminMiddleware,
  upload.single("video"),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No video file provided" });
      }

      // In production: send to FFmpeg worker for HLS processing
      // and upload to Cloudflare R2
      const uploadId = `upload-${Date.now()}`;

      res.json({
        success: true,
        data: {
          uploadId,
          filename: req.file.originalname,
          size: req.file.size,
          status: "processing",
          message: "Video queued for HLS processing",
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Upload poster/thumbnail
router.post(
  "/image",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No image file provided" });
      }

      // In production: upload to Cloudflare R2
      res.json({
        success: true,
        data: {
          url: `/uploads/${req.file.originalname}`,
          filename: req.file.originalname,
          size: req.file.size,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get upload status
router.get("/status/:uploadId", authMiddleware, async (req, res) => {
  // In production: check FFmpeg queue / Redis for real status
  res.json({
    success: true,
    data: {
      uploadId: req.params.uploadId,
      status: "processing",
      progress: 45,
      resolutions: ["360p", "480p", "720p", "1080p"],
      currentResolution: "720p",
    },
  });
});

export { router as uploadRoutes };
