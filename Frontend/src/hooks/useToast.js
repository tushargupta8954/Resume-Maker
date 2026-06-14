import toast from "react-hot-toast";

const useToast = () => {
  const success = (message, options = {}) => {
    toast.success(message, { duration: 4000, ...options });
  };

  const error = (message, options = {}) => {
    toast.error(message, { duration: 5000, ...options });
  };

  const info = (message, options = {}) => {
    toast(message, {
      duration: 4000,
      icon: "ℹ️",
      ...options,
    });
  };

  const loading = (message) => {
    return toast.loading(message);
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  const promise = (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || "Loading...",
      success: messages.success || "Done!",
      error: messages.error || "Something went wrong.",
    });
  };

  return { success, error, info, loading, dismiss, promise };
};

export default useToast;