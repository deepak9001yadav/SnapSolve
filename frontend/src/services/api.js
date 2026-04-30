const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * askAboutImage — sends an image (base64 data URL) + question to the backend
 * and returns the AI-generated answer string.
 *
 * @param {string} imageDataUrl  – full data URL: "data:image/jpeg;base64,..."
 * @param {string} question      – user's natural-language question
 * @returns {Promise<string>}    – AI response text
 */
export async function askAboutImage(imageDataUrl, question) {
  // Strip the "data:image/...;base64," prefix — send only the raw base64 bytes
  const base64Data = imageDataUrl.split(",")[1];

  const response = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Data, question }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.detail || `Server error: ${response.status}`
    );
  }

  const data = await response.json();
  return data.answer;
}
