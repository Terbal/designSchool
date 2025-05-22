import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Grid } from "@mui/material";
import CourseTabs from "./components/CourseTabs";
import WelcomeBanner from "./components/WelcomeBanner";
import CourseCard from "./components/CarousselCard";
import { EmptyCourses } from "./components/EmptyState";
import LoadingSpinner from "./components/LoginSpinner";
import Footer from "../components/Footer";

export default function DashboardEtudiant() {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [available, setAvailable] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [allRes, myRes] = await Promise.all([
          axios.get("http://localhost:5000/api/cours", config),
          axios.get("http://localhost:5000/api/inscription/mes-cours", config),
        ]);
        setAvailable(allRes.data);
        setEnrolled(myRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <CourseTabs value={tab} onChange={(_, v) => setTab(v)} />
        <WelcomeBanner user={user} tab={tab} />

        <Grid container spacing={3} alignItems="stretch">
          {(tab === 0 ? available : enrolled).map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <CourseCard
                course={course}
                tab={tab}
                isEnrolled={enrolled.some((e) => e.id === course.id)}
                onEnroll={() => navigate(`/inscription/${course.id}`)}
                onDetails={() => navigate(`/cours/${course.id}`)}
              />
            </Grid>
          ))}
        </Grid>

        {tab === 0 && available.length === 0 && <EmptyCourses tab={0} />}

        {tab === 1 && enrolled.length === 0 && (
          <EmptyCourses tab={1} onBrowse={() => setTab(0)} />
        )}
      </Container>
      <Footer />
    </>
  );
}
