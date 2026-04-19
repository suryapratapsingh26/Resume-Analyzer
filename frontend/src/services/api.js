const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

async function readJsonOrText(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  try {
    const text = await res.text();
    return text ? { error: text } : null;
  } catch {
    return null;
  }
}

export async function uploadResume(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: form,
  });
  const data = (await readJsonOrText(res)) || {};
  if (!res.ok) {
    return {
      error: data.error || `Failed to upload (HTTP ${res.status})`,
      details: data,
    };
  }
  return data;
}

export async function queryResume(q) {
  const res = await fetch(`${API_BASE}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q }),
  });
  const data = (await readJsonOrText(res)) || {};
  if (!res.ok) {
    return {
      error: data.error || `Failed to query (HTTP ${res.status})`,
      details: data,
    };
  }
  return data;
}
