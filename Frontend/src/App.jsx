import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Outlet from "./components/Outlet.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PokemonFetch from "./pages/PokemonFetch.jsx";
import BattleArena from "./pages/BattleArena.jsx";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <PokemonFetch />
          </ProtectedRoute>
        ),
      },

      // 🔴 CHANGE HERE: battle route
      {
        path: "battle",
        element: (
          <ProtectedRoute>
            <BattleArena />
          </ProtectedRoute>
        ),
      },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
