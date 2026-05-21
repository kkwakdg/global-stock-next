const REQUEST_TIMEOUT_MS = 20000;

export async function fetchJsonWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      ...options,
      cache: 'no-store',
      signal: controller.signal,
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || 'Network response was not ok');
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}
