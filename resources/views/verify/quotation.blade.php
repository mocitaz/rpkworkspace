@php
    $isAccepted = in_array($quotation->status, ['accepted', 'converted']);
    $isSent = $quotation->status === 'sent';
    $isRejected = $quotation->status === 'rejected';
@endphp
<!doctype html>
<html lang="id" class="h-full antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verifikasi Surat Penawaran {{ $quotation->quotation_number }} | RPK Law Firm</title>
    <link rel="icon" type="image/png" href="/images/rpkapp.png">
    <link rel="apple-touch-icon" href="/images/rpkapp.png">
    
    <script>
        (function() {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    @vite(['resources/css/app.css'])
    
    <style>
        :root {
            --workspace-light-background: radial-gradient(ellipse 68% 58% at 50% 48%, rgba(250, 250, 252, 0.72) 0%, rgba(250, 250, 252, 0.46) 44%, rgba(250, 250, 252, 0.12) 74%, transparent 100%), linear-gradient(rgba(250, 250, 252, 0.24), rgba(250, 250, 252, 0.24)), url('/images/workspace-landscape-bg.png');
            --workspace-dark-background: radial-gradient(ellipse 72% 62% at 50% 42%, rgba(15, 23, 42, 0.08) 0%, rgba(8, 15, 28, 0.2) 66%, rgba(5, 10, 19, 0.38) 100%), url('/images/workspace-architectural-dark-bg.png');
        }

        html {
            background-color: oklch(0.978 0.003 255);
        }
        html.dark {
            background-color: oklch(0.145 0 0);
        }

        body { 
            font-family: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background-image: var(--workspace-light-background);
            background-size: cover;
            background-attachment: fixed;
            background-position: bottom;
            background-repeat: no-repeat;
        }
        .dark body,
        html.dark body {
            background-color: #101216;
            background-image: var(--workspace-dark-background);
            background-size: cover;
            background-attachment: fixed;
            background-position: bottom;
            background-repeat: no-repeat;
        }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        @media print {
            body { background: white !important; padding: 0 !important; }
            .no-print { display: none !important; }
        }
    </style>
</head>
<body class="min-h-screen text-slate-900 selection:bg-slate-900 selection:text-white dark:text-zinc-100 flex flex-col justify-between">

    <!-- 1. Header Resmi -->
    <header class="sticky top-0 z-40 flex h-15 w-full shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-md transition-all sm:px-6 lg:px-8 dark:border-white/10 dark:bg-[#111317]/85">
        <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
                <a href="{{ route('home') }}" title="RPK Law Firm" class="shrink-0 transition-opacity hover:opacity-90 flex items-center">
                    <img 
                        src="/logo/raf-law-firm-transparent.png" 
                        alt="RPK Law Firm" 
                        class="h-8.5 w-auto max-w-[145px] object-contain dark:brightness-110"
                        onerror="this.onerror=null; this.src='/logo/logo.png';"
                    />
                </a>
                <div class="h-5 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
                <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                        <span class="text-xs sm:text-sm font-extrabold tracking-tight text-slate-950 dark:text-white uppercase font-sans">RPK LAW FIRM</span>
                        <span class="text-slate-300 dark:text-zinc-700 hidden sm:inline">·</span>
                        <span class="text-[10.5px] font-medium text-slate-500 dark:text-zinc-400 hidden sm:inline">Portal Verifikasi Penawaran Biaya Jasa Hukum</span>
                    </div>
                    <span class="text-[10px] text-slate-400 dark:text-zinc-500 truncate max-w-[280px] sm:max-w-none">Roni, Putra &amp; Kusumah Law Firm · Practice Development</span>
                </div>
            </div>

            <!-- Protocol & Security Status -->
            <div class="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-zinc-400">
                <div class="hidden md:flex items-center gap-1.5 text-[11px]">
                    <span class="text-slate-400 dark:text-zinc-500">Protokol:</span>
                    <span class="font-medium text-slate-800 dark:text-zinc-200">Sistem Penawaran Sah</span>
                </div>
                <span class="hidden md:inline text-slate-300 dark:text-zinc-700">·</span>
                @if ($isAccepted)
                    <span class="text-[11px] font-sans font-semibold text-emerald-600 dark:text-emerald-400">Disetujui / Aktif</span>
                @elseif ($isSent)
                    <span class="text-[11px] font-sans font-semibold text-blue-600 dark:text-blue-400">Terkirim (Sent)</span>
                @elseif ($isRejected)
                    <span class="text-[11px] font-sans font-semibold text-rose-600 dark:text-rose-400">Ditolak (Rejected)</span>
                @else
                    <span class="text-[11px] font-sans font-semibold text-slate-600 dark:text-zinc-400">Konsep (Draft)</span>
                @endif
            </div>
        </div>
    </header>

    <!-- 2. Main Workspace Layout -->
    <main class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-5 flex-1">

        <!-- Executive Document Hero -->
        <section class="group relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-[#f7f9ff] via-white to-[#eaf3ff] p-6 sm:p-7 shadow-[0_10px_28px_rgba(71,85,105,0.075)] dark:border-white/[0.08] dark:from-[#17191f] dark:via-[#17191f] dark:to-[#18202b]">
            <!-- Ambient Breathing Radial Glow -->
            <div class="matters-hero-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_83%_38%,rgba(147,197,253,0.34),transparent_30%),radial-gradient(circle_at_65%_115%,rgba(251,191,36,0.12),transparent_27%)]"></div>

            <!-- Drifting Micro-Dot Matrix Pattern -->
            <div class="matters-hero-dots pointer-events-none absolute inset-y-0 right-0 hidden w-[480px] [background-image:radial-gradient(rgba(59,130,246,0.24)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,transparent,black_28%)] [background-size:18px_18px] opacity-30 md:block"></div>

            <!-- Animated Vector Wave Lines -->
            <svg
                viewBox="0 0 560 200"
                aria-hidden="true"
                class="pointer-events-none absolute right-0 bottom-0 hidden h-full w-[480px] text-white/90 drop-shadow-[0_0_8px_rgba(96,165,250,0.35)] md:block"
            >
                <path
                    d="M8 165 C95 94 176 178 270 108 S430 49 554 72"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    class="matters-hero-line"
                    pathLength="1"
                />
                <path
                    d="M55 192 C138 136 213 187 302 128 S442 84 558 99"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    class="matters-hero-line matters-hero-line-secondary opacity-55"
                    pathLength="1"
                />
                <circle cx="270" cy="108" r="3.5" fill="currentColor" />
                <circle cx="430" cy="49" r="2.5" fill="currentColor" />
            </svg>

            <!-- Content Area -->
            <div class="relative z-10 max-w-5xl">
                <!-- Matter Reference & Title -->
                <div class="flex flex-wrap items-center gap-2 text-xs mb-1">
                    <span class="font-mono font-bold text-xs tracking-wider text-slate-900 dark:text-zinc-100 uppercase">
                        {{ $quotation->matter?->matter_number ?? 'RPK-PROPOSAL' }}
                    </span>
                    <span class="text-slate-300 dark:text-zinc-700 font-light">/</span>
                    <span class="text-slate-600 dark:text-zinc-400 font-medium text-xs sm:text-sm">
                        {{ $quotation->matter?->title ?? 'Divisi Pengembangan Perkara & Penawaran Honorarium' }}
                    </span>
                </div>

                <!-- Document Official Title -->
                <h1 class="text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight text-slate-950 dark:text-white leading-snug">
                    Verifikasi Surat Penawaran Biaya Jasa Hukum
                </h1>

                <!-- Balanced 4-Column Metadata Ledger Strip -->
                <div class="mt-5 pt-4 border-t border-slate-200/80 dark:border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-0 md:divide-x md:divide-slate-200/80 dark:md:divide-white/[0.08]">
                    <!-- 1. Ref -->
                    <div class="flex flex-col md:pr-4">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Nomor Penawaran</span>
                        <div class="flex items-center gap-1.5 mt-0.5">
                            <span class="font-mono font-bold text-xs sm:text-[13px] text-slate-950 dark:text-white select-all">{{ $quotation->quotation_number }}</span>
                            <button 
                                type="button" 
                                onclick="copyText('{{ $quotation->quotation_number }}', this)"
                                title="Salin Nomor Penawaran"
                                class="inline-flex items-center gap-1 text-[10.5px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                            >
                                <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                                <span>Salin</span>
                            </button>
                        </div>
                    </div>

                    <!-- 2. Masa Berlaku -->
                    <div class="flex flex-col md:px-4">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Masa Berlaku</span>
                        <div class="flex items-center gap-1.5 mt-0.5">
                            <span class="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-zinc-200 font-mono">
                                {{ $quotation->valid_until ? $quotation->valid_until->translatedFormat('d M Y') : '30 Hari Sejak Terbit' }}
                            </span>
                        </div>
                    </div>

                    <!-- 3. Status Penawaran -->
                    <div class="flex flex-col md:px-4">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Status Penawaran</span>
                        <div class="mt-0.5">
                            @if ($isAccepted)
                                <span class="text-xs sm:text-[13px] font-bold text-emerald-600 dark:text-emerald-400">Disetujui / Aktif</span>
                            @elseif ($isSent)
                                <span class="text-xs sm:text-[13px] font-bold text-blue-600 dark:text-blue-400">Terkirim (Sent)</span>
                            @elseif ($isRejected)
                                <span class="text-xs sm:text-[13px] font-bold text-rose-600 dark:text-rose-400">Ditolak (Rejected)</span>
                            @else
                                <span class="text-xs sm:text-[13px] font-bold text-slate-600 dark:text-zinc-400">Konsep (Draft)</span>
                            @endif
                        </div>
                    </div>

                    <!-- 4. Waktu Verifikasi -->
                    <div class="flex flex-col md:pl-4">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Waktu Verifikasi</span>
                        <span class="font-mono text-xs sm:text-[12.5px] font-medium text-slate-700 dark:text-zinc-300 mt-0.5">
                            {{ now()->timezone(config('raf.timezone', 'Asia/Jakarta'))->translatedFormat('d M Y, H:i') }} WIB
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- 3. BARIS 1: Kartu Utama Berkas Dokumen (Full Width, Lapang & Sangat Terbaca) -->
        <div class="rounded-2xl border border-slate-200/80 bg-white/95 p-6 sm:p-7 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-[#14161b]/95 space-y-6">
            
            <!-- 1. Executive Legal Authentication -->
            <div class="space-y-3.5">
                <div class="flex items-center gap-3.5">
                    <div class="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm ring-4 ring-emerald-500/10 dark:ring-emerald-400/20">
                        <svg class="size-5.5 text-white drop-shadow-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-sm sm:text-base font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                            Surat Penawaran Sah &amp; Terotentikasi
                        </h2>
                        <p class="text-[11.5px] text-slate-500 dark:text-zinc-400 mt-0.5">
                            Dokumen Proposal Jasa Hukum &amp; Estimasi Honorarium RPK Law Firm
                        </p>
                    </div>
                </div>

                <p class="text-xs sm:text-[13px] text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                    Proposal penawaran biaya jasa hukum dan ruang lingkup kerja ini diterbitkan secara sah dan terekam dalam sistem tata kelola operasional RPK Law Firm.
                </p>
            </div>

            <!-- Hairline Separator -->
            <div class="h-px w-full bg-slate-200/70 dark:bg-white/[0.06]"></div>

            <!-- 2. Parties Breakdown (Client & Scope) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-1 text-xs">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Ditujukan Kepada Klien</span>
                    <div class="font-bold text-slate-950 dark:text-white text-sm sm:text-base">
                        {{ $quotation->client->display_name }}
                    </div>
                    @if ($quotation->client->legal_name && $quotation->client->legal_name !== $quotation->client->display_name)
                        <div class="text-[11.5px] text-slate-500 dark:text-zinc-400 font-medium">{{ $quotation->client->legal_name }}</div>
                    @endif
                    @if ($quotation->client->email)
                        <div class="font-mono text-[11px] text-slate-500 dark:text-zinc-400 pt-0.5">{{ $quotation->client->email }}</div>
                    @endif
                </div>

                <div class="space-y-1 text-xs">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Perihal / Judul Penawaran</span>
                    <div class="font-bold text-slate-950 dark:text-white text-sm sm:text-base">
                        {{ $quotation->title }}
                    </div>
                    <div class="text-[11px] text-slate-500 dark:text-zinc-400 pt-0.5">
                        Total Penawaran: <span class="font-mono font-bold text-slate-900 dark:text-white">{{ $quotation->currency ?: 'IDR' }} {{ number_format($quotation->total_amount, 0, ',', '.') }}</span>
                    </div>
                </div>
            </div>

            <!-- Hairline Separator -->
            <div class="h-px w-full bg-slate-200/70 dark:bg-white/[0.06]"></div>

            <!-- 3. Line Items Table -->
            @if ($quotation->lineItems->isNotEmpty())
                <div class="space-y-2.5">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                        Rincian Ruang Lingkup Pekerjaan &amp; Honorarium
                    </span>

                    <div class="rounded-xl border border-slate-200/80 dark:border-white/10 overflow-hidden text-xs">
                        <table class="w-full text-left">
                            <thead class="bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 text-[10.5px] font-bold border-b border-slate-200/80 dark:border-white/10">
                                <tr>
                                    <th class="p-3.5">Deskripsi Pekerjaan</th>
                                    <th class="p-3.5 text-center">Kuantitas</th>
                                    <th class="p-3.5 text-right">Tarif Satuan</th>
                                    <th class="p-3.5 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-white/[0.06] bg-white dark:bg-transparent">
                                @foreach ($quotation->lineItems as $item)
                                    <tr>
                                        <td class="p-3.5 font-medium text-slate-900 dark:text-zinc-100">{{ $item->description }}</td>
                                        <td class="p-3.5 text-center font-mono text-slate-600 dark:text-zinc-400">{{ $item->quantity }}</td>
                                        <td class="p-3.5 text-right font-mono text-slate-600 dark:text-zinc-400">{{ $quotation->currency ?: 'IDR' }} {{ number_format($item->unit_amount, 0, ',', '.') }}</td>
                                        <td class="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-zinc-100">{{ $quotation->currency ?: 'IDR' }} {{ number_format($item->total_amount, 0, ',', '.') }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>

                        <!-- Summary Footer -->
                        <div class="bg-slate-50/70 dark:bg-zinc-900/40 border-t border-slate-200/80 dark:border-white/10 p-4 flex justify-between items-baseline font-black text-sm text-slate-900 dark:text-white">
                            <span class="uppercase tracking-wider text-xs">TOTAL ESTIMASI HONORARIUM:</span>
                            <span class="font-mono text-base font-black text-slate-950 dark:text-white">{{ $quotation->currency ?: 'IDR' }} {{ number_format($quotation->total_amount, 0, ',', '.') }}</span>
                        </div>
                    </div>
                </div>
            @endif

            <!-- Legal Entity Footer Notice -->
            <div class="pt-4 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-100 dark:border-white/5">
                <div class="flex items-center gap-2 text-slate-500 dark:text-zinc-400 text-[11px]">
                    <svg class="size-3.5 text-slate-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Otorisasi Resmi Roni, Putra &amp; Kusumah Law Firm</span>
                </div>
                <div class="font-mono text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
                    Divisi Pengembangan &amp; Penawaran Perkara
                </div>
            </div>
        </div>

        <!-- 4. BARIS 2: Container Verifikasi QR Code & Aksi Berkas (Dibawah Dokumen) -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            <!-- Kiri: QR Code & Validasi Penawaran Instan (7 Cols) -->
            <div class="md:col-span-7 flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/95 p-5 sm:p-6 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-[#14161b]/95">
                <div class="shrink-0 p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200/90 dark:border-white/10 shadow-2xs">
                    <img 
                        src="{{ route('verify.quotation.qr', $quotation->quotation_number) }}" 
                        alt="QR Code Verifikasi Penawaran" 
                        class="size-20 sm:size-22 object-contain"
                    />
                </div>

                <div class="space-y-1.5 text-xs min-w-0 flex-1">
                    <div class="font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                        <span class="size-1.5 rounded-full bg-emerald-500"></span>
                        <span class="text-xs sm:text-sm">Validasi Penawaran Instan</span>
                    </div>
                    <p class="text-slate-500 dark:text-zinc-400 text-[11px] sm:text-xs leading-relaxed">
                        Pindai kode QR untuk memvalidasi keabsahan proposal penawaran jasa hukum resmi secara publik.
                    </p>
                    <div class="font-mono text-[11px] text-slate-400 dark:text-zinc-500 truncate pt-0.5 select-all">
                        ID: <span class="font-semibold text-slate-800 dark:text-zinc-200">{{ $quotation->quotation_number }}</span>
                    </div>
                </div>
            </div>

            <!-- Kanan: Aksi & Proposal Penawaran (5 Cols) -->
            <div class="md:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/95 p-5 sm:p-6 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-[#14161b]/95 space-y-3">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
                    Aksi &amp; Proposal Penawaran
                </span>

                <div class="flex flex-col gap-2.5 flex-1 justify-center">
                    <button
                        type="button"
                        onclick="window.print()"
                        class="group flex items-center justify-between rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
                    >
                        <div class="flex items-center gap-2.5">
                            <svg class="size-4 shrink-0 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>Cetak Surat Penawaran</span>
                        </div>
                        <span class="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/20 text-white">
                            Berkas Cetak
                        </span>
                    </button>
                    <button
                        type="button"
                        onclick="copyText(window.location.href, this)"
                        class="group flex items-center justify-between rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 active:bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-800 shadow-2xs transition-all dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                        <div class="flex items-center gap-2.5">
                            <svg class="size-4 text-slate-500 dark:text-zinc-400 shrink-0 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Salin Tautan Verifikasi</span>
                        </div>
                        <span class="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                            Tautan Publik
                        </span>
                    </button>
                </div>

                <!-- Baseline Note -->
                <div class="pt-2 flex items-center justify-between text-slate-400 dark:text-zinc-500 font-mono text-[10.5px] border-t border-slate-100 dark:border-white/5">
                    <span class="flex items-center gap-1.5">
                        <span class="size-1.5 rounded-full bg-emerald-500"></span>
                        <span>Sistem Penawaran Sah</span>
                    </span>
                    <span>Terenkripsi TLS 1.3</span>
                </div>
            </div>

        </div>

    </main>

    <!-- 5. Footer Minimalis Resmi -->
    <footer class="mt-auto border-t border-slate-200/80 bg-white/80 py-4.5 text-center text-xs text-slate-500 backdrop-blur-md transition-colors dark:border-white/[0.06] dark:bg-[#0f1115]/80 dark:text-zinc-400">
        <div class="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
            <div class="flex items-center gap-2.5 font-mono text-[11px]">
                <span class="font-extrabold text-slate-950 dark:text-zinc-100 uppercase tracking-wider font-sans">RPK LAW FIRM</span>
                <span class="text-slate-300 dark:text-zinc-700">·</span>
                <span class="text-slate-600 dark:text-zinc-400 font-sans">Integritas Dokumen Terjamin (UU ITE No. 11/2008 &amp; No. 1/2024)</span>
            </div>
            <div class="flex items-center gap-3 font-mono text-[11px] text-slate-400 dark:text-zinc-500">
                <span>Ref: <span class="font-semibold text-slate-600 dark:text-zinc-400">{{ $quotation->quotation_number }}</span></span>
                <span class="text-slate-300 dark:text-zinc-700">·</span>
                <span>Hak Cipta Dilindungi Undang-Undang</span>
            </div>
        </div>
    </footer>

    <script>
        function copyText(text, btn) {
            navigator.clipboard.writeText(text).then(() => {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<span class="text-emerald-600 dark:text-emerald-400 font-bold">Tersalin!</span>';
                setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
            });
        }
    </script>
</body>
</html>
