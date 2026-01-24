import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Outlet from "./components/Outlet.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PokemonFetch from "./pages/PokemonFetch.jsx";
import BattleArena from "./pages/BattleArena.jsx";
import BattleIntro from "./pages/BattleIntro.jsx";
import { AuthProvider } from "./components/ContextApi.jsx";
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

      // 🔥 Battle Intro (3 sec screen)
      {
        path: "intro",
        element: (
          <ProtectedRoute>
            <BattleIntro />
          </ProtectedRoute>
        ),
      },

      // 🔥 Final Battle Arena
      {
        path: "battle-arena",
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
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
