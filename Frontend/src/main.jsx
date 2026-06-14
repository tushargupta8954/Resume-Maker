import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "regenerator-runtime/runtime";

import { store, persistor } from "./app/store.js";
import App from "./App.jsx";
import "./index.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center animate-pulse">
                <span className="text-white text-xl font-bold">R</span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        }
        persistor={persistor}
      >
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            gutter={12}
            containerStyle={{ top: 20, right: 20 }}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#1e293b",
                borderRadius: "12px",
                boxShadow:
                  "0 10px 40px -10px rgba(0,0,0,0.15), 0 4px 6px -2px rgba(0,0,0,0.05)",
                border: "1px solid #e2e8f0",
                fontSize: "0.875rem",
                fontFamily: "Inter, sans-serif",
                padding: "12px 16px",
                maxWidth: "380px",
              },
              success: {
                iconTheme: { primary: "#10b981", secondary: "#fff" },
                style: { borderLeft: "4px solid #10b981" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#fff" },
                style: { borderLeft: "4px solid #ef4444" },
              },
              loading: {
                iconTheme: { primary: "#6366f1", secondary: "#fff" },
                style: { borderLeft: "4px solid #6366f1" },
              },
            }}
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);