'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Journal } from '../types/journal';
import { CloseIcon, CameraIcon } from './Icons';

interface JournalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, editingId?: number) => Promise<void>;
  editingJournal: Journal | null;
}

const CATEGORY_LIST = [
  'Catatan Observasi',
  'Flora & Fauna',
  'Ekspedisi & Pendakian',
  'Konservasi & Hutan',
  'Geologi & Bentang Alam',
  'Tips Eksplorasi Alam',
];

export const JournalFormModal: React.FC<JournalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingJournal,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORY_LIST[0]);
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingJournal) {
      setTitle(editingJournal.title || '');
      setCategory(editingJournal.category || CATEGORY_LIST[0]);
      setContent(editingJournal.content || '');
      setPreviewUrl(editingJournal.image_url || null);
      setSelectedFile(null);
    } else {
      setTitle('');
      setCategory(CATEGORY_LIST[0]);
      setContent('');
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    setErrorMessage('');
  }, [editingJournal, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMessage('Judul dan isi catatan observasi wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('content', content.trim());
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      await onSubmit(formData, editingJournal ? editingJournal.id : undefined);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat menyimpan jurnal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '560px' }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {editingJournal ? 'Edit Jurnal Observasi' : 'Tulis Jurnal Baru'}
          </h3>
          <button
            onClick={onClose}
            id="btn-close-form"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {errorMessage && (
            <div style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '0.84rem',
              marginBottom: '14px',
            }}>
              {errorMessage}
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="journal-title">Judul Jurnal</label>
            <input
              type="text"
              id="journal-title"
              className="form-input"
              placeholder="Contoh: Pengamatan Flora di Taman Nasional Kutai"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="journal-category">Kategori</label>
            <select
              id="journal-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORY_LIST.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div className="form-group">
            <label className="form-label" htmlFor="journal-content">Isi Catatan Observasi</label>
            <textarea
              id="journal-content"
              className="form-textarea"
              placeholder="Tuliskan temuan atau catatan lapangan..."
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* Image Upload Dropzone */}
          <div className="form-group">
            <label className="form-label">Foto Dokumentasi</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
              id="file-upload-input"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '1px dashed #94a3b8',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#f8fafc',
              }}
            >
              {previewUrl ? (
                <div>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--blue-primary)', fontWeight: 600 }}>
                    Klik untuk mengganti foto
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <CameraIcon size={24} color="var(--blue-primary)" />
                  <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                    Pilih Foto Lapangan
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    JPG, PNG, WEBP
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '20px',
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              id="btn-submit-journal"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : (editingJournal ? 'Simpan Perubahan' : 'Terbitkan Jurnal')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
