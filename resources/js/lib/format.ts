export const formatDate = (value?: string | null, withTime = false) => {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
        timeZone: 'Asia/Jakarta',
    }).format(new Date(value));
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

export const formatMoney = (amount: number, currency = 'IDR') =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(amount);

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
