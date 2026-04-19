import React, { useState } from "react";
import Upload from "./components/Upload";
import Query from "./components/Query";
import Result from "./components/Result";

export default function App() {
  const [answer, setAnswer] = useState("");
  const [resumeMeta, setResumeMeta] = useState({
    ready: false,
    filename: "",
    chunks: 0,
    status: "not_ready", // not_ready | uploading | ready | error
    error: "",
  });
  const [queryStatus, setQueryStatus] = useState("idle"); // idle | retrieving | generating
  const [queryError, setQueryError] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [interviewStep, setInterviewStep] = useState(0);
                                        
  const disabledHint =
    resumeMeta.status === "uploading"
      ? "Uploading... please wait."
      : queryStatus !== "idle"
      ? "Processing... please wait."
      : "Please upload a resume first.";

  const globalState = (() => {
    if (resumeMeta.status === "error" || queryError) return "error";
    if (queryStatus !== "idle") return "processing";
    return resumeMeta.status;
  })();

  const topStatusText =
    globalState === "not_ready"
      ? "Not Ready"
    : globalState === "uploading"
      ? "Uploading..."
    : globalState === "ready"
      ? "Ready"
    : globalState === "processing"
      ? "Processing..."
    : "Error";

  return (
    <div className="wrap">
      <div className="hero">
        <div>
          <h1 className="title">Resume Analyzer</h1>
          <p className="subtitle">
            Upload your resume (PDF). We'll analyze it for questions.
          </p>
        </div>
        <div className="heroRight">
          <div className="statusRow">
            <div className="statusLabel">Status</div>
            <div
              className="statusPill"
              data-tone={globalState === "ready" ? "ok" : globalState}
            >
              {topStatusText}
            </div>
          </div>
          {resumeMeta.error ? <div className="error">{resumeMeta.error}</div> : null}
          {queryError ? <div className="error">{queryError}</div> : null}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1.25fr" }}>
        <div className="gridLeft">
          <Upload
            appState={globalState}
            onStateChange={(next) => {
              setResumeMeta(next);
              // Only clear if we are starting a fresh upload cycle
              if (next.status === "uploading" || next.status === "not_ready") {
                setAnswer("");
                setQueryError("");
              }
            }}
          />
          <div className="sectionSpacer" />
          <Query
            disabled={globalState !== "ready"}
            disabledHint={disabledHint}
            jobDescription={jobDescription}
            onDescriptionChange={setJobDescription}
            onStatusChange={(s, type) => {
              setQueryStatus(s);
              if (s !== "idle") {
                setQueryError("");
                setAnswer(""); // Clear previous answer to trigger "Generating..." feedback
                if (type === "interview") {
                  setIsInterviewActive(true);
                  setInterviewStep(1);
                } else if (type === "analyze") {
                  setIsInterviewActive(false);
                  setInterviewStep(0);
                }
              }
            }}
            onError={setQueryError}
            onResult={(text) => {
              setAnswer(text);
              setQueryError("");
            }}
          />
        </div>
        <div className="gridRight">
          <Result
            answer={answer}
            status={globalState === "processing" ? queryStatus : globalState}
            error={queryError || resumeMeta.error}
            resumeMeta={resumeMeta}
            globalState={globalState}
            isInterviewActive={isInterviewActive}
            interviewStep={interviewStep}
            onAnswerSubmit={async (userResponse) => {
              setQueryStatus("generating");
              const prompt = interviewStep < 5 
                ? `The user answered: "${userResponse}". Evaluate this answer briefly and then provide interview question #${interviewStep + 1} of 5.`
                : `The user answered: "${userResponse}". This was the final question. Provide a brief overall performance summary based on all answers.`;
              
              try {
                const { queryResume } = require("./services/api");
                const data = await queryResume(prompt);
                setAnswer(data.answer || "");
                setInterviewStep(prev => prev + 1);
              } catch (err) {
                setQueryError("Failed to submit answer.");
              } finally {
                setQueryStatus("idle");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
