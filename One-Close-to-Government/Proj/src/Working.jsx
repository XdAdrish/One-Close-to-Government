import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { FiMic, FiPauseCircle, FiPlayCircle } from "react-icons/fi";
import { useReports } from "./ReportsContext"; // make sure this path matches your project


export default function Working() {
  const { getToken } = useAuth();
  // Context (global reports)
  const { reports, setReports } = useReports(); // <-- uses global context
const [reportCounter , setReportCounter] = useState([]);
  const [customIssueType, setCustomIssueType] = useState("");

  // Image states
  const [images, setImages] = useState([]); // preview URLs
  const [rawFiles, setRawFiles] = useState([]); // actual File objects to send to backend


  // Camera
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);


  // Form fields
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");


  // Audio (voice note)
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);


  // ======= Utility: stop camera =======
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
  };


  // ======= Handle gallery image upload =======
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;


    // create preview URLs
    const uploadedPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...uploadedPreviews]);


    // keep real files for backend
    setRawFiles((prev) => [...prev, ...files]);
  };


  // ======= Camera handling =======
  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied or not available!");
    }
  };


  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const imageUrl = canvas.toDataURL("image/png");


    setImages((prev) => [...prev, imageUrl]);


    // convert dataURL to Blob -> File so backend can receive it
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `img_${Date.now()}.png`, { type: "image/png" });
        setRawFiles((prev) => [...prev, file]);
      })
      .catch((err) => {
        console.error("Error converting captured image:", err);
      });


    stopCamera();
  };


  // ======= Voice recording with pause/resume/stop =======
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];


      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };


      mediaRecorder.onstop = () => {
        const audio = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(audio);
        // stop microphone tracks so mic isn't left open
        stream.getTracks().forEach((t) => t.stop());
      };


      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      alert("Microphone access denied or not available!");
      console.error(err);
    }
  };


  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };


  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };


  const stopRecording = () => {
    if (mediaRecorderRef.current && (mediaRecorderRef.current.state === "recording" || mediaRecorderRef.current.state === "paused")) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };


  const playAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.play();
    }
  };


  // ======= Submit report =======
  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!description || !issueType || !department || !location) {
      alert("Please fill all required fields!");
      return;
    }

    const finalIssueType = issueType === "Other" ? customIssueType : issueType;
    // create a formatted report id (00001)
    const newId = Array.isArray(reports) ? reports.length + 1 : 1;
    const formatId = String(newId).padStart(5 , "0");


    // prepare local preview object (images = preview URLs, voiceNote preview if recorded)
    const localReport = {
      id: formatId,
      description,
      issueType: finalIssueType,
      department,
      location,
      images: images.slice(), // preview URLs
      voiceNote: audioBlob ? URL.createObjectURL(audioBlob) : null,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

     setReportCounter(reportCounter + 1);


    // Immediately update global context so dashboards see it
    setReports((prev = []) => [localReport, ...prev]);


    // Prepare FormData for backend (if backend exists)
    try {
      const formData = new FormData();
      formData.append("reportId", formatId);
      formData.append("description", description);
      formData.append("issueType", finalIssueType);
      formData.append("department", department);
      formData.append("location", location);


      // append image files
      rawFiles.forEach((file, idx) => {
        // ensure each file has a filename unique / tied to report id
        const filename = file.name || `img_${formatId}_${Date.now()}_${idx}.png`;
        formData.append("images", file, filename);
      });


      // append audio if available
      if (audioBlob) {
        formData.append("voiceNote", audioBlob, `voice_${formatId}.webm`);
      }


      // POST to backend with Clerk token
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });


      if (res.ok) {
        const savedReport = await res.json();
        // replace the local preview report with server-supplied object (image URLs etc)
        setReports((prev = []) =>
          prev.map((r) => (r.id === formatId ? savedReport : r))
        );
      } else {
        // backend not available or returned error — keep local report (we already added)
        console.warn("Backend returned non-OK response when submitting report.");
      }
    } catch (err) {
      // network/backend error — keep local report and warn
      console.warn("Could not POST to backend (network or server down).", err);
    }


    // reset form UI
    setImages([]);
    setRawFiles([]);
    setDescription("");
    setIssueType("");
    setDepartment("");
    setLocation("");
    setAudioBlob(null);
  };


  // cleanup on unmount: stop camera + stop recorder (if active)
  useEffect(() => {
    return () => {
      stopCamera();
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // safe reports for display (from context)
  const safeReports = Array.isArray(reports) ? reports : [];


  return (
    <section className="px-6 py-12 pt-28 bg-gray-50 min-h-screen" id="working">
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


          {/* Voice Note Recording (icons) */}
          <div className="flex items-center gap-4">
            {!isRecording && (
              <button
                type="button"
                onClick={startRecording}
                className="text-green-600 text-3xl"
                title="Start Recording"
              >
                <FiMic />
              </button>
            )}


            {isRecording && !isPaused && (
              <button
                type="button"
                onClick={pauseRecording}
                className="text-yellow-600 text-3xl"
                title="Pause Recording"
              >
                <FiPauseCircle />
              </button>
            )}


            {isRecording && isPaused && (
              <button
                type="button"
                onClick={resumeRecording}
                className="text-blue-600 text-3xl"
                title="Resume Recording"
              >
                <FiPlayCircle />
              </button>
            )}


            {isRecording && (
              <button
                type="button"
                onClick={stopRecording}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                Stop
              </button>
            )}


            {audioBlob && (
              <button
                type="button"
                onClick={playAudio}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg"
              >
                ▶️ Play Voice Note
              </button>
            )}
          </div>


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


      {/* Submitted Reports (from context) */}
      {safeReports.length > 0 && (
        <div className="mt-10 max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-green-700 mb-4">
            Submitted Reports
          </h3>
          <div className="space-y-6">
            {safeReports.map((report) => (
              <div
                key={report.id}
                className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
              >
                {/* Images */}
                {report.images && report.images.length > 0 && (
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
                {report.voiceNote && (
                  <audio controls src={report.voiceNote} className="mt-2 w-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}