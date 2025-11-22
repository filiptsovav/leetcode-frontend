import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TaskList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/taskSuggestion", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tasks");
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load recommended tasks.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  return (
    <div
      className="container"
      style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <h1 className="text-center mb-4">Task List</h1>

      <div
        className="task-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {tasks.map((task) => (
          <div
            key={task.titleSlug}
            className="task-card"
            style={{
              aspectRatio: "1",
              perspective: "1000px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const card = e.currentTarget;
              card.style.transform = "rotateY(180deg)";
            }}
            onMouseLeave={(e) => {
              const card = e.currentTarget;
              card.style.transform = "rotateY(0deg)";
            }}
          >
            {/* Front side */}
            <div
              className="card-front"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                backgroundColor: "#ffffff",
                border: "1px solid #dee2e6",
                borderRadius: "5px",
                padding: "15px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
            >
              <div className="task-info text-center">
                <strong style={{ fontSize: "1.1em" }}>{task.title}</strong>
                <br />
                <span style={{ color: task.difficulty === "Easy" ? "#28a745" : task.difficulty === "Medium" ? "#ffc107" : "#dc3545" }}>
                  {task.difficulty}
                </span>
                <br />
                <small className="text-muted">
                  Tags: {task.topicTags && task.topicTags.length > 0
                    ? task.topicTags.map((tag) => tag.name).join(", ")
                    : "None"}
                </small>
              </div>
            </div>

            {/* Back side */}
            <div
              className="card-back"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                backgroundColor: "#ffc5e3",
                border: "1px solid #dee2e6",
                borderRadius: "5px",
                padding: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "rotateY(180deg)",
                overflow: "hidden",
              }}
            >
              <div style={{ textAlign: "center", overflow: "hidden" }}>
                <p style={{ margin: 0, fontSize: "0.9em", lineHeight: "1.4" }}>
                  {task.content
                    ? task.content.replace(/<[^>]*>/g, '').split('\n')[0].substring(0, 150) + '...'
                    : "No content available"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-primary"
          style={{
            padding: "15px 30px",
            fontSize: "1.1rem",
            fontWeight: "500",
            transition: "transform 0.15s, box-shadow 0.15s",
            backgroundColor: "#ffc5e3",
            border: "none",
            color: "#000",
          }}
          onClick={() => navigate("/dashboard")}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "none";
          }}
        >
          Return to Home Page
        </button>
      </div>

      <style jsx>{`
        .task-card {
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}