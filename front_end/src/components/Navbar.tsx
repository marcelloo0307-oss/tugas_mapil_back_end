'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CompassIcon, PlusIcon, LogInIcon, LogOutIcon, ShieldIcon } from './Icons';

interface NavbarProps {
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
  onOpenCreateModal: () => void;
  isBackendLive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenCreateModal,
  isBackendLive,
}) => {
  const { user, logout, setDemoUser } = useAuth();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border-subtle)',
      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.06)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '66px',
      }}>
        {/* Brand */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
          }}>
            <CompassIcon size={22} />
          </div>
          <div>
            <div style={{
              fontSize: '1.08rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>Jurnal Alam Mapil</span>
              <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>MAPIL</span>
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: isBackendLive ? '#059669' : '#2563eb',
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isBackendLive ? '#10b981' : '#3b82f6',
                }} />
                {isBackendLive ? 'Backend Terhubung' : 'Mode Demo'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <>
              <button
                onClick={onOpenCreateModal}
                className="btn btn-primary"
                id="btn-tulis-jurnal"
                style={{ fontSize: '0.84rem', padding: '7px 14px' }}
              >
                <PlusIcon size={15} />
                <span>Tulis Jurnal</span>
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                borderRadius: 'var(--radius-sm)',
                background: user.role === 'admin' ? '#fef2f2' : 'var(--blue-light)',
                border: `1px solid ${user.role === 'admin' ? '#fecaca' : '#bfdbfe'}`,
                fontSize: '0.82rem',
              }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: user.role === 'admin' ? '#dc2626' : 'var(--blue-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}>
                  {user.role === 'admin' ? 'A' : user.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
                    {user.username}
                  </span>
                  {user.role === 'admin' ? (
                    <span style={{ fontSize: '0.68rem', color: '#b91c1c', fontWeight: 700 }}>
                      Administrator
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.68rem', color: 'var(--blue-text)', fontWeight: 600 }}>
                      Penulis
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={logout}
                className="btn btn-secondary"
                id="btn-logout"
                title="Keluar"
                style={{ padding: '7px 10px' }}
              >
                <LogOutIcon size={15} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  const code = prompt('Masukkan Kode Rahasia Developer untuk Mode Admin:');
                  if (code === 'mapil2026') {
                    setDemoUser(true);
                  } else if (code !== null) {
                    alert('Kode rahasia developer salah! Hanya developer yang diizinkan masuk mode admin.');
                  }
                }}
                className="btn btn-secondary"
                id="btn-demo-admin"
                title="Khusus Developer: Masuk Mode Administrator"
                style={{
                  fontSize: '0.78rem',
                  padding: '6px 12px',
                  background: '#fef2f2',
                  borderColor: '#fca5a5',
                  color: '#b91c1c',
                  fontWeight: 600,
                }}
              >
                <ShieldIcon size={13} color="#dc2626" />
                <span>🔒 Admin Dev</span>
              </button>

              <button
                onClick={() => setDemoUser(false)}
                className="btn btn-secondary"
                id="btn-demo-author"
                title="Coba Akun Demo Penulis"
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                Demo Penulis
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="btn btn-secondary"
                id="btn-login"
                style={{ fontSize: '0.84rem', padding: '6px 14px' }}
              >
                <LogInIcon size={14} />
                <span>Masuk</span>
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="btn btn-primary"
                id="btn-register"
                style={{ fontSize: '0.84rem', padding: '6px 14px' }}
              >
                <span>Daftar</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
