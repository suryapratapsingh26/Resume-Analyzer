import React, { useMemo, useRef, useState } from "react";
import { uploadResume } from "../services/api";

function CheckIcon() {
  return (
    <svg
      className="icon"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6.35 11.1 3.2 7.95l1.05-1.05 2.1 2.1 5.4-5.4 1.05 1.05-6.45 6.45Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Upload({ onStateChange, appState }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [status, setStatus] = useState("not_ready"); // not_ready | uploading | ready | error
  const [dragOver, setDragOver] = useState(false);
  const [isChangeHovered, setIsChangeHovered] = useState(false);

  const filename = useMemo(() => (file ? file.name : ""), [file]);
  const isLocked = appState === "processing";

  function publish(next) {
    onStateChange?.(next);
  }

  function pickFile() {
    inputRef.current?.click();
  }

  async function doUpload(selectedFile) {
    setErr("");
    setStatus("uploading");
    publish({
      ready: false,
      filename: selectedFile?.name || "",
      chunks: 0,
      status: "uploading",
      error: "",
    });

    setBusy(true);
    try {
      const data = await uploadResume(selectedFile);
      if (data.error) {
        setErr(data.error);
        setStatus("error");
        publish({
          ready: false,
          filename: selectedFile?.name || "",
          chunks: 0,
          status: "error",
          error: data.error,
        });
        return;
      }

      setStatus("ready");
      publish({
        ready: true,
        filename: selectedFile?.name || "",
        chunks: Number(data.chunks_indexed || 0),
        status: "ready",
        error: "",
      });
    } catch (ex) {
      const msg = String(ex);
      setErr(msg);
      setStatus("error");
      publish({
        ready: false,
        filename: selectedFile?.name || "",
        chunks: 0,
        status: "error",
        error: msg,
      });
    } finally {
      setBusy(false);
    }
  }

  function handlePickedFile(f) {
    setFile(f);
    setStatus("not_ready");
    publish({
      ready: false,
      filename: f?.name || "",
      chunks: 0,
      status: "not_ready",
      error: "",
    });
    if (f) doUpload(f); // Auto-upload after selection
  }

  return (
    <div className="card cardPrimary">
      <div className="row rowTop">
        <div>
          <div className="stepTitle">1) Upload Resume</div>
          <div className="hint">
            Upload your resume (PDF) to analyze it and ask questions.
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        className="input fileInputHidden"
        type="file"
        accept="application/pdf"
        disabled={busy || isLocked}
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          handlePickedFile(f);
        }}
      />

      {!file ? (
        <div
          className={`uploadEmpty dropZone ${dragOver ? "dropZoneActive" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            if (!busy && !isLocked) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (busy || isLocked) return;
            const f = e.dataTransfer?.files?.[0] || null;
            if (f) handlePickedFile(f);
          }}
          onClick={() => {
            if (!busy && !isLocked) pickFile();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") pickFile();
          }}
        >
          <button
            className="btn"
            type="button"
            disabled={busy || isLocked}
            onClick={(e) => {
              e.stopPropagation();
              pickFile();
            }}
          >
            Choose File
          </button>
          <div className="hint uploadHint">
            Drag & drop or click to upload. Upload starts automatically after selection.
          </div>
        </div>
      ) : (
        <div className="uploadSelected">
          <div className="fileRow">
            <div className="fileName mono">{filename}</div>
            <div className="actionRow">
              <button
                className="btn btnOutline"
                type="button"
                disabled={busy || isLocked}
                onMouseEnter={() => setIsChangeHovered(true)}
                onMouseLeave={() => setIsChangeHovered(false)}
                style={{ 
                  cursor: busy || isLocked ? "default" : "pointer",
                  backgroundColor: isChangeHovered && !busy && !isLocked ? "rgba(0,0,0,0.05)" : "transparent",
                  transition: "all 0.2s ease"
                }}
                onClick={pickFile}
              >
                Change
              </button>
            </div>
          </div>

          {status === "uploading" ? (
            <div className="hint uploadLine">
              <span className="spinner spinnerLight" /> Uploading resume...
            </div>
          ) : null}

          {status === "ready" ? (
            <div className="hint uploadLineOk">
              <span className="badge badgeOk badgeMini" style={{ marginTop: "10px", padding: "6px 12px", display: "inline-flex", alignItems: "center", transition: "all 0.2s ease" }}>
                <CheckIcon /> Resume uploaded and ready
              </span>
            </div>
          ) : null}
        </div>
      )}

      {err ? <div className="error">{err}</div> : null}
    </div>
  );
}
