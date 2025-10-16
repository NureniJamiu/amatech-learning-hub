import { useState, useCallback } from 'react';

export interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((toast: Toast) => {
    // In a real implementation, this would show a toast notification
    // For now, we'll just log it and use browser alert as fallback
    console.log('Toast:', toast);
    
    if (toast.variant === 'destructive') {
      alert(`Error: ${toast.title}\n${toast.description || ''}`);
    } else {
      alert(`${toast.title}\n${toast.description || ''}`);
    }

    setToasts((prev) => [...prev, toast]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== toast));
    }, 5000);
  }, []);

  return { toast, toasts };
}
