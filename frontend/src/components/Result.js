import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Result({ 
  answer, 
  status, 
  error, 
  resumeMeta, 
  globalState, 
  isInterviewActive, 
  interviewStep, 
  onAnswerSubmit 
}) {
  const hasAnswer = Boolean((answer || "").trim());
  const [userReply, setUserReply] = useState("");
  const isWaitingForUser = isInterviewActive && hasAnswer && globalState !== "processing" && interviewStep <= 5;

  const subtitle =
    globalState === "ready"
      ? "Ready to analyze or start prep."
      : globalState === "processing"
      ? "Generating answer..."
      : globalState === "uploading"
      ? "Uploading and indexing..."
      : "Your answer will appear here.";

  const boxText =
    globalState === "not_ready"
      ? "Upload a resume to begin."
      : globalState === "error" && !hasAnswer
      ? "Something went wrong. Fix the error above and try again."
      : globalState === "uploading"
      ? "Uploading and indexing resume..."
      : globalState === "ready" && !hasAnswer
      ? "Paste a Job Description and click Analyze to see your match score."
      : globalState === "processing" && !hasAnswer
      ? ""
      : hasAnswer
      ? answer
      : "Ask a question and your answer will show up here.";

  return (
    <div className="card cardOutput">
      <div className="row rowTop" style={{ alignItems: "flex-start" }}>
        <div>
          <div className="stepTitle">AI Response</div>
          <div className="hint">{subtitle}</div>
        </div>
      </div>

      {error ? (
        <div className="error">Failed to process request. Try again. {error}</div>
      ) : null}

      <div style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "14px",
        padding: "20px",
        overflowY: "auto",
        maxHeight: "500px",
        lineHeight: "1.7",
        color: "rgba(255,255,255,0.92)",
        fontSize: "15px",
      }}>
        {globalState === "processing" && !hasAnswer ? (
          <div className="resultLoading">
            <span className="spinner spinnerLight" /> Generating answer...
          </div>
        ) : null}

        <div style={{ color: "rgba(255,255,255,0.92)" }}>
          <ReactMarkdown
            components={{
              h1: ({children}) => <h1 style={{color:"#48e1c4", fontSize:"20px", marginBottom:"12px"}}>{children}</h1>,
              h2: ({children}) => <h2 style={{color:"#48e1c4", fontSize:"17px", marginBottom:"10px"}}>{children}</h2>,
              h3: ({children}) => <h3 style={{color:"#ffd166", fontSize:"15px", marginBottom:"8px"}}>{children}</h3>,
              strong: ({children}) => <strong style={{color:"#ffd166", fontWeight:"700"}}>{children}</strong>,
              li: ({children}) => <li style={{marginBottom:"6px", color:"rgba(255,255,255,0.88)"}}>{children}</li>,
              p: ({children}) => <p style={{marginBottom:"12px", color:"rgba(255,255,255,0.88)"}}>{children}</p>,
            }}
          >{boxText}</ReactMarkdown>
        </div>

        {isWaitingForUser && (
          <div style={{
            marginTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "16px"
          }}>
            <div className="hint" style={{ marginBottom: "8px", color: "rgba(255,255,255,0.7)" }}>
              Your Answer (Step {interviewStep}/5):
            </div>
            <textarea
              value={userReply}
              onChange={(e) => setUserReply(e.target.value)}
              placeholder="Type your response here..."
              style={{
                width: "100%",
                minHeight: "90px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(10,14,30,0.5)",
                color: "rgba(255,255,255,0.92)",
                padding: "12px",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
                lineHeight: "1.5",
              }}
            />
            <button
              style={{
                marginTop: "10px",
                border: "0",
                borderRadius: "12px",
                padding: "10px 20px",
                fontWeight: "650",
                color: "#081017",
                background: "linear-gradient(135deg, #48e1c4, #7cf3db)",
                cursor: "pointer",
              }}
              onClick={() => {
                onAnswerSubmit(userReply);
                setUserReply("");
              }}
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}