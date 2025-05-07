import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import CoursesTab from "../components/CoursesTab";
import UsersTab from "../components/UsersTab";
import NewsTab from "../components/NewsTab";
import StatTab from "../components/StatTab";
import Navbar from "../components/Navbar";
// plus tard: UsersTab, NewsTab, MessagesTab

const DashboardAdmin = () => {
  const [tab, setTab] = useState(0);
  const handleChange = (_, newVal) => setTab(newVal);

  return (
    <>
      <Navbar />
      <Box p={2} sx={{ pt: 10 }}>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label="Cours" />
          <Tab label="Utilisateurs" />
          <Tab label="Actualités" />
          <Tab label="Statistiques" />
        </Tabs>

        <Box mt={2}>
          {tab === 0 && <CoursesTab />}
          {tab === 1 && <UsersTab />}
          {tab === 2 && <NewsTab />}
          {tab === 3 && <StatTab />}
        </Box>
      </Box>
    </>
  );
};

export default DashboardAdmin;
