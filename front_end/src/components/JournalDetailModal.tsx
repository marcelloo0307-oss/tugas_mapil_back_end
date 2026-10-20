'use client';

import React, { useEffect } from 'react';
import { Journal } from '../types/journal';
import { CloseIcon, CalendarIcon, CompassIcon } from './Icons';

interface JournalDetailModalProps {
  journal: Journal | null;
  onClose: () => void;
  onEdit: (journal: Journal) => void;
  onDelete: (journal: Journal) => void;
}

export const JournalDetailModal: React.FC<JournalDetailModalProps> = ({
  journal,
  onClose,
  onEdit,
  onDelete,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!journal) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Waktu Sekarang';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Waktu Sekarang';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          background: '#ffffff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Image */}
        {journal.image_url ? (
          <div style={{ position: 'relative', width: '100%', height: '260px', background: '#f1f5f9' }}>
            <img
              src={journal.image_url}
              alt={journal.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div style={{
            height: '100px',
            background: 'var(--blue-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--blue-primary)',
          }}>
            <CompassIcon size={36} />
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-detail"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 10,
          }}
        >
          <CloseIcon size={16} />
        </button>

        {/* Modal Body */}
        <div style={{ padding: '22px', overflowY: 'auto', maxHeight: 'calc(90vh - 240px)' }}>
          {/* Category & Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="badge badge-blue">
              {journal.category || 'Observasi'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <CalendarIcon size={13} />
              <span>{formatDate(journal.created_at)}</span>
            </div>
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: '1.4rem',
            lineHeight: 1.3,
            marginBottom: '14px',
            color: 'var(--text-main)',
          }}>
            {journal.title}
          </h2>

          {/* Author info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-subtle)',
            marginBottom: '16px',
            gap: '8px',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--blue-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#ffffff',
            }}>
              {(journal.username || 'P').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>{journal.username || 'Penulis'}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Laporan Observasi Lapangan</div>
            </div>
          </div>

          {/* Content Paragraphs */}
          <div style={{
            fontSize: '0.92rem',
            lineHeight: 1.7,
            color: '#334155',
            whiteSpace: 'pre-line',
          }}>
            {journal.content}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '12px 20px',
          background: '#f8fafc',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} className="btn btn-secondary">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
