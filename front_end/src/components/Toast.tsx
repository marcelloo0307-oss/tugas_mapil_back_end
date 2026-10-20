'use client';

import React from 'react';
import { CheckCircleIcon, AlertCircleIcon, CloseIcon } from './Icons';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            minWidth: '260px',
            maxWidth: '380px',
            padding: '10px 14px',
            borderRadius: '8px',
            background: '#ffffff',
            border: `1px solid ${
              toast.type === 'success' 
                ? '#86efac' 
                : toast.type === 'error' 
                ? '#fca5a5' 
                : '#bfdbfe'
            }`,
            boxShadow: 'var(--shadow-md)',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {toast.type === 'success' && <CheckCircleIcon size={16} color="#16a34a" />}
            {toast.type === 'error' && <AlertCircleIcon size={16} color="#dc2626" />}
            {toast.type === 'info' && <AlertCircleIcon size={16} color="var(--blue-primary)" />}
            <span style={{ fontSize: '0.84rem', fontWeight: 500 }}>{toast.text}</span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
            }}
          >
            <CloseIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
