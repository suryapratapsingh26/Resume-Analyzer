import React, { useState } from "react";
import { queryResume } from "../services/api";

export default function Query({
  onResult,
  onError,
  disabled,
  disabledHint,
  onStatusChange,
  jobDescription,
  onDescriptionChange,
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState("idle"); // idle | analyze | interview

  function setStatus(next, type) {
    onStatusChange?.(next, type);
  }

  async function handleAction(type) {
    setErr("");
    if (!jobDescription || !jobDescription.trim()) {
      const msg = "Please paste a job description first.";
      setErr(msg);
      onError?.(msg);
      return;
    }

    if (disabled) {
      const msg = disabledHint || "Please upload a resume first.";
      setErr(msg);
      onError?.(msg);
      return;
    }

    setBusy(true);
    setMode(type);
    setStatus("retrieving", type);
    onError?.("");

    try {
      const t = setTimeout(() => setStatus("generating"), 600);
      
      const prompt = type === "analyze" 
        ? `Analyze this resume against the following Job Description. Return a Match Score out of 10, a list of missing skills, and 3 specific suggestions for improvement. \n\nJD: ${jobDescription}`
        : `Based on this resume and the following Job Description, generate the first of 5 technical interview questions. \n\nJD: ${jobDescription}`;

      const data = await queryResume(prompt);
      clearTimeout(t);

      if (data.error) {
        setErr(data.error);
        onError?.(data.error);
      } else {
        onResult?.(data.answer || "");
        onError?.("");
      }
    } catch (ex) {
      const msg = `Backend not reachable. Start the API server first. Details: ${String(
        ex
      )}`;
      setErr(msg);
      onError?.(msg);
    } finally {
      setBusy(false);
      setMode("idle");
      setStatus("idle");
    }
  }

  return (
    <div className="card cardQuery">
      <div className="row rowTop">
        <div>
          <div className="stepTitle">2) Job Description & Analysis</div>
          <div className="hint">
            Paste the target job description to compare against your resume.
          </div>
        </div>
      </div>

      <textarea
        className="textarea jdInput"
        value={jobDescription}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Paste the Job Description here..."
        disabled={busy || disabled}
        style={{ minHeight: "120px", marginBottom: "1rem" }}
      />

      <div className="actionButtonGroup" style={{ display: "flex", gap: "10px" }}>
        <button
          className="btn btnPrimary"
          onClick={() => handleAction("analyze")}
          disabled={busy || disabled}
        >
          {busy && mode === "analyze" ? "Analyzing..." : "Analyze Resume"}
        </button>
        <button
          className="btn btnOutline"
          onClick={() => handleAction("interview")}
          disabled={busy || disabled}
        >
          {busy && mode === "interview" ? "Preparing..." : "Start Interview Prep"}
        </button>
      </div>

      {!disabled ? (
        <div 
          className="hint helperText" 
          style={{ opacity: 0.6, fontSize: "0.82rem", marginTop: "-6px" }}
        >
          Fill the Job Description and select an action.
        </div>
      ) : null}

      {disabled ? (
        <div className="hint">{disabledHint || "Upload a resume first."}</div>
      ) : null}
      {err ? <div className="error">{err}</div> : null}
    </div>
  );
}
