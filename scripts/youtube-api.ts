/** Shared YouTube Data API v3 caller for the sync/enrich scripts. */
const API_BASE = "https://www.googleapis.com/youtube/v3";

/** Thrown when the YouTube API reports quota exhaustion (403 quotaExceeded). */
export class QuotaExceededError extends Error {}

export async function callYoutubeApi<T>(
  endpoint: string,
  params: Record<string, string>,
  apiKey: string
): Promise<T> {
  const url = new URL(`${API_BASE}/${endpoint}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  if (response.status === 403) {
    const body = await response.text();
    if (body.includes("quotaExceeded")) {
      throw new QuotaExceededError(`YouTube API quota exceeded calling ${endpoint}`);
    }
  }
  if (!response.ok) {
    throw new Error(`YouTube API ${endpoint} failed: ${response.status} ${await response.text()}`);
  }
  return (await response.json()) as T;
}
