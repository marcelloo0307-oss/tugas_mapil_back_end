'use client';

import React from 'react';
import { Journal } from '../types/journal';
import { useAuth } from '../context/AuthContext';
import { CalendarIcon, UserIcon, EditIcon, TrashIcon, ArrowRightIcon, CompassIcon, ShieldIcon } from './Icons';

interface JournalCardProps {
  journal: Journal;
  onReadMore: (journal: Journal) => void;
  onEdit: (journal: Journal) => void;
  onDelete: (journal: Journal) => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({
  journal,
  onReadMore,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();

  const isOwner = user && Number(user.id) === Number(journal.user_id);
  const isAdmin = user && user.role === 'admin';
  const canManage = isOwner || isAdmin;

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Baru Saja';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Baru Saja';
    }
  };

  const getBadgeClass = (category: string) => {
    if (!category) return 'badge badge-blue';
    if (category.includes('Flora') || category.includes('Fauna') || category.includes('Konservasi')) {
      return 'badge badge-cyan';
    }
    return 'badge badge-blue';
  };

  return (
    <article
      className="simple-card"
      id={`journal-card-${journal.id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Thumbnail */}
      <div
        onClick={() => onReadMore(journal)}
        style={{
          position: 'relative',
          width: '100%',
          height: '190px',
          background: '#e0f2fe',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {journal.image_url ? (
          <img
            src={journal.image_url}
            alt={journal.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--blue-light)',
            color: 'var(--blue-primary)',
          }}>
            <CompassIcon size={38} />
          </div>
        )}

        {/* Category Badge */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          gap: '6px',
        }}>
          <span className={getBadgeClass(journal.category)}>
            {journal.category || 'Observasi'}
          </span>
          {isAdmin && !isOwner && (
            <span className="badge badge-admin" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
              <ShieldIcon size={11} />
              <span>Admin Mode</span>
            </span>
          )}
        </div>

        {/* Management actions (Owner or Admin) */}
        {canManage && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            display: 'flex',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.92)',
            padding: '3px',
            borderRadius: '6px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(journal);
              }}
              className="btn-icon"
              title={isAdmin && !isOwner ? 'Edit Jurnal (Sebagai Administrator)' : 'Edit Jurnal'}
              id={`btn-edit-${journal.id}`}
              style={{ border: 'none' }}
            >
              <EditIcon size={14} color="var(--blue-primary)" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(journal);
              }}
              className="btn-icon"
              title={isAdmin && !isOwner ? 'Hapus Jurnal (Sebagai Administrator)' : 'Hapus Jurnal'}
              id={`btn-delete-${journal.id}`}
              style={{ border: 'none' }}
            >
              <TrashIcon size={14} color="#dc2626" />
            </button>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div style={{
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>
        {/* Author & Date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <UserIcon size={13} color="var(--blue-primary)" />
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {journal.username || 'Penulis'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CalendarIcon size={12} />
            <span>{formatDate(journal.created_at)}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onReadMore(journal)}
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            lineHeight: 1.4,
            marginBottom: '8px',
            color: 'var(--text-main)',
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {journal.title}
        </h3>

        {/* Excerpt */}
        <p style={{
          fontSize: '0.86rem',
          color: 'var(--text-muted)',
          lineHeight: 1.55,
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {journal.content}
        </p>

        {/* Read More Button */}
        <div style={{
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <button
            onClick={() => onReadMore(journal)}
            className="btn btn-secondary"
            id={`btn-read-${journal.id}`}
            style={{
              padding: '7px 12px',
              fontSize: '0.82rem',
              width: '100%',
              justifyContent: 'space-between',
              color: 'var(--blue-primary)',
              fontWeight: 600,
            }}
          >
            <span>Baca Selengkapnya</span>
            <ArrowRightIcon size={13} />
          </button>
        </div>
      </div>
    </article>
  );
};
