/**
 * Toast.jsx
 * Thin wrapper / helper around react-hot-toast
 * Provides pre-styled custom toast variants callable as functions.
 *
 * Usage:
 *   import Toast from "@components/common/Toast";
 *   Toast.success("Saved!");
 *   Toast.error("Something went wrong");
 *   Toast.ai("AI is thinking...");
 *   Toast.promise(myPromise, { loading:"...", success:"Done!", error:"Oops" })
 */

import toast from "react-hot-toast";
import {
  CheckCircle, XCircle, Info,
  AlertTriangle, Sparkles, Loader2,
} from "lucide-react";

// ── Shared style ──────────────────────────────────────────────────────────────
const base = {
  style: {
    fontFamily: "Inter, sans-serif",
    fontSize: "0.875rem",
    borderRadius: "12px",
    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15), 0 4px 6px -2px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    padding: "12px 16px",
    maxWidth: "380px",
    background: "#fff",
    color: "#1e293b",
  },
  duration: 4000,
};

// ── Factory ───────────────────────────────────────────────────────────────────
const make = (message, overrides = {}) =>
  toast(message, { ...base, ...overrides });

// ── Named helpers ─────────────────────────────────────────────────────────────
const Toast = {
  success: (message, opts = {}) =>
    toast.success(message, {
      ...base,
      style: { ...base.style, borderLeft: "4px solid #10b981" },
      iconTheme: { primary: "#10b981", secondary: "#fff" },
      ...opts,
    }),

  error: (message, opts = {}) =>
    toast.error(message, {
      ...base,
      duration: 5000,
      style: { ...base.style, borderLeft: "4px solid #ef4444" },
      iconTheme: { primary: "#ef4444", secondary: "#fff" },
      ...opts,
    }),

  info: (message, opts = {}) =>
    make(message, {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      style: { ...base.style, borderLeft: "4px solid #3b82f6" },
      ...opts,
    }),

  warning: (message, opts = {}) =>
    make(message, {
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      style: { ...base.style, borderLeft: "4px solid #f59e0b" },
      duration: 5000,
      ...opts,
    }),

  /** Special AI thinking toast */
  ai: (message = "AI is working its magic...", opts = {}) =>
    toast.loading(message, {
      ...base,
      style: {
        ...base.style,
        borderLeft: "4px solid #8b5cf6",
        background: "linear-gradient(135deg, #faf5ff, #f0f9ff)",
      },
      icon: <Sparkles className="w-5 h-5 text-violet-500 animate-pulse" />,
      ...opts,
    }),

  loading: (message = "Loading...", opts = {}) =>
    toast.loading(message, {
      ...base,
      style: { ...base.style, borderLeft: "4px solid #6366f1" },
      ...opts,
    }),

  promise: (promise, messages, opts = {}) =>
    toast.promise(
      promise,
      {
        loading: messages.loading || "Loading...",
        success: messages.success || "Done!",
        error:   messages.error   || "Something went wrong.",
      },
      {
        ...base,
        ...opts,
        success: {
          style: { ...base.style, borderLeft: "4px solid #10b981" },
          iconTheme: { primary: "#10b981", secondary: "#fff" },
          ...(opts.success || {}),
        },
        error: {
          style: { ...base.style, borderLeft: "4px solid #ef4444" },
          iconTheme: { primary: "#ef4444", secondary: "#fff" },
          ...(opts.error || {}),
        },
      }
    ),

  dismiss: (id) => toast.dismiss(id),
  dismissAll: () => toast.dismiss(),
};

export default Toast;