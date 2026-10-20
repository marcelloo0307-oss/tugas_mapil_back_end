import { Journal, AuthResponse } from '../types/journal';

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    return 'https://tugas-mapil-back-end.vercel.app/api';
  }
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Sample fallback journals showcasing Indonesian nature exploration
export const FALLBACK_JOURNALS: Journal[] = [
  {
    id: 1,
    user_id: 1,
    username: 'RimbaWanderer',
    title: 'Menyusuri Keheningan Lembah Ramma di Kaki Gunung Bawakaraeng',
    category: 'Ekspedisi & Pendakian',
    content: 'Pagi ini kabut tebal menyelimuti hamparan rumput hijau Lembah Ramma. Suhu berkisar 14 derajat Celsius dengan hembusan angin sejuk yang menyegarkan. Kami mendirikan bivak di dekat aliran mata air jernih yang mengalir dari lereng bebatuan andesit purba. Sepanjang jalur pendakian dari desa Lembanna, vegetasi pinus merkusii mendominasi sebelum berganti menjadi hutan lumut basah yang kaya akan anggrek hutan liar (Bulbophyllum sp.) dan lumut hati.',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 2,
    user_id: 2,
    username: 'NusaBio',
    title: 'Penemuan Koloni Baru Anggrek Hitam (Coelogyne pandurata) di Pedalaman Hutan Kutai',
    category: 'Flora & Fauna',
    content: 'Dalam survei botani mandiri di area penyangga Taman Nasional Kutai, tim kami menemukan 8 rumpun sehat anggrek hitam Kalimantan yang sedang mekar sempurna. Kelopak hijaunya kontras dengan lidah hitam legam yang memiliki tekstur beludru unik. Kami mendokumentasikan serangga penyerbuk alaminya serta mengukur tingkat kelembaban kanopi sebesar 88% dengan pH serasah tanah 6.2. Konservasi habitat mikro ini sangat krusial bagi kelangsungan plasma nutfah khas Kalimantan.',
    image_url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    username: 'RimbaWanderer',
    title: 'Formasi Stalaktit Spektakuler Gua Salukangkang: Rahasia Karst Maros-Pangkep',
    category: 'Geologi & Bentang Alam',
    content: 'Kawasan Karst Maros-Pangkep merupakan bentang alam menara karst terbesar kedua di dunia. Di dalam sistem gua Salukangkang sepanjang 12 kilometer, kami menelusuri lorong bawah tanah bertabur ornamen kalsit aktif: flowstone berkilau bagai tirai kristal dan helectite unik yang tumbuh menentang gravitasi. Suhu di dalam gua stabil pada 23°C dengan kelembaban mendekati 95%. Ekosistem gelap abadi ini dihuni udang buta transparan (Macrobrachium poeti) dan kelelawar buah penghasil guano.',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
  },
  {
    id: 4,
    user_id: 3,
    username: 'LestariAlam',
    title: 'Restorasi Terumbu Karang Mandiri di Kepulauan Derawan: 6 Bulan Pemantauan Fragmen',
    category: 'Konservasi & Hutan',
    content: 'Evaluasi struktur biorock dan spider web coral transplan di kedalaman 8-12 meter menunjukkan tingkat kelangsungan hidup fragmen Acropora formosa mencapai 91%. Polip karang tampak aktif merekat kuat pada substrat kalsium karbonat buatan. Ikan karang herbivora seperti Acanthuridae (ikan bedil) dan Scaridae mulai kembali mencari makan di terumbu baru, menekan laju pertumbuhan alga makro yang mengancam koloni karang muda.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
  }
];

export async function fetchJournals(): Promise<{ journals: Journal[]; isLive: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/journals`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const journalsList: Journal[] = Array.isArray(data) ? data : (data.data || []);
    
    // If backend returns empty list, fall back to sample so user can see UI
    if (journalsList.length === 0) {
      return { journals: FALLBACK_JOURNALS, isLive: true };
    }

    return { journals: journalsList, isLive: true };
  } catch (err: any) {
    console.warn('Backend API connection failed, using local journal data:', err.message);
    return { journals: FALLBACK_JOURNALS, isLive: false, error: err.message };
  }
}

export async function createJournalApi(formData: FormData, token: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/journals`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Gagal membuat jurnal');
  }
  return data;
}

export async function updateJournalApi(id: number, formData: FormData, token: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/journals/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Gagal memperbarui jurnal');
  }
  return data;
}

export async function deleteJournalApi(id: number, token: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/journals/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Gagal menghapus jurnal');
  }
  return data;
}

export async function loginApi(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Login gagal, periksa username atau password');
  }
  return data;
}

export async function registerApi(
  username: string,
  password: string,
  role: string = 'penulis',
  adminSecret?: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role, adminSecret }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Pendaftaran gagal');
  }
  return data;
}
