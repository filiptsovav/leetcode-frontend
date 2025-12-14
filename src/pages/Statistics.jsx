import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import "./statistics.css";


const PRIMARY_BLUE = "#0d6efd";

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

  return (
      <div className="statistics-page">
        <h1 className="page-title">Statistics</h1>

        <div className="timeframe-selector">
          <label className="selector-label">Time period:</label>
          <select
            className="selector"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        {isLoading ? (
          <div className="loading-text">Loading...</div>
        ) : (
          <>
            {/* ROW 1 */}
            <div className="charts-row">

              <div className="card">
                <Chart
                  options={{
                    title: { text: "Number of solved problems by level", align: "center" },
                    labels: ["Easy", "Medium", "Hard"],
                    colors: ["#6CA0DC", "#FFD166", "#F69AC1"],
                    legend: { position: "bottom" },
                  }}
                  series={difficultyStats}
                  type="pie"
                  height="100%"
                />
              </div>

              <div className="card">
                <Chart
                  options={{
                    title: { text: "Percentage of problems solved on the first/not first try", align: "center" },
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
            <div className="charts-row">
              <div className="card wide-card">
                <Chart
                  options={{
                    chart: { id: "topics", toolbar: { show: false } },
                    title: { text: "Number of solved problems by topics", align: "center" },
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
          className="return-button"
          onClick={() => navigate("/dashboard")}
        >
          Return to Homepage
        </button>
      </div>
    );
  }