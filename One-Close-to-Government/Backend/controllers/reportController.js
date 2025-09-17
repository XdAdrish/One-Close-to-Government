import Report from "../models/reportModel.js";

// Create report (accepts multipart form-data)
export const createReport = async (req, res) => {
  try {
    // Multer places files on req.files when using upload.fields
    const imageFiles = (req.files?.images || []).map((f) => {
      // server serves /uploads statically, store web path
      return `/uploads/${f.filename}`;
    });
    const voiceFile = Array.isArray(req.files?.voiceNote) && req.files.voiceNote.length > 0
      ? `/uploads/${req.files.voiceNote[0].filename}`
      : undefined;

    const report = await Report.create({
      user: req.auth.userId,
      description: req.body.description,
      issueType: req.body.issueType,
      department: req.body.department,
      location: req.body.location,
      images: imageFiles,
      voiceNote: voiceFile,
      status: "Pending",
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: "Failed to create report", error: err.message });
  }
};

// Get reports for logged-in user
export const getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.auth.userId });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports", error: err.message });
  }
};

// Admin: get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all reports", error: err.message });
  }
};

// Admin: update status
export const updateReportStatus = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Failed to update report", error: err.message });
  }
};
