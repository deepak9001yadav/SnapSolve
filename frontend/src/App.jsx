import { useState } from "react";
import Camera from "./components/Camera";
import QuestionBox from "./components/QuestionBox";
import ResponseBox from "./components/ResponseBox";
import { askAboutImage } from "./services/api";

export default function App() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /** Called by <Camera> whenever a frame is captured or cleared. */
  const handleCapture = (dataUrl) => {
    setCapturedImage(dataUrl);
    // Reset previous AI response when a new frame is taken
    setAnswer("");
    setError("");
  };

  /** Send image + question to the backend and display the response. */
  const handleAsk = async () => {
    if (!capturedImage || !question.trim()) return;

    setIsLoading(true);
    setError("");
    setAnswer("");

    try {
      const result = await askAboutImage(capturedImage, question);
      setAnswer(result);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">👁️</span>
            <span className="logo-text">
              AI <span className="logo-accent">Vision</span> Assistant
            </span>
          </div>
          <p className="header-sub">
            Point your camera · Capture a frame · Ask anything
          </p>
        </div>
      </header>

      {/* ── Main layout ── */}
      <main className="app-main">
        {/* Left column: camera */}
        <section className="panel panel-camera" aria-label="Camera Feed">
          <h2 className="panel-title">
            <span className="panel-title-icon">📹</span> Live Camera
          </h2>
          <Camera onCapture={handleCapture} />
        </section>

        {/* Right column: Q&A */}
        <section className="panel panel-qa" aria-label="Q&A Panel">
          <h2 className="panel-title">
            <span className="panel-title-icon">🧠</span> Ask the AI
          </h2>

          <QuestionBox
            question={question}
            onChange={setQuestion}
            onSubmit={handleAsk}
            isLoading={isLoading}
            hasImage={!!capturedImage}
          />

          <ResponseBox
            answer={answer}
            isLoading={isLoading}
            error={error}
          />
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        Powered by OpenAI Vision · Built with React + FastAPI
      </footer>
    </div>
  );
}
