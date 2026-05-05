import { useState } from "react";

/**
 * QuestionBox — text input + submit button for asking the AI a question
 * about the captured frame.
 *
 * @param {string}   question      – controlled input value
 * @param {function} onChange      – setter for question state
 * @param {function} onSubmit      – called when the user hits Ask / presses Enter
 * @param {boolean}  isLoading     – disables controls while AI is responding
 * @param {boolean}  hasImage      – whether a frame has been captured yet
 */
export default function QuestionBox({
  question,
  onChange,
  onSubmit,
  isLoading,
  hasImage,
}) {
  const [isListening, setIsListening] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const disabled = isLoading || !hasImage;

  return (
    <div className="question-box">
      <label className="question-label" htmlFor="question-input">
        💬 Ask about what you see
      </label>

      <div className="question-input-row">
        <textarea
          id="question-input"
          className="question-textarea"
          placeholder={
            hasImage
              ? "e.g. What objects are in this image? What color is the shirt?"
              : "Capture a frame first, then type your question here…"
          }
          value={question}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!hasImage || isLoading}
          rows={2}
        />

        <div className="button-group-vertical">
          <button
            className={`btn btn-mic ${isListening ? "active" : ""}`}
            onClick={startListening}
            disabled={disabled || isListening}
            title="Voice Input"
          >
            {isListening ? (
              <span className="mic-pulse">🔴</span>
            ) : (
              <span className="btn-icon">🎤</span>
            )}
          </button>

          <button
            className={`btn btn-ask ${isLoading ? "btn-loading" : ""}`}
            onClick={onSubmit}
            disabled={disabled || !question.trim()}
            id="ask-btn"
          >
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <>
                <span className="btn-icon">✨</span>
                Ask
              </>
            )}
          </button>
        </div>
      </div>

      {!hasImage && (
        <p className="question-hint">
          ☝️ Capture a video frame above before asking a question.
        </p>
      )}
    </div>
  );
}
