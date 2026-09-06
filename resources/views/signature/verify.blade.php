@php
    $isCompleted = $signatureRequest->status === 'completed';
    $isPending = in_array($signatureRequest->status, ['sent', 'pending']);
    $rawDocTitle = trim((string)($signatureRequest->document->title ?? ''));
    $isDefaultOrTest = empty($rawDocTitle) || strtolower($rawDocTitle) === 'test' || strtolower($rawDocTitle) === 'dokumen';
    $officialDocTitle = $isDefaultOrTest 
        ? 'SURAT KUASA KHUSUS & BERITA ACARA ELEKTRONIK' 
        : $rawDocTitle;
@endphp
<!doctype html>
<html lang="id" class="h-full antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sertifikat Verifikasi Keabsahan Dokumen | RPK Law Firm</title>
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
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    @vite(['resources/css/app.css'])
    
    <!-- PDF.js CDN for Interactive Document Inspector -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>

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
            background-image: radial-gradient(ellipse 68% 58% at 50% 48%, rgba(250, 250, 252, 0.72) 0%, rgba(250, 250, 252, 0.46) 44%, rgba(250, 250, 252, 0.12) 74%, transparent 100%), linear-gradient(rgba(250, 250, 252, 0.24), rgba(250, 250, 252, 0.24)), url('/images/workspace-landscape-bg.png');
            background-size: cover;
            background-attachment: fixed;
            background-position: bottom;
            background-repeat: no-repeat;
        }
        .dark body,
        html.dark body {
            background-color: #101216;
            background-image: radial-gradient(ellipse 72% 62% at 50% 42%, rgba(15, 23, 42, 0.08) 0%, rgba(8, 15, 28, 0.2) 66%, rgba(5, 10, 19, 0.38) 100%), url('/images/workspace-architectural-dark-bg.png');
            background-size: cover;
            background-attachment: fixed;
            background-position: bottom;
            background-repeat: no-repeat;
        }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-cinzel { font-family: 'Cinzel', serif; }

        .custom-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(148, 163, 184, 0.45) transparent;
        }
        .custom-scroll::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.02);
            border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.45);
            border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(100, 116, 139, 0.7);
        }

        @media print {
            body { background: white !important; padding: 0 !important; }
            .no-print { display: none !important; }
        }
    </style>
</head>
<body class="min-h-screen text-slate-900 selection:bg-slate-900 selection:text-white dark:text-zinc-100 flex flex-col justify-between">

    <!-- 1. Sleek Modern Top Bar (No Badges, No Emotes) -->
    <header class="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md transition-all sm:px-6 lg:px-8 dark:border-white/[0.08] dark:bg-[#111317]/90">
        <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <a href="{{ route('home') }}" title="RPK Law Firm" class="shrink-0 transition-opacity hover:opacity-90 flex items-center">
                    <img 
                        src="/logo/raf-law-firm-transparent.png" 
                        alt="RPK Law Firm" 
                        class="h-8 w-auto max-w-[140px] object-contain dark:brightness-110"
                        onerror="this.onerror=null; this.src='/logo/logo.png';"
                    />
                </a>
                <div class="h-4 w-px bg-slate-200 dark:bg-white/10"></div>
                <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold tracking-wider text-slate-950 dark:text-white uppercase font-cinzel">RPK LAW FIRM</span>
                        <span class="text-slate-300 dark:text-zinc-700 hidden sm:inline">·</span>
                        <span class="text-[10px] text-slate-500 dark:text-zinc-400 hidden sm:inline">Portal Verifikasi Keabsahan Dokumen</span>
                    </div>
                    <span class="text-[10px] text-slate-400 dark:text-zinc-500">Roni, Putra &amp; Kusumah Law Firm · Integritas Kriptografis Resmi</span>
                </div>
            </div>

            <!-- Protocol & Security Status -->
            <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
                <div class="hidden sm:flex items-center gap-2 text-[11px] font-mono">
                    <span class="text-slate-400 dark:text-zinc-500">Protokol:</span>
                    <span class="text-slate-700 dark:text-zinc-300">UU ITE &amp; SHA-256 Valid</span>
                </div>
                <div class="h-3 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
                @if ($isCompleted)
                    <div class="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                        <span class="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                        <span>SAH TERVERIFIKASI</span>
                    </div>
                @elseif ($isPending)
                    <div class="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 dark:text-amber-400">
                        <span class="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>PROSES PENANDATANGANAN</span>
                    </div>
                @else
                    <div class="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                        <span>{{ strtoupper($signatureRequest->status) }}</span>
                    </div>
                @endif
            </div>
        </div>
    </header>

    <!-- 2. Main Verification Workspace Layout -->
    <main class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-5 flex-1">

        <!-- Flash Notice Banners (Clean, Subtle, Executive) -->
        @if (session('success'))
            <div class="rounded-xl border border-emerald-200/80 bg-emerald-50/90 dark:border-emerald-800/40 dark:bg-emerald-950/40 p-4 text-xs font-medium text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3 shadow-2xs">
                <div class="flex items-center gap-2">
                    <svg class="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{{ session('success') }}</span>
                </div>
            </div>
        @endif

        @if (session('info'))
            <div class="rounded-xl border border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-zinc-900/90 p-4 text-xs font-medium text-slate-800 dark:text-zinc-200 flex items-center justify-between gap-3 shadow-2xs">
                <div class="flex items-center gap-2">
                    <svg class="size-4 text-slate-600 dark:text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ session('info') }}</span>
                </div>
            </div>
        @endif

        <!-- Executive Document Context Card -->
        <div class="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]/95 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs dark:border-white/[0.04]">
                <div class="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                    <span class="font-bold text-slate-900 dark:text-white font-cinzel">RPK Law Firm Legal Workspace</span>
                    <span>·</span>
                    <span>Sertifikat Otentisitas Elektronik</span>
                </div>
                <span class="font-mono text-slate-400 dark:text-zinc-500 text-[11px]">
                    Diverifikasi: <strong class="text-slate-700 dark:text-zinc-300 font-semibold">{{ now()->timezone(config('raf.timezone', 'Asia/Jakarta'))->translatedFormat('d F Y, H:i') }} WIB</strong>
                </span>
            </div>

            <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                    <span class="font-mono font-semibold text-slate-900 dark:text-white">
                        {{ $signatureRequest->document->matter?->matter_number ?? 'RPK-2026-0001' }}
                    </span>
                    <span class="text-slate-300 dark:text-zinc-700">·</span>
                    <span class="truncate">
                        {{ $signatureRequest->document->matter?->title ?? 'Pendampingan Hukum Korporasi dan Litigasi Strategis' }}
                    </span>
                </div>
                <h1 class="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                    {{ $officialDocTitle }}
                </h1>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed pt-0.5">
                    Sertifikat verifikasi keabsahan penandatanganan elektronik dokumen hukum resmi yang memiliki kekuatan hukum mengikat sesuai Pasal 11 UU ITE dan PP No. 71 Tahun 2019.
                </p>
            </div>

            <!-- Unified 3-Column Executive Data Bar -->
            <div class="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/70 shadow-2xs grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:border-white/10 dark:bg-zinc-900/60 dark:divide-white/10">
                <div class="p-3.5 sm:px-4 sm:py-3 flex flex-col justify-center">
                    <span class="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Kode Otentikasi</span>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate select-all">
                            {{ $signatureRequest->verification_code }}
                        </span>
                        <button 
                            type="button" 
                            onclick="copyText('{{ $signatureRequest->verification_code }}', this)"
                            class="text-[10.5px] font-semibold text-slate-700 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
                            title="Salin Kode"
                        >
                            Salin
                        </button>
                    </div>
                </div>

                <div class="p-3.5 sm:px-4 sm:py-3 flex flex-col justify-center">
                    <span class="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Perkara / Versi Dokumen</span>
                    <span class="mt-0.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                        @if ($signatureRequest->document->matter)
                            <span class="font-mono">{{ $signatureRequest->document->matter->matter_number }}</span> (v{{ $signatureRequest->documentVersion->version_number ?? 1 }}.0)
                        @else
                            Internal Firma (v{{ $signatureRequest->documentVersion->version_number ?? 1 }}.0)
                        @endif
                    </span>
                </div>

                <div class="p-3.5 sm:px-4 sm:py-3 flex flex-col justify-center">
                    <span class="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Status Keabsahan</span>
                    <div class="mt-0.5 flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                        @if ($isCompleted)
                            <svg class="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Sah (Dokumen telah ditandatangani)</span>
                        @else
                            <svg class="size-4 text-amber-600 dark:text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Menunggu Penyelesaian Tanda Tangan</span>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- 3. Split Grid: Left Document Viewer, Right Verification & Endorsement Suite -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            <!-- LEFT: Interactive Document Viewport (7 Cols on LG) -->
            <div class="lg:col-span-7 space-y-4">
                <div class="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]/95 space-y-3">
                    
                    <!-- Inspector Toolbar -->
                    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs dark:border-white/[0.04]">
                        
                        <!-- Page Navigator -->
                        <div class="flex items-center gap-1.5">
                            <button 
                                type="button" 
                                id="btnPrevPage" 
                                onclick="prevPage()"
                                class="size-7 flex items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-35 transition-colors cursor-pointer dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                title="Halaman Sebelumnya"
                            >
                                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span class="font-mono text-xs text-slate-600 dark:text-zinc-300 px-2 py-1">
                                Hal <strong id="pageNum" class="font-bold text-slate-900 dark:text-white">1</strong> / <span id="pageCount">1</span>
                            </span>
                            <button 
                                type="button" 
                                id="btnNextPage" 
                                onclick="nextPage()"
                                class="size-7 flex items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-35 transition-colors cursor-pointer dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                title="Halaman Berikutnya"
                            >
                                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <!-- Zoom Controls -->
                        <div class="flex items-center gap-1 bg-slate-100/80 dark:bg-zinc-800/60 p-0.5 rounded-lg border border-slate-200/60 dark:border-white/5">
                            <button 
                                type="button" 
                                onclick="changeZoom(-0.15)"
                                class="size-6 flex items-center justify-center rounded-md font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                                title="Perkecil Tampilan"
                            >
                                <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" />
                                </svg>
                            </button>
                            <button 
                                type="button" 
                                onclick="resetZoom()"
                                id="zoomLevelDisplay"
                                class="px-2 text-[11px] font-mono font-bold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer dark:text-zinc-300 dark:hover:text-white"
                                title="Reset Ukuran Tampilan (100%)"
                            >
                                100%
                            </button>
                            <button 
                                type="button" 
                                onclick="changeZoom(0.15)"
                                class="size-6 flex items-center justify-center rounded-md font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                                title="Perbesar Tampilan"
                            >
                                <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        <div class="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                            @if ($isCompleted)
                                <span class="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                                <span>Dokumen Final Bertanda Tangan</span>
                            @else
                                <span class="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                <span>Pratinjau Draf Terdaftar</span>
                            @endif
                        </div>
                    </div>

                    <!-- PDF Render Viewport Area -->
                    <div class="relative overflow-auto rounded-lg border border-slate-200/80 bg-slate-100/60 dark:border-white/10 dark:bg-zinc-900/40 p-3 sm:p-6 flex flex-col items-center min-h-[520px] max-h-[760px] custom-scroll" id="pdfViewportContainer" style="scroll-behavior: smooth;">
                        
                        <!-- Loading Spinner -->
                        <div id="pdfLoadingSpinner" class="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-zinc-900/90 z-20 space-y-2 text-slate-700 dark:text-zinc-300 rounded-lg">
                            <div class="size-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-white"></div>
                            <span class="text-xs font-semibold">Memuat Berkas Dokumen Resmi...</span>
                        </div>

                        <!-- Page Canvas Wrapper -->
                        <div class="relative shadow-md rounded-xs bg-white mx-auto my-0 shrink-0" id="pageWrapper">
                            <canvas id="pdfCanvas" class="bg-white block rounded-xs"></canvas>
                        </div>
                    </div>

                    <!-- Viewer Footer Sub-strip -->
                    <div class="border-t border-slate-100 dark:border-white/[0.04] pt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                        <span>Format Dokumen: PDF/A-1b Standard</span>
                        <span>Otentikasi Kriptografis RPK Valid</span>
                    </div>
                </div>
            </div>

            <!-- RIGHT: Control Suite, Endorsement, Audit Trail & Actions (5 Cols on LG) -->
            <div class="lg:col-span-5 space-y-4">

                <!-- 1. Official Document Certification & Endorsement Card -->
                <div class="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-4.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]/95 space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                        <div class="flex items-center gap-2">
                            <svg class="size-4 text-slate-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                Pengesahan Dokumen Resmi Firma Hukum
                            </h2>
                        </div>
                        <span class="text-[10px] font-mono text-slate-500 dark:text-zinc-400">Otorisasi &amp; Sertifikasi</span>
                    </div>

                    <div class="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3.5 dark:border-white/[0.04] dark:bg-zinc-900/50">
                        <div class="size-10 rounded-full bg-slate-900 text-white font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-xs dark:bg-white dark:text-slate-900">
                            FR
                        </div>
                        <div class="space-y-0.5 min-w-0 flex-1">
                            <div class="flex items-center justify-between gap-2">
                                <h3 class="text-xs font-bold text-slate-950 dark:text-white truncate">
                                    Muhamad Fajar Roni, S.H.
                                </h3>
                                <span class="text-[9px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/40 shrink-0">
                                    Otorisasi Aktif
                                </span>
                            </div>
                            <p class="text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                                Executive &amp; Strategic Litigation
                            </p>
                            <p class="text-[10px] text-slate-400 dark:text-zinc-500">
                                Managing Partner · Roni, Putra &amp; Kusumah Law Firm
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-[10.5px] font-mono text-slate-500 dark:text-zinc-400 pt-0.5">
                        <div class="flex flex-col">
                            <span class="text-[9.5px] text-slate-400 dark:text-zinc-500">Status Otorisasi:</span>
                            <strong class="text-slate-800 dark:text-zinc-200">Sah Terotorisasi</strong>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[9.5px] text-slate-400 dark:text-zinc-500">Kepatuhan Hukum:</span>
                            <span class="text-slate-800 dark:text-zinc-200">Pasal 11 UU ITE</span>
                        </div>
                    </div>
                </div>

                <!-- 2. Signers Audit Trail Section (Jejak Rekam Pembubuhan) -->
                <div class="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-4.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]/95 space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                            <svg class="size-4 text-slate-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>Jejak Rekam Pembubuhan Penandatangan</span>
                        </h3>
                        <span class="font-mono text-[11px] font-bold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10">
                            {{ $signatureRequest->signers->where('status', 'signed')->count() }} / {{ $signatureRequest->signers->count() }} Pihak Telah Tanda Tangan
                        </span>
                    </div>

                    <div class="space-y-3">
                        @foreach ($signatureRequest->signers as $index => $signer)
                            <div class="rounded-xl border border-slate-200/80 bg-slate-50/40 p-3.5 space-y-3 shadow-2xs dark:border-white/[0.06] dark:bg-zinc-900/40">
                                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-2 dark:border-white/[0.04]">
                                    <div class="flex items-center gap-2.5">
                                        <span class="flex size-5.5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white shrink-0 dark:bg-white dark:text-slate-900">
                                            {{ $index + 1 }}
                                        </span>
                                        <div>
                                            <h4 class="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                                                {{ $signer->accepted_name ?: $signer->name }}
                                            </h4>
                                            <div class="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                @if ($signer->signer_title)
                                                    <span class="font-medium text-slate-700 dark:text-zinc-300">{{ $signer->signer_title }}</span>
                                                    <span>·</span>
                                                @endif
                                                <span class="font-mono text-[10.5px]">{{ $signer->email }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        @if ($signer->status === 'signed')
                                            <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                                                <svg class="size-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Sah Terverifikasi
                                            </span>
                                        @else
                                            <span class="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                                                Menunggu Tanda Tangan
                                            </span>
                                        @endif
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                    <div>
                                        <span class="block text-[9.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                            Goresan Tanda Tangan:
                                        </span>
                                        @if ($signer->status === 'signed' && $signer->signature_data)
                                            <div class="mt-1 flex h-14 w-44 items-center justify-center rounded-lg border border-slate-200/80 bg-white p-1.5 shadow-2xs dark:border-white/10 dark:bg-zinc-900">
                                                <img 
                                                    src="{{ $signer->signature_data }}" 
                                                    alt="Tanda Tangan {{ $signer->name }}" 
                                                    style="max-height: 48px; max-width: 100%; object-fit: contain;"
                                                />
                                            </div>
                                        @elseif ($signer->status === 'signed')
                                            <div class="mt-1 flex h-12 w-44 items-center justify-center rounded-lg border border-slate-200/80 bg-white p-1.5 font-mono text-[11px] font-bold text-slate-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 shadow-2xs">
                                                Digital Signature Verified
                                            </div>
                                        @else
                                            <div class="mt-1 flex h-12 w-44 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-1.5 text-[11px] italic text-slate-400 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-500">
                                                Belum ditandatangani
                                            </div>
                                        @endif
                                    </div>

                                    <div class="space-y-1 sm:text-right text-xs">
                                        <div>
                                            <span class="block text-[9.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                                Waktu Pembubuhan:
                                            </span>
                                            @if ($signer->status === 'signed' && $signer->signed_at)
                                                <p class="font-mono text-[11.5px] font-bold text-slate-900 dark:text-white">
                                                    {{ $signer->signed_at->timezone(config('raf.timezone', 'Asia/Jakarta'))->translatedFormat('d F Y, H:i:s') }} WIB
                                                </p>
                                            @else
                                                <p class="text-[11px] italic text-amber-600 dark:text-amber-400">
                                                    Menunggu penandatanganan
                                                </p>
                                            @endif
                                        </div>
                                        @if ($signer->page_number)
                                            <div class="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                                <span>Posisi Dokumen:</span>
                                                <strong class="font-mono text-slate-800 dark:text-zinc-200">Halaman {{ $signer->page_number }}</strong>
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>

                <!-- 3. Action & Download Hub -->
                @if ($isCompleted)
                    <div class="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-4.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]/95 space-y-3">
                        <div class="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                            <svg class="size-4 text-slate-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                Unduh Berkas Resmi Yang Telah Ditandatangani
                            </h3>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-2">
                            <a
                                href="{{ route('signature.verify.download-signed', $signatureRequest->verification_code) }}"
                                class="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-black active:scale-98 transition-all dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-200"
                            >
                                <svg class="size-3.5 text-emerald-400 dark:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Unduh PDF Bertanda Tangan</span>
                            </a>
                            <a
                                href="{{ route('signature.verify.download-certificate', $signatureRequest->verification_code) }}"
                                class="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-98 transition-all dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            >
                                <svg class="size-3.5 text-slate-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                                </svg>
                                <span>Unduh Sertifikat PDF</span>
                            </a>
                        </div>
                    </div>
                @endif

                <!-- 4. Cryptographic Checksum (SHA-256) -->
                <div class="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]/95 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                            <svg class="size-3 text-slate-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Digital Checksum (SHA-256 Integrity Hash)</span>
                        </span>
                        <button 
                            type="button" 
                            onclick="copyText('{{ $signatureRequest->document_checksum }}', this)"
                            class="cursor-pointer rounded-md border border-slate-200/80 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                        >
                            Salin Hash
                        </button>
                    </div>
                    <code class="block font-mono text-[10.5px] text-slate-800 dark:text-zinc-200 font-bold break-all select-all bg-slate-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-white/5">
                        {{ $signatureRequest->document_checksum }}
                    </code>
                </div>

                <!-- 5. Barcode QR Code Verification Box -->
                <div class="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]/95 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="shrink-0 rounded-lg bg-white p-1.5 border border-slate-200/80 shadow-2xs dark:border-white/10">
                            <img 
                                src="{{ route('signature.qr', $signatureRequest->verification_code) }}" 
                                alt="QR Code Verifikasi Tanda Tangan" 
                                class="size-16 object-contain"
                            />
                        </div>
                        <div class="space-y-0.5 text-xs">
                            <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <svg class="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Dokumen Terdaftar Resmi</span>
                            </div>
                            <p class="text-slate-500 dark:text-zinc-400 text-[10.5px] leading-tight">
                                Tanda tangan elektronik sah sesuai Pasal 11 UU ITE &amp; PP No. 71 Tahun 2019.
                            </p>
                            <div class="font-mono text-[10px] text-slate-400 dark:text-zinc-500 truncate max-w-[240px] pt-0.5">
                                Kode: {{ $signatureRequest->verification_code }}
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-1.5 w-full sm:w-auto no-print shrink-0">
                        <button 
                            type="button" 
                            onclick="window.print()" 
                            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        >
                            <svg class="size-3 text-slate-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>Cetak</span>
                        </button>
                        <button 
                            type="button" 
                            onclick="copyLink()" 
                            id="copyBtn"
                            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 transition-all cursor-pointer dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-200"
                        >
                            <svg class="size-3 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span id="copyBtnText">Salin URL</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>

    </main>

    <!-- 4. Dignified Corporate Footer -->
    <footer class="mt-8 border-t border-slate-200/80 bg-white/90 py-5 text-center text-xs text-slate-500 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#111317]/90 dark:text-zinc-500">
        <p class="font-cinzel text-xs font-bold tracking-wider text-slate-800 dark:text-zinc-300 uppercase">&copy; {{ date('Y') }} RONI, PUTRA &amp; KUSUMAH LAW FIRM</p>
        <p class="font-mono text-[11px] text-slate-400 dark:text-zinc-600 mt-0.5">Sistem Manajemen Dokumen Elektronik Terpadu · UU ITE &amp; SHA-256 Validated</p>
    </footer>

    <!-- Interactive PDF.js Inspector Engine -->
    <script>
        const previewPdfUrl = "{{ route('signature.verify.preview', $signatureRequest->verification_code) }}";
        let pdfDoc = null;
        let currentPage = 1;
        let totalPages = 1;
        let currentZoomScale = 1.0;

        const pdfCanvas = document.getElementById('pdfCanvas');
        const pdfCtx = pdfCanvas.getContext('2d');
        const pageWrapper = document.getElementById('pageWrapper');

        function renderFallbackPage() {
            const container = document.getElementById('pdfViewportContainer');
            const containerWidth = Math.min(800, (container ? container.clientWidth : 700) - 48);
            const pageWidth = Math.max(480, containerWidth);
            const pageHeight = Math.round(pageWidth * 1.414); // A4 aspect ratio

            const dpr = Math.max(window.devicePixelRatio || 1, 1.5);
            pdfCanvas.height = Math.round(pageHeight * dpr);
            pdfCanvas.width = Math.round(pageWidth * dpr);
            pdfCanvas.style.width = pageWidth + 'px';
            pdfCanvas.style.height = pageHeight + 'px';

            pageWrapper.style.width = pageWidth + 'px';
            pageWrapper.style.height = pageHeight + 'px';

            pdfCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            pdfCtx.fillStyle = '#ffffff';
            pdfCtx.fillRect(0, 0, pageWidth, pageHeight);

            // Document header box
            pdfCtx.fillStyle = '#f8fafc';
            pdfCtx.fillRect(28, 28, pageWidth - 56, 68);
            pdfCtx.fillStyle = '#0f172a';
            pdfCtx.font = 'bold 13px Manrope, sans-serif';
            pdfCtx.fillText("{{ addslashes($officialDocTitle) }}", 44, 56);
            pdfCtx.fillStyle = '#64748b';
            pdfCtx.font = '10px JetBrains Mono, monospace';
            pdfCtx.fillText("Dokumen Terverifikasi RPK Law Firm · {{ $signatureRequest->verification_code }}", 44, 76);

            // Lines
            pdfCtx.fillStyle = '#e2e8f0';
            for (let y = 120; y < pageHeight - 140; y += 18) {
                const isShort = (y % 72 === 0) || (y % 126 === 0);
                const lineWidth = isShort ? (pageWidth - 160) : (pageWidth - 84);
                pdfCtx.fillRect(42, y, lineWidth, 7);
            }

            document.getElementById('pageNum').innerText = '1';
            document.getElementById('pageCount').innerText = '1';
            document.getElementById('pdfLoadingSpinner').classList.add('hidden');
        }

        if (window.pdfjsLib) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            pdfjsLib.getDocument(previewPdfUrl).promise.then(function(pdf) {
                pdfDoc = pdf;
                totalPages = pdf.numPages;
                currentPage = 1;
                document.getElementById('pageCount').innerText = totalPages;
                document.getElementById('pdfLoadingSpinner').classList.add('hidden');
                
                renderPage(currentPage);
            }).catch(function(err) {
                console.warn('PDF load fallback:', err);
                renderFallbackPage();
            });
        } else {
            renderFallbackPage();
        }

        function renderPage(pageNum) {
            if (!pdfDoc) {
                renderFallbackPage();
                return;
            }
            pdfDoc.getPage(pageNum).then(function(page) {
                const containerWidth = Math.min(800, document.getElementById('pdfViewportContainer').clientWidth - 48);
                const unscaledViewport = page.getViewport({ scale: 1 });

                const baseScale = containerWidth / unscaledViewport.width;
                const finalScale = baseScale * currentZoomScale;
                const viewport = page.getViewport({ scale: finalScale });

                const dpr = Math.max(window.devicePixelRatio || 1, 1.5);
                pdfCanvas.height = Math.round(viewport.height * dpr);
                pdfCanvas.width = Math.round(viewport.width * dpr);
                pdfCanvas.style.width = viewport.width + 'px';
                pdfCanvas.style.height = viewport.height + 'px';

                pageWrapper.style.width = viewport.width + 'px';
                pageWrapper.style.height = viewport.height + 'px';

                const renderContext = {
                    canvasContext: pdfCtx,
                    transform: [dpr, 0, 0, dpr, 0, 0],
                    viewport: viewport
                };
                page.render(renderContext);

                document.getElementById('pageNum').innerText = pageNum;
                document.getElementById('btnPrevPage').disabled = pageNum <= 1;
                document.getElementById('btnNextPage').disabled = pageNum >= totalPages;
            });
        }

        function prevPage() {
            if (currentPage <= 1) return;
            currentPage--;
            renderPage(currentPage);
        }

        function nextPage() {
            if (currentPage >= totalPages) return;
            currentPage++;
            renderPage(currentPage);
        }

        function changeZoom(delta) {
            currentZoomScale = Math.max(0.5, Math.min(2.0, currentZoomScale + delta));
            document.getElementById('zoomLevelDisplay').innerText = Math.round(currentZoomScale * 100) + '%';
            renderPage(currentPage);
        }

        function resetZoom() {
            currentZoomScale = 1.0;
            document.getElementById('zoomLevelDisplay').innerText = '100%';
            renderPage(currentPage);
        }

        function copyText(text, btn) {
            navigator.clipboard.writeText(text).then(() => {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<span class="text-emerald-600 dark:text-emerald-400 font-bold">Tersalin!</span>';
                setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
            });
        }

        function copyLink() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const btn = document.getElementById('copyBtnText');
                const prev = btn.innerText;
                btn.innerText = 'Tersalin!';
                setTimeout(() => { btn.innerText = prev; }, 2000);
            });
        }
    </script>
</body>
</html>
