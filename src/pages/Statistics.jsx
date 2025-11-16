import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

// Основной фирменный синий, использованный ранее
const PRIMARY_BLUE = "#2A4DD0";

export default function Statistics() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState("month");

  const [difficultyStats, setDifficultyStats] = useState([]);
  const [topicStats, setTopicStats] = useState({});
  const [avgTime, setAvgTime] = useState([]);
  const [firstAttempt, setFirstAttempt] = useState([]);
  const [dayOfWeekStats, setDayOfWeekStats] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  // ---- Fetch from backend ----
  async function loadStatistics(tf = timeframe) {
      setIsLoading(true);
      try {
        const response = await fetch(`/statistics?timeframe=${tf}`, { credentials: "include" });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const data = await response.json();
        setDifficultyStats(data.difficultyStats || []);
        setTopicStats(data.topicStats || {});
        setDayOfWeekStats(data.dayOfWeekStats || {});
        setAvgTime(data.avgTime || []);
        setFirstAttempt(data.firstAttempt || []);
      } catch (e) {
        console.error("Load error:", e);
      }
      setIsLoading(false);
    }

  useEffect(() => {
    loadStatistics();
  }, []);

  useEffect(() => {
    loadStatistics(timeframe);
  }, [timeframe]);

  // ---- Styles ----
  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#F2F4FF",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const card = {
    background: "#fff",
    borderRadius: "14px",
    padding: "18px",
    width: "100%",
    maxWidth: "450px",
    minHeight: "350px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const chartsRow = {
    width: "100%",
    maxWidth: "1400px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "22px",
    marginTop: "20px",
  };

  const title = {
    fontSize: "2.2rem",
    fontWeight: 800,
    color: PRIMARY_BLUE,
    marginBottom: "18px",
  };

  const selectStyle = {
    padding: "8px 12px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #c7c7c7",
  };

  return (
    <div style={pageStyle}>
      <h1 style={title}>Statistics</h1>

      {/* Timeframe selector */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: 600, marginRight: "10px", color: PRIMARY_BLUE }}>
          Time period:
        </label>
        <select
          style={selectStyle}
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>

      {isLoading ? (
        <div style={{ marginTop: "30px", fontSize: "1.2rem" }}>Loading...</div>
      ) : (
        <>
          {/* ROW 1 */}
          <div style={chartsRow}>
            {/* Average time */}
            <div style={card}>
              <Chart
                options={{
                  labels: ["Easy", "Medium", "Hard"],
                  colors: ["#6CA0DC", "#FFD166", "#F69AC1"],
                  legend: { position: "bottom" },
                }}
                series={avgTime}
                type="pie"
                height="100%"
              />
            </div>

            {/* First attempt */}
            <div style={card}>
              <Chart
                options={{
                  labels: ["First Attempt", "Not First"],
                  colors: ["#A88EE0", "#6CA0DC"],
                  plotOptions: {
                    pie: {
                      donut: { size: "60%" },
                    },
                  },
                  legend: { position: "bottom" },
                }}
                series={firstAttempt}
                type="donut"
                height="100%"
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div style={chartsRow}>
            {/* Topics */}
            <div style={{ ...card, maxWidth: "900px" }}>
              <Chart
                options={{
                  chart: { id: "topics" },
                  xaxis: { categories: Object.keys(topicStats) },
                  colors: [PRIMARY_BLUE],
                  plotOptions: {
                    bar: { borderRadius: 6 },
                  },
                }}
                series={[
                  {
                    name: "Solved",
                    data: Object.values(topicStats),
                  },
                ]}
                type="bar"
                height="100%"
              />
            </div>
          </div>
        </>
      )}

      <button
        style={{
          marginTop: "30px",
          padding: "12px 26px",
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "#fff",
          backgroundColor: PRIMARY_BLUE,
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        onClick={() => navigate("/dashboard")}
      >
        Return to Homepage
      </button>
    </div>
  );
}
