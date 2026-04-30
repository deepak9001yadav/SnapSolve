import { useRef, useState, useCallback } from "react";

/**
 * useCamera — manages webcam stream lifecycle and frame capture.
 * Returns refs for the video element plus helper functions.
 */
export function useCamera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null); // base64 data URL
  const [error, setError] = useState(null);

  /** Start the webcam stream and attach it to the <video> element. */
  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      setIsStreaming(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions.");
      console.error("Camera error:", err);
    }
  }, []);

  /** Stop all video tracks and clean up. */
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  }, [stream]);

  /**
   * Capture the current video frame onto a hidden <canvas>
   * and return it as a base64 JPEG data URL.
   */
  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedImage(dataUrl);
    return dataUrl;
  }, []);

  /** Clear the last captured snapshot. */
  const clearCapture = useCallback(() => setCapturedImage(null), []);

  return {
    videoRef,
    canvasRef,
    isStreaming,
    capturedImage,
    error,
    startCamera,
    stopCamera,
    captureFrame,
    clearCapture,
  };
}
