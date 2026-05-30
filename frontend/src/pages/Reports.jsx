import { useState, useEffect } from "react";
import API from "../utils/axios";
import Navbar from "../components/Navbar";

const COLORS = ["#7c3aed", "#a78bfa", "#6d28d9", "#8b5cf6", "#c4b5fd", "#3b82f6"];

// Simple bar chart — no external library
const BarChart = ({ data, valueKey = "count", labelKey = "name", horizontal = false }) => {
  if (!data || data.length === 0) return (
    <div style={{ height: "180px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px" }}>
      <span style={{ fontSize: "28px" }}>📊</span>
      <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>No data yet</p>
    </div>
  );

  const max = Math.max(...data.map(d => d[valueKey]));

  if (horizontal) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "4px 0" }}>
        {data.map((item, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "12px", color: "#374151", fontWeight: 500 }}>{item[labelKey]}</span>
              <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>{item[valueKey]}</span>
            </div>
            <div style={{ height: "8px", backgroundColor: "#f3f4f6", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{
                width: `${(item[valueKey] / max) * 100}%`,
                height: "100%",
                backgroundColor: COLORS[i % COLORS.length],
                borderRadius: "999px",
                transition: "width 0.6s ease",
              }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Vertical bars
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "180px", padding: "0 8px" }}>
      {data.map((item, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: COLORS[i % COLORS.length] }}>{item[valueKey]}</span>
          <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
            <div style={{
              width: "100%",
              height: `${Math.max((item[valueKey] / max) * 100, 8)}%`,
              backgroundColor: COLORS[i % COLORS.length],
              borderRadius: "6px 6px 0 0",
              transition: "height 0.6s ease",
            }} />
          </div>
          <span style={{ fontSize: "10px", color: "#6b7280", textAlign: "center", lineHeight: 1.2 }}>{item[labelKey]}</span>
        </div>
      ))}
    </div>
  );
};

const Reports = () => {
  const [lastWeekTasks, setLastWeekTasks] = useState([]);
  const [pendingData, setPendingData] = useState(null);
  const [byTeam, setByTeam] = useState([]);
  const [byOwner, setByOwner] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [lastWeekRes, pendingRes, byTeamRes, byOwnerRes] = await Promise.all([
          API.get("/report/last-week"),
          API.get("/report/pending"),
          API.get("/report/by-team"),
          API.get("/report/by-owner"),
        ]);
        setLastWeekTasks(lastWeekRes.data);
        setPendingData(pendingRes.data);
        setByTeam(byTeamRes.data);
        setByOwner(byOwnerRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Last week — group by date
  const lastWeekChartData = (() => {
    const days = {};
    lastWeekTasks.forEach(task => {
      const date = new Date(task.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      days[date] = (days[date] || 0) + 1;
    });
    return Object.entries(days).map(([name, count]) => ({ name, count }));
  })();

  const cardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #f3f4f6",
    borderRadius: "16px",
    padding: "24px",
  };

  const titleStyle = {
    fontSize: "15px", fontWeight: 600,
    color: "#111827", margin: "0 0 20px",
  };

  if (loading) return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#9ca3af" }}>Loading reports...</p>
      </main>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", minWidth: 0 }}>

        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: "0 0 28px" }}>Reports</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

          {/* Chart 1 — Total Work Done Last Week */}
          <div style={cardStyle}>
            <h3 style={titleStyle}>Total Work Done Last Week</h3>
            <BarChart data={lastWeekChartData} valueKey="count" labelKey="name" />
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "16px 0 0", textAlign: "center" }}>
              {lastWeekTasks.length} task{lastWeekTasks.length !== 1 ? "s" : ""} completed in last 7 days
            </p>
          </div>

          {/* Chart 2 — Total Days Pending */}
          <div style={cardStyle}>
            <h3 style={titleStyle}>Total Days of Work Pending</h3>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{
                width: "110px", height: "110px", borderRadius: "50%",
                backgroundColor: "#fef9c3", border: "4px solid #fde047",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "34px", fontWeight: 700, color: "#a16207", lineHeight: 1 }}>
                  {pendingData?.totalPendingdays ?? 0}
                </span>
                <span style={{ fontSize: "11px", color: "#a16207", fontWeight: 600 }}>days</span>
              </div>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                {pendingData?.tasks?.length ?? 0} pending tasks
              </p>
            </div>

            {/* Breakdown bars */}
            {(pendingData?.tasks?.length ?? 0) > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "To Do", color: "#3b82f6" },
                  { label: "In Progress", color: "#f59e0b" },
                  { label: "Blocked", color: "#ef4444" },
                ].map(({ label, color }) => {
                  const count = pendingData.tasks.filter(t => t.status === label).length;
                  const pct = Math.round((count / pendingData.tasks.length) * 100);
                  if (count === 0) return null;
                  return (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                        <span>{label}</span><span>{count}</span>
                      </div>
                      <div style={{ height: "6px", backgroundColor: "#f3f4f6", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", backgroundColor: color, borderRadius: "999px" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chart 3 — Tasks Closed by Team */}
          <div style={cardStyle}>
            <h3 style={titleStyle}>Tasks Closed by Team</h3>
            <BarChart data={byTeam} valueKey="count" labelKey="name" horizontal />
          </div>

          {/* Chart 4 — Tasks Closed by Owner */}
          <div style={cardStyle}>
            <h3 style={titleStyle}>Tasks Closed by Owner</h3>
            <BarChart data={byOwner} valueKey="count" labelKey="name" horizontal />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Reports;