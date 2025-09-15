import React, { useState, useRef } from "react";
import { useReports } from "./ReportsContext";


export default function Working() {
  const [images, setImages] = useState([]);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const {reports, setReports} = useReports();
  const [reportCounter , setReportCounter] = useState([]);
  const [customIssueType, setCustomIssueType] = useState("");


  // Handle gallery image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...uploadedImages]);
  };


  // Open device camera
  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or not available!");
    }
  };


  // Capture image from video stream
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const imageUrl = canvas.toDataURL("image/png");
    setImages((prev) => [...prev, imageUrl]);
    stopCamera();
  };


  // Stop camera stream
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };


  // Handle report submission
  const handleSubmit = (e) => {
    e.preventDefault();


    if (!description || !issueType || !department || !location) {
      alert("Please fill all required fields!");
      return;
    }

    const finalIssueType = issueType === "Other" ? customIssueType : issueType;
    const newId = reports.length + 1;
    const formatId = newId.toString().padStart(5 , "0");

    const newReport = {
      id: formatId,
      images,
      description,
      issueType : finalIssueType,
      department,
      location,
    };

    setReportCounter(reportCounter + 1);

    setReports((prev) => [newReport, ...prev]);


    // Reset form fields
    setImages([]);
    setDescription("");
    setIssueType("");
    setDepartment("");
    setLocation("");
  };


  return (
    <section className="px-6 py-12 bg-gray-50 min-h-screen" id="working">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-green-700">
        Report an Issue
      </h2>
      <p className="text-center text-gray-600 mt-2">
        Upload images, describe the issue, and submit directly to authorities.
      </p>


      <div className="mt-8 max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="text-gray-700 font-semibold">Add Photos:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="border border-gray-300 rounded-lg px-4 py-2 cursor-pointer"
            />
            <button
              type="button"
              onClick={handleTakePhoto}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Take Photo
            </button>
          </div>


          {/* Live Camera Stream */}
          {cameraStream && (
            <div className="mt-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="rounded-lg shadow-md w-full"
              ></video>
              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Capture
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}


          {/* Issue Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full border border-gray-300 rounded-lg p-3"
          />


          {/* Issue Type */}
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
          >
            <option value="">Select Issue Type</option>
            <option>Broken Street Light</option>
            <option>Garbage Overflow</option>
            <option>Road Blockage</option>
            <option>Waterlogging</option>
            <option>Illegal Parking</option>
            <option>Drainage Issue</option>
            <option value="Other">Other</option>
          </select>

          
          {issueType === "Other" && (
            <input
            type="text"
            value  = {customIssueType}
            onChange={(e) => setCustomIssueType(e.target.value)}
            placeholder="Describe your issue type..."
            className="w-full border border-gray-300 rounded-lg p-3 mt-2"
            />

            
  )}

          {/* Department */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
          >
            <option value="">Select Department</option>
            <option>PWD</option>
            <option>Electricity</option>
            <option>Municipality</option>
            <option>Sanitation</option>
            <option>Traffic</option>
          </select>


          {/* Manual Location */}
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location or address"
            className="w-full border border-gray-300 rounded-lg p-3"
          />


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Submit Report
          </button>
        </form>
      </div>


      {/* Submitted Reports */}
      {reports.length > 0 && (
        <div className="mt-10 max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-green-700 mb-4">
            Submitted Reports
          </h3>
          <div className="space-y-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
              >
                {/* Images */}
                {report.images.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto mb-3">
                    {report.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Uploaded"
                        className="h-24 w-24 object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                )}
                <p className="text-blue-700">Report ID:#{report.id}</p>
                <p className="text-gray-700">
                  <strong>Description:</strong> {report.description}
                </p>
                <p>
                  <strong>Issue:</strong> {report.issueType}
                </p>
                <p>
                  <strong>Department:</strong> {report.department}
                </p>
                <p>
                  <strong>Location:</strong> {report.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}