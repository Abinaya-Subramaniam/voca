export function speak(text, onEnd) {
  if (!text || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.9
  utterance.pitch = 1.1
  utterance.volume = 1
  if (onEnd) utterance.onend = onEnd
  window.speechSynthesis.speak(utterance)
}

export function cancelSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel()
}

export function isSpeechSupported() {
  return 'speechSynthesis' in window
}