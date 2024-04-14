import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "react-international-phone/style.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalProvider } from "./contexts/GlobalContext.tsx";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <GlobalProvider>
      <App />
      <Toaster />
    </GlobalProvider>
  </QueryClientProvider>
);
