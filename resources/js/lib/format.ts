export const formatDate = (value?: string | null, withTime = false) => {
    if (!value) {
        return '-';
    }

    const formatted = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(withTime ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}),
        timeZone: 'Asia/Jakarta',
    }).format(new Date(value));

    return withTime ? `${formatted} WIB` : formatted;
};

export const formatDateTime = (value?: string | null, withSeconds = false) => {
    if (!value) {
        return '-';
    }

    const formatted = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...(withSeconds ? { second: '2-digit' } : {}),
        hour12: false,
        timeZone: 'Asia/Jakarta',
    }).format(new Date(value));

    return `${formatted} WIB`;
};

export const formatTime = (value?: string | null, withWib = true) => {
    if (!value) {
        return '-';
    }

    const formatted = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta',
    }).format(new Date(value));

    return withWib ? `${formatted} WIB` : formatted;
};

export const formatRelativeTime = (value?: string | null): string => {
    if (!value) return '-';
    const now = new Date();
    const date = new Date(value);
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 45 && diffSec >= -5) return 'Baru saja';
    if (diffSec < 3600 && diffSec > 0) return `${Math.max(1, Math.floor(diffSec / 60))} menit lalu`;
    if (diffSec < 86400 && diffSec > 0) return `${Math.floor(diffSec / 3600)} jam lalu`;
    if (diffSec < 172800 && diffSec > 0) return `Kemarin, ${formatTime(value)}`;

    return formatDate(value, true);
};

export const formatChatTime = (value?: string | null) => {
    if (!value) return '';
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta',
    }).format(new Date(value));
};

export const formatChatDate = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    if (isToday) return 'Hari Ini';
    if (isYesterday) return 'Kemarin';

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
    }).format(date);
};

export const formatContactListTime = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (isToday) {
        return formatChatTime(value);
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) return 'Kemarin';

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        timeZone: 'Asia/Jakarta',
    }).format(date);
};

export const formatBytes = (bytes?: number | null) => {
    if (!bytes) {
        return '-';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'unit',
        unit: 'kilobyte',
        maximumFractionDigits: 1,
    }).format(bytes / 1024);
};

export const formatMoney = (amount?: number | string | null, currency = 'IDR') => {
    const cleanCurrency =
        typeof currency === 'string' && currency.trim().length === 3
            ? currency.trim().toUpperCase()
            : 'IDR';
    const num = typeof amount === 'number' && !isNaN(amount) ? amount : (Number(amount) || 0);

    try {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: cleanCurrency,
            maximumFractionDigits: 0,
        }).format(num);
    } catch {
        return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
    }
};

export const terbilang = (n: number): string => {
    if (n < 0) return `Minus ${terbilang(Math.abs(n))}`;
    const satuan = [
        '',
        'Satu',
        'Dua',
        'Tiga',
        'Empat',
        'Lima',
        'Enam',
        'Tujuh',
        'Delapan',
        'Sembilan',
        'Sepuluh',
        'Sebelas',
    ];
    n = Math.floor(n);
    if (n < 12) return satuan[n];
    if (n < 20) return `${terbilang(n - 10)} Belas`;
    if (n < 100)
        return `${terbilang(Math.floor(n / 10))} Puluh ${terbilang(n % 10)}`.trim();
    if (n < 200) return `Seratus ${terbilang(n - 100)}`.trim();
    if (n < 1000)
        return `${terbilang(Math.floor(n / 100))} Ratus ${terbilang(n % 100)}`.trim();
    if (n < 2000) return `Seribu ${terbilang(n - 1000)}`.trim();
    if (n < 1000000)
        return `${terbilang(Math.floor(n / 1000))} Ribu ${terbilang(n % 1000)}`.trim();
    if (n < 1000000000)
        return `${terbilang(Math.floor(n / 1000000))} Juta ${terbilang(n % 1000000)}`.trim();
    if (n < 1000000000000)
        return `${terbilang(Math.floor(n / 1000000000))} Miliar ${terbilang(n % 1000000000)}`.trim();
    return `${terbilang(Math.floor(n / 1000000000000))} Triliun ${terbilang(n % 1000000000000)}`.trim();
};
