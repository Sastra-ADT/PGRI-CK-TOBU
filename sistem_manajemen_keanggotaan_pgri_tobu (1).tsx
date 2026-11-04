import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, UserPlus, CreditCard, LayoutDashboard, FileSpreadsheet, 
  Settings, Search, Filter, Download, Upload, CheckCircle2, 
  AlertCircle, Trash2, Edit3, Printer, RefreshCw, X, ShieldCheck, 
  MapPin, Building2, Phone, Calendar, Check, FileText, ChevronRight, 
  Menu, User, DollarSign, ExternalLink, Info, School, Award,
  Wifi, WifiOff, FileJson
} from 'lucide-react';

// Data Master Referensi Kec. Tobu (Pembaruan Khusus 3 Sekolah)
const DESA_TOBU = [
  'Tobu', 'Huetile', 'Saenam', 'Tutem', 'Pruda', 'Tune', 'Calli'
];

const SEKOLAH_TOBU = [
  'SMA Negeri Tobu',
  'SMK Kristen Huetalan',
  'SMA Negeri Usapimnasi'
];

const STATUS_KEPEGAWAIAN = [
  'PNS',
  'PPPK Penuh Waktu',
  'PPPK Paruh Waktu',
  'Guru Honorer Daerah (Honda)',
  'Guru Honorer Sekolah',
  'Guru Swasta'
];

// Data Awal Seed Anggota
const INITIAL_MEMBERS = [
  {
    id: 'PGRI-TOBU-001',
    npa: '2402140001',
    nama: 'Marten Luter Kase, S.Pd.',
    nik: '5302141205780001',
    nuptk: '7445756658200023',
    gender: 'Laki-Laki',
    tempatLahir: 'Soe',
    tanggalLahir: '1978-05-12',
    statusPegawai: 'PNS',
    sekolah: 'SMA Negeri Tobu',
    noWa: '081234567890',
    desa: 'Tobu',
    statusKta: 'Terbit',
    statusIuran: 'Lunas',
    tanggalDaftar: '2024-01-15'
  },
  {
    id: 'PGRI-TOBU-002',
    npa: '2402140002',
    nama: 'Yustina Nabunome, S.Pd.K',
    nik: '5302145508820003',
    nuptk: '1234760662200012',
    gender: 'Perempuan',
    tempatLahir: 'Tobu',
    tanggalLahir: '1982-08-15',
    statusPegawai: 'PPPK Penuh Waktu',
    sekolah: 'SMK Kristen Huetalan',
    noWa: '082145678901',
    desa: 'Huetile',
    statusKta: 'Terbit',
    statusIuran: 'Lunas',
    tanggalDaftar: '2024-01-18'
  },
  {
    id: 'PGRI-TOBU-003',
    npa: '2402140003',
    nama: 'Yeftha Baun, S.Pd.',
    nik: '5302142010890002',
    nuptk: '8942767668110034',
    gender: 'Laki-Laki',
    tempatLahir: 'Kapan',
    tanggalLahir: '1989-10-20',
    statusPegawai: 'PPPK Paruh Waktu',
    sekolah: 'SMA Negeri Usapimnasi',
    noWa: '085239123456',
    desa: 'Saenam',
    statusKta: 'Terbit',
    statusIuran: 'Lunas',
    tanggalDaftar: '2024-02-01'
  },
  {
    id: 'PGRI-TOBU-004',
    npa: '2402140004',
    nama: 'Maria S. Tefnai, S.Ag.',
    nik: '5302146411930005',
    nuptk: '-',
    gender: 'Perempuan',
    tempatLahir: 'Huetile',
    tanggalLahir: '1993-11-24',
    statusPegawai: 'Guru Honorer Daerah (Honda)',
    sekolah: 'SMA Negeri Tobu',
    noWa: '081339876543',
    desa: 'Huetile',
    statusKta: 'Pending Verifikasi',
    statusIuran: 'Menunggak',
    tanggalDaftar: '2024-03-10'
  },
  {
    id: 'PGRI-TOBU-005',
    npa: '2402140005',
    nama: 'Daud A. Sian, S.Pd.',
    nik: '5302140304870004',
    nuptk: '4536765667200055',
    gender: 'Laki-Laki',
    tempatLahir: 'Saenam',
    tanggalLahir: '1987-04-03',
    statusPegawai: 'Guru Swasta',
    sekolah: 'SMK Kristen Huetalan',
    noWa: '082236112233',
    desa: 'Saenam',
    statusKta: 'Terbit',
    statusIuran: 'Lunas',
    tanggalDaftar: '2024-02-14'
  },
  {
    id: 'PGRI-TOBU-006',
    npa: '2402140006',
    nama: 'Elisabeth Benu, S.Pd.',
    nik: '5302144709950001',
    nuptk: '-',
    gender: 'Perempuan',
    tempatLahir: 'Pruda',
    tanggalLahir: '1995-09-07',
    statusPegawai: 'PPPK Paruh Waktu',
    sekolah: 'SMA Negeri Usapimnasi',
    noWa: '081239001122',
    desa: 'Pruda',
    statusKta: 'Pending Verifikasi',
    statusIuran: 'Menunggak',
    tanggalDaftar: '2024-04-02'
  }
];

export default function App() {
  // State Utama
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('pgri_tobu_members_v3');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedKtaMember, setSelectedKtaMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [toast, setToast] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const fileInputRef = useRef(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSekolah, setFilterSekolah] = useState('');
  const [filterStatusPegawai, setFilterStatusPegawai] = useState('');
  const [filterDesa, setFilterDesa] = useState('');
  const [filterStatusKta, setFilterStatusKta] = useState('');

  // Form State
  const initialForm = {
    nama: '',
    nik: '',
    nuptk: '',
    gender: 'Laki-Laki',
    tempatLahir: '',
    tanggalLahir: '',
    statusPegawai: 'PPPK Paruh Waktu',
    sekolah: SEKOLAH_TOBU[0],
    noWa: '',
    desa: DESA_TOBU[0],
    statusKta: 'Pending Verifikasi',
    statusIuran: 'Menunggak'
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  // Online / Offline Status Event Listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simpan Otomatis ke LocalStorage
  useEffect(() => {
    localStorage.setItem('pgri_tobu_members_v3', JSON.stringify(members));
  }, [members]);

  // Toast Notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Filtered Members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.npa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.nik.includes(searchTerm) ||
        m.sekolah.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSekolah = filterSekolah ? m.sekolah === filterSekolah : true;
      const matchPegawai = filterStatusPegawai ? m.statusPegawai === filterStatusPegawai : true;
      const matchDesa = filterDesa ? m.desa === filterDesa : true;
      const matchKta = filterStatusKta ? m.statusKta === filterStatusKta : true;

      return matchSearch && matchSekolah && matchPegawai && matchDesa && matchKta;
    });
  }, [members, searchTerm, filterSekolah, filterStatusPegawai, filterDesa, filterStatusKta]);

  // Statistik Anggota
  const stats = useMemo(() => {
    const total = members.length;
    const ktaTerbit = members.filter((m) => m.statusKta === 'Terbit').length;
    const ktaPending = members.filter((m) => m.statusKta === 'Pending Verifikasi').length;
    const iuranLunas = members.filter((m) => m.statusIuran === 'Lunas').length;

    const countByPegawai = STATUS_KEPEGAWAIAN.reduce((acc, curr) => {
      acc[curr] = members.filter((m) => m.statusPegawai === curr).length;
      return acc;
    }, {});

    const countByDesa = DESA_TOBU.reduce((acc, curr) => {
      acc[curr] = members.filter((m) => m.desa === curr).length;
      return acc;
    }, {});

    const countBySekolah = SEKOLAH_TOBU.reduce((acc, curr) => {
      acc[curr] = members.filter((m) => m.sekolah === curr).length;
      return acc;
    }, {});

    return { total, ktaTerbit, ktaPending, iuranLunas, countByPegawai, countByDesa, countBySekolah };
  }, [members]);

  // Form Input Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validasi Form
  const validateForm = () => {
    const errors = {};
    if (!formData.nama.trim()) errors.nama = 'Nama lengkap wajib diisi';
    if (!formData.nik.trim()) {
      errors.nik = 'NIK wajib diisi';
    } else if (!/^\d{16}$/.test(formData.nik.trim())) {
      errors.nik = 'NIK harus berupa tepat 16 digit angka';
    }
    if (!formData.tempatLahir.trim()) errors.tempatLahir = 'Tempat lahir wajib diisi';
    if (!formData.tanggalLahir) errors.tanggalLahir = 'Tanggal lahir wajib diisi';
    if (!formData.noWa.trim()) {
      errors.noWa = 'Nomor WA/HP wajib diisi';
    } else if (!/^\d{9,14}$/.test(formData.noWa.replace(/[\s\-\+]/g, ''))) {
      errors.noWa = 'Format nomor HP/WA tidak valid';
    }
    return errors;
  };

  // Submit Registrasi / Edit
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('Mohon periksa kembali isian formulir!', 'error');
      return;
    }

    if (editingMember) {
      setMembers((prev) =>
        prev.map((m) => (m.id === editingMember.id ? { ...m, ...formData } : m))
      );
      showToast(`Data guru ${formData.nama} berhasil diperbarui.`);
      setEditingMember(null);
    } else {
      const nextSeq = (members.length + 1).toString().padStart(4, '0');
      const newNpa = `240214${nextSeq}`;
      const newMember = {
        ...formData,
        id: `PGRI-TOBU-${Date.now().toString().slice(-4)}`,
        npa: newNpa,
        tanggalDaftar: new Date().toISOString().split('T')[0]
      };
      setMembers((prev) => [newMember, ...prev]);
      showToast(`Guru ${newMember.nama} berhasil didaftarkan dengan NPA: ${newNpa}`);
    }

    setFormData(initialForm);
    setActiveTab('members');
  };

  const handleEditClick = (member) => {
    setEditingMember(member);
    setFormData({
      nama: member.nama,
      nik: member.nik,
      nuptk: member.nuptk || '',
      gender: member.gender || 'Laki-Laki',
      tempatLahir: member.tempatLahir || '',
      tanggalLahir: member.tanggalLahir || '',
      statusPegawai: member.statusPegawai,
      sekolah: member.sekolah,
      noWa: member.noWa || '',
      desa: member.desa,
      statusKta: member.statusKta,
      statusIuran: member.statusIuran
    });
    setActiveTab('add_member');
  };

  const handleDeleteMember = (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data ${nama}?`)) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      showToast(`Data anggota ${nama} telah dihapus.`);
    }
  };

  const handleToggleKtaStatus = (id) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.statusKta === 'Terbit' ? 'Pending Verifikasi' : 'Terbit';
          showToast(`Status KTA ${m.nama} diubah menjadi ${nextStatus}`);
          return { ...m, statusKta: nextStatus };
        }
        return m;
      })
    );
  };

  const handleToggleIuranStatus = (id) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.statusIuran === 'Lunas' ? 'Menunggak' : 'Lunas';
          showToast(`Status Iuran ${m.nama} diubah menjadi ${nextStatus}`);
          return { ...m, statusIuran: nextStatus };
        }
        return m;
      })
    );
  };

  // Ekspor CSV
  const handleExportCSV = () => {
    const headers = ['NPA', 'Nama', 'NIK', 'NUPTK', 'Status Pegawai', 'Sekolah', 'Desa', 'No WA', 'Status KTA', 'Status Iuran'];
    const rows = filteredMembers.map((m) => [
      m.npa,
      `"${m.nama}"`,
      `"${m.nik}"`,
      `"${m.nuptk}"`,
      `"${m.statusPegawai}"`,
      `"${m.sekolah}"`,
      m.desa,
      `"${m.noWa}"`,
      m.statusKta,
      m.statusIuran
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PGRI_Tobu_Anggota_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data berhasil diekspor ke file CSV.');
  };

  // Ekspor JSON (Untuk Backup / Kirim ke Kab. TTS)
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(members, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PGRI_Tobu_Database_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Database berhasil diekspor dalam format JSON.');
  };

  // Impor JSON
  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target.result);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setMembers(parsedData);
            showToast(`Berhasil mengimpor ${parsedData.length} data anggota.`);
          } else {
            showToast('Format JSON tidak valid atau kosong.', 'error');
          }
        } catch (err) {
          showToast('Gagal membaca file JSON.', 'error');
        }
      };
    }
  };

  const handleResetData = () => {
    if (window.confirm('Kembalikan data ke contoh awal PGRI Kec. Tobu? Data baru akan direset.')) {
      setMembers(INITIAL_MEMBERS);
      localStorage.removeItem('pgri_tobu_members_v3');
      showToast('Data berhasil direset.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white font-medium transition-all ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-700'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="bg-red-800 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Judul Organisasi */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white text-red-800 flex items-center justify-center font-bold text-xl shadow-inner border-2 border-amber-400">
                <School className="w-7 h-7 text-red-800" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-amber-400 text-red-950 px-2 py-0.5 rounded uppercase tracking-wider">
                    Cabang Khusus
                  </span>
                  <span className="text-xs text-red-200">Kab. Timor Tengah Selatan, NTT</span>
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  PGRI KECAMATAN TOBU
                </h1>
                <p className="text-xs text-red-100 hidden sm:block">
                  Sistem Informasi Digitalisasi & Manajemen Keanggotaan Guru
                </p>
              </div>
            </div>

            {/* Offline/Online Badge & Nav Navigation */}
            <div className="hidden lg:flex items-center space-x-3">
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isOnline ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40' : 'bg-amber-900/80 text-amber-300 border border-amber-500/50 animate-pulse'
                }`}
                title={isOnline ? 'Terhubung ke Internet' : 'Mode Offline - Data tersimpan otomatis di browser'}
              >
                {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                <span>{isOnline ? 'Online' : 'Offline Sync'}</span>
              </div>

              <nav className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === 'dashboard' ? 'bg-red-900 text-amber-300 shadow-sm' : 'hover:bg-red-700/80 text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === 'members' ? 'bg-red-900 text-amber-300 shadow-sm' : 'hover:bg-red-700/80 text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Data Anggota ({members.length})
                </button>
                <button
                  onClick={() => {
                    setEditingMember(null);
                    setFormData(initialForm);
                    setActiveTab('add_member');
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === 'add_member' ? 'bg-red-900 text-amber-300 shadow-sm' : 'hover:bg-red-700/80 text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Tambah Guru
                </button>
                <button
                  onClick={() => setActiveTab('dues')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === 'dues' ? 'bg-red-900 text-amber-300 shadow-sm' : 'hover:bg-red-700/80 text-white'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  Iuran
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === 'settings' ? 'bg-red-900 text-amber-300 shadow-sm' : 'hover:bg-red-700/80 text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Ekspor/Impor
                </button>
              </nav>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="px-2 py-0.5 rounded bg-red-900 text-amber-300 text-[10px] font-bold">
                {isOnline ? 'Online' : 'Offline'}
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-red-900 text-white hover:bg-red-700 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-red-900 border-t border-red-700 px-4 pt-2 pb-4 space-y-1">
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'dashboard' ? 'bg-red-950 text-amber-300' : 'text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard Statistik
            </button>
            <button
              onClick={() => { setActiveTab('members'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'members' ? 'bg-red-950 text-amber-300' : 'text-white'
              }`}
            >
              <Users className="w-5 h-5" /> Data Anggota ({members.length})
            </button>
            <button
              onClick={() => {
                setEditingMember(null);
                setFormData(initialForm);
                setActiveTab('add_member');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'add_member' ? 'bg-red-950 text-amber-300' : 'text-white'
              }`}
            >
              <UserPlus className="w-5 h-5" /> Registrasi Guru Baru
            </button>
            <button
              onClick={() => { setActiveTab('dues'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'dues' ? 'bg-red-950 text-amber-300' : 'text-white'
              }`}
            >
              <DollarSign className="w-5 h-5" /> Kelola Iuran
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'settings' ? 'bg-red-950 text-amber-300' : 'text-white'
              }`}
            >
              <Settings className="w-5 h-5" /> Ekspor, Impor & Backup
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Banner Utama */}
            <div className="bg-gradient-to-r from-red-800 via-red-700 to-amber-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-amber-200 mb-3">
                  <ShieldCheck className="w-4 h-4 text-amber-300" /> SIMKTA PGRI Cabang Tobu
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Manajemen Keanggotaan Guru Kec. Tobu
                </h2>
                <p className="mt-2 text-red-100 text-sm sm:text-base leading-relaxed">
                  Platform pendataan terpadu guru di <strong>3 Satuan Pendidikan</strong> (SMA Negeri Tobu, SMK Kristen Huetalan, dan SMA Negeri Usapimnasi) serta 7 desa di Kecamatan Tobu.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('members')}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-red-950 rounded-xl font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" /> Kelola Databased Anggota
                  </button>
                  <button
                    onClick={() => {
                      setEditingMember(null);
                      setFormData(initialForm);
                      setActiveTab('add_member');
                    }}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" /> Registrasi Anggota Baru
                  </button>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                <School className="w-96 h-96 text-white" />
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Anggota Guru</span>
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.total}</p>
                <span className="text-xs text-slate-500 mt-1 inline-block">Terdata di Cabang Tobu</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">KTA Digital Terbit</span>
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.ktaTerbit}</p>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${stats.total ? (stats.ktaTerbit / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-500 mt-1 inline-block">
                  {stats.total ? Math.round((stats.ktaTerbit / stats.total) * 100) : 0}% Aktif Ber-KTA
                </span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Verifikasi</span>
                  <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.ktaPending}</p>
                <span className="text-xs text-amber-700 font-medium mt-1 inline-block">Memerlukan Cek Berkas</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lunas Iuran</span>
                  <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.iuranLunas}</p>
                <span className="text-xs text-slate-500 mt-1 inline-block">
                  {stats.total ? Math.round((stats.iuranLunas / stats.total) * 100) : 0}% Tertib Iuran
                </span>
              </div>
            </div>

            {/* Grafik & Breakdown Status Kepegawaian */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Komposisi Status Kepegawaian */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Distribusi Status Kepegawaian</h3>
                    <p className="text-xs text-slate-500">Termasuk PPPK Penuh Waktu & PPPK Paruh Waktu</p>
                  </div>
                  <Award className="w-5 h-5 text-red-700" />
                </div>
                <div className="space-y-4">
                  {STATUS_KEPEGAWAIAN.map((status) => {
                    const count = stats.countByPegawai[status] || 0;
                    const percent = stats.total ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <div key={status}>
                        <div className="flex justify-between items-center text-sm mb-1 font-medium">
                          <span className="text-slate-700 flex items-center gap-1.5">
                            {status === 'PPPK Paruh Waktu' && (
                              <span className="w-2 h-2 rounded-full bg-purple-600 inline-block"></span>
                            )}
                            {status}
                          </span>
                          <span className="text-slate-900 font-bold">{count} orang ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full ${
                              status === 'PNS'
                                ? 'bg-red-700'
                                : status === 'PPPK Penuh Waktu'
                                ? 'bg-amber-500'
                                : status === 'PPPK Paruh Waktu'
                                ? 'bg-purple-600'
                                : status.includes('Honorer')
                                ? 'bg-blue-600'
                                : 'bg-emerald-600'
                            }`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sebaran Wilayah per Desa */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Cakupan Desa Domisili</h3>
                    <p className="text-xs text-slate-500">7 Desa Wilayah Kerja Kec. Tobu</p>
                  </div>
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DESA_TOBU.map((desa) => {
                    const count = stats.countByDesa[desa] || 0;
                    return (
                      <div
                        key={desa}
                        className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-red-50/50 hover:border-red-200 transition-colors"
                      >
                        <span className="text-xs text-slate-500 font-medium block">Desa {desa}</span>
                        <span className="text-lg font-extrabold text-slate-900 mt-0.5 block">
                          {count} <span className="text-xs font-normal text-slate-600">Guru</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Rekapitulasi Khusus 3 Sekolah */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sebaran Guru di 3 Sekolah Utama Kec. Tobu</h3>
                  <p className="text-xs text-slate-500">Jumlah anggota PGRI terdaftar berdasarkan unit kerja sekolah</p>
                </div>
                <Building2 className="w-5 h-5 text-red-800" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {SEKOLAH_TOBU.map((sek) => {
                  const count = stats.countBySekolah[sek] || 0;
                  return (
                    <div
                      key={sek}
                      className="p-5 rounded-2xl border-2 border-slate-100 bg-gradient-to-b from-white to-slate-50 hover:border-red-500 transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="p-2.5 bg-red-100 text-red-800 rounded-xl">
                          <School className="w-6 h-6" />
                        </div>
                        <span className="px-3 py-1 bg-red-800 text-amber-300 font-extrabold rounded-full text-xs">
                          {count} Anggota
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-4">{sek}</h4>
                      <p className="text-xs text-slate-500 mt-1">Kecamatan Tobu, TTS</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DATA ANGGOTA */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Header Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Pangkalan Data Anggota PGRI Tobu</h2>
                <p className="text-xs text-slate-500">
                  Menampilkan {filteredMembers.length} dari {members.length} guru terdaftar
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" /> Ekspor CSV
                </button>
                <button
                  onClick={() => {
                    setEditingMember(null);
                    setFormData(initialForm);
                    setActiveTab('add_member');
                  }}
                  className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors"
                >
                  <UserPlus className="w-4 h-4" /> Registrasi Anggota
                </button>
              </div>
            </div>

            {/* Filter controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Search input */}
                <div className="relative lg:col-span-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari Nama, NPA, NIK..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                {/* Filter Sekolah (3 Sekolah) */}
                <div>
                  <select
                    value={filterSekolah}
                    onChange={(e) => setFilterSekolah(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none"
                  >
                    <option value="">Semua 3 Sekolah</option>
                    {SEKOLAH_TOBU.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Filter Status Pegawai */}
                <div>
                  <select
                    value={filterStatusPegawai}
                    onChange={(e) => setFilterStatusPegawai(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none"
                  >
                    <option value="">Semua Status Pegawai</option>
                    {STATUS_KEPEGAWAIAN.map((sp) => (
                      <option key={sp} value={sp}>{sp}</option>
                    ))}
                  </select>
                </div>

                {/* Filter Desa */}
                <div>
                  <select
                    value={filterDesa}
                    onChange={(e) => setFilterDesa(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none"
                  >
                    <option value="">Semua Desa</option>
                    {DESA_TOBU.map((d) => (
                      <option key={d} value={d}>Desa {d}</option>
                    ))}
                  </select>
                </div>

                {/* Filter Status KTA */}
                <div>
                  <select
                    value={filterStatusKta}
                    onChange={(e) => setFilterStatusKta(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none"
                  >
                    <option value="">Semua Status KTA</option>
                    <option value="Terbit">KTA Terbit</option>
                    <option value="Pending Verifikasi">Pending Verifikasi</option>
                  </select>
                </div>
              </div>

              {(searchTerm || filterSekolah || filterStatusPegawai || filterDesa || filterStatusKta) && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">Pencarian / filter aktif</span>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterSekolah('');
                      setFilterStatusPegawai('');
                      setFilterDesa('');
                      setFilterStatusKta('');
                    }}
                    className="text-red-700 hover:underline font-semibold"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Identitas & NPA</th>
                      <th className="py-3.5 px-4">Sekolah Induk & Desa</th>
                      <th className="py-3.5 px-4">Status Kepegawaian</th>
                      <th className="py-3.5 px-4">Status KTA</th>
                      <th className="py-3.5 px-4">Iuran</th>
                      <th className="py-3.5 px-4 text-center">Aksi / Cetak KTA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-400">
                          <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                          <p className="font-medium text-slate-600">Tidak ada data anggota yang cocok.</p>
                          <p className="text-xs mt-1">Coba ubah kata kunci atau reset filter.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                          {/* Nama & NPA */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 text-sm">{m.nama}</div>
                            <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                              NPA: <span className="font-semibold text-red-800">{m.npa}</span>
                            </div>
                            <div className="text-slate-400 text-[10px]">NIK: {m.nik}</div>
                          </td>

                          {/* Sekolah & Desa */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{m.sekolah}</div>
                            <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" /> Desa {m.desa}
                            </div>
                          </td>

                          {/* Status Pegawai */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                                m.statusPegawai === 'PNS'
                                  ? 'bg-red-100 text-red-800'
                                  : m.statusPegawai === 'PPPK Penuh Waktu'
                                  ? 'bg-amber-100 text-amber-800'
                                  : m.statusPegawai === 'PPPK Paruh Waktu'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {m.statusPegawai}
                            </span>
                            {m.nuptk && m.nuptk !== '-' && (
                              <div className="text-[10px] text-slate-400 mt-1">NUPTK: {m.nuptk}</div>
                            )}
                          </td>

                          {/* Status KTA */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleKtaStatus(m.id)}
                              title="Klik untuk ubah status KTA"
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-transform active:scale-95 ${
                                m.statusKta === 'Terbit'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                            >
                              {m.statusKta === 'Terbit' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" /> Aktif
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-3 h-3" /> Pending
                                </>
                              )}
                            </button>
                          </td>

                          {/* Status Iuran */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleIuranStatus(m.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                                m.statusIuran === 'Lunas'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {m.statusIuran}
                            </button>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedKtaMember(m)}
                                className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium text-[11px] flex items-center gap-1 transition-colors"
                                title="Lihat & Cetak KTA Digital"
                              >
                                <CreditCard className="w-3.5 h-3.5" /> KTA
                              </button>
                              <button
                                onClick={() => handleEditClick(m)}
                                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Edit Data Guru"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMember(m.id, m.nama)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus Anggota"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REGISTRASI / EDIT FORM */}
        {activeTab === 'add_member' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingMember ? 'Edit Profile Anggota PGRI' : 'Form Registrasi Anggota PGRI Tobu'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editingMember
                      ? `Pembaruan data untuk ${editingMember.nama}`
                      : 'Input data guru baru Kecamatan Tobu'}
                  </p>
                </div>
                <div className="p-3 bg-red-50 text-red-800 rounded-2xl">
                  <UserPlus className="w-6 h-6" />
                </div>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-5">
                {/* Nama & NIK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Lengkap (+Gelar) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      placeholder="Contoh: Petrus Tefnai, S.Pd."
                      className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none ${
                        formErrors.nama ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.nama && <span className="text-[11px] text-red-600 font-medium">{formErrors.nama}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NIK (Tepat 16 Digit) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="nik"
                      maxLength={16}
                      value={formData.nik}
                      onChange={handleInputChange}
                      placeholder="530214xxxxxxxxxx"
                      className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none ${
                        formErrors.nik ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.nik && <span className="text-[11px] text-red-600 font-medium">{formErrors.nik}</span>}
                  </div>
                </div>

                {/* NUPTK & Jenis Kelamin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NUPTK / PegID (Opsional)
                    </label>
                    <input
                      type="text"
                      name="nuptk"
                      value={formData.nuptk}
                      onChange={handleInputChange}
                      placeholder="Isi '-' jika tidak ada"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none"
                    >
                      <option value="Laki-Laki">Laki-Laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                {/* Tempat & Tanggal Lahir */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tempat Lahir <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="tempatLahir"
                      value={formData.tempatLahir}
                      onChange={handleInputChange}
                      placeholder="Contoh: Tobu / Soe"
                      className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none ${
                        formErrors.tempatLahir ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.tempatLahir && (
                      <span className="text-[11px] text-red-600 font-medium">{formErrors.tempatLahir}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tanggal Lahir <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      name="tanggalLahir"
                      value={formData.tanggalLahir}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none ${
                        formErrors.tanggalLahir ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.tanggalLahir && (
                      <span className="text-[11px] text-red-600 font-medium">{formErrors.tanggalLahir}</span>
                    )}
                  </div>
                </div>

                {/* Status Kepegawaian & Unit Kerja (3 Sekolah) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Status Kepegawaian</label>
                    <select
                      name="statusPegawai"
                      value={formData.statusPegawai}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none"
                    >
                      {STATUS_KEPEGAWAIAN.map((sp) => (
                        <option key={sp} value={sp}>{sp}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Unit Kerja / Sekolah (3 Sekolah Tobu)
                    </label>
                    <select
                      name="sekolah"
                      value={formData.sekolah}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none"
                    >
                      {SEKOLAH_TOBU.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* No WA & Desa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor WhatsApp / HP <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="noWa"
                      value={formData.noWa}
                      onChange={handleInputChange}
                      placeholder="08xxxxxxxxxx"
                      className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none ${
                        formErrors.noWa ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.noWa && <span className="text-[11px] text-red-600 font-medium">{formErrors.noWa}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Desa Domisili (Kec. Tobu)</label>
                    <select
                      name="desa"
                      value={formData.desa}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none"
                    >
                      {DESA_TOBU.map((d) => (
                        <option key={d} value={d}>Desa {d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Verifikasi KTA & Iuran */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Status Kartu Anggota (KTA)</label>
                    <select
                      name="statusKta"
                      value={formData.statusKta}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none"
                    >
                      <option value="Pending Verifikasi">Pending Verifikasi</option>
                      <option value="Terbit">Terbit (Aktif)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Status Iuran Keanggotaan</label>
                    <select
                      name="statusIuran"
                      value={formData.statusIuran}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none"
                    >
                      <option value="Menunggak">Menunggak</option>
                      <option value="Lunas">Lunas</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember(null);
                      setActiveTab('members');
                    }}
                    className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {editingMember ? 'Simpan Perubahan' : 'Daftarkan Anggota Baru'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: MANAJEMEN IURAN */}
        {activeTab === 'dues' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Modul Verifikasi Iuran Keanggotaan</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Pencatatan tertib iuran bulanan untuk operasional PGRI Cabang Khusus Kec. Tobu.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-emerald-700">
                  Lunas: <span className="text-slate-900">{stats.iuranLunas} Guru</span>
                </div>
                <div className="text-red-700">
                  Menunggak: <span className="text-slate-900">{stats.total - stats.iuranLunas} Guru</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase">
                      <th className="py-3.5 px-4">Nama Anggota</th>
                      <th className="py-3.5 px-4">Sekolah</th>
                      <th className="py-3.5 px-4">Status Kepegawaian</th>
                      <th className="py-3.5 px-4">Status Iuran</th>
                      <th className="py-3.5 px-4 text-center">Aksi Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {members.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{m.nama}</td>
                        <td className="py-3 px-4 text-slate-600">{m.sekolah}</td>
                        <td className="py-3 px-4">{m.statusPegawai}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                              m.statusIuran === 'Lunas'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {m.statusIuran}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleIuranStatus(m.id)}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            Set {m.statusIuran === 'Lunas' ? 'Menunggak' : 'Lunas'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EKSPOR, IMPOR & PENGATURAN DATA */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Pusat Sinkronisasi & Ekspor-Impor Data</h2>
                <p className="text-xs text-slate-500">
                  Pengelolaan cadangan database lokal dan sinkronisasi laporan ke Pengurus PGRI Kabupaten Timor Tengah Selatan.
                </p>
              </div>

              {/* Offline Status Info Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      Status Jaringan Internet: {isOnline ? 'ONLINE' : 'OFFLINE MODE'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Sistem menggunakan penyimpanan offline lokal (*LocalStorage*). Data Anda aman dan tersimpan meski tanpa jaringan internet.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div className="space-y-4">
                {/* Ekspor CSV */}
                <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:border-red-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-50 text-red-800 rounded-xl">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Ekspor Laporan CSV (Excel)</h4>
                      <p className="text-xs text-slate-500">
                        Unduh tabel data anggota untuk pelaporan format Excel.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Unduh CSV
                  </button>
                </div>

                {/* Ekspor JSON */}
                <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
                      <FileJson className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Ekspor File Backup JSON</h4>
                      <p className="text-xs text-slate-500">
                        Simpan seluruh struktur database untuk dikirimkan ke Pengurus Kabupaten TTS.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleExportJSON}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Unduh JSON
                  </button>
                </div>

                {/* Impor JSON */}
                <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Impor Database JSON</h4>
                      <p className="text-xs text-slate-500">
                        Unggah file cadangan JSON untuk memulihkan data anggota.
                      </p>
                    </div>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept=".json"
                      ref={fileInputRef}
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      Pilih File JSON
                    </button>
                  </div>
                </div>

                {/* Reset Data */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
                      <RefreshCw className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Reset ke Data Contoh Awal</h4>
                      <p className="text-xs text-slate-600">
                        Kembalikan aplikasi ke data sampel default PGRI Tobu.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleResetData}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Reset Data
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-semibold text-slate-300">
            Sistem Keanggotaan PGRI Cabang Khusus Kecamatan Tobu
          </p>
          <p className="text-slate-500 text-[11px]">
            Kabupaten Timor Tengah Selatan, Nusa Tenggara Timur • Transformasi Digital & Keanggotaan Guru
          </p>
        </div>
      </footer>

      {/* MODAL / KTA DIGITAL GENERATOR */}
      {selectedKtaMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">Generator KTA Digital PGRI</span>
              </div>
              <button
                onClick={() => setSelectedKtaMember(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PREVIEW KERTAS / KTA */}
            <div className="p-6 bg-slate-100 flex flex-col items-center justify-center">
              
              {/* ID CARD VISUAL */}
              <div
                id="printable-kta"
                className="w-[340px] h-[520px] bg-gradient-to-b from-red-900 via-red-800 to-red-950 text-white rounded-2xl shadow-2xl overflow-hidden relative border-2 border-amber-400 flex flex-col justify-between"
              >
                {/* Header KTA */}
                <div className="p-4 bg-red-950/90 text-center border-b border-amber-400/40 relative">
                  <div className="w-10 h-10 mx-auto rounded-full bg-white text-red-900 flex items-center justify-center font-bold text-lg shadow-md mb-1 border-2 border-amber-400">
                    <School className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-xs tracking-wider text-amber-300 uppercase">
                    PERSATUAN GURU REPUBLIK INDONESIA
                  </h3>
                  <p className="text-[10px] font-bold text-red-100">PGRI CABANG KHUSUS KEC. TOBU</p>
                  <p className="text-[9px] text-amber-200/80">KAB. TIMOR TENGAH SELATAN - NTT</p>
                </div>

                {/* Isu & Identitas Guru */}
                <div className="px-5 py-3 flex-1 flex flex-col items-center justify-between text-center relative z-10">
                  
                  {/* Foto & NPA Badge */}
                  <div className="space-y-1">
                    <div className="w-24 h-28 mx-auto rounded-xl bg-slate-200 border-2 border-amber-400 overflow-hidden shadow-lg flex items-center justify-center text-slate-400 relative">
                      <User className="w-16 h-16 text-slate-500" />
                      <div className="absolute bottom-0 inset-x-0 bg-red-900/90 text-[9px] text-white py-0.5 font-bold">
                        PASFOTO
                      </div>
                    </div>
                    <div className="inline-block bg-amber-400 text-red-950 px-3 py-0.5 rounded-full font-mono font-extrabold text-xs shadow">
                      NPA: {selectedKtaMember.npa}
                    </div>
                  </div>

                  {/* Detail Lengkap */}
                  <div className="w-full space-y-1 text-left bg-red-950/50 p-3 rounded-xl border border-red-700/50">
                    <div>
                      <span className="text-[9px] text-amber-300 font-semibold uppercase block">Nama Anggota</span>
                      <p className="text-xs font-bold text-white tracking-wide truncate">{selectedKtaMember.nama}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-1">
                      <div>
                        <span className="text-[8px] text-red-200 block">Unit Kerja</span>
                        <p className="text-[10px] font-semibold text-white truncate">{selectedKtaMember.sekolah}</p>
                      </div>
                      <div>
                        <span className="text-[8px] text-red-200 block">Status Pegawai</span>
                        <p className="text-[10px] font-semibold text-white truncate">{selectedKtaMember.statusPegawai}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-0.5">
                      <div>
                        <span className="text-[8px] text-red-200 block">Desa</span>
                        <p className="text-[10px] font-semibold text-white">Desa {selectedKtaMember.desa}</p>
                      </div>
                      <div>
                        <span className="text-[8px] text-red-200 block">Masa Berlaku</span>
                        <p className="text-[10px] font-semibold text-amber-300">SEUMUR HIDUP</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code & Stempel Digital */}
                  <div className="w-full flex items-center justify-between pt-1 border-t border-red-700/50">
                    {/* Simulated QR Code */}
                    <div className="w-12 h-12 bg-white p-1 rounded-lg flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-full h-full text-slate-900 fill-current">
                        <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm13-2h3v3h-3v-3zm-3 3h3v3h-3v-3zm3 3h3v3h-3v-3zm-6-3h3v3h-3v-3z"/>
                      </svg>
                    </div>

                    <div className="text-right">
                      <p className="text-[8px] text-red-200">Tobu, {new Date().toLocaleDateString('id-ID')}</p>
                      <p className="text-[9px] font-bold text-amber-300">Pengurus Cabang Tobu</p>
                      <div className="h-6 flex items-center justify-end font-serif italic text-amber-200 text-xs opacity-90">
                        [Stempel & TTD Digital]
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer Stripe */}
                <div className="py-1 bg-amber-400 text-red-950 text-center font-bold text-[9px] tracking-widest uppercase">
                  KARTU TANDA ANGGOTA RESMI PGRI
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Status KTA: <strong className="text-emerald-700">{selectedKtaMember.statusKta}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedKtaMember(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Tutup
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Cetak KTA
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Print CSS Rules */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-kta, #printable-kta * {
            visibility: visible;
          }
          #printable-kta {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}