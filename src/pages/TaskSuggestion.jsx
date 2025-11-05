import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TaskList({ recommendedTasks = [] }) {
  const navigate = useNavigate();

  return (
    <div
      className="container"
      style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <h1 className="text-center mb-4">Task List</h1>

      <div
        className="task-container d-grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
      >
        {recommendedTasks.map((task) => (
          <a
            key={task.titleSlug}
            href={`https://leetcode.com/problems/${task.titleSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card p-3 text-decoration-none text-dark"
            style={{
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
            }}
          >
            <div className="task-info text-center mb-2">
              <strong>{task.title}</strong>
              <br />
              Difficulty: {task.difficulty}
              <br />
              Tags:{" "}
              {task.topicTags && task.topicTags.length > 0
                ? task.topicTags.map((tag) => tag.name).join(", ")
                : "None"}
            </div>
            <div
              className="task-description"
              style={{
                display: "none",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,123,255,0.1)",
                color: "black",
                padding: "15px",
                borderRadius: "5px",
                textAlign: "center",
                overflow: "hidden",
              }}
            >
              <p>{task.content ? task.content.split("\n")[0] : "No content available"}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard")}
        >
          <i className="fas fa-arrow-left" /> Return to Home Page
        </button>
      </div>
    </div>
  );
}
