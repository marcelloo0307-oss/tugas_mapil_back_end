'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CloseIcon, UserIcon, ShieldIcon } from './Icons';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'penulis' | 'admin'>('penulis');
  const [adminSecret, setAdminSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register, setDemoUser } = useAuth();

  useEffect(() => {
    setMode(initialMode);
    setUsername('');
    setPassword('');
    setRole('penulis');
    setAdminSecret('');
    setError('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username dan password wajib diisi.');
      return;
    }

    if (mode === 'register' && role === 'admin' && !adminSecret.trim()) {
      setError('Kode rahasia developer wajib diisi untuk mendaftar sebagai Admin.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      if (mode === 'login') {
        await login(username.trim(), password);
        onSuccess(`Selamat datang kembali, ${username}!`);
      } else {
        await register(username.trim(), password, role, adminSecret.trim());
        onSuccess(
          role === 'admin'
            ? `Akun Administrator ${username} berhasil diverifikasi & dibuat!`
            : `Akun Penulis ${username} berhasil dibuat!`
        );
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Terjadi kendala autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (asAdmin: boolean = false) => {
    if (asAdmin) {
      const code = prompt('Masukkan Kode Rahasia Developer untuk mengaktifkan Mode Admin:');
      if (code !== 'mapil2026') {
        setError('Kode rahasia developer salah! Hanya developer yang diizinkan masuk mode admin.');
        return;
      }
    }
    setDemoUser(asAdmin);
    onSuccess(asAdmin ? 'Masuk sebagai Mode Demo Admin (Terverifikasi)' : 'Masuk sebagai Mode Demo Penulis');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '420px' }}
      >
        {/* Header Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
        }}>
          <button
            onClick={() => { setMode('login'); setError(''); }}
            id="tab-login"
            style={{
              flex: 1,
              padding: '14px',
              background: 'transparent',
              border: 'none',
              borderBottom: mode === 'login' ? '2px solid var(--blue-primary)' : '2px solid transparent',
              color: mode === 'login' ? 'var(--blue-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Masuk
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            id="tab-register"
            style={{
              flex: 1,
              padding: '14px',
              background: 'transparent',
              border: 'none',
              borderBottom: mode === 'register' ? '2px solid var(--blue-primary)' : '2px solid transparent',
              color: mode === 'register' ? 'var(--blue-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Daftar Akun Baru
          </button>

          <button
            onClick={onClose}
            id="btn-close-auth"
            style={{
              position: 'absolute',
              right: '10px',
              top: '10px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {error && (
            <div style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '0.82rem',
              marginBottom: '14px',
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-username">Username</label>
            <input
              type="text"
              id="auth-username"
              className="form-input"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">Password</label>
            <input
              type="password"
              id="auth-password"
              className="form-input"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role selector for registration */}
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Peran Akun</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}>
                <div
                  onClick={() => setRole('penulis')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${role === 'penulis' ? 'var(--blue-primary)' : '#cbd5e1'}`,
                    background: role === 'penulis' ? 'var(--blue-light)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: role === 'penulis' ? 'var(--blue-text)' : 'var(--text-main)',
                  }}
                >
                  <UserIcon size={14} color={role === 'penulis' ? 'var(--blue-primary)' : 'var(--text-muted)'} />
                  <span>Penulis</span>
                </div>

                <div
                  onClick={() => setRole('admin')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${role === 'admin' ? '#dc2626' : '#cbd5e1'}`,
                    background: role === 'admin' ? '#fef2f2' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: role === 'admin' ? '#b91c1c' : 'var(--text-main)',
                  }}
                >
                  <ShieldIcon size={14} color={role === 'admin' ? '#dc2626' : 'var(--text-muted)'} />
                  <span>Admin (Penuh)</span>
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {role === 'admin'
                  ? '🛡️ Akun Admin berhak mengedit & menghapus SEMUA jurnal di sistem (Memerlukan kode developer).'
                  : '✍️ Akun Penulis hanya dapat mengedit/menghapus jurnal miliknya sendiri.'}
              </div>
            </div>
          )}

          {/* Admin Developer Secret Passcode Input */}
          {mode === 'register' && role === 'admin' && (
            <div className="form-group" style={{ animation: 'fadeIn 0.2s ease-in' }}>
              <label className="form-label" htmlFor="auth-admin-secret" style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>🔒 Kode Rahasia Developer</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 400 }}>(Khusus Pengembang)</span>
              </label>
              <input
                type="password"
                id="auth-admin-secret"
                className="form-input"
                placeholder="Masukkan kode rahasia developer"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                required
                style={{
                  borderColor: '#fca5a5',
                  background: '#fef2f2',
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#b91c1c' }}>
                Hanya developer yang mengetahui kode ini yang dapat membuat akun Admin.
              </span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            id="btn-auth-submit"
            disabled={isLoading}
            style={{ width: '100%', marginTop: '6px', padding: '10px' }}
          >
            {isLoading
              ? 'Memproses...'
              : (mode === 'login' ? 'Masuk' : (role === 'admin' ? 'Daftar sebagai Admin' : 'Daftar sebagai Penulis'))}
          </button>

          {/* Quick Demo Options */}
          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Atau coba langsung tanpa membuat akun:
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo(true)}
                className="btn btn-secondary"
                id="btn-quick-demo-admin"
                style={{
                  fontSize: '0.76rem',
                  padding: '6px 12px',
                  background: '#fef2f2',
                  borderColor: '#fca5a5',
                  color: '#b91c1c',
                  fontWeight: 600,
                }}
              >
                <ShieldIcon size={13} color="#dc2626" />
                <span>Demo Admin (Akses Hapus Semua)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(false)}
                className="btn btn-secondary"
                id="btn-quick-demo-author"
                style={{ fontSize: '0.76rem', padding: '6px 12px' }}
              >
                <UserIcon size={13} color="var(--blue-primary)" />
                <span>Demo Penulis</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
