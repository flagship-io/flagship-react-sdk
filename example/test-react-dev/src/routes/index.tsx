import { Route, Routes } from "react-router-dom";
import routeList from "./routeList";

export default function AppRoutes() {
  return (
    <Routes>
      {routeList.map((item) => (
        <Route path={item.path} element={<item.element />} key={item.key} />
      ))}
    </Routes>
  );
}
