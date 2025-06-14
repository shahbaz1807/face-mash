"use client";

import { useState, useRef, useEffect } from "react";

function RatingPopup({ isOpen, onClose, capturedImage }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowContent(true), 100);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const ratings = [
    { feature: "Eyes", score: Math.floor(Math.random() * 3) + 8 },
    { feature: "Smile", score: Math.floor(Math.random() * 2) + 9 },
    { feature: "Style", score: 10 },
    { feature: "Vibe", score: Math.floor(Math.random() * 2) + 9 },
  ];

  const compliments = [
    "Stunning",
    "Gorgeous",
    "Adorable",
    "Stylish",
    "Cute",
    "Amazing",
  ];
  const messages = [
    "You look absolutely stunning! 😍",
    "Camera loves you! 📸✨",
    "Serving looks today! 💅",
    "Pure perfection! 🔥",
    "You're glowing! ✨",
  ];

  const selectedCompliments = compliments
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  const selectedMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-md transform transition-all duration-500 ${
          showContent ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {/* Glassmorphism popup */}
        <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
          {/* Floating particles inside popup */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute top-4 left-4 w-2 h-2 bg-pink-300/60 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-6 w-1 h-1 bg-purple-300/60 rounded-full animate-bounce"></div>
            <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-blue-300/60 rounded-full animate-ping"></div>
          </div>

          {/* Captured image preview */}
          {capturedImage && (
            <div className="mb-6 flex justify-center">
              <img
                src={capturedImage || "/placeholder.svg"}
                alt="Captured selfie"
                className="w-24 h-32 object-cover rounded-2xl border-2 border-white/40 shadow-lg"
              />
            </div>
          )}

          {/* Rating system */}
          <div className="mb-6">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              Your Selfie Score! 📊
            </h3>
            <div className="space-y-3">
              {ratings.map((rating, index) => (
                <div
                  key={rating.feature}
                  className={`flex justify-between items-center transform transition-all duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-white/90 font-medium">
                    {rating.feature}:
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i < rating.score
                              ? "bg-gradient-to-r from-pink-400 to-purple-500"
                              : "bg-white/20"
                          }`}
                          style={{ animationDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>
                    <span className="text-white font-bold">
                      {rating.score}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliment tags */}
          <div className="mb-6">
            <div className="flex flex-wrap justify-center gap-2">
              {selectedCompliments.map((compliment, index) => (
                <span
                  key={compliment}
                  className={`px-3 py-1 bg-gradient-to-r from-pink-400/30 to-purple-500/30 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20 transform transition-all duration-300 hover:scale-105 animate-bounce`}
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animationDuration: "2s",
                  }}
                >
                  {compliment}
                </span>
              ))}
            </div>
          </div>

          {/* Fun message */}
          <div className="mb-6 text-center">
            <p className="text-white text-lg font-medium animate-pulse">
              {selectedMessage}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 active:scale-95 focus:outline-none focus:ring-4 focus:ring-pink-500/30"
          >
            <span className="inline-block animate-bounce">✨</span> Awesome!{" "}
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "0.1s" }}
            >
              ✨
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CameraPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestCameraPermission = async () => {
    try {
      console.log("🎥 Requesting camera access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 1280 },
        },
        audio: false,
      });

      console.log("✅ Camera permission granted!");
      setPermissionGranted(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsStreaming(true);
          console.log("🔴 Live camera started!");
        };
      }
    } catch (error) {
      console.error("❌ Camera error:", error);
      setPermissionGranted(false);
      setIsStreaming(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;

    setIsCapturing(true);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data (but don't save)
      const imageDataUrl = canvas.toDataURL("image/png", 0.9);
      setCapturedImage(imageDataUrl);

      // Show popup after capture effect
      setTimeout(() => {
        setIsCapturing(false);
        setShowPopup(true);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating blobs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-400/30 to-purple-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/30 to-cyan-500/30 rounded-full blur-xl animate-bounce"></div>
        <div
          className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Camera permission request */}
        {!permissionGranted && (
          <div className="mb-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-md">
              <div className="text-6xl mb-4 animate-bounce">📸</div>
              <h2 className="text-white text-2xl font-bold mb-4">
                Camera Access Required
              </h2>
              <p className="text-white/80 mb-6">
                Click below to start your live camera
              </p>
              <button
                onClick={requestCameraPermission}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/50 active:scale-95"
              >
                🎥 Start Camera
              </button>
            </div>
          </div>
        )}

        {/* Camera container */}
        {permissionGranted && (
          <div className="relative mb-8 transform transition-all duration-700 hover:scale-105">
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-75 animate-pulse"></div>

            {/* Camera frame */}
            <div className="relative bg-black/20 backdrop-blur-sm rounded-3xl p-2 border border-white/20">
              <div className="relative w-72 h-96 md:w-80 md:h-[28rem] rounded-2xl overflow-hidden bg-black">
                {/* Video element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isCapturing ? "brightness-150 contrast-125" : ""
                  }`}
                />

                {/* Capture flash effect */}
                {isCapturing && (
                  <div className="absolute inset-0 bg-white animate-ping opacity-80"></div>
                )}

                {/* Camera overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10"></div>

                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/50 rounded-tl-lg"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/50 rounded-tr-lg"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/50 rounded-bl-lg"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/50 rounded-br-lg"></div>

                {/* Live indicator */}
                {isStreaming && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-xs font-medium">LIVE</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Capture button */}
        {isStreaming && (
          <button
            onClick={capturePhoto}
            disabled={isCapturing}
            className="relative group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/50 active:scale-95 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-pink-500/30"
          >
            {/* Button glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>

            <span className="relative flex items-center space-x-2">
              <span
                className={`transition-transform duration-300 ${
                  isCapturing ? "animate-spin" : "group-hover:rotate-12"
                }`}
              >
                📸
              </span>
              <span>{isCapturing ? "Capturing..." : "Capture"}</span>
              <span
                className={`transition-transform duration-300 ${
                  isCapturing ? "animate-spin" : "group-hover:-rotate-12"
                }`}
              >
                ✨
              </span>
            </span>
          </button>
        )}

        {/* Status text */}
        <p className="mt-4 text-white/70 text-center animate-pulse text-lg">
          {!permissionGranted ? (
            <span className="text-yellow-300">
              🎯 Ready to start your camera!
            </span>
          ) : !isStreaming ? (
            <span className="text-blue-300">🔄 Loading camera...</span>
          ) : (
            <span className="text-green-300">✨ Strike a pose! 💫</span>
          )}
        </p>
      </div>

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Rating popup */}
      <RatingPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        capturedImage={capturedImage}
      />
    </div>
  );
}
