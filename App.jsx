import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

export default function App() {
  const videoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      setModelsLoaded(true);
    };
    loadModels();
    startVideo();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => (videoRef.current.srcObject = stream))
      .catch((err) => console.error(err));
  };

  const captureFace = async () => {
    if (!modelsLoaded) return;
    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      await axios.post("http://localhost:5000/mark-attendance", {
        studentId: "<student_id_here>"
      });
      alert("Attendance Marked!");
    } else {
      alert("Face not recognized");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">AI Attendance System</h1>
      <video ref={videoRef} autoPlay muted width="400" height="300" />
      <button onClick={captureFace} className="bg-blue-500 text-white p-2 mt-2">
        Mark Attendance
      </button>
    </div>
  );
}
