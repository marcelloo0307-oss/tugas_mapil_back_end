'use client';

import React from 'react';
import { SearchIcon } from './Icons';
import { CategoryOption } from '../types/journal';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryOption;
  onSelectCategory: (cat: CategoryOption) => void;
  totalJournals: number;
}

const CATEGORIES: CategoryOption[] = [
  'Semua',
  'Catatan Observasi',
  'Flora & Fauna',
  'Ekspedisi & Pendakian',
  'Konservasi & Hutan',
  'Geologi & Bentang Alam',
  'Tips Eksplorasi Alam',
];

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalJournals,
}) => {
  return (
    <section style={{
      padding: '32px 0 24px',
      marginBottom: '20px',
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        
        {/* Simple Title */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '8px',
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)',
        }}>
          Catatan Observasi & Ekspedisi Alam
        </h1>

        {/* Simple Subtitle */}
        <p style={{
          fontSize: '0.96rem',
          color: '#1e3a8a',
          fontWeight: 500,
          maxWidth: '580px',
          margin: '0 auto 20px',
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
        }}>
          Dokumentasi flora-fauna liar, bentang alam, dan catatan petualangan rimba Nusantara.
        </p>

        {/* Search Box */}
        <div style={{
          maxWidth: '500px',
          margin: '0 auto 16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            border: '2px solid var(--border-card)',
            borderRadius: 'var(--radius-full)',
            padding: '5px 8px 5px 16px',
            boxShadow: 'var(--shadow-md)',
          }}>
            <SearchIcon size={18} color="var(--blue-primary)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari judul jurnal, flora-fauna, atau penulis..."
              id="search-input"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.9rem',
                padding: '8px 10px',
                color: 'var(--text-main)',
                fontFamily: 'inherit',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                }}
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Simple Category Filter Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '6px',
        }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                style={{
                  background: isActive ? 'var(--blue-primary)' : '#ffffff',
                  color: isActive ? '#ffffff' : '#1e3a8a',
                  border: `1px solid ${isActive ? 'var(--blue-primary)' : 'var(--border-card)'}`,
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 8px rgba(29, 78, 216, 0.3)' : 'var(--shadow-sm)',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
