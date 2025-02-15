import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

import App from "./App";
import Landing from "./pages/landing/Landing";
import { AuthenticationForm } from "./pages/auth/Login";

import "@mantine/core/styles.css";
import ProductDetails from "./pages/landing/ProductDetails";
import NotFound from "./components/NotFound";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Often a layout component that renders <Outlet />
    children: [
      {
        index: true, // sets this route as the default child
        element: <Navigate to="products" replace />,
      },
      // Public (Insecure) routes
      {
        path: "login",
        element: <AuthenticationForm />,
      },

      // Private (Secure) route wrapper
      {
        path: "products",
        element: <PrivateRoute />, // Only authenticated users can access anything under /secure
        children: [
          {
            index: true, // sets this route as the default child
            element: <Landing />,
          },
          {
            path: ":productId",
            element: <ProductDetails />,
          },
          // add other secure child routes here
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 1000 * 60 * 15,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Provide Auth Context to the entire App */}
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
