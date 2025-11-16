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

  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    if (!/^\d+$/.test(taskTime) || attemptNumber < 1) {
      setMessage({ type: "error", text: "Please enter valid values." });
      return;
    }

    // Подготовка данных
    const formData = new URLSearchParams();
    formData.append("taskName", taskName);
    formData.append("taskTime", taskTime);
    formData.append("completionDate", completionDate);
    formData.append("attemptNumber", attemptNumber);

    try {
      const response = await fetch("/taskChosen", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.error || "Error occurred." });
        return;
      }

      setMessage({ type: "success", text: "Task successfully saved!" });

    } catch (err) {
      setMessage({ type: "error", text: "Server unavailable." });
    }
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

          <div className="card p-3">
            <label htmlFor="taskTime">Time to Solve (in minutes)</label>
            <input
              type="text"
              id="taskTime"
              className="form-control"
              required
              pattern="[0-9]+"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
            />
          </div>

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

          <div className="card p-3">
            <label htmlFor="completionDate">Completion Date</label>
            <input
              type="date"
              id="completionDate"
              className="form-control"
              required
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
            />
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
