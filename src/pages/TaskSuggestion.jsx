import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tasklist.css"; // убедитесь, что путь совпадает с расположением файла

const PRIMARY_BLUE = "#0d6efd";

export default function TaskSuggestion() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // множество с slug'ами перевёрнутых карточек
  const [flipped, setFlipped] = useState(new Set());

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

  const handleMouseEnter = (slug) =>
    setFlipped((prev) => {
      const s = new Set(prev);
      s.add(slug);
      return s;
    });

  const handleMouseLeave = (slug) =>
    setFlipped((prev) => {
      const s = new Set(prev);
      s.delete(slug);
      return s;
    });

  const handleKeyDown = (e, slug) => {
    if (e.key === "Enter" || e.key === " ") {
      // открываем задачу в новой вкладке
      window.open(`https://leetcode.com/problems/${slug}`, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  return (
    <div className="tasks-page">
      <h1 className="tasks-title">Task List</h1>

      <div className="tasks-grid">
        {tasks.map((task) => {
          const slug = task.titleSlug;
          const isFlipped = flipped.has(slug);

          return (
            <div
              key={slug}
              className="tasks-card"
              role="button"
              tabIndex={0}
              onClick={() =>
                window.open(`https://leetcode.com/problems/${slug}`, "_blank", "noopener,noreferrer")
              }
              onMouseEnter={() => handleMouseEnter(slug)}
              onMouseLeave={() => handleMouseLeave(slug)}
              onFocus={() => handleMouseEnter(slug)}
              onBlur={() => handleMouseLeave(slug)}
              onKeyDown={(e) => handleKeyDown(e, slug)}
              aria-label={`Open LeetCode problem ${task.title}`}
            >
              <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
                <div className="card-front">
                  <div className="task-info">
                    <div className="task-title">{task.title}</div>
                    <div
                      className={
                        task.difficulty === "Easy"
                          ? "task-diff task-diff-easy"
                          : task.difficulty === "Medium"
                          ? "task-diff task-diff-medium"
                          : "task-diff task-diff-hard"
                      }
                    >
                      {task.difficulty}
                    </div>
                    <small className="text-muted">
                      Tags:{" "}
                      {task.topicTags && task.topicTags.length > 0
                        ? task.topicTags.map((t) => t.name).join(", ")
                        : "None"}
                    </small>
                  </div>
                </div>

                <div className="card-back">
                  <p className="task-back-text">
                    {task.content
                      ? task.content.replace(/<[^>]*>/g, "").split("\n")[0].substring(0, 150) + "..."
                      : "No content available"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          className="tasks-button"
          onClick={() => navigate("/dashboard")}
          aria-label="Return to Home Page"
        >
          Return to Home Page
        </button>
      </div>
    </div>
  );
}
