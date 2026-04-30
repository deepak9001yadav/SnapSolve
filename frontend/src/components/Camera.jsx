import { useEffect } from "react";
import { useCamera } from "../hooks/useCamera";

/**
 * Camera component — renders the live video feed, a hidden canvas used
 * for frame capture, and the camera control buttons.
 *
 * @param {function} onCapture  – called with the base64 data URL when a frame is captured
 */
export default function Camera({ onCapture }) {
  const {
    videoRef,
    canvasRef,
    isStreaming,
    capturedImage,
    error,
    startCamera,
    stopCamera,
    captureFrame,
    clearCapture,
  } = useCamera();

  // Start camera automatically on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera(); // cleanup on unmount
  }, []);

  const handleCapture = () => {
    const dataUrl = captureFrame();
    if (dataUrl && onCapture) onCapture(dataUrl);
  };

  const handleRetake = () => {
    clearCapture();
    if (onCapture) onCapture(null);
  };

  return (
    <div className="camera-wrapper">
      {/* Error banner */}
      {error && (
        <div className="camera-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Live video feed (hidden once a frame is captured) */}
      <div className={`video-container ${capturedImage ? "hidden" : ""}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="video-feed"
          id="camera-video"
        />
        <div className="video-overlay">
          <div className="scan-line" />
        </div>
      </div>

      {/* Snapshot preview */}
      {capturedImage && (
        <div className="snapshot-container">
          <img src={capturedImage} alt="Captured frame" className="snapshot" />
          <div className="snapshot-badge">📸 Frame Captured</div>
        </div>
      )}

      {/* Hidden canvas used to pull frame pixels */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Controls */}
      <div className="camera-controls">
        {!capturedImage ? (
          <button
            className="btn btn-capture"
            onClick={handleCapture}
            disabled={!isStreaming}
            id="capture-btn"
          >
            <span className="btn-icon">📷</span>
            Capture Frame
          </button>
        ) : (
          <button
            className="btn btn-retake"
            onClick={handleRetake}
            id="retake-btn"
          >
            <span className="btn-icon">🔄</span>
            Retake
          </button>
        )}
      </div>
    </div>
  );
}
