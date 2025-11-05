import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TaskChosen() {
  const navigate = useNavigate();

  const [taskName, setTaskName] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [completionDate, setCompletionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState("blue"); // default tag color
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^\d+$/.test(taskTime) || attemptNumber < 1) {
      setMessage({ type: "error", text: "Please enter valid values." });
      return;
    }

    setMessage({ type: "success", text: "Task successfully saved!" });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-start flex-column flex-md-row"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "40px 20px",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <div
        className="card p-4"
        style={{
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2 className="text-center mb-4">Task Information</h2>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {/* Task Name */}
          <div className="card p-3">
            <label htmlFor="taskName">Task Name</label>
            <input
              type="text"
              id="taskName"
              className="form-control"
              required
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>

          {/* Time to Solve */}
          <div className="card p-3">
            <label htmlFor="taskTime">Time to Solve (in minutes)</label>
            <input
              type="text"
              id="taskTime"
              className="form-control"
              required
              pattern="[0-9]+"
              title="Enter a positive number"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
            />
          </div>

          {/* Attempt Number */}
          <div className="card p-3">
            <label htmlFor="attemptNumber">Attempt Number</label>
            <input
              type="number"
              id="attemptNumber"
              className="form-control"
              required
              min="1"
              value={attemptNumber}
              onChange={(e) => setAttemptNumber(e.target.value)}
            />
          </div>

          {/* Completion Date */}
          <div className="card p-3 d-flex flex-column gap-2">
            <label htmlFor="completionDate">Completion Date</label>
            <input
              type="date"
              id="completionDate"
              className="form-control"
              required
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
            />
            <div className="d-flex gap-2 mt-2">
              {/* Теги статуса */}
              {["red", "green", "yellow", "blue"].map((color) => (
                <span
                  key={color}
                  className="tag"
                  style={{
                    backgroundColor:
                      color === "red"
                        ? "#dc3545"
                        : color === "green"
                        ? "#28a745"
                        : color === "yellow"
                        ? "#ffc107"
                        : "#007bff",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => setStatus(color)}
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </span>
              ))}
            </div>
            <small>Selected status: {status}</small>
          </div>

          <button type="submit" className="btn btn-primary py-2 mt-2">
            Save Task
          </button>
        </form>

        {message && (
          <p
            className={`mt-3 text-center ${
              message.type === "success" ? "text-success" : "text-danger"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="mt-4 text-center">
          <button
            className="btn btn-link"
            onClick={() => navigate("/dashboard")}
          >
            Return to Main Page
          </button>
        </div>
      </div>
    </div>
  );
}
