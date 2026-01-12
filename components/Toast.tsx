import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'SUCCESS' | 'ERROR' | 'INFO';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'SUCCESS') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-premium border backdrop-blur-md animate-slide-up transition-all transform ${
                toast.type === 'SUCCESS' ? 'bg-white/90 border-brand-lime/30 text-brand-deep' :
                toast.type === 'ERROR' ? 'bg-white/90 border-red-200 text-red-600' :
                'bg-white/90 border-slate-200 text-slate-700'
            }`}
          >
            <div className={`shrink-0 ${toast.type === 'SUCCESS' ? 'text-brand-lime' : toast.type === 'ERROR' ? 'text-red-500' : 'text-blue-500'}`}>
                {toast.type === 'SUCCESS' && <CheckCircle2 size={20} />}
                {toast.type === 'ERROR' && <AlertCircle size={20} />}
                {toast.type === 'INFO' && <Info size={20} />}
            </div>
            <p className="text-sm font-semibold flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};