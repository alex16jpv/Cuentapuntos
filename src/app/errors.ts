const EVENT = 'mi-bastidor:write-error';

export function reportWriteError(error: unknown): void {
  console.error(error);
  window.dispatchEvent(new Event(EVENT));
}

export function onWriteError(listener: () => void): () => void {
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

export function runWrite(write: Promise<unknown>): void {
  write.catch(reportWriteError);
}
