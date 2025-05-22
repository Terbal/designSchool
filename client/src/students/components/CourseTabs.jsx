import { Tabs, Tab } from "@mui/material";
import { Book, Assignment } from "@mui/icons-material";

export default function CourseTabs({ value, onChange }) {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      sx={{
        mb: 4,
        pt: 5,
        "& .MuiTabs-indicator": {
          height: 4,
          borderRadius: 2,
        },
      }}
    >
      <Tab label="Cours disponibles" icon={<Book />} iconPosition="start" />
      <Tab label="Mes cours" icon={<Assignment />} iconPosition="start" />
    </Tabs>
  );
}
