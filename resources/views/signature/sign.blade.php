<!doctype html>
<html lang="id" class="h-full antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Penandatanganan Dokumen Elektronik Resmi | RPK Law Firm</title>
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
    
    <!-- PDF.js & SignaturePad CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/signature_pad@5.0.4/dist/signature_pad.umd.min.js"></script>
    
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

        .placement-stamp {
            cursor: grab;
            user-select: none;
            touch-action: none;
            transition: box-shadow 0.15s ease, transform 0.15s ease, width 0.12s ease, height 0.12s ease;
        }
        .placement-stamp:active, .placement-stamp.is-dragging {
            cursor: grabbing;
            transform: scale(1.015);
            box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.8), 0 16px 24px -4px rgba(0, 0, 0, 0.22);
        }

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
    </style>
</head>
<body class="min-h-screen bg-cover bg-fixed bg-bottom bg-no-repeat text-slate-900 selection:bg-slate-900 selection:text-white dark:text-zinc-100 flex flex-col justify-between">

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
                        <span class="text-[10px] text-slate-500 dark:text-zinc-400 hidden sm:inline">Digital Signing Workspace</span>
                    </div>
                    <span class="text-[10px] text-slate-400 dark:text-zinc-500">Roni, Putra &amp; Kusumah Law Firm · Integrated Practice Management</span>
                </div>
            </div>

            <!-- Protocol & Security Status (Clean Minimal Text, No Badges, No Emotes) -->
            <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
                <div class="hidden md:flex items-center gap-2 text-[11px] font-mono">
                    <span class="text-slate-400 dark:text-zinc-500">Protokol:</span>
                    <span class="text-slate-700 dark:text-zinc-300">UU ITE &amp; SHA-256 Valid</span>
                </div>
                <div class="h-3 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>
                <div class="flex items-center gap-1.5 text-[11px] font-medium text-slate-800 dark:text-zinc-200">
                    <span class="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                    <span>Sesi Penandatanganan Aktif</span>
                </div>
            </div>
        </div>
    </header>

    <!-- 2. Main Workspace Layout -->
    <main class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-5 flex-1">

        @php
            $rawDocTitle = trim((string)($signer->signatureRequest->document->title ?? ''));
            $isDefaultOrTest = empty($rawDocTitle) || strtolower($rawDocTitle) === 'test' || strtolower($rawDocTitle) === 'dokumen';
            $officialDocTitle = $isDefaultOrTest 
                ? 'SURAT KUASA KHUSUS & BERITA ACARA ELEKTRONIK' 
                : $rawDocTitle;
        @endphp

        <!-- Executive Document Context Card -->
        <div class="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]/95 space-y-4">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div class="space-y-1.5 min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                        <span class="font-mono font-semibold text-slate-900 dark:text-white">
                            {{ $signer->signatureRequest->document->matter?->matter_number ?? 'RPK-2026-0001' }}
                        </span>
                        <span class="text-slate-300 dark:text-zinc-700">·</span>
                        <span class="truncate">
                            {{ $signer->signatureRequest->document->matter?->title ?? 'Pendampingan Hukum Korporasi dan Litigasi Strategis' }}
                        </span>
                    </div>
                    <h1 class="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-slate-950 dark:text-white leading-snug">
                        {{ $officialDocTitle }}
                    </h1>
                </div>

                <div class="flex flex-wrap items-center gap-4 sm:gap-6 shrink-0 text-xs border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0 dark:border-white/[0.04]">
                    <!-- Registered Signer Identity -->
                    <div class="flex items-center gap-2.5">
                        <div class="size-8 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-white/10 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-zinc-300">
                            {{ collect(explode(' ', $signer->name))->map(fn($w) => mb_substr($w, 0, 1))->take(2)->join('') }}
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-400 dark:text-zinc-500 block">Pihak Penandatangan</span>
                            <strong class="font-semibold text-slate-900 dark:text-zinc-100">{{ $signer->name }}</strong>
                            <span class="block font-mono text-[11px] text-slate-500 dark:text-zinc-400">{{ $signer->email }}</span>
                        </div>
                    </div>

                    @if ($signer->signatureRequest->expires_at)
                        <div class="border-l border-slate-200/80 dark:border-white/10 pl-4 sm:pl-6">
                            <span class="text-[10px] text-slate-400 dark:text-zinc-500 block">Batas Waktu</span>
                            <span class="font-mono font-semibold text-slate-800 dark:text-zinc-200">
                                {{ $signer->signatureRequest->expires_at->translatedFormat('d M Y, H:i') }} WIB
                            </span>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Guidance Sub-strip -->
            <div class="border-t border-slate-100 dark:border-white/[0.04] pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-400">
                <div class="flex items-center gap-2">
                    <svg class="size-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Goreskan tanda tangan langsung di atas lembar dokumen pada area yang dituju, atur posisi stempel atau QR verifikasi, lalu tinjau pratinjau sebelum penerbitan.</span>
                </div>
                <span class="font-mono text-[11px] text-slate-400 dark:text-zinc-500">Skala Presisi WYSIWYG</span>
            </div>
        </div>

        <!-- 3. Form Grid: Split Layout (Viewer & Control Suite) -->
        <form id="signingForm" method="post" action="{{ route('signature.sign.store', $signer->signing_token) }}" class="space-y-4">
            @csrf

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                <!-- LEFT: Interactive Document Viewport (7 Cols on LG) -->
                <div class="lg:col-span-7 space-y-3">
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
                                <span id="zoomLevelDisplay" class="font-mono text-[11px] font-semibold text-slate-600 dark:text-zinc-300 px-1 min-w-[38px] text-center">
                                    100%
                                </span>
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
                                <button 
                                    type="button" 
                                    onclick="resetZoom()"
                                    class="px-2 py-0.5 rounded-md text-[10.5px] font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                                    title="Sesuaikan Ukuran Layar"
                                >
                                    Fit
                                </button>
                            </div>

                            <!-- Placement Presets -->
                            <div class="flex items-center gap-1.5 text-xs">
                                <span class="text-slate-400 dark:text-zinc-500 hidden sm:inline text-[11px]">Snap:</span>
                                <button 
                                    type="button" 
                                    onclick="setPresetPosition('bottom-right')"
                                    class="h-7 px-2.5 rounded-lg border border-slate-200/80 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                    Kanan Bawah
                                </button>
                                <button 
                                    type="button" 
                                    onclick="setPresetPosition('bottom-left')"
                                    class="h-7 px-2.5 rounded-lg border border-slate-200/80 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                    Kiri Bawah
                                </button>
                            </div>
                        </div>

                        <!-- Direct Pen Inking Bar -->
                        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 text-xs dark:border-white/[0.04]">
                            <div class="flex items-center gap-2">
                                <span class="text-[11px] font-medium text-slate-600 dark:text-zinc-400">Pilihan Tinta:</span>
                                <button 
                                    type="button" 
                                    onclick="setPenColor('#1e3a8a')" 
                                    id="btnColorBlue"
                                    class="size-4.5 rounded-full bg-blue-900 ring-2 ring-slate-900 ring-offset-1 transition-all cursor-pointer dark:ring-white" 
                                    title="Biru Dokumen Legal"
                                ></button>
                                <button 
                                    type="button" 
                                    onclick="setPenColor('#0f172a')" 
                                    id="btnColorNavy"
                                    class="size-4.5 rounded-full bg-slate-900 transition-all cursor-pointer" 
                                    title="Navy Gelap"
                                ></button>
                                <button 
                                    type="button" 
                                    onclick="setPenColor('#000000')" 
                                    id="btnColorBlack"
                                    class="size-4.5 rounded-full bg-black transition-all cursor-pointer" 
                                    title="Hitam Pekat"
                                ></button>
                                <div class="h-3.5 w-px bg-slate-200 dark:bg-zinc-700 mx-1"></div>
                                <button 
                                    type="button" 
                                    onclick="clearCanvas()" 
                                    class="cursor-pointer text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1"
                                    title="Hapus goresan tanda tangan"
                                >
                                    <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Hapus TTD</span>
                                </button>
                            </div>
                            <div class="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                                <span class="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                                <span>Goreskan TTD langsung di atas kertas</span>
                            </div>
                        </div>

                        <!-- Live Coordinate & Dimensions Bar -->
                        <div class="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-400 px-0.5">
                            <span class="flex items-center gap-1.5">
                                <span class="size-1.5 rounded-full bg-slate-900 dark:bg-white"></span>
                                <span>Posisi: Hal <strong id="displayPage" class="font-semibold text-slate-800 dark:text-zinc-200">1</strong> (<strong id="displayX" class="text-slate-800 dark:text-zinc-200">60</strong>% X, <strong id="displayY" class="text-slate-800 dark:text-zinc-200">75</strong>% Y)</span>
                            </span>
                            <span>
                                Dimensi: <strong id="displayDimensions" class="font-semibold text-slate-800 dark:text-zinc-200">50 × 22 mm</strong>
                            </span>
                        </div>

                        <!-- PDF Render Viewport Area -->
                        <div class="relative overflow-auto rounded-lg border border-slate-200/80 bg-slate-100/60 dark:border-white/10 dark:bg-zinc-900/40 p-3 sm:p-6 flex flex-col items-center min-h-[520px] max-h-[720px] custom-scroll" id="pdfViewportContainer" style="scroll-behavior: smooth;">
                            
                            <!-- Loading Spinner -->
                            <div id="pdfLoadingSpinner" class="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-zinc-900/90 z-20 space-y-2 text-slate-700 dark:text-zinc-300 rounded-lg">
                                <div class="size-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-white"></div>
                                <span class="text-xs font-semibold">Memuat Pratinjau Dokumen...</span>
                            </div>

                            <!-- Page Canvas Wrapper -->
                            <div class="relative shadow-md rounded-xs bg-white mx-auto my-0 shrink-0" id="pageWrapper">
                                <canvas id="pdfCanvas" class="bg-white block rounded-xs"></canvas>
                                
                                <!-- Interactive Direct Paper Inking Zone (Direct on Paper) -->
                                <div 
                                    id="placementStamp" 
                                    class="placement-stamp absolute z-10 select-none bg-transparent group"
                                    style="width: 170px; height: 75px; left: 60%; top: 75%;"
                                >
                                    <!-- Floating Positioning Pill (Above signature on paper) -->
                                    <div 
                                        id="stampHeaderBar" 
                                        class="absolute -top-7 left-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-sans shadow-md cursor-grab active:cursor-grabbing select-none hover:bg-slate-800 transition-colors"
                                        title="Klik &amp; seret untuk memindahkan posisi tanda tangan pada lembar dokumen"
                                    >
                                        <svg class="size-2.5 text-slate-300 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                                        </svg>
                                        <span class="font-medium pointer-events-none tracking-tight">Geser Posisi TTD</span>
                                    </div>

                                    <!-- Direct Paper Signature Canvas Area -->
                                    <div 
                                        id="stampSigCanvasContainer" 
                                        class="relative w-full h-full rounded border border-dashed border-blue-400/60 bg-transparent transition-colors hover:border-blue-500/80"
                                    >
                                        <canvas 
                                            id="signatureCanvas" 
                                            class="w-full h-full block cursor-crosshair touch-none bg-transparent"
                                        ></canvas>
                                        <div id="canvasPlaceholder" class="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 text-[9px] text-blue-700/60 font-medium italic select-none">
                                            <span>Bubuhkan tanda tangan Anda di area ini</span>
                                        </div>
                                    </div>

                                    <!-- Signer Name Printed Underneath (If enabled) -->
                                    <div id="stampNameBottom" class="hidden pt-1 text-center pointer-events-none">
                                        <p class="text-[8px] font-bold text-slate-900 leading-tight truncate stamp-display-name">
                                            {{ $signer->name }}
                                        </p>
                                        <p class="text-[6.5px] text-slate-500 leading-none truncate stamp-display-title"></p>
                                    </div>

                                    <!-- Signer Name Printed On Top (If enabled) -->
                                    <div id="stampNameTop" class="hidden pb-1 text-center pointer-events-none">
                                        <p class="text-[8px] font-bold text-slate-900 leading-tight truncate stamp-display-name">
                                            {{ $signer->name }}
                                        </p>
                                        <p class="text-[6.5px] text-slate-500 leading-none truncate stamp-display-title"></p>
                                    </div>

                                </div>

                                <!-- Floating Draggable QR Verification Barcode -->
                                <div 
                                    id="stampQrBlock" 
                                    class="{{ ($signer->show_qr ?? true) ? '' : 'hidden' }} absolute z-20 select-none cursor-grab active:cursor-grabbing p-1 rounded-md border border-slate-300 bg-white shadow-md transition-all group dark:bg-zinc-900 dark:border-white/20"
                                    style="width: 52px; height: 52px;"
                                    title="Klik dan seret untuk meletakkan barcode QR di mana saja pada lembar dokumen"
                                >
                                    <div 
                                        id="qrDragHandle"
                                        class="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-900 text-[8px] font-sans font-medium text-white shadow-sm select-none whitespace-nowrap cursor-grab active:cursor-grabbing opacity-90 group-hover:opacity-100 dark:bg-zinc-800"
                                    >
                                        <svg class="size-2 text-slate-300 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                                        </svg>
                                        <span>Geser QR</span>
                                    </div>
                                    <img 
                                        src="{{ route('signature.qr', $signer->signatureRequest->verification_code) }}" 
                                        alt="QR" 
                                        class="size-full object-contain pointer-events-none block"
                                    />
                                </div>
                            </div>

                        </div>

                        <!-- Hidden Coordinate & Dimensional Form Inputs -->
                        <input type="hidden" name="page_number" id="inputPageNumber" value="1">
                        <input type="hidden" name="position_x" id="inputPositionX" value="60">
                        <input type="hidden" name="position_y" id="inputPositionY" value="75">
                        <input type="hidden" name="stamp_width" id="inputStampWidth" value="50">
                        <input type="hidden" name="stamp_height" id="inputStampHeight" value="22">
                        <input type="hidden" name="show_qr" id="inputShowQr" value="{{ ($signer->show_qr ?? true) ? '1' : '0' }}">
                        <input type="hidden" name="show_name" id="inputShowName" value="0">
                        <input type="hidden" name="show_title" id="inputShowTitle" value="0">
                        <input type="hidden" name="show_border" id="inputShowBorder" value="0">
                        <input type="hidden" name="stamp_layout" id="stampLayoutInput" value="{{ $signer->stamp_layout ?: 'sig_left' }}">
                        <input type="hidden" name="name_position" id="namePositionInput" value="none">
                        <input type="hidden" name="signature_type" id="signatureTypeInput" value="draw">
                        <input type="hidden" name="signature_data" id="signatureDataInput" value="">
                    </div>
                </div>

                <!-- RIGHT: Control Suite & Legal Endorsement (5 Cols on LG) -->
                <div class="lg:col-span-5 space-y-4">
                    
                    <!-- 1. Official Document Certification & Endorsement Card -->
                    <div class="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-4.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]/95 space-y-3">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                            <div class="flex items-center gap-2">
                                <svg class="size-4 text-slate-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                    Pengesahan Dokumen Resmi
                                </h2>
                            </div>
                            <span class="text-[10px] font-mono text-slate-500 dark:text-zinc-400">Verifikasi Integritas</span>
                        </div>

                        <div class="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3 dark:border-white/[0.04] dark:bg-zinc-900/50">
                            <div class="size-9 rounded-full bg-slate-900 text-white font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-xs dark:bg-white dark:text-slate-900">
                                FR
                            </div>
                            <div class="space-y-0.5 min-w-0 flex-1">
                                <div class="flex items-center justify-between gap-2">
                                    <h3 class="text-xs font-bold text-slate-950 dark:text-white truncate">
                                        Muhamad Fajar Roni, S.H.
                                    </h3>
                                    <span class="text-[9px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/40 shrink-0">
                                        Otorisasi Aktif
                                    </span>
                                </div>
                                <p class="text-[11px] font-medium text-slate-600 dark:text-zinc-400">
                                    Executive &amp; Strategic Litigation
                                </p>
                                <p class="text-[10px] text-slate-400 dark:text-zinc-500">
                                    Managing Partner · Roni, Putra &amp; Kusumah Law Firm
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2 text-[10.5px] font-mono text-slate-500 dark:text-zinc-400 pt-0.5">
                            <div class="flex flex-col">
                                <span class="text-[9.5px] text-slate-400 dark:text-zinc-500">Kode Verifikasi:</span>
                                <strong class="text-slate-800 dark:text-zinc-200">{{ $signer->signatureRequest->verification_code }}</strong>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-[9.5px] text-slate-400 dark:text-zinc-500">Integritas Dokumen:</span>
                                <span class="text-slate-800 dark:text-zinc-200">SHA-256 Valid</span>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Identitas Penandatangan Card -->
                    <div class="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-4.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]/95 space-y-3">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                Identitas Penandatangan
                            </h2>
                            <span class="text-[11px] text-slate-400 dark:text-zinc-500">KTP / Legalitas</span>
                        </div>

                        <div class="space-y-3">
                            <div>
                                <label for="accepted_name" class="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">
                                    Nama Lengkap <span class="text-rose-500">*</span>
                                </label>
                                <input 
                                    id="accepted_name" 
                                    name="accepted_name" 
                                    type="text"
                                    value="{{ old('accepted_name', $signer->name) }}" 
                                    required
                                    placeholder="Nama lengkap penandatangan"
                                    class="mt-1 h-9 w-full rounded-lg border border-slate-200/80 bg-white px-3 text-xs font-medium text-slate-900 outline-hidden transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                                >
                                @error('accepted_name')
                                    <p class="mt-1 text-xs text-rose-600 font-semibold">{{ $message }}</p>
                                @enderror
                            </div>

                            <div>
                                <label for="signer_title" class="text-xs font-medium text-slate-700 dark:text-zinc-300 block">
                                    Jabatan / Gelar (Opsional)
                                </label>
                                <input 
                                    id="signer_title" 
                                    name="signer_title" 
                                    type="text"
                                    value="{{ old('signer_title') }}" 
                                    placeholder="Contoh: Direktur Utama / Kuasa Hukum"
                                    class="mt-1 h-9 w-full rounded-lg border border-slate-200/80 bg-white px-3 text-xs font-medium text-slate-900 outline-hidden transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                                >
                            </div>
                        </div>
                    </div>

                    <!-- 3. Pengaturan Stempel & Ukuran Presisi -->
                    <div class="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-4.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]/95 space-y-3">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                Pengaturan Stempel &amp; Ukuran Presisi
                            </h2>
                            <span id="sizeBadge" class="font-mono text-[10.5px] font-semibold text-slate-600 dark:text-zinc-400">Standar (50×22 mm)</span>
                        </div>

                        <!-- Ukuran Tanda Tangan -->
                        <div class="space-y-2">
                            <span class="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">Pilihan Ukuran Tanda Tangan:</span>
                            <div class="grid grid-cols-3 gap-1.5 text-xs">
                                <button 
                                    type="button" 
                                    id="btnSizeCompact" 
                                    onclick="setStampDimensions(38, 16, 'Compact')" 
                                    class="rounded-lg border border-slate-200/80 bg-white p-2 text-center font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                                >
                                    <div class="text-xs">Ringkas</div>
                                    <div class="text-[10px] font-mono text-slate-400 mt-0.5">38 × 16 mm</div>
                                </button>
                                <button 
                                    type="button" 
                                    id="btnSizeStandard" 
                                    onclick="setStampDimensions(50, 22, 'Standar')" 
                                    class="rounded-lg border-2 border-slate-900 bg-slate-50/80 p-2 text-center font-bold text-slate-950 transition-all cursor-pointer dark:border-white dark:bg-zinc-800 dark:text-white"
                                >
                                    <div class="text-xs">Standar</div>
                                    <div class="text-[10px] font-mono text-slate-700 dark:text-zinc-300 mt-0.5">50 × 22 mm</div>
                                </button>
                                <button 
                                    type="button" 
                                    id="btnSizeLarge" 
                                    onclick="setStampDimensions(64, 28, 'Besar')" 
                                    class="rounded-lg border border-slate-200/80 bg-white p-2 text-center font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                                >
                                    <div class="text-xs">Besar</div>
                                    <div class="text-[10px] font-mono text-slate-400 mt-0.5">64 × 28 mm</div>
                                </button>
                            </div>

                            <!-- Slider Skala -->
                            <div class="pt-1.5 space-y-1">
                                <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                                    <span>Skala Proporsional:</span>
                                    <span id="sliderScaleValue" class="font-semibold text-slate-800 dark:text-zinc-200">100%</span>
                                </div>
                                <input 
                                    type="range" 
                                    id="scaleSlider" 
                                    min="70" 
                                    max="140" 
                                    value="100" 
                                    step="5"
                                    oninput="handleScaleSlider(this.value)"
                                    class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:bg-zinc-700 dark:accent-white"
                                >
                            </div>
                        </div>

                        <!-- Opsi Tambahan (QR Code & Bingkai) -->
                        <div class="border-t border-slate-100 dark:border-white/[0.04] pt-2.5 space-y-2 text-xs">
                            <span class="font-semibold text-slate-700 dark:text-zinc-300 block">Kelengkapan Pembubuhan:</span>
                            
                            <div class="space-y-1.5">
                                <label class="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 bg-white dark:border-white/10 dark:bg-zinc-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                                    <div class="space-y-0.5">
                                        <span class="text-xs font-semibold text-slate-800 dark:text-zinc-200 block">Sertakan QR Code Verifikasi</span>
                                        <span class="text-[10px] text-slate-400 dark:text-zinc-500 block">Tautkan kode QR untuk pembuktian keaslian berkas</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        id="toggleQr" 
                                        {{ ($signer->show_qr ?? true) ? 'checked' : '' }}
                                        onchange="handleToggleElement('qr', this.checked)"
                                        class="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-zinc-700 cursor-pointer shrink-0"
                                    >
                                </label>

                                <!-- Pilihan Letak Posisi Barcode QR (Bisa dipilih tempatnya & bisa diseret bebas) -->
                                <div id="qrPositionSection" class="{{ ($signer->show_qr ?? true) ? '' : 'hidden' }} pl-3 pt-2 pb-2.5 space-y-2 border-l-2 border-slate-300 dark:border-zinc-700 ml-1">
                                    <div class="flex items-center justify-between pr-1">
                                        <span class="text-[11px] font-bold text-slate-700 dark:text-zinc-300 block">Posisi Barcode QR:</span>
                                        <span id="qrCurrentPosBadge" class="text-[10px] font-mono text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">Kanan TTD</span>
                                    </div>

                                    <div class="grid grid-cols-2 gap-1.5 text-xs">
                                        <button 
                                            type="button" 
                                            id="btnQrPosRight" 
                                            onclick="setQrPosition('sig_left')" 
                                            class="rounded-lg border-2 border-slate-900 bg-slate-50/80 p-2 text-left font-bold text-slate-950 transition-all cursor-pointer dark:border-white dark:bg-zinc-800 dark:text-white"
                                        >
                                            <div class="text-xs">Kanan TTD</div>
                                            <div class="text-[10px] font-normal text-slate-500 dark:text-zinc-400 mt-0.5">Samping kanan tanda tangan</div>
                                        </button>

                                        <button 
                                            type="button" 
                                            id="btnQrPosLeft" 
                                            onclick="setQrPosition('qr_left')" 
                                            class="rounded-lg border border-slate-200/80 bg-white p-2 text-left font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                                        >
                                            <div class="text-xs">Kiri TTD</div>
                                            <div class="text-[10px] font-normal text-slate-400 mt-0.5">Samping kiri tanda tangan</div>
                                        </button>

                                        <button 
                                            type="button" 
                                            id="btnQrPosBottom" 
                                            onclick="setQrPosition('qr_bottom')" 
                                            class="rounded-lg border border-slate-200/80 bg-white p-2 text-left font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                                        >
                                            <div class="text-xs">Bawah TTD</div>
                                            <div class="text-[10px] font-normal text-slate-400 mt-0.5">Di bawah tanda tangan</div>
                                        </button>

                                        <button 
                                            type="button" 
                                            id="btnQrPosTop" 
                                            onclick="setQrPosition('qr_top')" 
                                            class="rounded-lg border border-slate-200/80 bg-white p-2 text-left font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                                        >
                                            <div class="text-xs">Atas TTD</div>
                                            <div class="text-[10px] font-normal text-slate-400 mt-0.5">Di atas tanda tangan</div>
                                        </button>

                                        <button 
                                            type="button" 
                                            id="btnQrPosDocBottomRight" 
                                            onclick="setQrPosition('doc_bottom_right')" 
                                            class="rounded-lg border border-slate-200/80 bg-white p-2 text-left font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                                        >
                                            <div class="text-xs">Pojok Kanan Bawah</div>
                                            <div class="text-[10px] font-normal text-slate-400 mt-0.5">Margin kanan bawah kertas</div>
                                        </button>

                                        <button 
                                            type="button" 
                                            id="btnQrPosDocBottomLeft" 
                                            onclick="setQrPosition('doc_bottom_left')" 
                                            class="rounded-lg border border-slate-200/80 bg-white p-2 text-left font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                                        >
                                            <div class="text-xs">Pojok Kiri Bawah</div>
                                            <div class="text-[10px] font-normal text-slate-400 mt-0.5">Margin kiri bawah kertas</div>
                                        </button>
                                    </div>

                                    <p class="text-[10.5px] text-slate-500 dark:text-zinc-400 leading-normal">
                                        Anda juga dapat menyeret langsung kotak QR pada lembar dokumen ke koordinat yang dikehendaki.
                                    </p>
                                </div>

                                <label class="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 bg-white dark:border-white/10 dark:bg-zinc-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                                    <span class="text-xs text-slate-700 dark:text-zinc-300">Cetak Nama Terdaftar di Bawah Tanda Tangan</span>
                                    <input 
                                        type="checkbox" 
                                        id="toggleName" 
                                        onchange="handleToggleElement('name', this.checked)"
                                        class="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-zinc-700 cursor-pointer"
                                    >
                                </label>

                                <label class="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 bg-white dark:border-white/10 dark:bg-zinc-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                                    <span class="text-xs text-slate-700 dark:text-zinc-300">Sertakan Bingkai Stempel Formal</span>
                                    <input 
                                        type="checkbox" 
                                        id="toggleBorder" 
                                        onchange="handleToggleElement('border', this.checked)"
                                        class="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-zinc-700 cursor-pointer"
                                    >
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- 4. Konfirmasi Hukum & Tombol Aksi Utama -->
                    <div class="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-4.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]/95 space-y-3">
                        <label class="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-zinc-300">
                            <input 
                                type="checkbox" 
                                name="accept_terms" 
                                value="1" 
                                required
                                class="mt-0.5 size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-zinc-700 cursor-pointer"
                            >
                            <span class="text-xs leading-relaxed">
                                Saya menyatakan telah meninjau isi dokumen dan menyetujui pembubuhan tanda tangan elektronik resmi pada dokumen <strong>{{ $officialDocTitle }}</strong> sesuai ketentuan UU ITE.
                            </span>
                        </label>
                        @error('accept_terms')
                            <p class="text-xs text-rose-600 font-semibold">{{ $message }}</p>
                        @enderror

                        <!-- Signature Alert Notification -->
                        <div id="sigRequiredAlert" class="hidden rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 p-2.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2 animate-in fade-in">
                            <svg class="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span class="font-medium leading-tight">Silakan bubuhkan tanda tangan Anda terlebih dahulu pada lembar dokumen sebelum melanjutkan.</span>
                        </div>

                        <div class="flex flex-col gap-2 pt-1">
                            <button 
                                type="button" 
                                onclick="openPreviewModal()"
                                id="submitBtn"
                                class="h-11 w-full rounded-lg bg-slate-950 font-semibold text-xs text-white shadow-sm hover:bg-slate-800 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200"
                            >
                                <svg class="size-4 text-emerald-400 dark:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>Pratinjau Hasil &amp; Pembubuhan Dokumen Resmi</span>
                            </button>
                            <p class="text-[11px] text-slate-400 dark:text-zinc-500 text-center leading-normal">
                                Pratinjau draf dokumen bertanda tangan akan ditampilkan terlebih dahulu agar Anda dapat memeriksa tata letak dan memastikan kerapihan sebelum berkas resmi diterbitkan.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </form>

    </main>

    <!-- 4. Modal Pratinjau Dokumen Bertanda Tangan (Sebelum Pembubuhan Resmi) -->
    <div id="previewModal" class="fixed inset-0 z-50 hidden overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 transition-all" role="dialog" aria-modal="true">
        <div class="relative w-full max-w-5xl rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-white/10 dark:bg-[#14161b] flex flex-col h-[94vh] max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <!-- Modal Header -->
            <div class="flex flex-wrap items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-white/[0.06] gap-3">
                <div class="space-y-0.5">
                    <h3 class="text-sm font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                        <svg class="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Pratinjau Hasil Akhir Dokumen Resmi</span>
                    </h3>
                    <p class="text-[11px] text-slate-500 dark:text-zinc-400">
                        Periksa ketepatan letak tanda tangan dan barcode verifikasi pada lembar halaman sebelum dokumen resmi diterbitkan ke sistem.
                    </p>
                </div>

                <!-- Modal Controls: Page Navigator & Zoom -->
                <div class="flex items-center gap-2">
                    <div id="modalPageNav" class="hidden items-center gap-1 bg-slate-100/90 dark:bg-zinc-800/80 p-1 rounded-lg border border-slate-200/80 dark:border-white/10">
                        <button 
                            type="button" 
                            id="btnModalPrevPage"
                            onclick="modalChangePage(-1)" 
                            class="size-6 rounded hover:bg-white text-slate-700 dark:text-zinc-200 flex items-center justify-center cursor-pointer disabled:opacity-30 transition-colors" 
                            title="Halaman Sebelumnya"
                        >
                            <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span class="font-mono text-[11px] px-1.5 text-slate-700 dark:text-zinc-300">
                            Hal <strong id="modalCurrentPage">1</strong> / <span id="modalTotalPages">1</span>
                        </span>
                        <button 
                            type="button" 
                            id="btnModalNextPage"
                            onclick="modalChangePage(1)" 
                            class="size-6 rounded hover:bg-white text-slate-700 dark:text-zinc-200 flex items-center justify-center cursor-pointer disabled:opacity-30 transition-colors" 
                            title="Halaman Berikutnya"
                        >
                            <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <!-- Zoom Controls -->
                    <div class="flex items-center gap-1 bg-slate-100/90 dark:bg-zinc-800/80 p-1 rounded-lg border border-slate-200/80 dark:border-white/10 text-xs">
                        <button 
                            type="button" 
                            onclick="modalZoom(-0.15)"
                            class="size-6 rounded hover:bg-white text-slate-700 dark:text-zinc-200 flex items-center justify-center cursor-pointer transition-colors"
                            title="Perkecil"
                        >
                            <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                        </button>
                        <button 
                            type="button" 
                            onclick="modalZoomReset()"
                            id="modalZoomDisplay"
                            class="px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:text-zinc-300 hover:bg-white rounded transition-colors cursor-pointer"
                            title="Reset Zoom"
                        >
                            100%
                        </button>
                        <button 
                            type="button" 
                            onclick="modalZoom(0.15)"
                            class="size-6 rounded hover:bg-white text-slate-700 dark:text-zinc-200 flex items-center justify-center cursor-pointer transition-colors"
                            title="Perbesar"
                        >
                            <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    <button 
                        type="button" 
                        onclick="closePreviewModal()"
                        class="size-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-zinc-800 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Tutup Pratinjau"
                    >
                        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Modal Meta Info Strip -->
            <div class="bg-slate-50/90 px-5 py-2 border-b border-slate-100 text-xs text-slate-600 dark:bg-zinc-900/70 dark:border-white/[0.04] flex flex-wrap items-center justify-between gap-3 font-mono text-[11px]">
                <div class="flex items-center gap-3">
                    <span>Target Hal: <strong id="modalMetaPage" class="text-slate-900 dark:text-white">1</strong></span>
                    <span>·</span>
                    <span>Posisi: <strong id="modalMetaPos" class="text-slate-900 dark:text-white">60% X, 75% Y</strong></span>
                    <span>·</span>
                    <span>Dimensi: <strong id="modalMetaDim" class="text-slate-900 dark:text-white">50 × 22 mm</strong></span>
                </div>
                <div>
                    Penandatangan: <strong id="modalMetaName" class="text-slate-900 dark:text-white">{{ $signer->name }}</strong>
                </div>
            </div>

            <!-- Modal Body Canvas Viewport (100% Scrollable & Zoomable) -->
            <div id="modalViewport" class="flex-1 min-h-0 overflow-y-auto overflow-x-auto p-4 sm:p-8 bg-slate-100/80 dark:bg-zinc-950 custom-scroll flex justify-center items-start" style="scroll-behavior: smooth;">
                <div class="relative bg-white shadow-2xl rounded-xs transition-all duration-150 my-auto shrink-0" id="modalCanvasWrapper">
                    <canvas id="modalPreviewCanvas" class="block bg-white"></canvas>
                </div>
            </div>

            <!-- Modal Footer Actions -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5 bg-white dark:border-white/[0.06] dark:bg-[#14161b]">
                <button 
                    type="button" 
                    onclick="closePreviewModal(true)"
                    class="h-10 w-full sm:w-auto rounded-lg border border-slate-200/90 bg-white px-4 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center gap-2"
                >
                    <svg class="size-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    <span>Ubah Posisi / Revisi Hasil</span>
                </button>

                <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button 
                        type="button" 
                        id="modalSubmitBtn"
                        onclick="confirmAndSubmitSignature()"
                        class="h-10 w-full sm:w-auto rounded-lg bg-slate-950 px-6 text-xs font-semibold text-white shadow-md hover:bg-slate-800 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200"
                    >
                        <svg class="size-4 text-emerald-400 dark:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Konfirmasi &amp; Bubuhkan Tanda Tangan Resmi</span>
                    </button>
                </div>
            </div>

        </div>
    </div>

    <!-- 5. Refined Corporate Footer -->
    <footer class="text-center space-y-1.5 text-xs text-slate-500 dark:text-zinc-500 py-6 border-t border-slate-200/60 dark:border-white/5">
        <p class="font-medium text-slate-700 dark:text-zinc-400">&copy; {{ date('Y') }} Roni, Putra &amp; Kusumah Law Firm · Advocates &amp; Legal Consultants</p>
        <p class="font-mono text-[11px] text-slate-400 dark:text-zinc-600">Sistem Manajemen Dokumen Elektronik Terpadu · UU ITE &amp; SHA-256 Validated</p>
    </footer>

    <!-- Interactive JavaScript Engine -->
    <script>
        // State variables (Direct on-paper signing without stamp frame)
        let baseStampWidthMm = 50.0;
        let baseStampHeightMm = 22.0;
        let currentScaleRatio = 1.0;
        let currentStampWidthMm = 50.0;
        let currentStampHeightMm = 22.0;

        let showQrCode = {{ ($signer->show_qr ?? true) ? 'true' : 'false' }};
        let showSignerName = false;
        let showSignerTitle = false;
        let showStampBorder = false;
        let currentStampLayout = '{{ $signer->stamp_layout ?: 'sig_left' }}';
        let currentNamePosition = 'none';
        let currentSignatureType = 'draw';

        // 1. Signature Pad Logic (Direct Inking on PDF Paper)
        const canvas = document.getElementById('signatureCanvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        const signatureDataInput = document.getElementById('signatureDataInput');
        let isDrawing = false;
        let hasDrawn = false;
        let strokeColor = '#1e3a8a';
        let signaturePadInstance = null;
        let points = [];
        let strokeWidth = 2.0;

        function initSignaturePad() {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;
            const dpr = Math.max(window.devicePixelRatio || 1, 2.5);
            
            let existingData = null;
            if (signaturePadInstance && !signaturePadInstance.isEmpty()) {
                existingData = signaturePadInstance.toData();
            }

            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);

            if (window.SignaturePad) {
                if (signaturePadInstance) {
                    signaturePadInstance.off();
                }
                signaturePadInstance = new SignaturePad(canvas, {
                    minWidth: 1.0,
                    maxWidth: 3.0,
                    penColor: strokeColor,
                    velocityFilterWeight: 0.7,
                });
                if (existingData) {
                    signaturePadInstance.fromData(existingData);
                    hasDrawn = true;
                    const ph = document.getElementById('canvasPlaceholder');
                    if (ph) ph.style.display = 'none';
                }
                signaturePadInstance.addEventListener('beginStroke', function() {
                    const ph = document.getElementById('canvasPlaceholder');
                    if (ph) ph.style.display = 'none';
                });
                signaturePadInstance.addEventListener('endStroke', function() {
                    hasDrawn = !signaturePadInstance.isEmpty();
                    const ph = document.getElementById('canvasPlaceholder');
                    if (ph) ph.style.display = hasDrawn ? 'none' : 'flex';
                    const box = document.getElementById('stampSigCanvasContainer');
                    if (box) {
                        if (hasDrawn) {
                            box.classList.remove('border-dashed', 'border-blue-400/60');
                            box.classList.add('border-transparent', 'hover:border-blue-300/40');
                        } else {
                            box.classList.remove('border-transparent', 'hover:border-blue-300/40');
                            box.classList.add('border-dashed', 'border-blue-400/60');
                        }
                    }
                    syncCanvasData();
                });
            } else if (ctx) {
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                ctx.strokeStyle = strokeColor;
                ctx.fillStyle = strokeColor;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            }
        }

        window.addEventListener('resize', () => {
            clearTimeout(window._sigResizeTimer);
            window._sigResizeTimer = setTimeout(initSignaturePad, 200);
        });
        setTimeout(initSignaturePad, 60);

        function setPenColor(color) {
            strokeColor = color;
            if (signaturePadInstance) {
                signaturePadInstance.penColor = color;
            } else if (ctx) {
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
            }

            const btnBlue = document.getElementById('btnColorBlue');
            const btnNavy = document.getElementById('btnColorNavy');
            const btnBlack = document.getElementById('btnColorBlack');

            if (btnBlue) btnBlue.className = 'size-4.5 rounded-full bg-blue-900 transition-all cursor-pointer ' + (color === '#1e3a8a' ? 'ring-2 ring-slate-900 ring-offset-1 dark:ring-white' : '');
            if (btnNavy) btnNavy.className = 'size-4.5 rounded-full bg-slate-900 transition-all cursor-pointer ' + (color === '#0f172a' ? 'ring-2 ring-slate-900 ring-offset-1 dark:ring-white' : '');
            if (btnBlack) btnBlack.className = 'size-4.5 rounded-full bg-black transition-all cursor-pointer ' + (color === '#000000' ? 'ring-2 ring-slate-900 ring-offset-1 dark:ring-white' : '');

            if (hasDrawn) {
                syncCanvasData();
            }
        }

        // Resilient Fallback Smooth Bezier Curve Engine
        function getCanvasPos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top,
                time: Date.now()
            };
        }

        function startDrawing(e) {
            if (signaturePadInstance) return;
            isDrawing = true;
            hasDrawn = true;
            const ph = document.getElementById('canvasPlaceholder');
            if (ph) ph.style.display = 'none';
            points = [getCanvasPos(e)];
            e.preventDefault();
            e.stopPropagation();
        }

        function draw(e) {
            if (signaturePadInstance || !isDrawing) return;
            const currentPoint = getCanvasPos(e);
            points.push(currentPoint);

            if (points.length >= 3) {
                const p1 = points[points.length - 3];
                const p2 = points[points.length - 2];
                const p3 = points[points.length - 1];

                const dist = Math.hypot(p3.x - p2.x, p3.y - p2.y);
                const timeDiff = Math.max(1, p3.time - p2.time);
                const velocity = dist / timeDiff;

                const targetWidth = Math.max(1.0, Math.min(3.0, 3.2 - (velocity * 0.8)));
                strokeWidth = strokeWidth * 0.6 + targetWidth * 0.4;

                const mid1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
                const mid2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };

                ctx.beginPath();
                ctx.moveTo(mid1.x, mid1.y);
                ctx.quadraticCurveTo(p2.x, p2.y, mid2.x, mid2.y);
                ctx.lineWidth = strokeWidth;
                ctx.stroke();
            }
            e.preventDefault();
            e.stopPropagation();
        }

        function stopDrawing(e) {
            if (signaturePadInstance) return;
            if (isDrawing) {
                isDrawing = false;
                points = [];
                syncCanvasData();
            }
            if (e) {
                e.stopPropagation();
            }
        }

        if (canvas) {
            ['mousedown', 'touchstart', 'pointerdown'].forEach(evt => {
                canvas.addEventListener(evt, function(e) {
                    e.stopPropagation();
                }, { passive: false });
            });
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            window.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('touchstart', startDrawing, { passive: false });
            canvas.addEventListener('touchmove', draw, { passive: false });
            window.addEventListener('touchend', stopDrawing);
        }

        function clearCanvas(e) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            if (signaturePadInstance) {
                signaturePadInstance.clear();
            } else if (ctx && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            hasDrawn = false;
            signatureDataInput.value = '';
            const ph = document.getElementById('canvasPlaceholder');
            if (ph) ph.style.display = 'flex';
            const box = document.getElementById('stampSigCanvasContainer');
            if (box) {
                box.classList.remove('border-transparent', 'hover:border-blue-300/40');
                box.classList.add('border-dashed', 'border-blue-400/60');
            }
        }

        // Send raw full canvas to guarantee 100% WYSIWYG scale without distortion or zooming!
        function syncCanvasData() {
            if (hasDrawn && canvas) {
                signatureDataInput.value = canvas.toDataURL('image/png');
            } else {
                signatureDataInput.value = '';
            }
        }

        // 2. Customizer & Live Synchronizer
        function updateSignerTexts() {
            const nameVal = document.getElementById('accepted_name').value || 'Penanda Tangan';
            const titleVal = document.getElementById('signer_title').value || '';

            document.querySelectorAll('.stamp-display-name').forEach(el => el.innerText = nameVal);
            document.querySelectorAll('.stamp-display-title').forEach(el => {
                el.innerText = titleVal;
                el.style.display = (titleVal && showSignerTitle) ? 'block' : 'none';
            });
        }

        document.getElementById('accepted_name').addEventListener('input', updateSignerTexts);
        document.getElementById('signer_title').addEventListener('input', updateSignerTexts);

        // Stamp Dimensions & 1:1 Scale Engine
        function setStampDimensions(widthMm, heightMm, label) {
            baseStampWidthMm = widthMm;
            baseStampHeightMm = heightMm;
            currentScaleRatio = 1.0;
            document.getElementById('scaleSlider').value = 100;
            document.getElementById('sliderScaleValue').innerText = '100%';

            document.getElementById('btnSizeCompact').className = 'rounded-lg border border-slate-200/80 bg-white p-2 text-center font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300';
            document.getElementById('btnSizeStandard').className = 'rounded-lg border border-slate-200/80 bg-white p-2 text-center font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300';
            document.getElementById('btnSizeLarge').className = 'rounded-lg border border-slate-200/80 bg-white p-2 text-center font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300';

            if (label === 'Compact') {
                document.getElementById('btnSizeCompact').className = 'rounded-lg border-2 border-slate-900 bg-slate-50/80 p-2 text-center font-bold text-slate-950 transition-all cursor-pointer dark:border-white dark:bg-zinc-800 dark:text-white';
            } else if (label === 'Standar') {
                document.getElementById('btnSizeStandard').className = 'rounded-lg border-2 border-slate-900 bg-slate-50/80 p-2 text-center font-bold text-slate-950 transition-all cursor-pointer dark:border-white dark:bg-zinc-800 dark:text-white';
            } else if (label === 'Besar') {
                document.getElementById('btnSizeLarge').className = 'rounded-lg border-2 border-slate-900 bg-slate-50/80 p-2 text-center font-bold text-slate-950 transition-all cursor-pointer dark:border-white dark:bg-zinc-800 dark:text-white';
            }

            document.getElementById('sizeBadge').innerText = `${label} (${widthMm}×${heightMm} mm)`;
            recalculateStampPixelDimensions();
        }

        function handleScaleSlider(val) {
            currentScaleRatio = parseInt(val) / 100;
            document.getElementById('sliderScaleValue').innerText = `${val}%`;
            recalculateStampPixelDimensions();
        }

        function recalculateStampPixelDimensions() {
            currentStampWidthMm = Math.round(baseStampWidthMm * currentScaleRatio * 10) / 10;
            currentStampHeightMm = Math.round(baseStampHeightMm * currentScaleRatio * 10) / 10;

            document.getElementById('inputStampWidth').value = currentStampWidthMm;
            document.getElementById('inputStampHeight').value = currentStampHeightMm;
            document.getElementById('displayDimensions').innerText = `${currentStampWidthMm} × ${currentStampHeightMm} mm`;

            if (currentPdfViewport) {
                const pageOriginalWidthMm = currentPdfPageUnscaledWidth / 2.83465;
                const pageOriginalHeightMm = currentPdfPageUnscaledHeight / 2.83465;

                const renderedPageWidthPx = currentPdfViewport.width;
                const renderedPageHeightPx = currentPdfViewport.height;

                const stampPxWidth = Math.round(renderedPageWidthPx * (currentStampWidthMm / pageOriginalWidthMm));
                const stampPxHeight = Math.round(renderedPageHeightPx * (currentStampHeightMm / pageOriginalHeightMm));

                const placementStamp = document.getElementById('placementStamp');
                placementStamp.style.width = Math.max(140, stampPxWidth) + 'px';
                placementStamp.style.height = Math.max(72, stampPxHeight) + 'px';

                clearTimeout(window._sigResizeTimer);
                window._sigResizeTimer = setTimeout(initSignaturePad, 40);
            }
        }

        // Toggle Element Handlers (QR, Name, Title, Border)
        function handleToggleElement(elem, isChecked) {
            const qrBlock = document.getElementById('stampQrBlock');
            const nameTop = document.getElementById('stampNameTop');
            const nameBottom = document.getElementById('stampNameBottom');
            const placementStamp = document.getElementById('placementStamp');

            if (elem === 'qr') {
                showQrCode = isChecked;
                document.getElementById('inputShowQr').value = isChecked ? '1' : '0';
                const section = document.getElementById('qrPositionSection');
                if (section) section.style.display = isChecked ? 'block' : 'none';
                if (isChecked && (!currentStampLayout || currentStampLayout === 'sig_only')) {
                    currentStampLayout = 'sig_left';
                    document.getElementById('stampLayoutInput').value = 'sig_left';
                }
                applyQrVisualPosition();
            } else if (elem === 'name') {
                showSignerName = isChecked;
                document.getElementById('inputShowName').value = isChecked ? '1' : '0';
                if (nameBottom) nameBottom.style.display = isChecked ? 'block' : 'none';
                clearTimeout(window._sigResizeTimer);
                window._sigResizeTimer = setTimeout(initSignaturePad, 40);
            } else if (elem === 'title') {
                showSignerTitle = isChecked;
                document.getElementById('inputShowTitle').value = isChecked ? '1' : '0';
                document.querySelectorAll('.stamp-display-title').forEach(el => {
                    el.style.display = (isChecked && el.innerText) ? 'block' : 'none';
                });
                clearTimeout(window._sigResizeTimer);
                window._sigResizeTimer = setTimeout(initSignaturePad, 40);
            } else if (elem === 'border') {
                showStampBorder = isChecked;
                document.getElementById('inputShowBorder').value = isChecked ? '1' : '0';
                if (isChecked) {
                    placementStamp.classList.add('border-2', 'border-slate-900', 'bg-white/95', 'p-2', 'rounded-lg', 'shadow-md');
                    placementStamp.classList.remove('bg-transparent');
                } else {
                    placementStamp.classList.remove('border-2', 'border-slate-900', 'bg-white/95', 'p-2', 'rounded-lg', 'shadow-md');
                    placementStamp.classList.add('bg-transparent');
                }
            }
        }

        function setQrPosition(layout) {
            currentStampLayout = layout;
            document.getElementById('stampLayoutInput').value = layout;
            updateQrButtonStyles(layout);
            applyQrVisualPosition();
        }

        function updateQrButtonStyles(activeKey) {
            const buttons = {
                'sig_left': document.getElementById('btnQrPosRight'),
                'qr_left': document.getElementById('btnQrPosLeft'),
                'qr_bottom': document.getElementById('btnQrPosBottom'),
                'qr_top': document.getElementById('btnQrPosTop'),
                'doc_bottom_right': document.getElementById('btnQrPosDocBottomRight'),
                'doc_bottom_left': document.getElementById('btnQrPosDocBottomLeft'),
            };

            const labels = {
                'sig_left': 'Kanan TTD',
                'qr_left': 'Kiri TTD',
                'qr_bottom': 'Bawah TTD',
                'qr_top': 'Atas TTD',
                'doc_bottom_right': 'Pojok Kanan Bawah',
                'doc_bottom_left': 'Pojok Kiri Bawah',
            };

            for (const key in buttons) {
                const btn = buttons[key];
                if (!btn) continue;
                if (key === activeKey) {
                    btn.className = 'rounded-lg border-2 border-slate-900 bg-slate-50/80 p-2 text-left font-bold text-slate-950 transition-all cursor-pointer dark:border-white dark:bg-zinc-800 dark:text-white';
                } else {
                    btn.className = 'rounded-lg border border-slate-200/80 bg-white p-2 text-left font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300';
                }
            }

            const badge = document.getElementById('qrCurrentPosBadge');
            if (badge) {
                if (activeKey === 'custom' || (activeKey && activeKey.startsWith('custom_'))) {
                    badge.innerText = 'Posisi Bebas (Custom)';
                } else {
                    badge.innerText = labels[activeKey] || 'Kanan TTD';
                }
            }
        }

        function applyQrVisualPosition() {
            const qrBlock = document.getElementById('stampQrBlock');
            const placementStamp = document.getElementById('placementStamp');
            const pageWrapper = document.getElementById('pageWrapper');
            if (!qrBlock || !placementStamp || !pageWrapper) return;

            if (!showQrCode) {
                qrBlock.style.display = 'none';
                return;
            }
            qrBlock.style.display = 'flex';

            qrBlock.style.left = '';
            qrBlock.style.top = '';
            qrBlock.style.right = '';
            qrBlock.style.bottom = '';
            qrBlock.style.transform = '';

            if (currentStampLayout === 'qr_left') {
                qrBlock.className = 'absolute -left-15 top-1/2 -translate-y-1/2 shrink-0 flex items-center justify-center p-1 rounded-md border border-slate-300 bg-white shadow-md size-12 z-20 cursor-grab active:cursor-grabbing select-none group transition-all dark:bg-zinc-900 dark:border-white/20';
                if (qrBlock.parentElement !== placementStamp) {
                    placementStamp.appendChild(qrBlock);
                }
            } else if (currentStampLayout === 'qr_bottom') {
                qrBlock.className = 'absolute left-1/2 -translate-x-1/2 -bottom-15 shrink-0 flex items-center justify-center p-1 rounded-md border border-slate-300 bg-white shadow-md size-12 z-20 cursor-grab active:cursor-grabbing select-none group transition-all dark:bg-zinc-900 dark:border-white/20';
                if (qrBlock.parentElement !== placementStamp) {
                    placementStamp.appendChild(qrBlock);
                }
            } else if (currentStampLayout === 'qr_top') {
                qrBlock.className = 'absolute left-1/2 -translate-x-1/2 -top-15 shrink-0 flex items-center justify-center p-1 rounded-md border border-slate-300 bg-white shadow-md size-12 z-20 cursor-grab active:cursor-grabbing select-none group transition-all dark:bg-zinc-900 dark:border-white/20';
                if (qrBlock.parentElement !== placementStamp) {
                    placementStamp.appendChild(qrBlock);
                }
            } else if (currentStampLayout === 'doc_bottom_right') {
                qrBlock.className = 'absolute right-6 bottom-5 shrink-0 flex items-center justify-center p-1 rounded-md border border-slate-300 bg-white shadow-md size-12 z-20 cursor-grab active:cursor-grabbing select-none group transition-all dark:bg-zinc-900 dark:border-white/20';
                if (qrBlock.parentElement !== pageWrapper) {
                    pageWrapper.appendChild(qrBlock);
                }
            } else if (currentStampLayout === 'doc_bottom_left') {
                qrBlock.className = 'absolute left-6 bottom-5 shrink-0 flex items-center justify-center p-1 rounded-md border border-slate-300 bg-white shadow-md size-12 z-20 cursor-grab active:cursor-grabbing select-none group transition-all dark:bg-zinc-900 dark:border-white/20';
                if (qrBlock.parentElement !== pageWrapper) {
                    pageWrapper.appendChild(qrBlock);
                }
            } else if (currentStampLayout && currentStampLayout.startsWith('custom_')) {
                const parts = currentStampLayout.split('_');
                const pX = parseFloat(parts[1]) || 80;
                const pY = parseFloat(parts[2]) || 85;
                qrBlock.className = 'absolute shrink-0 flex items-center justify-center p-1 rounded-md border border-slate-300 bg-white shadow-md size-12 z-20 cursor-grab active:cursor-grabbing select-none group transition-all dark:bg-zinc-900 dark:border-white/20';
                if (qrBlock.parentElement !== pageWrapper) {
                    pageWrapper.appendChild(qrBlock);
                }
                qrBlock.style.left = pX + '%';
                qrBlock.style.top = pY + '%';
            } else { // sig_left (default: Kanan TTD)
                qrBlock.className = 'absolute -right-15 top-1/2 -translate-y-1/2 shrink-0 flex items-center justify-center p-1 rounded-md border border-slate-300 bg-white shadow-md size-12 z-20 cursor-grab active:cursor-grabbing select-none group transition-all dark:bg-zinc-900 dark:border-white/20';
                if (qrBlock.parentElement !== placementStamp) {
                    placementStamp.appendChild(qrBlock);
                }
            }
        }

        // 5. PDF.js Viewport & Drag-and-Drop Interactive Engine
        const pdfUrl = "{{ route('signature.sign.pdf', $signer->signing_token) }}";
        let pdfDoc = null;
        let currentPage = 1;
        let totalPages = 1;
        let currentZoomScale = 1.0;
        let currentPdfViewport = null;
        let currentPdfPageUnscaledWidth = 595.28;
        let currentPdfPageUnscaledHeight = 841.89;

        const pdfCanvas = document.getElementById('pdfCanvas');
        const pdfCtx = pdfCanvas.getContext('2d');
        const pageWrapper = document.getElementById('pageWrapper');
        const placementStamp = document.getElementById('placementStamp');
        const inputPageNumber = document.getElementById('inputPageNumber');
        const inputPositionX = document.getElementById('inputPositionX');
        const inputPositionY = document.getElementById('inputPositionY');
        const displayPage = document.getElementById('displayPage');
        const displayX = document.getElementById('displayX');
        const displayY = document.getElementById('displayY');

        function renderFallbackPage() {
            const container = document.getElementById('pdfViewportContainer');
            const containerWidth = Math.min(800, (container ? container.clientWidth : 700) - 48);
            const pageWidth = Math.max(480, containerWidth);
            const pageHeight = Math.round(pageWidth * 1.414); // A4 aspect ratio
            currentPdfPageUnscaledWidth = 595.28;
            currentPdfPageUnscaledHeight = 841.89;
            currentPdfViewport = { width: pageWidth, height: pageHeight };

            const dpr = Math.max(window.devicePixelRatio || 1, 1.5);
            pdfCanvas.height = Math.round(pageHeight * dpr);
            pdfCanvas.width = Math.round(pageWidth * dpr);
            pdfCanvas.style.width = pageWidth + 'px';
            pdfCanvas.style.height = pageHeight + 'px';

            pageWrapper.style.width = pageWidth + 'px';
            pageWrapper.style.height = pageHeight + 'px';

            // Draw clean simulated document paper
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
            pdfCtx.fillText("Pratinjau Draf Dokumen Resmi RPK Law Firm · Halaman 1", 44, 76);

            // Document text lines
            pdfCtx.fillStyle = '#e2e8f0';
            for (let y = 120; y < pageHeight - 140; y += 18) {
                const isShort = (y % 72 === 0) || (y % 126 === 0);
                const lineWidth = isShort ? (pageWidth - 160) : (pageWidth - 84);
                pdfCtx.fillRect(42, y, lineWidth, 7);
            }

            document.getElementById('pageNum').innerText = '1';
            document.getElementById('pageCount').innerText = '1';
            document.getElementById('pdfLoadingSpinner').classList.add('hidden');
            recalculateStampPixelDimensions();
            updatePlacementDisplay();
        }

        if (window.pdfjsLib) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf) {
                pdfDoc = pdf;
                totalPages = pdf.numPages;
                currentPage = totalPages; // Default to signature page
                document.getElementById('pageCount').innerText = totalPages;
                document.getElementById('pdfLoadingSpinner').classList.add('hidden');
                
                renderPage(currentPage);
                updateCoordinates(currentPage, 60, 75);
            }).catch(function(err) {
                console.warn('PDF load warning / fallback:', err);
                renderFallbackPage();
                updateCoordinates(1, 60, 75);
            });
        } else {
            renderFallbackPage();
            updateCoordinates(1, 60, 75);
        }

        function renderPage(pageNum) {
            if (!pdfDoc) {
                renderFallbackPage();
                return;
            }
            pdfDoc.getPage(pageNum).then(function(page) {
                const containerWidth = Math.min(800, document.getElementById('pdfViewportContainer').clientWidth - 48);
                const unscaledViewport = page.getViewport({ scale: 1 });
                currentPdfPageUnscaledWidth = unscaledViewport.width;
                currentPdfPageUnscaledHeight = unscaledViewport.height;

                const baseScale = containerWidth / unscaledViewport.width;
                const finalScale = baseScale * currentZoomScale;
                const viewport = page.getViewport({ scale: finalScale });
                currentPdfViewport = viewport;

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
                
                recalculateStampPixelDimensions();
                updatePlacementDisplay();
            });
        }

        function prevPage() {
            if (currentPage <= 1) return;
            currentPage--;
            renderPage(currentPage);
            updateCoordinates(currentPage, parseFloat(inputPositionX.value), parseFloat(inputPositionY.value));
        }

        function nextPage() {
            if (currentPage >= totalPages) return;
            currentPage++;
            renderPage(currentPage);
            updateCoordinates(currentPage, parseFloat(inputPositionX.value), parseFloat(inputPositionY.value));
        }

        function changeZoom(delta) {
            currentZoomScale = Math.max(0.5, Math.min(1.8, currentZoomScale + delta));
            document.getElementById('zoomLevelDisplay').innerText = Math.round(currentZoomScale * 100) + '%';
            renderPage(currentPage);
        }

        function resetZoom() {
            currentZoomScale = 1.0;
            document.getElementById('zoomLevelDisplay').innerText = '100%';
            renderPage(currentPage);
        }

        function updateCoordinates(page, xPercent, yPercent) {
            currentPage = page;
            inputPageNumber.value = page;
            inputPositionX.value = Math.round(xPercent);
            inputPositionY.value = Math.round(yPercent);
            
            displayPage.innerText = page;
            displayX.innerText = Math.round(xPercent);
            displayY.innerText = Math.round(yPercent);

            updatePlacementDisplay();
        }

        function updatePlacementDisplay() {
            const xPercent = parseFloat(inputPositionX.value) || 60;
            const yPercent = parseFloat(inputPositionY.value) || 75;

            placementStamp.style.left = xPercent + '%';
            placementStamp.style.top = yPercent + '%';
        }

        function setPresetPosition(preset) {
            if (preset === 'bottom-right') {
                updateCoordinates(currentPage, 60, 78);
            } else if (preset === 'bottom-left') {
                updateCoordinates(currentPage, 10, 78);
            } else if (preset === 'bottom-center') {
                updateCoordinates(currentPage, 35, 78);
            }
        }

        // Drag & Drop Stamp Controller
        let isDraggingStamp = false;
        let dragStartX, dragStartY, initialStampLeft, initialStampTop;

        function startDrag(e) {
            const canvasEl = document.getElementById('signatureCanvas');
            const canvasContainer = document.getElementById('stampSigCanvasContainer');
            const qrBlock = document.getElementById('stampQrBlock');
            if (e.target === canvasEl || (canvasEl && canvasEl.contains(e.target)) ||
                e.target === canvasContainer || (canvasContainer && canvasContainer.contains(e.target)) ||
                e.target === qrBlock || (qrBlock && qrBlock.contains(e.target))) {
                return;
            }
            if (e.target.closest && (e.target.closest('button') || e.target.closest('input') || e.target.closest('a'))) {
                return;
            }
            isDraggingStamp = true;
            placementStamp.classList.add('is-dragging');
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            dragStartX = clientX;
            dragStartY = clientY;
            
            const rect = pageWrapper.getBoundingClientRect();
            const stampRect = placementStamp.getBoundingClientRect();
            
            initialStampLeft = stampRect.left - rect.left;
            initialStampTop = stampRect.top - rect.top;
            
            e.preventDefault();
            e.stopPropagation();
        }

        function doDrag(e) {
            if (!isDraggingStamp) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const deltaX = clientX - dragStartX;
            const deltaY = clientY - dragStartY;
            
            const rect = pageWrapper.getBoundingClientRect();
            let newX = initialStampLeft + deltaX;
            let newY = initialStampTop + deltaY;
            
            newX = Math.max(0, Math.min(rect.width - placementStamp.offsetWidth, newX));
            newY = Math.max(0, Math.min(rect.height - placementStamp.offsetHeight, newY));
            
            const percentX = (newX / rect.width) * 100;
            const percentY = (newY / rect.height) * 100;
            
            updateCoordinates(currentPage, percentX, percentY);
            e.preventDefault();
        }

        function endDrag() {
            isDraggingStamp = false;
            placementStamp.classList.remove('is-dragging');
        }

        placementStamp.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', doDrag);
        window.addEventListener('mouseup', endDrag);

        placementStamp.addEventListener('touchstart', startDrag, { passive: false });
        window.addEventListener('touchmove', doDrag, { passive: false });
        window.addEventListener('touchend', endDrag);

        // Drag & Drop QR Block Controller (Bebas Geser QR)
        let isDraggingQr = false;
        let dragQrStartX, dragQrStartY, initialQrLeft, initialQrTop;

        function startQrDrag(e) {
            const qrBlock = document.getElementById('stampQrBlock');
            if (!qrBlock || !showQrCode) return;

            isDraggingQr = true;
            qrBlock.classList.add('is-dragging');
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            dragQrStartX = clientX;
            dragQrStartY = clientY;

            const pwRect = pageWrapper.getBoundingClientRect();
            const qrRect = qrBlock.getBoundingClientRect();

            if (qrBlock.parentElement !== pageWrapper) {
                const curLeft = qrRect.left - pwRect.left;
                const curTop = qrRect.top - pwRect.top;
                pageWrapper.appendChild(qrBlock);
                qrBlock.style.left = curLeft + 'px';
                qrBlock.style.top = curTop + 'px';
                qrBlock.style.right = 'auto';
                qrBlock.style.bottom = 'auto';
                qrBlock.style.transform = 'none';
            }

            const updatedQrRect = qrBlock.getBoundingClientRect();
            initialQrLeft = updatedQrRect.left - pwRect.left;
            initialQrTop = updatedQrRect.top - pwRect.top;

            e.preventDefault();
            e.stopPropagation();
        }

        function doQrDrag(e) {
            if (!isDraggingQr) return;
            const qrBlock = document.getElementById('stampQrBlock');
            if (!qrBlock) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const deltaX = clientX - dragQrStartX;
            const deltaY = clientY - dragQrStartY;

            const pwRect = pageWrapper.getBoundingClientRect();
            let newX = initialQrLeft + deltaX;
            let newY = initialQrTop + deltaY;

            newX = Math.max(0, Math.min(pwRect.width - qrBlock.offsetWidth, newX));
            newY = Math.max(0, Math.min(pwRect.height - qrBlock.offsetHeight, newY));

            const pctX = (newX / pwRect.width) * 100;
            const pctY = (newY / pwRect.height) * 100;

            qrBlock.style.left = pctX.toFixed(2) + '%';
            qrBlock.style.top = pctY.toFixed(2) + '%';
            qrBlock.style.right = 'auto';
            qrBlock.style.bottom = 'auto';
            qrBlock.style.transform = 'none';

            currentStampLayout = 'custom_' + pctX.toFixed(1) + '_' + pctY.toFixed(1);
            document.getElementById('stampLayoutInput').value = currentStampLayout;

            updateQrButtonStyles('custom');
            e.preventDefault();
        }

        function endQrDrag() {
            if (!isDraggingQr) return;
            isDraggingQr = false;
            const qrBlock = document.getElementById('stampQrBlock');
            if (qrBlock) qrBlock.classList.remove('is-dragging');
        }

        const qrBlockElement = document.getElementById('stampQrBlock');
        if (qrBlockElement) {
            qrBlockElement.addEventListener('mousedown', startQrDrag);
            qrBlockElement.addEventListener('touchstart', startQrDrag, { passive: false });
        }
        window.addEventListener('mousemove', doQrDrag);
        window.addEventListener('touchmove', doQrDrag, { passive: false });
        window.addEventListener('mouseup', endQrDrag);
        window.addEventListener('touchend', endQrDrag);

        pageWrapper.addEventListener('click', function(e) {
            const qrBlock = document.getElementById('stampQrBlock');
            if (e.target === placementStamp || placementStamp.contains(e.target) ||
                e.target === qrBlock || (qrBlock && qrBlock.contains(e.target))) return;
            const rect = pageWrapper.getBoundingClientRect();
            let clickX = e.clientX - rect.left - (placementStamp.offsetWidth / 2);
            let clickY = e.clientY - rect.top - (placementStamp.offsetHeight / 2);

            clickX = Math.max(0, Math.min(rect.width - placementStamp.offsetWidth, clickX));
            clickY = Math.max(0, Math.min(rect.height - placementStamp.offsetHeight, clickY));

            const percentX = (clickX / rect.width) * 100;
            const percentY = (clickY / rect.height) * 100;
            updateCoordinates(currentPage, percentX, percentY);
        });

        // 6. Preview Modal & Final Confirmation Workflow
        let modalScale = 1.0;
        let modalBaseWidth = 720;
        let previewModalCurrentPage = 1;

        function openPreviewModal() {
            if (!hasDrawn || (signaturePadInstance && signaturePadInstance.isEmpty())) {
                const alertEl = document.getElementById('sigRequiredAlert');
                if (alertEl) {
                    alertEl.classList.remove('hidden');
                    setTimeout(() => alertEl.classList.add('hidden'), 5000);
                } else {
                    alert('Silakan bubuhkan tanda tangan Anda terlebih dahulu pada lembar dokumen.');
                }
                placementStamp.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const container = document.getElementById('stampSigCanvasContainer');
                if (container) {
                    container.classList.add('ring-4', 'ring-rose-500/80', 'animate-pulse');
                    setTimeout(() => container.classList.remove('ring-4', 'ring-rose-500/80', 'animate-pulse'), 2000);
                }
                return;
            }

            syncCanvasData();

            const modal = document.getElementById('previewModal');
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            modalScale = 1.0;
            previewModalCurrentPage = parseInt(inputPageNumber.value) || currentPage || 1;

            if (pdfDoc && totalPages > 1) {
                const nav = document.getElementById('modalPageNav');
                if (nav) nav.classList.remove('hidden');
                document.getElementById('modalTotalPages').innerText = totalPages;
            }

            renderModalPreviewPage(previewModalCurrentPage);
        }

        function modalZoom(delta) {
            modalScale = Math.max(0.5, Math.min(2.2, +(modalScale + delta).toFixed(2)));
            applyModalZoom();
        }

        function modalZoomReset() {
            modalScale = 1.0;
            applyModalZoom();
        }

        function applyModalZoom() {
            const wrapper = document.getElementById('modalCanvasWrapper');
            const zoomDisplay = document.getElementById('modalZoomDisplay');
            if (zoomDisplay) zoomDisplay.innerText = Math.round(modalScale * 100) + '%';
            if (wrapper) {
                wrapper.style.width = Math.round(modalBaseWidth * modalScale) + 'px';
            }
        }

        function modalChangePage(delta) {
            if (!pdfDoc) return;
            const newPage = previewModalCurrentPage + delta;
            if (newPage < 1 || newPage > totalPages) return;
            previewModalCurrentPage = newPage;
            renderModalPreviewPage(previewModalCurrentPage);
        }

        function renderModalPreviewPage(targetPage) {
            const modalCanvas = document.getElementById('modalPreviewCanvas');
            const modalCtx = modalCanvas.getContext('2d');
            const targetSignPage = parseInt(inputPageNumber.value) || currentPage || 1;

            document.getElementById('modalCurrentPage').innerText = targetPage;
            const prevBtn = document.getElementById('btnModalPrevPage');
            const nextBtn = document.getElementById('btnModalNextPage');
            if (prevBtn) prevBtn.disabled = targetPage <= 1;
            if (nextBtn) nextBtn.disabled = targetPage >= totalPages;

            const isSignPage = (targetPage === targetSignPage);

            document.getElementById('modalMetaPage').innerText = targetSignPage;
            document.getElementById('modalMetaPos').innerText = `${document.getElementById('displayX').innerText}% X, ${document.getElementById('displayY').innerText}% Y`;
            document.getElementById('modalMetaDim').innerText = document.getElementById('displayDimensions').innerText;
            document.getElementById('modalMetaName').innerText = document.getElementById('accepted_name').value || '{{ $signer->name }}';

            if (pdfDoc) {
                pdfDoc.getPage(targetPage).then(function(page) {
                    const baseViewport = page.getViewport({ scale: 1 });
                    const containerWidth = Math.min(840, window.innerWidth - 64);
                    const scale = (containerWidth / baseViewport.width);
                    const dpr = Math.max(window.devicePixelRatio || 1, 1.5);
                    const viewport = page.getViewport({ scale: scale * 1.35 });

                    modalBaseWidth = containerWidth;
                    modalCanvas.width = Math.round(viewport.width * dpr);
                    modalCanvas.height = Math.round(viewport.height * dpr);
                    modalCanvas.style.width = '100%';
                    modalCanvas.style.height = 'auto';
                    applyModalZoom();

                    const renderContext = {
                        canvasContext: modalCtx,
                        transform: [dpr, 0, 0, dpr, 0, 0],
                        viewport: viewport
                    };

                    page.render(renderContext).promise.then(function() {
                        if (isSignPage) {
                            drawStampOnModalCanvas(modalCtx, modalCanvas.width, modalCanvas.height);
                        }
                    });
                });
            } else {
                const srcCanvas = document.getElementById('pdfCanvas');
                if (!srcCanvas || srcCanvas.width === 0) {
                    renderFallbackPage();
                }
                const containerWidth = Math.min(840, window.innerWidth - 64);
                modalBaseWidth = containerWidth;
                modalCanvas.width = srcCanvas.width;
                modalCanvas.height = srcCanvas.height;
                modalCanvas.style.width = '100%';
                modalCanvas.style.height = 'auto';
                applyModalZoom();

                modalCtx.drawImage(srcCanvas, 0, 0);
                if (isSignPage) {
                    drawStampOnModalCanvas(modalCtx, modalCanvas.width, modalCanvas.height);
                }
            }
        }

        function drawStampOnModalCanvas(modalCtx, canvasW, canvasH) {
            const pwRect = pageWrapper.getBoundingClientRect();
            const psRect = placementStamp.getBoundingClientRect();

            const scaleX = canvasW / pwRect.width;
            const scaleY = canvasH / pwRect.height;

            const xPercent = parseFloat(inputPositionX.value) || 60;
            const yPercent = parseFloat(inputPositionY.value) || 75;

            const stampX = (xPercent / 100) * pwRect.width * scaleX;
            const stampY = (yPercent / 100) * pwRect.height * scaleY;
            const stampW = psRect.width * scaleX;
            const stampH = psRect.height * scaleY;

            // Background & Border (Only drawn if showStampBorder is enabled by user)
            if (showStampBorder) {
                modalCtx.save();
                modalCtx.fillStyle = '#ffffff';
                modalCtx.strokeStyle = '#0f172a';
                modalCtx.lineWidth = 2 * scaleX;

                const radius = 6 * scaleX;
                modalCtx.beginPath();
                modalCtx.moveTo(stampX + radius, stampY);
                modalCtx.arcTo(stampX + stampW, stampY, stampX + stampW, stampY + stampH, radius);
                modalCtx.arcTo(stampX + stampW, stampY + stampH, stampX, stampY + stampH, radius);
                modalCtx.arcTo(stampX, stampY + stampH, stampX, stampY, radius);
                modalCtx.arcTo(stampX, stampY, stampX + stampW, stampY, radius);
                modalCtx.closePath();
                modalCtx.fill();
                modalCtx.stroke();
                modalCtx.restore();

                // Header bar
                modalCtx.fillStyle = '#0f172a';
                modalCtx.font = `bold ${Math.round(7.5 * scaleX)}px Manrope, sans-serif`;
                modalCtx.fillText('RPK E-SIGN', stampX + (8 * scaleX), stampY + (10 * scaleY));

                modalCtx.fillStyle = '#64748b';
                modalCtx.font = `${Math.round(6.5 * scaleX)}px JetBrains Mono, monospace`;
                modalCtx.fillText('UU ITE VALID', stampX + stampW - (55 * scaleX), stampY + (10 * scaleY));
            }

            const headerHeight = showStampBorder ? 14 * scaleY : 0;
            const contentY = stampY + headerHeight;
            const contentH = stampH - headerHeight;

            // Signature Visual (100% WYSIWYG scale without artificial stretching)
            const sigX = stampX;
            const sigW = stampW;
            const sigAreaH = (showSignerName) ? contentH * 0.65 : contentH;
            const sigData = signatureDataInput.value;
            if (sigData) {
                const sImg = new Image();
                sImg.onload = () => {
                    modalCtx.drawImage(sImg, sigX, contentY, sigW, sigAreaH);
                };
                sImg.src = sigData;
                if (sImg.complete && sImg.naturalWidth > 0) {
                    modalCtx.drawImage(sImg, sigX, contentY, sigW, sigAreaH);
                }
            } else {
                modalCtx.fillStyle = '#94a3b8';
                modalCtx.font = `italic ${Math.round(8 * scaleX)}px Manrope, sans-serif`;
                modalCtx.fillText('[Tanda Tangan]', sigX + (sigW * 0.2), contentY + (sigAreaH * 0.5));
            }

            // QR Code block rendering on modal canvas
            if (showQrCode) {
                const qrBlock = document.getElementById('stampQrBlock');
                const qrImg = qrBlock ? qrBlock.querySelector('img') : null;
                const qrDimension = Math.min(contentH, 42 * scaleY);

                let qrX = 0;
                let qrY = 0;

                if (currentStampLayout === 'qr_left') {
                    qrX = Math.max(8 * scaleX, stampX - qrDimension - (8 * scaleX));
                    qrY = contentY + (contentH - qrDimension) / 2;
                } else if (currentStampLayout === 'qr_bottom') {
                    qrX = stampX + (stampW - qrDimension) / 2;
                    qrY = stampY + stampH + (6 * scaleY);
                } else if (currentStampLayout === 'qr_top') {
                    qrX = stampX + (stampW - qrDimension) / 2;
                    qrY = Math.max(8 * scaleY, stampY - qrDimension - (6 * scaleY));
                } else if (currentStampLayout === 'doc_bottom_right') {
                    qrX = canvasW - qrDimension - (24 * scaleX);
                    qrY = canvasH - qrDimension - (20 * scaleY);
                } else if (currentStampLayout === 'doc_bottom_left') {
                    qrX = 24 * scaleX;
                    qrY = canvasH - qrDimension - (20 * scaleY);
                } else if (currentStampLayout && currentStampLayout.startsWith('custom_')) {
                    const parts = currentStampLayout.split('_');
                    const pX = parseFloat(parts[1]) || 80;
                    const pY = parseFloat(parts[2]) || 85;
                    qrX = (pX / 100) * canvasW;
                    qrY = (pY / 100) * canvasH;
                } else { // sig_left (default: Kanan TTD)
                    qrX = Math.min(canvasW - qrDimension - (8 * scaleX), stampX + stampW + (8 * scaleX));
                    qrY = contentY + (contentH - qrDimension) / 2;
                }

                if (qrImg) {
                    if (qrImg.complete && qrImg.naturalWidth > 0) {
                        modalCtx.drawImage(qrImg, qrX, qrY, qrDimension, qrDimension);
                    } else {
                        const tempQr = new Image();
                        tempQr.onload = () => {
                            modalCtx.drawImage(tempQr, qrX, qrY, qrDimension, qrDimension);
                        };
                        tempQr.src = qrImg.src;
                    }
                }
            }

            // Signer Name & Title
            if (showSignerName) {
                const nameVal = document.getElementById('accepted_name').value || 'Penanda Tangan';
                const titleVal = document.getElementById('signer_title').value || '';

                modalCtx.fillStyle = '#0f172a';
                modalCtx.font = `bold ${Math.round(8.5 * scaleX)}px Manrope, sans-serif`;
                const textBaseY = (currentNamePosition === 'top') 
                    ? (contentY + (8 * scaleY)) 
                    : (contentY + contentH - (showSignerTitle && titleVal ? 9 * scaleY : 2 * scaleY));
                
                modalCtx.fillText(nameVal, sigX, textBaseY);

                if (showSignerTitle && titleVal) {
                    modalCtx.fillStyle = '#64748b';
                    modalCtx.font = `${Math.round(7 * scaleX)}px Manrope, sans-serif`;
                    modalCtx.fillText(titleVal, sigX, textBaseY + (9 * scaleY));
                }
            }
        }

        function closePreviewModal(scrollToPlacement = false) {
            const modal = document.getElementById('previewModal');
            modal.classList.add('hidden');
            document.body.style.overflow = '';

            if (scrollToPlacement) {
                const vp = document.getElementById('pdfViewportContainer');
                if (vp) {
                    vp.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                const stamp = document.getElementById('placementStamp');
                if (stamp) {
                    stamp.classList.add('ring-4', 'ring-slate-900', 'ring-offset-2');
                    setTimeout(() => {
                        stamp.classList.remove('ring-4', 'ring-slate-900', 'ring-offset-2');
                    }, 2500);
                }
            }
        }

        function confirmAndSubmitSignature() {
            const acceptTerms = document.querySelector('input[name="accept_terms"]');
            if (acceptTerms) {
                acceptTerms.checked = true;
            }
            const modalSubmitBtn = document.getElementById('modalSubmitBtn');
            if (modalSubmitBtn) {
                modalSubmitBtn.disabled = true;
                modalSubmitBtn.innerHTML = '<div class="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div> <span>Menerbitkan Dokumen Resmi...</span>';
            }

            const mainSubmitBtn = document.getElementById('submitBtn');
            if (mainSubmitBtn) {
                mainSubmitBtn.disabled = true;
            }

            document.getElementById('signingForm').submit();
        }

        // Form Submit Handler
        document.getElementById('signingForm').addEventListener('submit', function(e) {
            if (!hasDrawn || (signaturePadInstance && signaturePadInstance.isEmpty())) {
                e.preventDefault();
                alert('Silakan bubuhkan tanda tangan Anda terlebih dahulu pada lembar dokumen.');
                placementStamp.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            syncCanvasData();
            
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<div class="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div> <span>Membubuhkan Tanda Tangan...</span>';
            }
        });

        // Initial setup
        updateSignerTexts();
        applyQrVisualPosition();
        updateQrButtonStyles(currentStampLayout);
    </script>
</body>
</html>
