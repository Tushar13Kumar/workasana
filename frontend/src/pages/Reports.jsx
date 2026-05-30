import { useState, useEffect } from "react";
import API from "../utils/axios";
import Navbar from "../components/Navbar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const COLORS = ["#7c3aed", "#a78bfa", "#6d28d9", "#8b5cf6", "#c4b5fd", "#ddd6fe"];

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

  // Last week data — group by day for chart
  const lastWeekChartData = (() => {
    const days = {};
    lastWeekTasks.forEach(task => {
      const date = new Date(task.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      days[date] = (days[date] || 0) + 1;
    });
    return Object.entries(days).map(([date, count]) => ({ date, count }));
  })();

  const cardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #f3f4f6",
    borderRadius: "16px",
    padding: "24px",
  };

  const titleStyle = {
    fontSize: "15px",
    fontWeight: 600,
    color: "#111827",
    margin: "0 0 20px",
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

        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: "0 0 28px" }}>
          Reports
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

          {/* Chart 1 — Total Work Done Last Week */}
          <div style={cardStyle}>
            <h3 style={titleStyle}>Total Work Done Last Week</h3>
            {lastWeekChartData.length === 0 ? (
              <EmptyChart message="No tasks completed in the last 7 days" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={lastWeekChartData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }}
                    formatter={(val) => [val, "Tasks Completed"]}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {lastWeekChartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "12px 0 0", textAlign: "center" }}>
              {lastWeekTasks.length} task{lastWeekTasks.length !== 1 ? "s" : ""} completed in last 7 days
            </p>
          </div>

          {/* Chart 2 — Total Days of Work Pending */}
          <div style={cardStyle}>
            <h3 style={titleStyle}>Total Days of Work Pending</h3>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "220px", gap: "12px" }}>
              {/* Big number */}
              <div style={{
                width: "120px", height: "120px", borderRadius: "50%",
                backgroundColor: "#fef9c3", border: "4px solid #fde047",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "36px", fontWeight: 700, color: "#a16207", lineHeight: 1 }}>
                  {pendingData?.totalPendingdays ?? 0}
                </span>
                <span style={{ fontSize: "11px", color: "#a16207", fontWeight: 600 }}>days</span>
              </div>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, textAlign: "center" }}>
                {pendingData?.tasks?.length ?? 0} pending task{(pendingData?.tasks?.length ?? 0) !== 1 ? "s" : ""} total
              </p>
            </div>

            {/* Pending tasks breakdown bar */}
            {pendingData?.tasks?.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                {["To Do", "In Progress", "Blocked"].map(status => {
                  const count = pendingData.tasks.filter(t => t.status === status).length;
                  const pct = Math.round((count / pendingData.tasks.length) * 100);
                  const colors = { "To Do": "#3b82f6", "In Progress": "#f59e0b", "Blocked": "#ef4444" };
                  if (count === 0) return null;
                  return (
                    <div key={status} style={{ marginBottom: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                        <span>{status}</span>
                        <span>{count} tasks</span>
                      </div>
                      <div style={{ height: "6px", backgroundColor: "#f3f4f6", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", backgroundColor: colors[status], borderRadius: "999px" }} />
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
            {byTeam.length === 0 ? (
              <EmptyChart message="No completed tasks by team yet" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byTeam} barSize={36} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }}
                    formatter={(val) => [val, "Tasks Completed"]}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {byTeam.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Chart 4 — Tasks Closed by Owner */}
          <div style={cardStyle}>
            <h3 style={titleStyle}>Tasks Closed by Owner</h3>
            {byOwner.length === 0 ? (
              <EmptyChart message="No completed tasks by owner yet" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byOwner} barSize={36} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }}
                    formatter={(val) => [val, "Tasks Completed"]}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {byOwner.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

// Empty state component
const EmptyChart = ({ message }) => (
  <div style={{
    height: "220px", display: "flex", alignItems: "center",
    justifyContent: "center", flexDirection: "column", gap: "8px",
  }}>
    <span style={{ fontSize: "32px" }}>📊</span>
    <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0, textAlign: "center" }}>{message}</p>
  </div>
);

export default Reports;