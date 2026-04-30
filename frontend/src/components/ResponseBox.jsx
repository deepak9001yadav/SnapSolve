/**
 * ResponseBox — displays the AI's answer (or an error), with a subtle
 * entrance animation when new content arrives.
 *
 * @param {string}  answer    – AI response text (null/empty = idle)
 * @param {boolean} isLoading – shows skeleton pulse while waiting
 * @param {string}  error     – error message if the API call failed
 */
export default function ResponseBox({ answer, isLoading, error }) {
  if (!isLoading && !answer && !error) {
    return (
      <div className="response-box response-idle">
        <div className="idle-icon">🤖</div>
        <p className="idle-text">
          AI response will appear here after you ask a question.
        </p>
      </div>
    );
  }

  return (
    <div className="response-box">
      <div className="response-header">
        <span className="response-label">🤖 AI Response</span>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="response-loading">
          <div className="skeleton skeleton-line long" />
          <div className="skeleton skeleton-line medium" />
          <div className="skeleton skeleton-line short" />
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="response-error">
          <span className="error-icon">❌</span>
          <span>{error}</span>
        </div>
      )}

      {/* Success — AI answer */}
      {answer && !isLoading && (
        <div className="response-content">
          <p className="response-text">{answer}</p>
        </div>
      )}
    </div>
  );
}
