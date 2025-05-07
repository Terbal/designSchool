import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";

// Axios instance for stats with interceptor
const statsApi = axios.create({
  baseURL: "http://localhost:5000/api/admin/stats",
});
// Inject token into each request
statsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function StatTab() {
  const [userStats, setUserStats] = useState([]);
  const [messageStats, setMessageStats] = useState([]);
  const [period, setPeriod] = useState("daily");
  const [courseStats, setCourseStats] = useState([]);

  // Fetch users by role
  useEffect(() => {
    statsApi
      .get("/users")
      .then((res) => setUserStats(res.data))
      .catch((err) => console.error("Users stats error", err));
  }, []);

  // Fetch message counts
  useEffect(() => {
    statsApi
      .get(`/messages?period=${period}`)
      .then((res) => setMessageStats(res.data))
      .catch((err) => console.error("Message stats error", err));
  }, [period]);

  // Fetch top courses
  useEffect(() => {
    statsApi
      .get("/courses")
      .then((res) => setCourseStats(res.data))
      .catch((err) => console.error("Course stats error", err));
  }, []);

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
      gap={2}
      p={2}
    >
      {/* Users by Role Pie */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Répartition des utilisateurs
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userStats}
                dataKey="count"
                nameKey="role"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {userStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Messages over time Line */}
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Messages échangés ({period})</Typography>
            <FormControl size="small">
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <MenuItem value="daily">Jour</MenuItem>
                <MenuItem value="weekly">Semaine</MenuItem>
                <MenuItem value="monthly">Mois</MenuItem>
                <MenuItem value="yearly">Année</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={messageStats}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Courses Bar */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top cours suivis
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={courseStats}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="titre"
                angle={-45}
                textAnchor="end"
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="enrollments" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
