import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import CoursesTab from "../components/CoursesTab";
import UsersTab from "../components/UsersTab";
import NewsTab from "../components/NewsTab";
// plus tard: UsersTab, NewsTab, MessagesTab

const DashboardAdmin = () => {
  const [tab, setTab] = useState(0);
  const handleChange = (_, newVal) => setTab(newVal);

  return (
    <Box p={2}>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label="Cours" />
        <Tab label="Utilisateurs" />
        <Tab label="Actualités" />
        <Tab label="Messagerie" />
      </Tabs>

      <Box mt={2}>
        {tab === 0 && <CoursesTab />}
        {tab === 1 && <UsersTab />}
        {tab === 2 && <NewsTab />}
        {tab === 3 && <div>Section Messagerie…</div>}
      </Box>
    </Box>
  );
};

export default DashboardAdmin;
