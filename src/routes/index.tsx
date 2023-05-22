import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDrawerContext } from "../shared/contexts";
import { Dashboard, Dashboard2, Dashboard3, Dashboard5 } from "../pages";

export const AppRoutes = () => {
  const { setDrawerOptions } = useAppDrawerContext();
  useEffect(() => {
    setDrawerOptions([
      { icon: "group_add", path: "/cadastro-facial", label: "Cadastro facial" },
      { icon: "edit_note", path: "/cadastro-lacre", label: "Cadastro lacre" },
      { icon: "fact_check", path: "/checklist", label: "Checklist" },
      { icon: "fact_check", path: "/agendamento2", label: "agendamento" },
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/cadastro-facial" element={<Dashboard />} />
      <Route path="/cadastro-lacre" element={<Dashboard2 />} />
      <Route path="/checklist" element={<Dashboard3 />} />
      <Route path="/agendamento2" element={<Dashboard5 />} />

      <Route path="*" element={<Navigate to="/cadastro-facial" />} />
    </Routes>
  );
};
