import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Routes } from "./Routes/Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./Providers/authProviders";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={Routes} />
      <Toaster position="top-center" reverseOrder={false} />
    </AuthProvider>
  </QueryClientProvider>
  </HelmetProvider>

);
