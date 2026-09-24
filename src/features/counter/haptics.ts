export function tapFeedback(): void {
  if ('vibrate' in navigator) navigator.vibrate(12);
}
