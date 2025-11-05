import React, { useState, useEffect } from "react";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Statistics({
  difficultyStats = [5, 10, 3],
  topicStats = { Array: 4, DP: 2, Graph: 3 },
  avgTimeData = [30, 45, 60],
  firstAttemptData = [8, 12],
}) {
  const [timeframe, setTimeframe] = useState("week");
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartContainerStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    padding: "20px",
    textAlign: "center",
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "380px",
    minWidth: "280px",
  };

  const chartTitleStyle = {
    fontSize: "1.6rem",
    fontWeight: "700",
    marginBottom: "15px",
    color: "#1a237e",
  };

  const softBlue = "#6CA0DC";
  const softPink = "#F7A8B8";
  const softYellow = "#FFD166";
  const softPurple = "#CDB4DB";

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#f0f4ff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "25px",
      }}
    >
      <h1
        style={{
          marginBottom: "15px",
          fontSize: "2.4rem",
          fontWeight: 800,
          color: "#1a237e",
        }}
      >
        Statistics
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="timeframe"
          style={{ fontWeight: 600, fontSize: "1.1rem", color: "#1a237e" }}
        >
          Time period:
        </label>
        <select
          id="timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          style={{
            marginLeft: "10px",
            padding: "6px 12px",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "stretch",
          gap: "20px",
          width: "100%",
          maxWidth: "1300px",
        }}
      >
        <div style={chartContainerStyle}>
          <div style={chartTitleStyle}>Average Solving Time</div>
          <Pie
            data={{
              labels: ["Easy", "Medium", "Hard"],
              datasets: [
                {
                  data: avgTimeData,
                  backgroundColor: [softBlue, softYellow, softPink],
                },
              ],
            }}
          />
        </div>

        <div style={chartContainerStyle}>
          <div style={chartTitleStyle}>First Attempt Success</div>
          <Doughnut
            data={{
              labels: ["First Try", "Not First Try"],
              datasets: [
                {
                  data: firstAttemptData,
                  backgroundColor: [softPurple, softBlue],
                },
              ],
            }}
          />
        </div>

        <div style={chartContainerStyle}>
          <div style={chartTitleStyle}>Topics</div>
          <Bar
            data={{
              labels: Object.keys(topicStats),
              datasets: [
                {
                  label: "Solved Problems",
                  data: Object.values(topicStats),
                  backgroundColor: softPink,
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, ticks: { font: { size: 13 } } },
                x: { ticks: { font: { size: 13 } } },
              },
            }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "25px",
          padding: "12px 24px",
          fontSize: "1.1rem",
          fontWeight: 600,
          backgroundColor: "#5A8DEE",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background 0.3s ease",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#4979D0")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#5A8DEE")}
      >
        Return to Homepage
      </button>
    </div>
  );
}
