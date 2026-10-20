'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Journal, CategoryOption } from '../types/journal';
import { useAuth } from '../context/AuthContext';
import {
  fetchJournals,
  createJournalApi,
  updateJournalApi,
  deleteJournalApi,
} from '../lib/api';

import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { JournalCard } from '../components/JournalCard';
import { JournalDetailModal } from '../components/JournalDetailModal';
import { JournalFormModal } from '../components/JournalFormModal';
import { AuthModal } from '../components/AuthModal';
import { ToastContainer, ToastMessage } from '../components/Toast';
import {
  RefreshCwIcon,
  PlusIcon,
  CompassIcon,
  AlertCircleIcon,
} from '../components/Icons';

export default function HomePage() {
  const { user, token } = useAuth();

  // Data states
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendLive, setIsBackendLive] = useState<boolean>(false);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('Semua');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modals & UI states
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const [detailJournal, setDetailJournal] = useState<Journal | null>(null);
  const [deleteConfirmJournal, setDeleteConfirmJournal] = useState<Journal | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch journals
  const loadJournals = async (showToast = false) => {
    try {
      setIsLoading(true);
      const res = await fetchJournals();
      setJournals(res.journals);
      setIsBackendLive(res.isLive);
      if (showToast) {
        if (res.isLive) {
          addToast('Data jurnal berhasil diperbarui dari server!', 'success');
        } else {
          addToast('Backend belum terhubung. Menggunakan data demo lokal.', 'info');
        }
      }
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat jurnal', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJournals(false);
  }, []);

  // Filter and sort journals
  const filteredJournals = useMemo(() => {
    return journals
      .filter((j) => {
        // Category filter
        if (selectedCategory !== 'Semua') {
          if (!j.category || !j.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
            return false;
          }
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = j.title?.toLowerCase().includes(q);
          const matchContent = j.content?.toLowerCase().includes(q);
          const matchUser = j.username?.toLowerCase().includes(q);
          const matchCat = j.category?.toLowerCase().includes(q);
          return matchTitle || matchContent || matchUser || matchCat;
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [journals, selectedCategory, searchQuery, sortOrder]);

  // Handle Journal Submit (Create or Update)
  const handleJournalSubmit = async (formData: FormData, editingId?: number) => {
    if (editingId) {
      // UPDATE
      if (isBackendLive && token) {
        try {
          const updatedRes = await updateJournalApi(editingId, formData, token);
          addToast('Jurnal berhasil disimpan di server!', 'success');
          setJournals((prev) =>
            prev.map((item) =>
              item.id === editingId
                ? {
                    ...item,
                    title: (formData.get('title') as string) || item.title,
                    category: (formData.get('category') as string) || item.category,
                    content: (formData.get('content') as string) || item.content,
                    image_url: updatedRes.data?.image_url || item.image_url,
                  }
                : item
            )
          );
        } catch (err: any) {
          addToast(err.message || 'Gagal memperbarui jurnal', 'error');
          throw err;
        }
      } else {
        // Offline / Simulation update
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const content = formData.get('content') as string;
        const file = formData.get('image') as File | null;
        let newImageUrl: string | undefined = undefined;
        if (file && file.size > 0) {
          newImageUrl = URL.createObjectURL(file);
        }

        setJournals((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  title: title || item.title,
                  category: category || item.category,
                  content: content || item.content,
                  image_url: newImageUrl || item.image_url,
                }
              : item
          )
        );
        addToast('Jurnal berhasil diperbarui!', 'success');
      }
    } else {
      // CREATE NEW
      if (isBackendLive && token) {
        try {
          const newRes = await createJournalApi(formData, token);
          addToast('Jurnal berhasil ditambahkan ke server!', 'success');
          const createdItem: Journal = newRes.data || {
            id: Date.now(),
            user_id: user?.id || 1,
            username: user?.username || 'Penulis',
            title: formData.get('title') as string,
            category: formData.get('category') as string,
            content: formData.get('content') as string,
            image_url: newRes.data?.image_url || null,
            created_at: new Date().toISOString(),
          };
          setJournals((prev) => [createdItem, ...prev]);
        } catch (err: any) {
          addToast(err.message || 'Gagal menambahkan jurnal', 'error');
          throw err;
        }
      } else {
        // Offline / Simulation create
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const content = formData.get('content') as string;
        const file = formData.get('image') as File | null;
        let imgUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
        if (file && file.size > 0) {
          imgUrl = URL.createObjectURL(file);
        }

        const newJournal: Journal = {
          id: Date.now(),
          user_id: user?.id || 1,
          username: user?.username || 'Penulis Alam',
          title,
          category,
          content,
          image_url: imgUrl,
          created_at: new Date().toISOString(),
        };

        setJournals((prev) => [newJournal, ...prev]);
        addToast('Jurnal baru berhasil ditambahkan!', 'success');
      }
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirmJournal) return;

    const id = deleteConfirmJournal.id;
    if (isBackendLive && token) {
      try {
        await deleteJournalApi(id, token);
        setJournals((prev) => prev.filter((j) => j.id !== id));
        addToast(
          user?.role === 'admin'
            ? 'Jurnal berhasil dihapus dari server (Moderasi Admin).'
            : 'Jurnal berhasil dihapus dari server.',
          'success'
        );
      } catch (err: any) {
        addToast(err.message || 'Gagal menghapus jurnal', 'error');
      }
    } else {
      setJournals((prev) => prev.filter((j) => j.id !== id));
      addToast(
        user?.role === 'admin'
          ? 'Jurnal telah dihapus (Moderasi Admin).'
          : 'Jurnal telah dihapus.',
        'success'
      );
    }
    setDeleteConfirmJournal(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Navbar */}
      <Navbar
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'login');
          setAuthModalOpen(true);
        }}
        onOpenCreateModal={() => {
          setEditingJournal(null);
          setFormModalOpen(true);
        }}
        isBackendLive={isBackendLive}
      />

      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        totalJournals={journals.length}
      />

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, paddingBottom: '60px' }}>
        {/* Controls Bar: Sort, Header, Refresh */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {selectedCategory === 'Semua' ? 'Daftar Jurnal' : selectedCategory}
            </h2>
            <span className="badge badge-blue">
              {filteredJournals.length} Jurnal
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Sort Toggle */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
              className="form-select"
              id="sort-select"
              style={{
                padding: '6px 10px',
                fontSize: '0.82rem',
                width: 'auto',
                background: '#ffffff',
              }}
            >
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={() => loadJournals(true)}
              className="btn btn-secondary"
              id="btn-refresh-journals"
              title="Perbarui data"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            >
              <RefreshCwIcon size={14} />
              <span>Muat Ulang</span>
            </button>
          </div>
        </div>

        {/* Backend status note if offline */}
        {!isBackendLive && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--blue-light)',
            border: '1px solid var(--blue-border)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '0.82rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CompassIcon size={16} color="var(--blue-primary)" />
              <span style={{ color: 'var(--blue-text)' }}>
                <strong>Mode Demo:</strong> Backend belum terhubung di port 3000. Data jurnal tetap bisa ditambah, diedit, dan dihapus secara lokal.
              </span>
            </div>
            <button
              onClick={() => loadJournals(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
            >
              Cek Server
            </button>
          </div>
        )}

        {/* Journals Grid */}
        {isLoading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            gap: '12px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid #cbd5e1',
              borderTopColor: 'var(--blue-primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Memuat data jurnal...
            </div>
          </div>
        ) : filteredJournals.length === 0 ? (
          /* Empty State */
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            borderRadius: 'var(--radius-md)',
            background: '#ffffff',
            border: '1px dashed #cbd5e1',
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Tidak Ada Jurnal Ditemukan</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 16px', fontSize: '0.85rem' }}>
              {searchQuery
                ? `Tidak ada jurnal yang sesuai dengan "${searchQuery}".`
                : 'Belum ada catatan jurnal pada kategori ini.'}
            </p>
            <button
              onClick={() => {
                if (user) {
                  setEditingJournal(null);
                  setFormModalOpen(true);
                } else {
                  setAuthModalOpen(true);
                }
              }}
              className="btn btn-primary"
              id="btn-empty-action"
              style={{ fontSize: '0.85rem' }}
            >
              <PlusIcon size={15} />
              <span>{user ? 'Tulis Jurnal Baru' : 'Masuk untuk Menulis'}</span>
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '20px',
          }}>
            {filteredJournals.map((journal) => (
              <JournalCard
                key={journal.id}
                journal={journal}
                onReadMore={(j) => setDetailJournal(j)}
                onEdit={(j) => {
                  setEditingJournal(j);
                  setFormModalOpen(true);
                }}
                onDelete={(j) => setDeleteConfirmJournal(j)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmJournal && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmJournal(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '400px', padding: '22px', textAlign: 'center' }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <AlertCircleIcon size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>
              {user?.role === 'admin' && Number(user.id) !== Number(deleteConfirmJournal.user_id)
                ? 'Hapus Jurnal (Moderasi Admin)'
                : 'Hapus Jurnal?'}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
              {user?.role === 'admin' && Number(user.id) !== Number(deleteConfirmJournal.user_id)
                ? `Sebagai Administrator, Anda berhak memoderasi dan menghapus jurnal "${deleteConfirmJournal.title}" (karya ${deleteConfirmJournal.username || 'penulis'}). Tindakan ini tidak dapat dibatalkan.`
                : `Apakah Anda yakin ingin menghapus jurnal "${deleteConfirmJournal.title}"?`}
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteConfirmJournal(null)}
                className="btn btn-secondary"
                id="btn-cancel-delete"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn btn-danger"
                id="btn-confirm-delete"
              >
                {user?.role === 'admin' && Number(user.id) !== Number(deleteConfirmJournal.user_id)
                  ? 'Ya, Hapus Jurnal (Admin)'
                  : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <JournalDetailModal
        journal={detailJournal}
        onClose={() => setDetailJournal(null)}
        onEdit={(j) => {
          setDetailJournal(null);
          setEditingJournal(j);
          setFormModalOpen(true);
        }}
        onDelete={(j) => {
          setDetailJournal(null);
          setDeleteConfirmJournal(j);
        }}
      />

      {/* Form Modal (Create & Edit) */}
      <JournalFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingJournal(null);
        }}
        onSubmit={handleJournalSubmit}
        editingJournal={editingJournal}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(msg) => addToast(msg, 'success')}
      />

      {/* Toast System */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Simple Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px 0',
        color: 'var(--text-muted)',
        fontSize: '0.82rem',
        marginTop: 'auto',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <strong>Jurnal Alam Mapil</strong> — Catatan Observasi & Eksplorasi Alam Nusantara
          </div>
          <div>
            © {new Date().getFullYear()} Jurnal Alam Mapil
          </div>
        </div>
      </footer>

      {/* Global CSS animation keyframes */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
