import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Catalog from "./pages/Catalog";
import PromptsPage from "./pages/PromptsPage";
import PromptList from "./pages/PromptList";
import PromptParameterization from "./pages/PromptParameterization";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./Components/CommonComponents/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import DashboardV1 from "./pages/DashboardV1";
import ViewDashboards from "./pages/ViewDashboards";

import App from "./App";
import { Link } from "react-router-dom";

const router = createBrowserRouter([
  {
    // Ruta en la que va a estar la estructura principal como la navbar
    path: "/",
    element: <App />,
    children: [
      {
        // Pagina principal
        path: "",
        element: <HomePage />,
      },
      {
        // Pagina del catalogo de analisis
        path: "catalog",
        element: <Catalog />,
      },
      {
        path: "catalog/prompt-list",
        element: <PromptList />,
      },
      {
        /* Ruta protegida */
        path: "/catalog/prompt-list/prompt-parameterization",
        element: (
        <PrivateRoute>
          <PromptParameterization /> 
        </PrivateRoute>
        ),
      },
      {
        path: "/prompts",
        element: <PromptsPage/>,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "catalog/prompt-list/prompt-parameterization",
        element: <PromptParameterization />,
      },
      {
        path: "dashboard",
        element: <Dashboard/>,
      },
      {
        path: "dashboardV1",
        element: <DashboardV1 />,
      },
      {
        path: "view-dashboards",
        element: <PrivateRoute><ViewDashboards/></PrivateRoute>,
      }

    ],
    ErrorBoundary: () => {
      return (
        <div className="flex flex-col items-center justify-center h-screen space-y-8">
          <h1 className="text-4xl font-bold">Error 404: page not found</h1>
          <Link to="/" className="main-button">
            Go to Home
          </Link>
        </div>
      );
    },
  },
  
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
