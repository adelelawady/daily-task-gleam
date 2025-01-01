import { useState } from "react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, action }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, title, description, action };
    
    setToasts((currentToasts) => [...currentToasts, newToast]);
    
    setTimeout(() => {
      setToasts((currentToasts) => 
        currentToasts.filter((toast) => toast.id !== id)
      );
    }, 5000);
  };

  return {
    toasts,
    toast,
  };
}