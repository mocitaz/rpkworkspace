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
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
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

        .placement-stamp, .placement-qr {
            cursor: grab;
            user-select: none;
            touch-action: none;
            transition: box-shadow 0.15s ease, transform 0.15s ease;
        }
        .placement-stamp:active, .placement-stamp.is-dragging,
        .placement-qr:active, .placement-qr.is-dragging {
            cursor: grabbing;
            box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.9), 0 16px 24px -4px rgba(0, 0, 0, 0.25);
        }

        .custom-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(148, 163, 184, 0.4) transparent;
        }
        .custom-scroll::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.35);
            border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(100, 116, 139, 0.6);
        }
    </style>
</head>
<body class="min-h-screen text-slate-900 selection:bg-slate-900 selection:text-white dark:text-zinc-100 flex flex-col justify-between">

    @php
        $rawDocTitle = trim((string)($signer->signatureRequest->document->title ?? ''));
        $isDefaultOrTest = empty($rawDocTitle) || strtolower($rawDocTitle) === 'test' || strtolower($rawDocTitle) === 'dokumen';
        $officialDocTitle = $isDefaultOrTest 
            ? 'SURAT KUASA KHUSUS & BERITA ACARA ELEKTRONIK' 
            : $rawDocTitle;
        $signerInitials = collect(explode(' ', (string) $signer->name))->map(fn($w) => mb_substr($w, 0, 1))->take(2)->join('') ?: 'SN';
    @endphp

    <!-- 1. Header Resmi (No Badges, No Emotes) -->
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
                        <span class="text-[10.5px] font-medium text-slate-500 dark:text-zinc-400 hidden sm:inline">Digital Signing Workspace</span>
                    </div>
                    <span class="text-[10px] text-slate-400 dark:text-zinc-500 truncate max-w-[280px] sm:max-w-none">Roni, Putra &amp; Kusumah Law Firm · Practice Management</span>
                </div>
            </div>

            <!-- Protocol & Security Status (Clean typography, no badges, no dots) -->
            <div class="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-zinc-400">
                <div class="hidden md:flex items-center gap-1.5 text-[11px]">
                    <span class="text-slate-400 dark:text-zinc-500">Protokol:</span>
                    <span class="font-medium text-slate-800 dark:text-zinc-200">UU ITE &amp; SHA-256 Valid</span>
                </div>
                <span class="hidden md:inline text-slate-300 dark:text-zinc-700">·</span>
                <span class="text-[11px] font-sans text-slate-600 dark:text-zinc-400">Sesi Aktif</span>
            </div>
        </div>
    </header>

    <!-- 2. Main Workspace Layout -->
    <main class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex-1 flex flex-col space-y-4">

        <!-- Executive Document Hero (Compact RPK Design: Animated BG Preserved, No Character Image, Concise Content) -->
        <section class="group relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-[#f7f9ff] via-white to-[#eaf3ff] p-5 sm:p-6 shadow-[0_10px_28px_rgba(71,85,105,0.075)] dark:border-white/[0.08] dark:from-[#17191f] dark:via-[#17191f] dark:to-[#18202b]">
            <!-- 1. Ambient Breathing Radial Glow -->
            <div class="matters-hero-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_83%_38%,rgba(147,197,253,0.34),transparent_30%),radial-gradient(circle_at_65%_115%,rgba(251,191,36,0.12),transparent_27%)]"></div>

            <!-- 2. Drifting Micro-Dot Matrix Pattern -->
            <div class="matters-hero-dots pointer-events-none absolute inset-y-0 right-0 hidden w-[480px] [background-image:radial-gradient(rgba(59,130,246,0.24)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,transparent,black_28%)] [background-size:18px_18px] opacity-30 md:block"></div>

            <!-- 3. Animated Vector Wave Lines with Drop Shadow -->
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

            <!-- 4. Content Area: Official Document & Matter Dossier -->
            <div class="relative z-10 max-w-5xl">
                <!-- Matter Reference & Title -->
                <div class="flex flex-wrap items-center gap-2 text-xs">
                    <span class="font-mono font-bold text-xs tracking-wider text-slate-900 dark:text-zinc-100 uppercase">
                        {{ $signer->signatureRequest->document->matter?->matter_number ?? 'RPK-2026-0001' }}
                    </span>
                    <span class="text-slate-300 dark:text-zinc-700">/</span>
                    <span class="text-slate-600 dark:text-zinc-400 font-medium text-xs sm:text-sm">
                        {{ $signer->signatureRequest->document->matter?->title ?? 'Pendampingan Hukum Korporasi dan Penyelesaian Sengketa Internal PT Kembang Kembar Grup' }}
                    </span>
                </div>

                <!-- Document Title -->
                <h1 class="mt-2 text-xl sm:text-2xl font-black tracking-tight text-slate-950 dark:text-white leading-snug">
                    {{ $officialDocTitle }}
                </h1>

                <!-- Compact Metadata Strip -->
                <div class="mt-3 flex flex-wrap items-center gap-y-2 gap-x-5 sm:gap-x-7 text-xs">
                    <div class="flex items-center gap-1.5">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Ref:</span>
                        <span class="font-mono font-bold text-slate-900 dark:text-zinc-100">{{ $signer->signatureRequest->verification_code }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <span class="size-1.5 rounded-full bg-emerald-500"></span>
                        <span class="font-bold text-slate-800 dark:text-zinc-200">SHA-256 Valid</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Status:</span>
                        <span class="font-semibold text-slate-900 dark:text-zinc-100">Siap Ditandatangani</span>
                    </div>
                    @if ($signer->signatureRequest->expires_at)
                        <div class="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-sans">Batas:</span>
                            <span>{{ $signer->signatureRequest->expires_at->translatedFormat('d M Y, H:i') }} WIB</span>
                        </div>
                    @endif
                </div>
            </div>
        </section>

        <!-- 3. Sequential Tab Navigation Bar -->
        <nav aria-label="Alur Penandatanganan" class="rounded-2xl border border-slate-200/90 bg-white/90 p-1.5 sm:p-2 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-[#14171d]/90">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <!-- Tab 1 Button -->
                <button 
                    type="button" 
                    id="stepNav1" 
                    onclick="onStepNavClick(1)" 
                    class="group relative flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition-all duration-200 text-left border-slate-500/80 bg-slate-600 text-white shadow-md shadow-slate-600/20 cursor-pointer dark:border-zinc-500 dark:bg-zinc-700 dark:shadow-zinc-900/30"
                >
                    <span class="step-badge size-7.5 rounded-xl bg-white/20 text-white font-mono text-xs font-black flex items-center justify-center shrink-0 border border-white/30 backdrop-blur-xs shadow-2xs">01</span>
                    <div class="truncate min-w-0">
                        <span class="step-title block text-xs sm:text-[12.5px] font-bold text-white leading-tight truncate">Telaah Dokumen</span>
                        <span class="step-subtitle block text-[10px] sm:text-[10.5px] text-slate-200/90 leading-tight font-normal mt-0.5 truncate">Identitas Penandatangan</span>
                    </div>
                </button>

                <!-- Tab 2 Button -->
                <button 
                    type="button" 
                    id="stepNav2" 
                    onclick="onStepNavClick(2)" 
                    class="group relative flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition-all duration-200 text-left border-transparent bg-slate-100/40 text-slate-400 opacity-60 cursor-not-allowed dark:bg-zinc-900/30 dark:text-zinc-600"
                    title="Selesaikan telaah dokumen dan klik 'Mulai Tanda Tangan' untuk membuka langkah ini"
                >
                    <span class="step-badge size-7.5 rounded-xl bg-slate-200/60 text-slate-400 font-mono text-xs font-medium flex items-center justify-center shrink-0 dark:bg-zinc-800/50 dark:text-zinc-600">02</span>
                    <div class="truncate min-w-0">
                        <span class="step-title block text-xs sm:text-[12.5px] font-medium text-slate-500 dark:text-zinc-500 leading-tight truncate">Buat Tanda Tangan</span>
                        <span class="step-subtitle block text-[10px] sm:text-[10.5px] text-slate-400/80 dark:text-zinc-600 leading-tight font-normal mt-0.5 truncate">Spesimen Tanda Tangan Resmi</span>
                    </div>
                </button>

                <!-- Tab 3 Button -->
                <button 
                    type="button" 
                    id="stepNav3" 
                    onclick="onStepNavClick(3)" 
                    class="group relative flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition-all duration-200 text-left border-transparent bg-slate-100/40 text-slate-400 opacity-60 cursor-not-allowed dark:bg-zinc-900/30 dark:text-zinc-600"
                    title="Selesaikan langkah sebelumnya terlebih dahulu"
                >
                    <span class="step-badge size-7.5 rounded-xl bg-slate-200/60 text-slate-400 font-mono text-xs font-medium flex items-center justify-center shrink-0 dark:bg-zinc-800/50 dark:text-zinc-600">03</span>
                    <div class="truncate min-w-0">
                        <span class="step-title block text-xs sm:text-[12.5px] font-medium text-slate-500 dark:text-zinc-500 leading-tight truncate">Tata Letak Stempel</span>
                        <span class="step-subtitle block text-[10px] sm:text-[10.5px] text-slate-400/80 dark:text-zinc-600 leading-tight font-normal mt-0.5 truncate">Posisi Halaman &amp; QR</span>
                    </div>
                </button>

                <!-- Tab 4 Button -->
                <button 
                    type="button" 
                    id="stepNav4" 
                    onclick="onStepNavClick(4)" 
                    class="group relative flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition-all duration-200 text-left border-transparent bg-slate-100/40 text-slate-400 opacity-60 cursor-not-allowed dark:bg-zinc-900/30 dark:text-zinc-600"
                    title="Selesaikan langkah sebelumnya terlebih dahulu"
                >
                    <span class="step-badge size-7.5 rounded-xl bg-slate-200/60 text-slate-400 font-mono text-xs font-medium flex items-center justify-center shrink-0 dark:bg-zinc-800/50 dark:text-zinc-600">04</span>
                    <div class="truncate min-w-0">
                        <span class="step-title block text-xs sm:text-[12.5px] font-medium text-slate-500 dark:text-zinc-500 leading-tight truncate">Konfirmasi Akhir</span>
                        <span class="step-subtitle block text-[10px] sm:text-[10.5px] text-slate-400/80 dark:text-zinc-600 leading-tight font-normal mt-0.5 truncate">Pernyataan &amp; Pengesahan</span>
                    </div>
                </button>
            </div>
        </nav>

        <!-- 4. Signing Form Container -->
        <form id="signingForm" method="post" action="{{ route('signature.sign.store', $signer->signing_token) }}" class="flex-1 flex flex-col space-y-4" novalidate>
            @csrf

            <!-- Hidden Inputs for Submission -->
            <input type="hidden" name="page_number" id="inputPageNumber" value="1">
            <input type="hidden" name="position_x" id="inputPositionX" value="60">
            <input type="hidden" name="position_y" id="inputPositionY" value="75">
            <input type="hidden" name="stamp_width" id="inputStampWidth" value="50">
            <input type="hidden" name="stamp_height" id="inputStampHeight" value="22">
            <input type="hidden" name="show_qr" id="inputShowQr" value="{{ ($signer->show_qr ?? true) ? '1' : '0' }}">
            <input type="hidden" name="show_name" id="inputShowName" value="0">
            <input type="hidden" name="show_title" id="inputShowTitle" value="0">
            <input type="hidden" name="show_border" id="inputShowBorder" value="0">
            @php
                $initialStampLayout = $signer->stamp_layout;
                if (empty($initialStampLayout) || (!str_starts_with($initialStampLayout, 'custom_') && $initialStampLayout !== 'qr_only')) {
                    $initialStampLayout = 'custom_82.0_75.0';
                }
            @endphp
            <input type="hidden" name="stamp_layout" id="stampLayoutInput" value="{{ $initialStampLayout }}">
            <input type="hidden" name="name_position" id="namePositionInput" value="none">
            <input type="hidden" name="signature_type" id="signatureTypeInput" value="draw">
            <input type="hidden" name="signature_data" id="signatureDataInput" value="">

            <!-- ========================================================================= -->
            <!-- TAB 1: TELAAH DOKUMEN & IDENTITAS -->
            <!-- ========================================================================= -->
            <div id="tabPanel1" class="space-y-4">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    <!-- Left: Document Viewer (8 cols) -->
                    <div class="lg:col-span-8 rounded-xl border border-slate-200/90 bg-slate-50/90 p-4 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-[#14171d]/90 space-y-3">
                        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5 dark:border-zinc-700/80">
                            <div class="flex items-center gap-2.5">
                                <div class="size-8 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center shrink-0 border border-slate-200/70 dark:border-white/5 shadow-2xs">
                                    <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        Pratinjau Draf Dokumen
                                    </h2>
                                    <p class="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                                        Telaah naskah perjanjian dan klausul legal sebelum membubuhkan tanda tangan.
                                    </p>
                                </div>
                            </div>

                            <!-- Page & Zoom Toolbar -->
                            <div class="flex items-center gap-2">
                                <!-- Page Nav -->
                                <div class="flex items-center rounded-lg border border-slate-200/80 bg-slate-50/90 p-0.5 dark:border-white/10 dark:bg-zinc-800/70 shadow-2xs">
                                    <button 
                                        type="button" 
                                        onclick="prevPage()"
                                        id="tab1BtnPrev"
                                        class="size-6.5 flex items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                                        title="Halaman Sebelumnya"
                                    >
                                        <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <span class="font-mono text-xs text-slate-600 dark:text-zinc-300 px-2 py-0.5 select-none whitespace-nowrap">
                                        Hal <strong class="displayCurrentPage font-semibold text-slate-900 dark:text-white">1</strong> / <span class="displayTotalPages">1</span>
                                    </span>
                                    <button 
                                        type="button" 
                                        onclick="nextPage()"
                                        id="tab1BtnNext"
                                        class="size-6.5 flex items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                                        title="Halaman Berikutnya"
                                    >
                                        <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                <!-- Zoom Controls -->
                                <div class="flex items-center rounded-lg border border-slate-200/80 bg-slate-50/90 p-0.5 dark:border-white/10 dark:bg-zinc-800/70 shadow-2xs">
                                    <button 
                                        type="button" 
                                        onclick="changeZoom(-0.15)"
                                        class="size-6.5 flex items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                                        title="Perkecil"
                                    >
                                        <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span class="zoomDisplay font-mono text-[11px] font-semibold text-slate-600 dark:text-zinc-300 px-1 min-w-[38px] text-center select-none">100%</span>
                                    <button 
                                        type="button" 
                                        onclick="changeZoom(0.15)"
                                        class="size-6.5 flex items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                                        title="Perbesar"
                                    >
                                        <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                    <div class="h-3.5 w-px bg-slate-200 dark:bg-white/10 mx-0.5"></div>
                                    <button 
                                        type="button" 
                                        onclick="resetZoom()"
                                        class="px-2 py-0.5 rounded-md text-[10.5px] font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                                        title="Sesuaikan Layar"
                                    >
                                        Fit
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- PDF Viewport -->
                        <div class="relative overflow-auto rounded-lg border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-zinc-900/60 p-3 sm:p-6 flex flex-col items-center min-h-[500px] max-h-[680px] custom-scroll" id="tab1ViewportContainer">
                            <div id="tab1LoadingSpinner" class="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-zinc-900/90 z-20 space-y-2 text-slate-700 dark:text-zinc-300 rounded-lg">
                                <div class="size-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-white"></div>
                                <span class="text-xs font-semibold">Memuat Pratinjau Dokumen...</span>
                            </div>

                            <div class="relative shadow-sm rounded-xs bg-white mx-auto my-0 shrink-0" id="tab1PageWrapper">
                                <canvas id="tab1PdfCanvas" class="bg-white block rounded-xs"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Signer Legal Identity & Verification Form (4 cols) -->
                    <div class="lg:col-span-4 space-y-4">
                        <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-5 text-slate-800 space-y-4 dark:border-white/10 dark:bg-[#14171d] dark:text-slate-100">
                            <!-- Card Header -->
                            <div class="border-b border-slate-200/80 pb-3 dark:border-zinc-800">
                                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                    Identitas Penandatangan
                                </h2>
                                <p class="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                                    Pastikan nama dan jabatan sesuai dengan dokumen identitas resmi (KTP/Akta).
                                </p>
                            </div>

                            <!-- Signer Account Info -->
                            <div class="flex items-center gap-3">
                                @if ($signer->avatar_url)
                                    <img 
                                        src="{{ $signer->avatar_url }}" 
                                        alt="{{ $signer->name }}" 
                                        class="size-10 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                                        onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.classList.remove('hidden');"
                                    />
                                    <div class="hidden size-10 rounded-full bg-slate-900 text-white font-medium text-xs flex items-center justify-center font-mono dark:bg-white dark:text-slate-950">
                                        {{ $signerInitials }}
                                    </div>
                                @else
                                    <div class="size-10 rounded-full bg-slate-900 text-white font-medium text-xs flex items-center justify-center font-mono dark:bg-white dark:text-slate-950">
                                        {{ $signerInitials }}
                                    </div>
                                @endif
                                <div class="min-w-0 flex-1">
                                    <div class="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                        {{ $signer->name }}
                                    </div>
                                    <div class="text-xs font-mono text-slate-500 dark:text-zinc-400 truncate">
                                        {{ $signer->email }}
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-3.5">
                                <div>
                                    <label for="accepted_name" class="text-xs font-medium text-slate-700 block mb-1.5 dark:text-zinc-300">
                                        Nama Lengkap Resmi <span class="text-slate-900 dark:text-white font-semibold">*</span>
                                    </label>
                                    <input 
                                        id="accepted_name" 
                                        name="accepted_name" 
                                        type="text"
                                        value="{{ old('accepted_name', $signer->name) }}" 
                                        required
                                        placeholder="Nama lengkap sesuai identitas"
                                        class="h-9.5 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-hidden transition-colors focus:border-slate-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white"
                                    >
                                    @error('accepted_name')
                                        <p class="mt-1 text-xs text-rose-600 font-medium">{{ $message }}</p>
                                    @enderror
                                </div>

                                <div>
                                    <label for="signer_title" class="text-xs font-medium text-slate-700 block mb-1.5 dark:text-zinc-300">
                                        Jabatan / Kapasitas Legal (Opsional)
                                    </label>
                                    <input 
                                        id="signer_title" 
                                        name="signer_title" 
                                        type="text"
                                        value="{{ old('signer_title') }}" 
                                        placeholder="Contoh: Direktur Utama / Kuasa Hukum"
                                        class="h-9.5 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-hidden transition-colors focus:border-slate-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white"
                                    >
                                    <span class="text-[11px] text-slate-500 block mt-1 dark:text-zinc-400">
                                        Dicantumkan pada sertifikat keabsahan tanda tangan.
                                    </span>
                                </div>

                                <!-- Cryptographic Integrity -->
                                <div class="rounded-lg border border-slate-200 bg-white p-3 space-y-2 text-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                                    <div class="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                                        <span>Integritas Kriptografis:</span>
                                        <span class="font-mono text-slate-900 dark:text-white font-medium">SHA-256 Valid</span>
                                    </div>
                                    <div class="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                                        <span>Kode Verifikasi:</span>
                                        <span class="font-mono text-slate-900 dark:text-white font-medium">{{ $signer->signatureRequest->verification_code }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-2 border-t border-slate-200/80 dark:border-zinc-800">
                                <button 
                                    type="button" 
                                    id="btnStartSigning"
                                    onclick="validateAndGoToTab(2)"
                                    class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-xs font-semibold cursor-pointer shadow-xs"
                                >
                                    <span>Mulai Tanda Tangan</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- TAB 2: PEMBUATAN TANDA TANGAN -->
            <!-- ========================================================================= -->
            <div id="tabPanel2" class="hidden space-y-4">
                <div class="max-w-3xl mx-auto rounded-xl border border-slate-200/90 bg-slate-50/90 p-6 shadow-xs backdrop-blur-md text-slate-800 dark:border-white/10 dark:bg-[#14171d]/90 dark:text-slate-100 space-y-5">
                    <div class="border-b border-slate-200/80 pb-3.5 dark:border-zinc-700/80">
                        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                            Spesimen Tanda Tangan Elektronik Resmi
                        </h2>
                        <p class="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                            Bubuhkan spesimen tanda tangan resmi Anda pada bidang kanvas dengan presisi menggunakan stylus, mouse, atau layar sentuh.
                        </p>
                    </div>

                    <!-- Bilah Alat Studio Terpadu (Pilihan Instrumen, Warna Tinta, Urungkan & Hapus) -->
                    <div class="flex flex-wrap items-center justify-between gap-3 px-3 py-2 rounded-xl border border-slate-200/90 bg-white shadow-2xs dark:border-zinc-800 dark:bg-[#181b22]">
                        <!-- Kiri: Pilihan Instrumen / Pensil -->
                        <div class="flex items-center gap-1 bg-slate-100/90 p-1 rounded-lg dark:bg-zinc-800/90">
                            <!-- Pensil Presisi (1.2px) -->
                            <button 
                                type="button" 
                                id="toolPencil" 
                                onclick="setSignatureTool('pencil')"
                                class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 transition-all cursor-pointer dark:text-zinc-400 dark:hover:text-white"
                                title="Pensil Presisi (Goresan Halus 1.2px)"
                            >
                                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <span>Pensil Presisi</span>
                            </button>

                            <!-- Pena Dokumen Resmi (2.2px - Default Active) -->
                            <button 
                                type="button" 
                                id="toolPen" 
                                onclick="setSignatureTool('pen')"
                                class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-slate-900 shadow-2xs cursor-pointer dark:bg-zinc-700 dark:text-white transition-all"
                                title="Pena Dokumen Resmi (Standar 2.2px)"
                            >
                                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Pena Resmi</span>
                            </button>

                            <!-- Pena Kaligrafi / Basah (3.5px) -->
                            <button 
                                type="button" 
                                id="toolCalligraphy" 
                                onclick="setSignatureTool('calligraphy')"
                                class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 transition-all cursor-pointer dark:text-zinc-400 dark:hover:text-white"
                                title="Pena Kaligrafi / Basah (Tebal Elegan 3.5px)"
                            >
                                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                <span>Pena Basah</span>
                            </button>
                        </div>

                        <!-- Tengah: Warna Tinta -->
                        <div class="flex items-center gap-2 px-1">
                            <span class="text-xs font-medium text-slate-500 dark:text-zinc-400 hidden sm:inline">Tinta:</span>
                            <div class="flex items-center gap-1.5">
                                <button 
                                    type="button" 
                                    onclick="setPenColor('#1e3a8a')" 
                                    id="btnColorBlue"
                                    class="size-5 rounded-full bg-blue-900 ring-2 ring-slate-900 ring-offset-2 transition-all cursor-pointer dark:ring-white shadow-2xs" 
                                    title="Biru Dokumen Legal"
                                ></button>
                                <button 
                                    type="button" 
                                    onclick="setPenColor('#0f172a')" 
                                    id="btnColorNavy"
                                    class="size-5 rounded-full bg-slate-900 transition-all cursor-pointer shadow-2xs" 
                                    title="Navy Gelap"
                                ></button>
                                <button 
                                    type="button" 
                                    onclick="setPenColor('#000000')" 
                                    id="btnColorBlack"
                                    class="size-5 rounded-full bg-black transition-all cursor-pointer shadow-2xs" 
                                    title="Hitam Pekat"
                                ></button>
                            </div>
                        </div>

                        <!-- Kanan: Aksi Goresan (Urungkan & Hapus) -->
                        <div class="flex items-center gap-1.5">
                            <button 
                                type="button" 
                                onclick="undoSignaturePad()" 
                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors text-xs font-medium cursor-pointer shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                                title="Batalkan goresan terakhir (⌘Z / Ctrl+Z)"
                            >
                                <svg class="size-3.5 text-slate-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a5 5 0 015 5v2m-15-7l4-4m-4 4l4 4" />
                                </svg>
                                <span>Urungkan (⌘Z)</span>
                            </button>

                            <button 
                                type="button" 
                                onclick="clearSignaturePad()" 
                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200/80 bg-rose-50/60 text-rose-700 hover:bg-rose-100/80 active:bg-rose-200/80 transition-colors text-xs font-medium cursor-pointer shadow-2xs dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                                title="Hapus semua goresan tanda tangan"
                            >
                                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Hapus</span>
                            </button>
                        </div>
                    </div>

                    <!-- Spacious High-DPI Signature Card in Pure White Elevation -->
                    <div class="relative rounded-xl border border-slate-200/90 bg-white dark:border-zinc-700/80 dark:bg-zinc-900/80 p-4 min-h-[260px] sm:min-h-[300px] flex flex-col justify-end shadow-2xs">
                        <canvas 
                            id="studioSignatureCanvas" 
                            class="w-full h-[240px] sm:h-[260px] block cursor-crosshair touch-none bg-transparent"
                        ></canvas>

                        <!-- Canvas Placeholder -->
                        <div id="studioCanvasPlaceholder" class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-zinc-500 select-none">
                            <svg class="size-6 text-slate-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span class="text-xs font-medium">Bubuhkan tanda tangan Anda di area ini</span>
                        </div>
                    </div>

                    <!-- Signature Status & High-DPI Vector Precision -->
                    <div id="signatureStatusBar" class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg border border-slate-200/80 bg-white/70 text-xs transition-colors dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div class="flex items-center gap-2">
                            <span id="signatureStatusIconWrap" class="text-slate-400 dark:text-zinc-500 flex items-center shrink-0">
                                <svg id="signatureStatusIconEmpty" class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <svg id="signatureStatusIconDrawn" class="size-3.5 text-slate-900 dark:text-white hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            <span id="signatureDrawnStatus" class="font-medium text-slate-500 dark:text-zinc-400">
                                Belum ada goresan tanda tangan
                            </span>
                        </div>

                        <div class="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 dark:text-zinc-500 sm:border-l sm:border-slate-200 sm:pl-3 dark:sm:border-zinc-800">
                            <span>Presisi Vektor High-DPI</span>
                        </div>
                    </div>

                    <!-- Navigation Action Buttons -->
                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-200/80 dark:border-zinc-700/80">
                        <button 
                            type="button" 
                            onclick="switchTab(1)"
                            class="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors text-xs font-medium cursor-pointer shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                        >
                            <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Kembali ke Telaah</span>
                        </button>

                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <!-- Skip Signature Option (Barcode QR Only) -->
                            <button 
                                type="button" 
                                onclick="openSkipSignatureModal()"
                                class="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors text-xs font-medium cursor-pointer shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                title="Lewati tanda tangan goresan dan sahkan dokumen hanya dengan Barcode QR resmi"
                            >
                                <svg class="size-3.5 text-slate-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                                <span>Lewati TTD (Gunakan QR Saja)</span>
                            </button>

                            <button 
                                type="button" 
                                onclick="validateAndGoToTab(3)"
                                class="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors text-xs font-semibold shadow-xs shadow-blue-600/20 cursor-pointer"
                            >
                                <span>Lanjutkan ke Penempatan Stempel</span>
                                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- TAB 3: TATA LETAK & PENEMPATAN STEMPEL -->
            <!-- ========================================================================= -->
            <div id="tabPanel3" class="hidden space-y-4">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    <!-- Left: Placement Canvas on Document (8 cols) -->
                    <div class="lg:col-span-8 rounded-xl border border-slate-200/90 bg-slate-50/90 p-4 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-[#14171d]/90 space-y-3">
                        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5 dark:border-zinc-700/80">
                            <div class="flex items-center gap-2.5">
                                <div class="size-8 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center shrink-0 border border-slate-200/70 dark:border-white/5 shadow-2xs">
                                    <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        Atur Posisi Stempel
                                    </h2>
                                    <p class="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                                        Geser kotak stempel tanda tangan dan segel barcode QR ke posisi target pengesahan.
                                    </p>
                                </div>
                            </div>

                            <!-- Placement Page Nav & Zoom -->
                            <div class="flex items-center gap-2">
                                <!-- Page Nav -->
                                <div class="flex items-center rounded-lg border border-slate-200/80 bg-slate-50/90 p-0.5 dark:border-white/10 dark:bg-zinc-800/70 shadow-2xs">
                                    <button 
                                        type="button" 
                                        onclick="prevPage()"
                                        id="tab3BtnPrev"
                                        class="size-6.5 flex items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                                        title="Halaman Sebelumnya"
                                    >
                                        <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <span class="font-mono text-xs text-slate-600 dark:text-zinc-300 px-2 py-0.5 select-none whitespace-nowrap">
                                        Hal <strong class="displayCurrentPage font-semibold text-slate-900 dark:text-white">1</strong> / <span class="displayTotalPages">1</span>
                                    </span>
                                    <button 
                                        type="button" 
                                        onclick="nextPage()"
                                        id="tab3BtnNext"
                                        class="size-6.5 flex items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                                        title="Halaman Berikutnya"
                                    >
                                        <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                <!-- Zoom Controls -->
                                <div class="flex items-center rounded-lg border border-slate-200/80 bg-slate-50/90 p-0.5 dark:border-white/10 dark:bg-zinc-800/70 shadow-2xs">
                                    <button 
                                        type="button" 
                                        onclick="changeZoom(-0.15)"
                                        class="size-6.5 flex items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                                        title="Perkecil"
                                    >
                                        <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span class="zoomDisplay font-mono text-[11px] font-semibold text-slate-600 dark:text-zinc-300 px-1 min-w-[38px] text-center select-none">100%</span>
                                    <button 
                                        type="button" 
                                        onclick="changeZoom(0.15)"
                                        class="size-6.5 flex items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                                        title="Perbesar"
                                    >
                                        <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                    <div class="h-3.5 w-px bg-slate-200 dark:bg-white/10 mx-0.5"></div>
                                    <button 
                                        type="button" 
                                        onclick="resetZoom()"
                                        class="px-2 py-0.5 rounded-md text-[10.5px] font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                                        title="Sesuaikan Layar"
                                    >
                                        Fit
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Live Coordinate Indicator Bar -->
                        <div class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200/70 bg-slate-50/70 px-3 py-1.5 text-xs font-mono text-slate-500 dark:border-white/5 dark:bg-zinc-900/40 dark:text-zinc-400 shadow-2xs">
                            <div class="flex items-center gap-2">
                                <span class="relative flex size-2">
                                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                                    <span class="relative inline-flex size-2 rounded-full bg-blue-600 dark:bg-blue-500"></span>
                                </span>
                                <span>Posisi: Hal <strong id="displayPage" class="font-semibold text-slate-900 dark:text-white">1</strong> (<strong id="displayX" class="text-slate-900 dark:text-white">60</strong>% X, <strong id="displayY" class="text-slate-900 dark:text-white">75</strong>% Y)</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-slate-400 dark:text-zinc-500">Dimensi:</span>
                                <strong id="displayDimensions" class="font-semibold text-slate-900 dark:text-white">50 × 22 mm</strong>
                            </div>
                        </div>

                        <!-- PDF Interactive Placement Viewport Area -->
                        <div class="relative overflow-auto rounded-lg border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-zinc-900/60 p-3 sm:p-6 flex flex-col items-center min-h-[520px] max-h-[700px] custom-scroll" id="tab3ViewportContainer">
                            
                            <div id="tab3LoadingSpinner" class="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-zinc-900/90 z-20 space-y-2 text-slate-700 dark:text-zinc-300 rounded-lg">
                                <div class="size-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-white"></div>
                                <span class="text-xs font-semibold">Memuat Pratinjau Dokumen...</span>
                            </div>

                            <div class="relative shadow-sm rounded-xs bg-white mx-auto my-0 shrink-0" id="tab3PageWrapper">
                                <canvas id="tab3PdfCanvas" class="bg-white block rounded-xs"></canvas>
                                
                                <!-- Draggable WYSIWYG Stamp Box -->
                                <div 
                                    id="placementStamp" 
                                    class="placement-stamp absolute z-10 select-none bg-transparent group"
                                    style="width: 170px; height: 75px; left: 60%; top: 75%;"
                                >
                                    <!-- Stamp Drag Handle -->
                                    <div 
                                        id="stampHeaderBar" 
                                        class="absolute -top-7 left-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-sans shadow-md cursor-grab active:cursor-grabbing select-none hover:bg-slate-800 transition-colors"
                                        title="Klik &amp; seret untuk memindahkan posisi stempel tanda tangan"
                                    >
                                        <svg class="size-2.5 text-slate-300 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                                        </svg>
                                        <span class="font-medium pointer-events-none tracking-tight">Geser Posisi Stempel</span>
                                    </div>

                                    <!-- Rendered Signature Preview Inside Stamp -->
                                    <div 
                                        id="stampPreviewBox" 
                                        class="relative w-full h-full rounded border border-slate-300 dark:border-white/20 bg-white/80 dark:bg-zinc-900/80 p-1 flex items-center justify-center transition-all overflow-hidden"
                                    >
                                        <img 
                                            id="stampSignatureImg" 
                                            src="" 
                                            alt="TTD" 
                                            class="w-full h-full object-contain pointer-events-none block"
                                        />

                                        <!-- QR Only Seal inside Stamp Frame -->
                                        <div id="stampQrOnlySeal" class="hidden flex-col items-center justify-center size-full p-1 text-center select-none pointer-events-none">
                                            <img 
                                                src="{{ route('signature.qr', $signer->signatureRequest->verification_code) }}" 
                                                alt="QR Seal" 
                                                class="size-9 object-contain block mx-auto mb-0.5"
                                            />
                                            <span class="text-[7.5px] font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200 leading-tight">
                                                Segel Barcode QR
                                            </span>
                                            <span class="text-[6.5px] font-mono text-slate-500 dark:text-zinc-400 leading-none truncate max-w-full">
                                                {{ $signer->signatureRequest->verification_code }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Signer Name Printed Underneath (If enabled) -->
                                    <div id="stampNameBottom" class="hidden pt-1 text-center pointer-events-none">
                                        <p class="text-[8px] font-bold text-slate-900 dark:text-zinc-100 leading-tight truncate stamp-display-name">
                                            {{ $signer->name }}
                                        </p>
                                        <p class="text-[6.5px] text-slate-500 leading-none truncate stamp-display-title"></p>
                                    </div>

                                    <!-- Signer Name Printed On Top (If enabled) -->
                                    <div id="stampNameTop" class="hidden pb-1 text-center pointer-events-none">
                                        <p class="text-[8px] font-bold text-slate-900 dark:text-zinc-100 leading-tight truncate stamp-display-name">
                                            {{ $signer->name }}
                                        </p>
                                        <p class="text-[6.5px] text-slate-500 leading-none truncate stamp-display-title"></p>
                                    </div>

                                </div>

                                <!-- Draggable Independent Barcode QR Box -->
                                @php
                                    $defaultQrLeft = '82%';
                                    $defaultQrTop = '75%';
                                    if (str_starts_with($initialStampLayout, 'custom_')) {
                                        $layoutParts = explode('_', $initialStampLayout);
                                        $defaultQrLeft = ($layoutParts[1] ?? '82') . '%';
                                        $defaultQrTop = ($layoutParts[2] ?? '75') . '%';
                                    }
                                @endphp
                                <div 
                                    id="placementQr" 
                                    class="{{ ($signer->show_qr ?? true) ? '' : 'hidden' }} placement-qr absolute z-20 select-none group"
                                    style="width: 52px; height: 52px; left: {{ $defaultQrLeft }}; top: {{ $defaultQrTop }};"
                                >
                                    <!-- QR Drag Handle -->
                                    <div 
                                        id="qrHeaderBar" 
                                        class="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-sans shadow-md cursor-grab active:cursor-grabbing select-none hover:bg-slate-800 transition-colors"
                                        title="Klik &amp; seret untuk memindahkan posisi Barcode QR"
                                    >
                                        <svg class="size-2.5 text-slate-300 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                                        </svg>
                                        <span class="font-medium pointer-events-none tracking-tight">Geser Barcode QR</span>
                                    </div>

                                    <!-- QR Box Preview -->
                                    <div class="relative size-full rounded border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xs flex items-center justify-center cursor-grab active:cursor-grabbing">
                                        <img 
                                            src="{{ route('signature.qr', $signer->signatureRequest->verification_code) }}" 
                                            alt="Barcode QR" 
                                            class="size-full object-contain pointer-events-none block select-none"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- Right: Precision Controls & Stamp Options (4 cols) -->
                    <div class="lg:col-span-4 space-y-4">
                        
                        <!-- QR Only Mode Notice Banner -->
                        <div id="tab3QrOnlyNotice" class="hidden rounded-xl border border-blue-200/80 bg-blue-50/70 p-3.5 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200 space-y-2">
                            <div class="flex items-start gap-2">
                                <svg class="size-4 shrink-0 text-blue-700 dark:text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div class="space-y-1">
                                    <p class="font-semibold text-xs leading-snug">Pengesahan via Barcode QR Aktif</p>
                                    <p class="text-[11px] leading-relaxed text-blue-800/90 dark:text-blue-300/90">
                                        Dokumen disahkan dengan stempel Barcode QR Kriptografis terpusat tanpa goresan tanda tangan basah.
                                    </p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onclick="cancelQrOnlyAndReturnToCanvas()"
                                class="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100 underline cursor-pointer"
                            >
                                ← Kembali &amp; Buat Goresan Tanda Tangan
                            </button>
                        </div>


                        <!-- Pengaturan Stempel & Ukuran Presisi Card -->
                        <div class="rounded-xl border border-slate-200/90 bg-slate-50/90 p-5 shadow-xs backdrop-blur-md text-slate-800 space-y-3.5 dark:border-white/10 dark:bg-[#14171d]/90 dark:text-slate-100">
                            <!-- Card Header (Clean, without top-right badge and without icon) -->
                            <div class="border-b border-slate-200/80 pb-2.5 dark:border-zinc-700/80">
                                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                    Pengaturan Stempel &amp; Ukuran Presisi
                                </h2>
                            </div>

                            <!-- Pilihan Ukuran -->
                            <div class="space-y-2">
                                <span class="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">Pilihan Ukuran Stempel:</span>
                                <div class="grid grid-cols-3 gap-1.5 text-xs">
                                    <button 
                                        type="button" 
                                        id="btnSizeCompact" 
                                        onclick="setStampDimensions(38, 16, 'Compact')" 
                                        class="rounded-lg border border-slate-200 bg-white p-2 text-center font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                                    >
                                        <div class="text-xs">Ringkas</div>
                                        <div class="text-[10px] font-mono text-slate-400 mt-0.5">38 × 16 mm</div>
                                    </button>
                                    <button 
                                        type="button" 
                                        id="btnSizeStandard" 
                                        onclick="setStampDimensions(50, 22, 'Standar')" 
                                        class="rounded-lg border-2 border-slate-900 bg-white p-2 text-center font-bold text-slate-950 transition-all cursor-pointer shadow-2xs dark:border-white dark:bg-zinc-800 dark:text-white"
                                    >
                                        <div class="text-xs">Standar</div>
                                        <div class="text-[10px] font-mono text-slate-700 dark:text-zinc-300 mt-0.5">50 × 22 mm</div>
                                    </button>
                                    <button 
                                        type="button" 
                                        id="btnSizeLarge" 
                                        onclick="setStampDimensions(64, 28, 'Besar')" 
                                        class="rounded-lg border border-slate-200 bg-white p-2 text-center font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                                    >
                                        <div class="text-xs">Besar</div>
                                        <div class="text-[10px] font-mono text-slate-400 mt-0.5">64 × 28 mm</div>
                                    </button>
                                </div>

                                <!-- Scale Slider -->
                                <div class="pt-1.5 space-y-1">
                                    <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                                        <span>Skala Proporsional:</span>
                                        <span id="sliderScaleValue" class="font-semibold text-slate-800 dark:text-zinc-200">100%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        id="scaleSlider" 
                                        min="75" 
                                        max="135" 
                                        value="100" 
                                        step="5"
                                        oninput="handleScaleSlider(this.value)"
                                        class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:bg-zinc-700 dark:accent-white"
                                    >
                                </div>
                            </div>

                            <!-- Opsi Kelengkapan -->
                            <div class="border-t border-slate-200/80 dark:border-zinc-700/80 pt-2.5 space-y-2 text-xs">
                                <span class="font-semibold text-slate-700 dark:text-zinc-300 block">Sertakan QR Code &amp; Tata Letak:</span>
                                
                                <label 
                                    id="labelToggleQr" 
                                    onclick="if (isQrOnly) { event.preventDefault(); return false; }"
                                    class="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs"
                                >
                                    <div class="space-y-0.5">
                                        <div class="flex items-center gap-1.5">
                                            <span class="text-xs font-semibold text-slate-800 dark:text-zinc-200 block">Sertakan QR Code</span>
                                            <span id="qrRequiredBadge" class="hidden text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">Wajib (Mode QR)</span>
                                        </div>
                                        <span id="qrSubtitleText" class="text-[10px] text-slate-400 dark:text-zinc-500 block">Tautkan barcode QR verifikasi keabsahan UU ITE</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        id="toggleQr" 
                                        {{ ($signer->show_qr ?? true) ? 'checked' : '' }}
                                        onchange="handleToggleElement('qr', this.checked)"
                                        class="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-zinc-700 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                </label>

                                <div id="qrDragNotice" class="{{ ($signer->show_qr ?? true) ? '' : 'hidden' }} text-[11px] text-slate-500 dark:text-zinc-400 flex items-start gap-1.5 px-1 py-1">
                                    <svg class="size-3.5 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                    </svg>
                                    <span>Barcode QR dapat digeser &amp; ditempatkan bebas langsung pada pratinjau dokumen di sebelah kiri.</span>
                                </div>

                                <label class="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs">
                                    <span class="text-xs text-slate-700 dark:text-zinc-300">Cetak Nama Terdaftar di Bawah Tanda Tangan</span>
                                    <input 
                                        type="checkbox" 
                                        id="toggleName" 
                                        onchange="handleToggleElement('name', this.checked)"
                                        class="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-zinc-700 cursor-pointer shrink-0"
                                    >
                                </label>

                                <label class="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs">
                                    <span class="text-xs text-slate-700 dark:text-zinc-300">Sertakan Bingkai Stempel Formal</span>
                                    <input 
                                        type="checkbox" 
                                        id="toggleBorder" 
                                        onchange="handleToggleElement('border', this.checked)"
                                        class="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-zinc-700 cursor-pointer shrink-0"
                                    >
                                </label>
                            </div>

                            <!-- Next Action -->
                            <div class="pt-3 border-t border-slate-200/80 dark:border-zinc-700/80 flex items-center gap-2">
                                <button 
                                    type="button" 
                                    onclick="switchTab(2)"
                                    class="flex items-center justify-center px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors text-xs font-medium cursor-pointer shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    <span>← Ganti TTD</span>
                                </button>
                                <button 
                                    type="button" 
                                    id="btnProceedToConfirm"
                                    onclick="validateAndGoToTab(4)"
                                    class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors text-xs font-semibold shadow-xs shadow-blue-600/20 cursor-pointer"
                                >
                                    <span>Lanjutkan ke Konfirmasi Akhir</span>
                                    <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- TAB 4: KONFIRMASI AKHIR & PEMBUBUHAN RESMI -->
            <!-- ========================================================================= -->
            <div id="tabPanel4" class="hidden space-y-4">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    <!-- Left: Final Proof Canvas (8 cols) -->
                    <div class="lg:col-span-8 rounded-xl border border-slate-200/90 bg-slate-50/90 p-4 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-[#14171d]/90 space-y-3">
                        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5 dark:border-zinc-700/80">
                            <div class="flex items-center gap-2.5">
                                <div class="size-8 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center shrink-0 border border-slate-200/70 dark:border-white/5 shadow-2xs">
                                    <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        Lembar Pratinjau Pengesahan Akhir
                                    </h2>
                                    <p class="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                                        Inspeksi visual stempel tanda tangan dan segel QR sebelum pembubuhan resmi dieksekusi.
                                    </p>
                                </div>
                            </div>

                            <!-- Target Info Widget -->
                            <div class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono text-slate-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 shadow-2xs">
                                <span>Halaman Target:</span>
                                <strong id="tab4TargetPageDisplay" class="font-bold text-slate-900 dark:text-white">1</strong>
                            </div>
                        </div>

                        <!-- Final Proof Viewport -->
                        <div class="relative overflow-auto rounded-lg border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-zinc-900/60 p-3 sm:p-6 flex flex-col items-center min-h-[480px] max-h-[660px] custom-scroll">
                            <div id="tab4LoadingSpinner" class="hidden absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-zinc-900/90 z-20 space-y-2 text-slate-700 dark:text-zinc-300 rounded-lg">
                                <div class="size-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-white"></div>
                                <span class="text-xs font-semibold">Memproses Pratinjau Pengesahan...</span>
                            </div>

                            <div class="relative shadow-sm rounded-xs bg-white mx-auto my-0 shrink-0" id="tab4CanvasWrapper">
                                <canvas id="tab4FinalCanvas" class="bg-white block rounded-xs"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Execution Summary & Legal Undertaking (4 cols) -->
                    <div class="lg:col-span-4 space-y-4">
                        <div class="rounded-xl border border-slate-200/90 bg-slate-50/90 p-5 shadow-xs backdrop-blur-md text-slate-800 space-y-4 dark:border-white/10 dark:bg-[#14171d]/90 dark:text-slate-100">
                            <div class="border-b border-slate-200/80 pb-2.5 dark:border-zinc-700/80">
                                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                    Pengesahan Dokumen Resmi
                                </h2>
                                <p class="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                                    Verifikasi rincian sebelum pembubuhan resmi dieksekusi.
                                </p>
                            </div>

                            <!-- Summary Checklist in Pure White Elevation -->
                            <div class="rounded-xl border border-slate-200/90 bg-white p-3.5 space-y-2 text-xs shadow-2xs dark:border-zinc-700/80 dark:bg-zinc-900/80">
                                <div class="flex items-center justify-between gap-3 py-1 border-b border-slate-100 dark:border-white/[0.04]">
                                    <span class="text-slate-400 dark:text-zinc-500">Penandatangan:</span>
                                    <div class="flex items-center gap-2 shrink-0">
                                        @if ($signer->avatar_url)
                                            <img src="{{ $signer->avatar_url }}" alt="{{ $signer->name }}" class="size-5 rounded-full object-cover border border-slate-200 dark:border-white/10">
                                        @endif
                                        <strong id="tab4SummaryName" class="text-slate-900 dark:text-zinc-100 font-semibold text-right">{{ $signer->name }}</strong>
                                    </div>
                                </div>
                                <div class="flex justify-between items-start py-1 border-b border-slate-100 dark:border-white/[0.04]">
                                    <span class="text-slate-400 dark:text-zinc-500">Jabatan:</span>
                                    <span id="tab4SummaryTitle" class="text-slate-700 dark:text-zinc-300 text-right">-</span>
                                </div>
                                <div class="flex justify-between items-start py-1 border-b border-slate-100 dark:border-white/[0.04]">
                                    <span class="text-slate-400 dark:text-zinc-500">Posisi Pembubuhan:</span>
                                    <span id="tab4SummaryPosition" class="text-slate-700 dark:text-zinc-300 font-mono text-right">Hal 1 (60% X, 75% Y)</span>
                                </div>
                                <div class="flex justify-between items-start py-1 border-b border-slate-100 dark:border-white/[0.04]">
                                    <span class="text-slate-400 dark:text-zinc-500">Metode Pengesahan:</span>
                                    <span id="tab4SummaryMethod" class="text-slate-800 dark:text-zinc-200 font-semibold text-right">Tanda Tangan &amp; Barcode QR</span>
                                </div>
                                <div class="flex justify-between items-start py-1 border-b border-slate-100 dark:border-white/[0.04]">
                                    <span class="text-slate-400 dark:text-zinc-500">Dimensi Stempel:</span>
                                    <span id="tab4SummaryDimensions" class="text-slate-700 dark:text-zinc-300 font-mono text-right">50 × 22 mm</span>
                                </div>
                                <div class="flex justify-between items-start py-1">
                                    <span class="text-slate-400 dark:text-zinc-500">Kode Verifikasi:</span>
                                    <span class="text-slate-700 dark:text-zinc-300 font-mono text-right">{{ $signer->signatureRequest->verification_code }}</span>
                                </div>
                            </div>

                            <!-- Legal Undertaking Terms Checkbox -->
                            <div class="pt-3 border-t border-slate-200/80 dark:border-zinc-700/80 space-y-3">
                                <div id="termsCardContainer" class="p-3 rounded-lg border border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 hover:border-slate-300 transition-all shadow-2xs">
                                    <label class="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-zinc-300">
                                        <input 
                                            type="checkbox" 
                                            name="accept_terms" 
                                            id="accept_terms"
                                            value="1" 
                                            onchange="if (this.checked) hideTermsRequiredToast();"
                                            class="mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 cursor-pointer shrink-0"
                                        >
                                        <span class="text-xs leading-relaxed text-slate-700 dark:text-zinc-300 select-none">
                                            Saya menyatakan telah meninjau isi dokumen ini dan menyetujui pembubuhan tanda tangan elektronik resmi sesuai ketentuan UU ITE.
                                        </span>
                                    </label>
                                </div>
                                @error('accept_terms')
                                    <p class="text-xs text-rose-600 font-semibold px-0.5">{{ $message }}</p>
                                @enderror

                                <!-- Action Buttons -->
                                <button 
                                    type="submit" 
                                    id="submitBtn"
                                    class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors text-xs font-bold tracking-wide uppercase cursor-pointer shadow-md shadow-blue-600/20"
                                >
                                    <span>Bubuhkan Tanda Tangan Resmi RPK</span>
                                </button>

                                <button 
                                    type="button" 
                                    onclick="switchTab(3)"
                                    class="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors text-xs font-medium cursor-pointer shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    <span>← Sesuaikan Posisi / TTD</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </form>

        <!-- Toast Notification: Persetujuan UU ITE Diperlukan -->
        <div id="termsRequiredToast" class="hidden fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/95 text-slate-900 shadow-xl shadow-slate-900/10 border border-amber-200/90 backdrop-blur-md max-w-sm animate-in fade-in slide-in-from-top-3 duration-200 dark:bg-[#181a20]/95 dark:text-white dark:border-amber-500/30">
            <div class="size-7 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/70 dark:border-amber-800/40 shadow-2xs">
                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                    <span class="font-bold text-xs text-slate-950 dark:text-white">Persetujuan Diperlukan</span>
                    <span class="text-[10px] font-mono text-slate-400 dark:text-zinc-500">· UU ITE</span>
                </div>
                <p class="text-[11px] text-slate-600 dark:text-zinc-400 leading-snug mt-0.5">
                    Centang kotak persetujuan dokumen sebelum membubuhkan tanda tangan.
                </p>
            </div>
            <button 
                type="button" 
                onclick="hideTermsRequiredToast()" 
                class="size-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Tutup"
            >
                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Toast Notification: Akses Navigasi Terkunci (White Minimalist Compact) -->
        <div id="navBlockedToast" class="hidden fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/95 text-slate-900 shadow-xl shadow-slate-900/10 border border-slate-200/90 backdrop-blur-md max-w-sm animate-in fade-in slide-in-from-top-3 duration-200 dark:bg-[#181a20]/95 dark:text-white dark:border-white/10">
            <div class="size-7 rounded-lg bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 flex items-center justify-center shrink-0 border border-slate-200 dark:border-zinc-700">
                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                    <span class="font-bold text-xs text-slate-950 dark:text-white">Verifikasi Identitas</span>
                    <span class="text-[10px] font-mono text-slate-400 dark:text-zinc-500">· Tab 1</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                    Klik <span class="font-semibold text-slate-800 dark:text-zinc-200">Mulai Tanda Tangan</span> terlebih dahulu
                </p>
            </div>
            <div class="flex items-center gap-1 shrink-0 pl-1">
                <button 
                    type="button" 
                    onclick="hideBlockedNavToast(); openProceedToStudioModal();" 
                    class="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors text-[11px] font-bold cursor-pointer shadow-2xs whitespace-nowrap"
                >
                    Mulai
                </button>
                <button 
                    type="button" 
                    onclick="hideBlockedNavToast()" 
                    class="size-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Tutup"
                >
                    <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </main>

    <!-- 5. Footer Minimalis Resmi -->
    <footer class="mt-auto border-t border-slate-200/80 bg-white/80 py-4.5 text-center text-xs text-slate-500 backdrop-blur-md transition-colors dark:border-white/[0.06] dark:bg-[#0f1115]/80 dark:text-zinc-400">
        <div class="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
            <div class="flex items-center gap-2.5 font-mono text-[11px]">
                <span class="font-extrabold text-slate-950 dark:text-zinc-100 uppercase tracking-wider font-sans">RPK LAW FIRM</span>
                <span class="text-slate-300 dark:text-zinc-700">·</span>
                <span class="text-slate-600 dark:text-zinc-400 font-sans">Integritas Kriptografis Terjamin (UU ITE No. 11/2008 &amp; No. 1/2024)</span>
            </div>
            <div class="flex items-center gap-3 font-mono text-[11px] text-slate-400 dark:text-zinc-500">
                <span>Ref: <span class="font-semibold text-slate-600 dark:text-zinc-400">{{ $signer->signatureRequest->verification_code }}</span></span>
                <span class="text-slate-300 dark:text-zinc-700">·</span>
                <span>Hak Cipta Dilindungi Undang-Undang</span>
            </div>
        </div>
    </footer>

    <!-- ========================================================================= -->
    <!-- ROOT-LEVEL MODALS: OUTSIDE MAIN TO GUARANTEE 100% FULL-VIEWPORT BACKDROP -->
    <!-- ========================================================================= -->

    <!-- Modal 1: Konfirmasi Telaah Dokumen & Identitas (Lanjut ke Studio TTD) -->
    <div id="proceedToStudioModal" class="hidden fixed inset-0 z-[100] w-screen h-screen min-h-screen min-w-full overflow-y-auto bg-slate-950/75 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center transition-all">
        <div class="relative w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xl dark:border-zinc-800 dark:bg-[#15181e] space-y-5 my-auto animate-in fade-in zoom-in-95 duration-150">
            <!-- Modal Header -->
            <div class="flex items-start gap-3.5">
                <div class="size-10 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-white/10">
                    <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <div class="space-y-1">
                    <h3 class="text-sm sm:text-base font-bold text-slate-950 dark:text-white leading-tight">
                        Konfirmasi Telaah Dokumen &amp; Identitas
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                        Pastikan Anda telah menelaah seluruh draf dokumen hukum ini dan mengonfirmasi bahwa data identitas pihak penandatangan di bawah sudah sesuai sebelum membubuhkan tanda tangan.
                    </p>
                </div>
            </div>

            <!-- Summary Details Card -->
            <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs dark:border-white/[0.06] dark:bg-zinc-900/50 space-y-2.5">
                <div class="flex items-start justify-between gap-3 text-xs">
                    <span class="text-slate-500 dark:text-zinc-400 shrink-0">Dokumen:</span>
                    <span class="font-semibold text-slate-900 dark:text-white text-right leading-snug">{{ $officialDocTitle }}</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500 dark:text-zinc-400">Nomor Perkara:</span>
                    <span class="font-mono font-semibold text-slate-800 dark:text-zinc-200">{{ $signer->signatureRequest->document->matter?->matter_number ?? 'RPK-2026-0001' }}</span>
                </div>
                <div class="h-px bg-slate-200/70 dark:bg-white/[0.06]"></div>
                <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500 dark:text-zinc-400">Penandatangan:</span>
                    <span id="proceedModalSignerName" class="font-bold text-slate-900 dark:text-white">{{ $signer->name }}</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500 dark:text-zinc-400">Jabatan / Kapasitas:</span>
                    <span id="proceedModalSignerTitle" class="text-slate-700 dark:text-zinc-300 font-medium">{{ $signer->title ?: '-' }}</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500 dark:text-zinc-400">Email:</span>
                    <span class="font-mono text-slate-700 dark:text-zinc-300">{{ $signer->email }}</span>
                </div>
            </div>

            <!-- Info Guidance -->
            <div class="rounded-xl border border-slate-200/60 bg-slate-50/60 p-3 text-xs text-slate-600 dark:border-white/[0.06] dark:bg-zinc-900/40 dark:text-zinc-400 flex items-start gap-2.5">
                <svg class="size-4 text-slate-400 dark:text-zinc-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="leading-relaxed text-[11.5px]">
                    Setelah konfirmasi, Anda akan diarahkan ke tahap Spesimen Tanda Tangan Resmi untuk membubuhkan goresan tanda tangan atau memilih pengesahan QR Barcode resmi.
                </span>
            </div>

            <!-- Action Buttons (Blue Primary) -->
            <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-1">
                <button 
                    type="button" 
                    onclick="closeProceedToStudioModal()"
                    class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors text-xs font-semibold cursor-pointer dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                    Periksa Kembali Dokumen
                </button>
                <button 
                    type="button" 
                    onclick="confirmProceedToStudio()"
                    class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors text-xs font-semibold cursor-pointer shadow-xs shadow-blue-600/20 flex items-center justify-center gap-1.5"
                >
                    <span>Mulai Tanda Tangan</span>
                    <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Modal 2: Konfirmasi Lewati Tanda Tangan (Barcode QR Saja) -->
    <div id="skipSignatureModal" class="hidden fixed inset-0 z-[100] w-screen h-screen min-h-screen min-w-full overflow-y-auto bg-slate-950/75 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center transition-all">
        <div class="relative w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-[#15181e] space-y-4 my-auto animate-in fade-in zoom-in-95 duration-150">
            <div class="flex items-start gap-3.5">
                <div class="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
                    <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                </div>
                <div class="space-y-1">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        Sahkan Dokumen dengan Barcode QR Saja?
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                        Anda akan melewati pembuatan goresan tanda tangan basah. Dokumen resmi akan disahkan secara digital menggunakan Barcode QR Kriptografis resmi RPK Law Firm.
                    </p>
                </div>
            </div>

            <div class="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs text-slate-600 dark:border-white/[0.06] dark:bg-zinc-900/60 dark:text-zinc-300 space-y-2">
                <div class="flex items-center gap-2 text-[11px] font-semibold text-slate-800 dark:text-zinc-200">
                    <svg class="size-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ketetapan Hukum UU ITE No. 11/2008 &amp; No. 1/2024</span>
                </div>
                <ul class="text-[11px] space-y-1.5 text-slate-500 dark:text-zinc-400 list-disc list-inside">
                    <li>Stempel pengesahan pada dokumen akan menampilkan Barcode QR verifikasi resmi terpusat.</li>
                    <li>Nama lengkap dan jejak audit digital tetap tersemat secara permanen.</li>
                    <li>Pilihan ini dapat diubah kembali ke goresan tanda tangan kapan saja sebelum pembubuhan akhir.</li>
                </ul>
            </div>

            <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-1">
                <button 
                    type="button" 
                    onclick="closeSkipSignatureModal()"
                    class="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors text-xs font-semibold cursor-pointer dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                >
                    Batal &amp; Buat Tanda Tangan
                </button>
                <button 
                    type="button" 
                    onclick="confirmSkipSignatureToQr()"
                    class="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors text-xs font-semibold cursor-pointer shadow-xs shadow-blue-600/20"
                >
                    Ya, Sahkan dengan Barcode QR Saja
                </button>
            </div>
        </div>
    </div>

    <!-- Modal 3: Konfirmasi Tata Letak & Keamanan Penempatan (Lanjut ke Konfirmasi Akhir) -->
    <div id="proceedToConfirmModal" class="hidden fixed inset-0 z-[100] w-screen h-screen min-h-screen min-w-full overflow-y-auto bg-slate-950/75 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center transition-all">
        <div class="relative w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xl dark:border-zinc-800 dark:bg-[#15181e] space-y-5 my-auto animate-in fade-in zoom-in-95 duration-150">
            <!-- Modal Header -->
            <div class="flex items-start gap-3.5">
                <div class="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
                    <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
                <div class="space-y-1">
                    <h3 class="text-sm sm:text-base font-bold text-slate-950 dark:text-white leading-tight">
                        Konfirmasi Penempatan Stempel &amp; Dokumen
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                        Pastikan posisi stempel tanda tangan dan segel barcode QR sudah aman, tepat, dan tidak menutupi isi materi hukum dokumen sebelum melanjutkan ke tahap pengesahan akhir.
                    </p>
                </div>
            </div>

            <!-- Summary Details Card -->
            <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs dark:border-white/[0.06] dark:bg-zinc-900/50 space-y-2.5">
                <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500 dark:text-zinc-400">Halaman Penempatan:</span>
                    <span id="confirmModalTargetPage" class="font-bold text-slate-900 dark:text-white">Halaman 1</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500 dark:text-zinc-400">Metode Pengesahan:</span>
                    <span id="confirmModalMethod" class="font-semibold text-slate-800 dark:text-zinc-200">Spesimen Tanda Tangan &amp; Barcode QR Resmi</span>
                </div>
                <div class="h-px bg-slate-200/70 dark:bg-white/[0.06]"></div>
                <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500 dark:text-zinc-400">Integritas Koordinat:</span>
                    <span class="font-mono text-slate-700 dark:text-zinc-300">Posisi &amp; Skala Terkunci</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500 dark:text-zinc-400">Status Keabsahan:</span>
                    <span class="font-medium text-slate-900 dark:text-zinc-200">Siap Diterbitkan Sertifikat Elektronik</span>
                </div>
            </div>

            <!-- Info Guidance -->
            <div class="rounded-xl border border-slate-200/60 bg-slate-50/60 p-3 text-xs text-slate-600 dark:border-white/[0.06] dark:bg-zinc-900/40 dark:text-zinc-400 flex items-start gap-2.5">
                <svg class="size-4 text-slate-400 dark:text-zinc-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="leading-relaxed text-[11.5px]">
                    Setelah konfirmasi, Anda akan diarahkan ke tahap Pernyataan &amp; Pengesahan untuk menelaah pratinjau final dan menandatangani dokumen secara resmi.
                </span>
            </div>

            <!-- Action Buttons (Blue Primary) -->
            <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-1">
                <button 
                    type="button" 
                    onclick="closeProceedToConfirmModal()"
                    class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors text-xs font-semibold cursor-pointer dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                    Periksa Kembali Posisi
                </button>
                <button 
                    type="button" 
                    onclick="confirmProceedToFinalStep()"
                    class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors text-xs font-semibold cursor-pointer shadow-xs shadow-blue-600/20 flex items-center justify-center gap-1.5"
                >
                    <span>Lanjutkan ke Konfirmasi Akhir</span>
                    <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- ========================================================================= -->
    <!-- SCRIPT LOGIC: TAB WIZARD, HIGH-DPI CANVAS, TRIMMING & PDF PLACEMENT -->
    <!-- ========================================================================= -->
    <script>
        // State Machine
        let activeTab = 1;
        let pdfDoc = null;
        let currentPage = 1;
        let totalPages = 1;
        let currentZoomScale = 1.0;
        let currentPdfViewport = null;
        let currentPdfPageUnscaledWidth = 595.28;
        let currentPdfPageUnscaledHeight = 841.89;

        // Stamp Parameters
        let baseStampWidthMm = 50;
        let baseStampHeightMm = 22;
        let currentScaleRatio = 1.0;
        let currentStampWidthMm = 50;
        let currentStampHeightMm = 22;
        let showQrCode = {{ ($signer->show_qr ?? true) ? 'true' : 'false' }};
        let showSignerName = false;
        let showSignerTitle = false;
        let showStampBorder = false;
        let currentStampLayout = '{{ $initialStampLayout }}';
        let isQrOnly = {{ ($signer->stamp_layout === 'qr_only') ? 'true' : 'false' }};
        let isIdentityVerified = false;
        let isLayoutConfirmed = false;
        let blockedToastTimeout = null;
        let termsToastTimeout = null;

        // Studio Signature Pad
        const studioCanvas = document.getElementById('studioSignatureCanvas');
        let studioPad = null;
        let strokeColor = '#1e3a8a';
        let hasDrawnSignature = false;
        let trimmedSignatureDataUrl = '';

        // Signature Instrument Settings (Pensil Presisi, Pena Dokumen, Pena Kaligrafi)
        const SIGNATURE_TOOLS = {
            pencil: {
                minWidth: 0.8,
                maxWidth: 1.4,
                velocityFilterWeight: 0.85,
                name: 'Pensil Presisi'
            },
            pen: {
                minWidth: 1.5,
                maxWidth: 2.8,
                velocityFilterWeight: 0.7,
                name: 'Pena Dokumen Resmi'
            },
            calligraphy: {
                minWidth: 2.0,
                maxWidth: 4.2,
                velocityFilterWeight: 0.5,
                name: 'Pena Kaligrafi / Basah'
            }
        };
        let currentSignatureTool = 'pen';

        // Tab Navigation Controller
        function switchTab(targetTab) {
            // Guard: Cannot go to Tab 2 without valid name
            if (targetTab > 1) {
                const nameVal = document.getElementById('accepted_name').value.trim();
                if (!nameVal) {
                    alert('Silakan masukkan nama lengkap penandatangan terlebih dahulu.');
                    document.getElementById('accepted_name').focus();
                    return;
                }
            }

            // Guard: Cannot go to Tab 3 or 4 without signature unless in QR-only mode
            if (targetTab > 2 && !isQrOnly) {
                if (!hasDrawnSignature || !trimmedSignatureDataUrl) {
                    openSkipSignatureModal();
                    return;
                }
            }

            activeTab = targetTab;

            // Hide all tab panels
            document.getElementById('tabPanel1').classList.add('hidden');
            document.getElementById('tabPanel2').classList.add('hidden');
            document.getElementById('tabPanel3').classList.add('hidden');
            document.getElementById('tabPanel4').classList.add('hidden');

            // Show active panel
            document.getElementById(`tabPanel${targetTab}`).classList.remove('hidden');

            // Update tab button styles
            updateTabNavStyles();

            // Post-switch tab specific initialization
            if (targetTab === 1) {
                renderPdfToCanvas('tab1PdfCanvas', 'tab1PageWrapper', 'tab1LoadingSpinner');
            } else if (targetTab === 2) {
                requestAnimationFrame(() => {
                    requestAnimationFrame(initStudioPad);
                });
            } else if (targetTab === 3) {
                renderPdfToCanvas('tab3PdfCanvas', 'tab3PageWrapper', 'tab3LoadingSpinner');
                updateStampPreviewDisplay();
                recalculateStampPixelDimensions();
                updatePlacementDisplay();
            } else if (targetTab === 4) {
                renderTab4FinalProof();
            }
        }

        function validateAndGoToTab(targetTab) {
            if (targetTab === 2) {
                openProceedToStudioModal();
                return;
            }
            if (targetTab === 3 && !isQrOnly && (!hasDrawnSignature || !trimmedSignatureDataUrl)) {
                openSkipSignatureModal();
                return;
            }
            if (targetTab === 4) {
                openProceedToConfirmModal();
                return;
            }
            switchTab(targetTab);
        }

        function onStepNavClick(targetTab) {
            if (targetTab === 1) {
                switchTab(1);
                return;
            }

            // Guard: Cannot access Tab 2, 3, or 4 if identity has not been verified via "Mulai Tanda Tangan"
            if (!isIdentityVerified) {
                showBlockedNavNotice();
                return;
            }

            if (targetTab > 2 && !isQrOnly && (!hasDrawnSignature || !trimmedSignatureDataUrl)) {
                openSkipSignatureModal();
                return;
            }

            // Guard: Cannot jump directly to Tab 4 without confirming via "Lanjutkan ke Konfirmasi Akhir"
            if (targetTab === 4 && !isLayoutConfirmed) {
                if (activeTab === 3) {
                    openProceedToConfirmModal();
                } else {
                    switchTab(3);
                }
                return;
            }

            switchTab(targetTab);
        }

        function showBlockedNavNotice() {
            const toast = document.getElementById('navBlockedToast');
            const startBtn = document.getElementById('btnStartSigning');

            if (toast) {
                toast.classList.remove('hidden');
                if (blockedToastTimeout) clearTimeout(blockedToastTimeout);
                blockedToastTimeout = setTimeout(() => {
                    toast.classList.add('hidden');
                }, 4500);
            }

            if (startBtn) {
                startBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                startBtn.classList.add('ring-2', 'ring-slate-900', 'ring-offset-2', 'dark:ring-white');
                setTimeout(() => {
                    startBtn.classList.remove('ring-2', 'ring-slate-900', 'ring-offset-2', 'dark:ring-white');
                }, 2200);
            }
        }

        function hideBlockedNavToast() {
            const toast = document.getElementById('navBlockedToast');
            if (toast) toast.classList.add('hidden');
        }

        function showTermsRequiredToast() {
            const toast = document.getElementById('termsRequiredToast');
            if (toast) {
                toast.classList.remove('hidden');
                if (termsToastTimeout) clearTimeout(termsToastTimeout);
                termsToastTimeout = setTimeout(() => {
                    toast.classList.add('hidden');
                }, 5000);
            }
            const termsCard = document.getElementById('termsCardContainer');
            if (termsCard) {
                termsCard.classList.add('ring-2', 'ring-amber-500', 'border-amber-300', 'bg-amber-50/50');
                setTimeout(() => {
                    termsCard.classList.remove('ring-2', 'ring-amber-500', 'border-amber-300', 'bg-amber-50/50');
                }, 3000);
                termsCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            const termsInput = document.getElementById('accept_terms');
            if (termsInput) termsInput.focus();
        }

        function hideTermsRequiredToast() {
            const toast = document.getElementById('termsRequiredToast');
            if (toast) toast.classList.add('hidden');
            if (termsToastTimeout) clearTimeout(termsToastTimeout);
            const termsCard = document.getElementById('termsCardContainer');
            if (termsCard) {
                termsCard.classList.remove('ring-2', 'ring-amber-500', 'border-amber-300', 'bg-amber-50/50');
            }
        }

        // Proceed to Studio Signature Confirmation Modal Controllers
        function openProceedToStudioModal() {
            const nameInput = document.getElementById('accepted_name');
            const titleInput = document.getElementById('signer_title') || document.getElementById('accepted_title');
            const nameVal = nameInput ? nameInput.value.trim() : '';
            const titleVal = titleInput ? titleInput.value.trim() : '';

            if (!nameVal) {
                alert('Silakan masukkan nama lengkap penandatangan terlebih dahulu.');
                if (nameInput) nameInput.focus();
                return;
            }

            const modalName = document.getElementById('proceedModalSignerName');
            const modalTitle = document.getElementById('proceedModalSignerTitle');
            if (modalName) modalName.textContent = nameVal;
            if (modalTitle) modalTitle.textContent = titleVal || '-';

            const modal = document.getElementById('proceedToStudioModal');
            if (modal) {
                modal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
            }
        }

        function closeProceedToStudioModal() {
            const modal = document.getElementById('proceedToStudioModal');
            if (modal) {
                modal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        }

        function confirmProceedToStudio() {
            isIdentityVerified = true;
            closeProceedToStudioModal();
            switchTab(2);
        }

        function updateTabNavStyles() {
            for (let i = 1; i <= 4; i++) {
                const navBtn = document.getElementById(`stepNav${i}`);
                if (!navBtn) continue;
                const badge = navBtn.querySelector('.step-badge');
                const title = navBtn.querySelector('.step-title');
                const subtitle = navBtn.querySelector('.step-subtitle');
                const stepNum = '0' + i;

                if (i === activeTab) {
                    // Active Step: Cool Slate Grey / Titanium (Abu-abu berkelas, tidak hitam pekat, tidak biru)
                    navBtn.className = 'group relative flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition-all duration-200 text-left border-slate-500/80 bg-slate-600 text-white shadow-md shadow-slate-600/20 cursor-pointer dark:border-zinc-500 dark:bg-zinc-700 dark:shadow-zinc-900/30';
                    navBtn.removeAttribute('title');
                    if (badge) {
                        badge.className = 'step-badge size-7.5 rounded-xl bg-white/20 text-white font-mono text-xs font-black flex items-center justify-center shrink-0 border border-white/30 backdrop-blur-xs shadow-2xs';
                        badge.textContent = stepNum;
                    }
                    if (title) title.className = 'step-title block text-xs sm:text-[12.5px] font-bold text-white leading-tight truncate';
                    if (subtitle) subtitle.className = 'step-subtitle block text-[10px] sm:text-[10.5px] text-slate-200/90 leading-tight font-normal mt-0.5 truncate';
                } else if (i === 1 || (i === 2 && isIdentityVerified) || (i === 3 && isIdentityVerified && (hasDrawnSignature || isQrOnly)) || (i === 4 && isIdentityVerified && (hasDrawnSignature || isQrOnly) && isLayoutConfirmed)) {
                    // Unlocked / Completed Step: Crisp white surface, soft border, dark text, hover lift
                    navBtn.className = 'group relative flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition-all duration-200 text-left border-slate-200/90 bg-white hover:bg-slate-50/90 hover:border-slate-300 text-slate-800 shadow-2xs cursor-pointer dark:border-white/10 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:bg-zinc-800/80';
                    navBtn.removeAttribute('title');
                    if (badge) {
                        if (i < activeTab) {
                            badge.className = 'step-badge size-7.5 rounded-xl bg-slate-100 text-slate-800 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700';
                            badge.innerHTML = '<svg class="size-3.5 text-slate-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>';
                        } else {
                            badge.className = 'step-badge size-7.5 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
                            badge.textContent = stepNum;
                        }
                    }
                    if (title) title.className = 'step-title block text-xs sm:text-[12.5px] font-semibold text-slate-900 dark:text-white leading-tight truncate';
                    if (subtitle) subtitle.className = 'step-subtitle block text-[10px] sm:text-[10.5px] text-slate-500 dark:text-zinc-400 leading-tight font-normal mt-0.5 truncate';
                } else {
                    // Locked Step: Muted, disabled look
                    navBtn.className = 'group relative flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition-all duration-200 text-left border-transparent bg-slate-100/40 text-slate-400 opacity-60 cursor-not-allowed dark:bg-zinc-900/30 dark:text-zinc-600';
                    navBtn.title = 'Selesaikan langkah sebelumnya terlebih dahulu';
                    if (badge) {
                        badge.className = 'step-badge size-7.5 rounded-xl bg-slate-200/60 text-slate-400 font-mono text-xs font-medium flex items-center justify-center shrink-0 dark:bg-zinc-800/50 dark:text-zinc-600';
                        badge.textContent = stepNum;
                    }
                    if (title) title.className = 'step-title block text-xs sm:text-[12.5px] font-medium text-slate-500 dark:text-zinc-500 leading-tight truncate';
                    if (subtitle) subtitle.className = 'step-subtitle block text-[10px] sm:text-[10.5px] text-slate-400/80 dark:text-zinc-600 leading-tight font-normal mt-0.5 truncate';
                }
            }
        }

        // Reset verified state if user edits identity details
        document.getElementById('accepted_name')?.addEventListener('input', () => {
            isIdentityVerified = false;
            updateTabNavStyles();
        });
        document.getElementById('signer_title')?.addEventListener('input', () => {
            isIdentityVerified = false;
            updateTabNavStyles();
        });

        // 1. Studio Signature Pad Initialization & Precision Trimming
        function initStudioPad() {
            if (!studioCanvas) return;
            const rect = studioCanvas.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) {
                requestAnimationFrame(initStudioPad);
                return;
            }

            // Use exact devicePixelRatio and scale 2d context for 1:1 stylus/pointer alignment
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            const targetWidth = Math.round(rect.width * ratio);
            const targetHeight = Math.round(rect.height * ratio);

            let existingData = null;
            if (studioPad && !studioPad.isEmpty()) {
                existingData = studioPad.toData();
            }

            if (studioCanvas.width !== targetWidth || studioCanvas.height !== targetHeight || !studioPad) {
                studioCanvas.width = targetWidth;
                studioCanvas.height = targetHeight;
                const ctx = studioCanvas.getContext('2d');
                ctx.scale(ratio, ratio);

                if (window.SignaturePad) {
                    if (studioPad) {
                        studioPad.off();
                    }
                    const activeTool = SIGNATURE_TOOLS[currentSignatureTool] || SIGNATURE_TOOLS.pen;
                    studioPad = new SignaturePad(studioCanvas, {
                        minWidth: activeTool.minWidth,
                        maxWidth: activeTool.maxWidth,
                        penColor: strokeColor,
                        velocityFilterWeight: activeTool.velocityFilterWeight,
                    });

                    if (existingData && existingData.length > 0) {
                        studioPad.fromData(existingData);
                        hasDrawnSignature = true;
                        document.getElementById('studioCanvasPlaceholder').style.display = 'none';
                        updateDrawnStatus(true);
                    }

                    studioPad.addEventListener('beginStroke', function() {
                        const wasQrOnly = isQrOnly;
                        isQrOnly = false;
                        if (currentStampLayout === 'qr_only') {
                            const pQr = document.getElementById('placementQr');
                            const pX = pQr ? parseFloat(pQr.style.left) || 82 : 82;
                            const pY = pQr ? parseFloat(pQr.style.top) || 75 : 75;
                            currentStampLayout = `custom_${pX.toFixed(1)}_${pY.toFixed(1)}`;
                            document.getElementById('stampLayoutInput').value = currentStampLayout;
                        }
                        if (wasQrOnly) {
                            updateStampPreviewDisplay();
                        }
                        document.getElementById('studioCanvasPlaceholder').style.display = 'none';
                    });

                    studioPad.addEventListener('endStroke', function() {
                        hasDrawnSignature = !studioPad.isEmpty();
                        document.getElementById('studioCanvasPlaceholder').style.display = hasDrawnSignature ? 'none' : 'flex';
                        updateDrawnStatus(hasDrawnSignature);
                        if (hasDrawnSignature) {
                            captureTrimmedSignature();
                        }
                    });
                }
            }
        }

        // Undo Last Stroke (Cmd+Z / Ctrl+Z)
        function undoSignaturePad() {
            if (!studioPad) return;
            const data = studioPad.toData();
            if (data && data.length > 0) {
                data.pop();
                studioPad.fromData(data);
                if (data.length === 0) {
                    hasDrawnSignature = false;
                    trimmedSignatureDataUrl = '';
                    document.getElementById('signatureDataInput').value = '';
                    document.getElementById('studioCanvasPlaceholder').style.display = 'flex';
                    document.getElementById('stampSignatureImg').src = '';
                    updateDrawnStatus(false);
                } else {
                    hasDrawnSignature = true;
                    document.getElementById('studioCanvasPlaceholder').style.display = 'none';
                    updateDrawnStatus(true);
                    captureTrimmedSignature();
                }
            }
        }

        // Global Keydown Listener for Cmd+Z / Ctrl+Z & Modal Escape
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeProceedToStudioModal();
                closeSkipSignatureModal();
                closeProceedToConfirmModal();
                return;
            }
            if (activeTab === 2) {
                if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
                    const targetTag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
                    if (targetTag === 'input' || targetTag === 'textarea') return;
                    e.preventDefault();
                    undoSignaturePad();
                }
            }
        });

        // Skip Signature (Barcode QR Only) Modal Controllers
        function openSkipSignatureModal() {
            const modal = document.getElementById('skipSignatureModal');
            if (modal) {
                modal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
            }
        }

        function closeSkipSignatureModal() {
            const modal = document.getElementById('skipSignatureModal');
            if (modal) {
                modal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        }

        // Proceed to Confirm (Tab 3 to Tab 4) Modal Controllers
        function openProceedToConfirmModal() {
            const pageSpan = document.getElementById('confirmModalTargetPage');
            const methodSpan = document.getElementById('confirmModalMethod');
            const targetPage = document.getElementById('inputPageNumber')?.value || currentPage || 1;
            const total = totalPages || 1;

            if (pageSpan) {
                pageSpan.textContent = `Halaman ${targetPage} dari ${total}`;
            }

            if (methodSpan) {
                methodSpan.textContent = isQrOnly 
                    ? 'Barcode QR Kriptografis Saja (Tanpa TTD Basah)' 
                    : 'Spesimen Tanda Tangan & Barcode QR Resmi';
            }

            const modal = document.getElementById('proceedToConfirmModal');
            if (modal) {
                modal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
            }
        }

        function closeProceedToConfirmModal() {
            const modal = document.getElementById('proceedToConfirmModal');
            if (modal) {
                modal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        }

        function confirmProceedToFinalStep() {
            isLayoutConfirmed = true;
            closeProceedToConfirmModal();
            updateTabNavStyles();
            switchTab(4);
        }

        // Close modals on clicking outside the card (backdrop click)
        document.getElementById('proceedToStudioModal')?.addEventListener('click', function(e) {
            if (e.target === this) {
                closeProceedToStudioModal();
            }
        });

        document.getElementById('skipSignatureModal')?.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSkipSignatureModal();
            }
        });

        document.getElementById('proceedToConfirmModal')?.addEventListener('click', function(e) {
            if (e.target === this) {
                closeProceedToConfirmModal();
            }
        });

        function confirmSkipSignatureToQr() {
            isQrOnly = true;
            currentStampLayout = 'qr_only';
            document.getElementById('stampLayoutInput').value = 'qr_only';
            showQrCode = true;
            document.getElementById('inputShowQr').value = '1';

            if (studioPad) {
                studioPad.clear();
            }
            hasDrawnSignature = false;
            trimmedSignatureDataUrl = '';
            document.getElementById('signatureDataInput').value = '';
            document.getElementById('stampSignatureImg').src = '';

            closeSkipSignatureModal();
            updateStampPreviewDisplay();
            switchTab(3);
        }

        function cancelQrOnlyAndReturnToCanvas() {
            isQrOnly = false;
            const pQr = document.getElementById('placementQr');
            const pX = pQr ? parseFloat(pQr.style.left) || 82 : 82;
            const pY = pQr ? parseFloat(pQr.style.top) || 75 : 75;
            currentStampLayout = `custom_${pX.toFixed(1)}_${pY.toFixed(1)}`;
            document.getElementById('stampLayoutInput').value = currentStampLayout;
            updateStampPreviewDisplay();
            switchTab(2);
        }

        function setSignatureTool(toolKey) {
            if (!SIGNATURE_TOOLS[toolKey]) return;
            currentSignatureTool = toolKey;
            const tool = SIGNATURE_TOOLS[toolKey];

            if (studioPad) {
                studioPad.minWidth = tool.minWidth;
                studioPad.maxWidth = tool.maxWidth;
                studioPad.velocityFilterWeight = tool.velocityFilterWeight;
            }

            const tools = ['pencil', 'pen', 'calligraphy'];
            tools.forEach(key => {
                const btn = document.getElementById('tool' + key.charAt(0).toUpperCase() + key.slice(1));
                if (!btn) return;
                if (key === toolKey) {
                    btn.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-slate-900 shadow-2xs cursor-pointer dark:bg-zinc-700 dark:text-white transition-all';
                } else {
                    btn.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 transition-all cursor-pointer dark:text-zinc-400 dark:hover:text-white';
                }
            });
        }

        function setPenColor(color) {
            strokeColor = color;
            if (studioPad) {
                studioPad.penColor = color;
            }
            document.getElementById('btnColorBlue').className = 'size-5 rounded-full bg-blue-900 transition-all cursor-pointer ' + (color === '#1e3a8a' ? 'ring-2 ring-slate-900 ring-offset-2 dark:ring-white' : '');
            document.getElementById('btnColorNavy').className = 'size-5 rounded-full bg-slate-900 transition-all cursor-pointer ' + (color === '#0f172a' ? 'ring-2 ring-slate-900 ring-offset-2 dark:ring-white' : '');
            document.getElementById('btnColorBlack').className = 'size-5 rounded-full bg-black transition-all cursor-pointer ' + (color === '#000000' ? 'ring-2 ring-slate-900 ring-offset-2 dark:ring-white' : '');

            if (hasDrawnSignature) {
                captureTrimmedSignature();
            }
        }

        function clearSignaturePad() {
            if (studioPad) {
                studioPad.clear();
            }
            hasDrawnSignature = false;
            trimmedSignatureDataUrl = '';
            document.getElementById('signatureDataInput').value = '';
            document.getElementById('studioCanvasPlaceholder').style.display = 'flex';
            document.getElementById('stampSignatureImg').src = '';
            updateDrawnStatus(false);
        }

        function updateDrawnStatus(isDrawn) {
            const txt = document.getElementById('signatureDrawnStatus');
            const iconEmpty = document.getElementById('signatureStatusIconEmpty');
            const iconDrawn = document.getElementById('signatureStatusIconDrawn');
            const bar = document.getElementById('signatureStatusBar');
            if (!txt) return;

            if (isDrawn) {
                txt.innerText = 'Goresan tanda tangan terdeteksi dan tersimpan rapi';
                txt.className = 'font-medium text-slate-900 dark:text-white';
                if (iconEmpty) iconEmpty.classList.add('hidden');
                if (iconDrawn) iconDrawn.classList.remove('hidden');
                if (bar) {
                    bar.className = 'flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg border border-slate-300/90 bg-white text-xs transition-colors shadow-2xs dark:border-zinc-700 dark:bg-zinc-900/80';
                }
            } else {
                txt.innerText = 'Belum ada goresan tanda tangan';
                txt.className = 'font-medium text-slate-500 dark:text-zinc-400';
                if (iconEmpty) iconEmpty.classList.remove('hidden');
                if (iconDrawn) iconDrawn.classList.add('hidden');
                if (bar) {
                    bar.className = 'flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg border border-slate-200/80 bg-white/70 text-xs transition-colors dark:border-zinc-800 dark:bg-zinc-900/50';
                }
            }
        }

        // Auto-Trim Transparent Bounding Box to eliminate zoom/stretching
        function captureTrimmedSignature() {
            if (!studioCanvas || !hasDrawnSignature) return;

            const ctx = studioCanvas.getContext('2d');
            const width = studioCanvas.width;
            const height = studioCanvas.height;
            const imgData = ctx.getImageData(0, 0, width, height).data;

            let minX = width, minY = height, maxX = 0, maxY = 0;
            let found = false;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const alpha = imgData[(y * width + x) * 4 + 3];
                    if (alpha > 15) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                        found = true;
                    }
                }
            }

            if (!found) {
                trimmedSignatureDataUrl = '';
                document.getElementById('signatureDataInput').value = '';
                return;
            }

            // Balanced margin around signature
            const padding = Math.max(12, Math.round(width * 0.02));
            const cropX = Math.max(0, minX - padding);
            const cropY = Math.max(0, minY - padding);
            const cropWidth = Math.min(width - cropX, (maxX - minX) + (padding * 2));
            const cropHeight = Math.min(height - cropY, (maxY - minY) + (padding * 2));

            const trimmedCanvas = document.createElement('canvas');
            trimmedCanvas.width = cropWidth;
            trimmedCanvas.height = cropHeight;
            const tCtx = trimmedCanvas.getContext('2d');
            tCtx.drawImage(studioCanvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

            trimmedSignatureDataUrl = trimmedCanvas.toDataURL('image/png');
            document.getElementById('signatureDataInput').value = trimmedSignatureDataUrl;
            document.getElementById('stampSignatureImg').src = trimmedSignatureDataUrl;
        }

        // 2. PDF.js Engine & Viewports
        const pdfUrl = "{{ route('signature.sign.pdf', $signer->signing_token) }}";

        if (window.pdfjsLib) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf) {
                pdfDoc = pdf;
                totalPages = pdf.numPages;
                currentPage = totalPages; // Default to last page for signature
                
                document.querySelectorAll('.displayTotalPages').forEach(el => el.innerText = totalPages);
                document.querySelectorAll('.displayCurrentPage').forEach(el => el.innerText = currentPage);
                document.getElementById('inputPageNumber').value = currentPage;
                document.getElementById('displayPage').innerText = currentPage;
                document.getElementById('tab4TargetPageDisplay').innerText = currentPage;

                renderPdfToCanvas('tab1PdfCanvas', 'tab1PageWrapper', 'tab1LoadingSpinner');
            }).catch(function(err) {
                console.warn('PDF load warning / fallback:', err);
                renderFallbackDocument();
            });
        } else {
            renderFallbackDocument();
        }

        function renderPdfToCanvas(canvasId, wrapperId, spinnerId) {
            const canvasEl = document.getElementById(canvasId);
            const wrapperEl = document.getElementById(wrapperId);
            const spinnerEl = document.getElementById(spinnerId);
            if (!canvasEl || !wrapperEl) return;

            if (spinnerEl) spinnerEl.classList.remove('hidden');

            if (!pdfDoc) {
                renderFallbackDocument();
                return;
            }

            pdfDoc.getPage(currentPage).then(function(page) {
                const containerEl = canvasEl.closest('.custom-scroll') || document.body;
                const containerWidth = Math.min(840, containerEl.clientWidth - 48);
                const unscaledViewport = page.getViewport({ scale: 1 });
                currentPdfPageUnscaledWidth = unscaledViewport.width;
                currentPdfPageUnscaledHeight = unscaledViewport.height;

                const baseScale = Math.max(0.5, containerWidth / unscaledViewport.width);
                const finalScale = baseScale * currentZoomScale;
                const viewport = page.getViewport({ scale: finalScale });
                currentPdfViewport = viewport;

                const dpr = Math.max(window.devicePixelRatio || 1, 1.5);
                canvasEl.height = Math.round(viewport.height * dpr);
                canvasEl.width = Math.round(viewport.width * dpr);
                canvasEl.style.width = viewport.width + 'px';
                canvasEl.style.height = viewport.height + 'px';

                wrapperEl.style.width = viewport.width + 'px';
                wrapperEl.style.height = viewport.height + 'px';

                const ctx = canvasEl.getContext('2d');
                const renderContext = {
                    canvasContext: ctx,
                    transform: [dpr, 0, 0, dpr, 0, 0],
                    viewport: viewport
                };

                page.render(renderContext).promise.then(function() {
                    if (spinnerEl) spinnerEl.classList.add('hidden');
                    if (canvasId === 'tab3PdfCanvas') {
                        recalculateStampPixelDimensions();
                        updatePlacementDisplay();
                    }
                });

                document.querySelectorAll('.displayCurrentPage').forEach(el => el.innerText = currentPage);
                document.getElementById('inputPageNumber').value = currentPage;
                document.getElementById('displayPage').innerText = currentPage;
                document.getElementById('tab4TargetPageDisplay').innerText = currentPage;
            });
        }

        function renderFallbackDocument() {
            document.querySelectorAll('#tab1LoadingSpinner, #tab3LoadingSpinner').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.displayTotalPages').forEach(el => el.innerText = '1');
            document.querySelectorAll('.displayCurrentPage').forEach(el => el.innerText = '1');
        }

        function prevPage() {
            if (currentPage <= 1) return;
            currentPage--;
            if (activeTab === 3) {
                isLayoutConfirmed = false;
                updateTabNavStyles();
            }
            refreshActivePageViewports();
        }

        function nextPage() {
            if (currentPage >= totalPages) return;
            currentPage++;
            if (activeTab === 3) {
                isLayoutConfirmed = false;
                updateTabNavStyles();
            }
            refreshActivePageViewports();
        }

        function refreshActivePageViewports() {
            if (activeTab === 1) {
                renderPdfToCanvas('tab1PdfCanvas', 'tab1PageWrapper', 'tab1LoadingSpinner');
            } else if (activeTab === 3) {
                renderPdfToCanvas('tab3PdfCanvas', 'tab3PageWrapper', 'tab3LoadingSpinner');
            }
        }

        function changeZoom(delta) {
            currentZoomScale = Math.max(0.6, Math.min(1.8, +(currentZoomScale + delta).toFixed(2)));
            document.querySelectorAll('.zoomDisplay').forEach(el => el.innerText = Math.round(currentZoomScale * 100) + '%');
            refreshActivePageViewports();
        }

        function resetZoom() {
            currentZoomScale = 1.0;
            document.querySelectorAll('.zoomDisplay').forEach(el => el.innerText = '100%');
            refreshActivePageViewports();
        }

        // 3. Stamp Sizing & Coordinates
        function updatePlacementCoordinates(percentX, percentY) {
            const x = Math.max(0, Math.min(96, parseFloat(percentX.toFixed(1))));
            const y = Math.max(0, Math.min(96, parseFloat(percentY.toFixed(1))));

            document.getElementById('inputPositionX').value = x;
            document.getElementById('inputPositionY').value = y;
            document.getElementById('displayX').innerText = Math.round(x);
            document.getElementById('displayY').innerText = Math.round(y);

            updatePlacementDisplay();
        }

        function updatePlacementDisplay() {
            const placementStamp = document.getElementById('placementStamp');
            if (!placementStamp) return;

            const x = document.getElementById('inputPositionX').value || 60;
            const y = document.getElementById('inputPositionY').value || 75;

            placementStamp.style.left = x + '%';
            placementStamp.style.top = y + '%';
        }

        function setPresetPosition(preset) {
            if (preset === 'bottom-right') {
                updatePlacementCoordinates(60, 78);
            } else if (preset === 'bottom-left') {
                updatePlacementCoordinates(10, 78);
            } else if (preset === 'bottom-center') {
                updatePlacementCoordinates(35, 78);
            }
        }

        function setStampDimensions(widthMm, heightMm, label) {
            baseStampWidthMm = widthMm;
            baseStampHeightMm = heightMm;
            currentScaleRatio = 1.0;
            document.getElementById('scaleSlider').value = 100;
            document.getElementById('sliderScaleValue').innerText = '100%';

            ['btnSizeCompact', 'btnSizeStandard', 'btnSizeLarge'].forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.className = 'rounded-lg border border-slate-200 bg-white p-2 text-center font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300';
            });

            const activeClass = 'rounded-lg border-2 border-slate-900 bg-white p-2 text-center font-bold text-slate-950 transition-all cursor-pointer shadow-2xs dark:border-white dark:bg-zinc-800 dark:text-white';
            if (label === 'Compact') {
                const btn = document.getElementById('btnSizeCompact');
                if (btn) btn.className = activeClass;
            } else if (label === 'Standar') {
                const btn = document.getElementById('btnSizeStandard');
                if (btn) btn.className = activeClass;
            } else if (label === 'Besar') {
                const btn = document.getElementById('btnSizeLarge');
                if (btn) btn.className = activeClass;
            }

            const sizeBadge = document.getElementById('sizeBadge');
            if (sizeBadge) {
                sizeBadge.innerText = `${label} (${widthMm}×${heightMm} mm)`;
            }
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
                if (placementStamp) {
                    placementStamp.style.width = stampPxWidth + 'px';
                    placementStamp.style.height = stampPxHeight + 'px';
                }

                const qrPxSize = Math.round(renderedPageWidthPx * (16.0 / pageOriginalWidthMm));
                const placementQr = document.getElementById('placementQr');
                if (placementQr) {
                    placementQr.style.width = qrPxSize + 'px';
                    placementQr.style.height = qrPxSize + 'px';
                }
            }
        }

        // 4. Toggle Elements & QR Positions
        function handleToggleElement(elem, isChecked) {
            if (elem === 'qr') {
                if (isQrOnly) {
                    const toggleQr = document.getElementById('toggleQr');
                    if (toggleQr) {
                        toggleQr.checked = true;
                        toggleQr.disabled = true;
                    }
                    showQrCode = true;
                    document.getElementById('inputShowQr').value = '1';
                    return;
                }
                showQrCode = isChecked;
                document.getElementById('inputShowQr').value = isChecked ? '1' : '0';
                const placementQr = document.getElementById('placementQr');
                const qrNotice = document.getElementById('qrDragNotice');
                if (placementQr) {
                    if (isChecked && !isQrOnly) {
                        placementQr.classList.remove('hidden');
                    } else {
                        placementQr.classList.add('hidden');
                    }
                }
                if (qrNotice) {
                    if (isChecked && !isQrOnly) {
                        qrNotice.classList.remove('hidden');
                    } else {
                        qrNotice.classList.add('hidden');
                    }
                }
            } else if (elem === 'name') {
                showSignerName = isChecked;
                document.getElementById('inputShowName').value = isChecked ? '1' : '0';
                document.getElementById('stampNameBottom').style.display = isChecked ? 'block' : 'none';
            } else if (elem === 'border') {
                showStampBorder = isChecked;
                document.getElementById('inputShowBorder').value = isChecked ? '1' : '0';
                const previewBox = document.getElementById('stampPreviewBox');
                if (previewBox) {
                    if (isChecked) {
                        previewBox.classList.add('border-slate-900', 'bg-white', 'shadow-xs', 'dark:border-white');
                        previewBox.classList.remove('border-slate-300', 'dark:border-white/20');
                    } else {
                        previewBox.classList.remove('border-slate-900', 'shadow-xs', 'dark:border-white');
                        previewBox.classList.add('border-slate-300', 'dark:border-white/20');
                    }
                }
            }
        }

        function updateStampPreviewDisplay() {
            const nameVal = document.getElementById('accepted_name').value || 'Penanda Tangan';
            const titleVal = document.getElementById('signer_title').value || '';

            document.querySelectorAll('.stamp-display-name').forEach(el => el.innerText = nameVal);
            document.querySelectorAll('.stamp-display-title').forEach(el => {
                el.innerText = titleVal;
                el.style.display = (titleVal && showSignerTitle) ? 'block' : 'none';
            });

            const stampSigImg = document.getElementById('stampSignatureImg');
            const stampQrOnlySeal = document.getElementById('stampQrOnlySeal');
            const tab3QrNotice = document.getElementById('tab3QrOnlyNotice');
            const placementQr = document.getElementById('placementQr');
            const qrNotice = document.getElementById('qrDragNotice');
            const toggleQr = document.getElementById('toggleQr');
            const labelToggleQr = document.getElementById('labelToggleQr');
            const qrRequiredBadge = document.getElementById('qrRequiredBadge');
            const qrSubtitleText = document.getElementById('qrSubtitleText');

            if (isQrOnly) {
                if (toggleQr) {
                    toggleQr.checked = true;
                    toggleQr.disabled = true;
                }
                if (labelToggleQr) {
                    labelToggleQr.classList.add('opacity-75', 'cursor-not-allowed');
                    labelToggleQr.classList.remove('cursor-pointer');
                    labelToggleQr.setAttribute('title', 'Pada mode Barcode QR saja, QR Code wajib aktif dan tidak dapat dinonaktifkan.');
                }
                if (qrRequiredBadge) qrRequiredBadge.classList.remove('hidden');
                if (qrSubtitleText) qrSubtitleText.innerText = 'Wajib aktif sebagai segel keabsahan UU ITE (tidak dapat dinonaktifkan)';

                showQrCode = true;
                const showQrInput = document.getElementById('inputShowQr');
                if (showQrInput) showQrInput.value = '1';

                if (stampSigImg) stampSigImg.style.display = 'none';
                if (stampQrOnlySeal) stampQrOnlySeal.style.display = 'flex';
                if (tab3QrNotice) tab3QrNotice.classList.remove('hidden');
                if (placementQr) placementQr.classList.add('hidden');
                if (qrNotice) qrNotice.classList.add('hidden');
            } else {
                if (toggleQr) {
                    toggleQr.disabled = false;
                }
                if (labelToggleQr) {
                    labelToggleQr.classList.remove('opacity-75', 'cursor-not-allowed');
                    labelToggleQr.classList.add('cursor-pointer');
                    labelToggleQr.removeAttribute('title');
                }
                if (qrRequiredBadge) qrRequiredBadge.classList.add('hidden');
                if (qrSubtitleText) qrSubtitleText.innerText = 'Tautkan barcode QR verifikasi keabsahan UU ITE';

                if (stampSigImg) {
                    stampSigImg.style.display = 'block';
                    stampSigImg.src = trimmedSignatureDataUrl || '';
                }
                if (stampQrOnlySeal) stampQrOnlySeal.style.display = 'none';
                if (tab3QrNotice) tab3QrNotice.classList.add('hidden');
                if (placementQr) {
                    if (showQrCode) placementQr.classList.remove('hidden');
                    else placementQr.classList.add('hidden');
                }
                if (qrNotice) {
                    if (showQrCode) qrNotice.classList.remove('hidden');
                    else qrNotice.classList.add('hidden');
                }
            }
        }

        // 5. Drag & Drop Controllers (Stamp & Standalone Barcode QR)
        let isDraggingStamp = false;
        let dragStartX, dragStartY, initialStampLeft, initialStampTop;

        const placementStampEl = document.getElementById('placementStamp');
        const tab3PageWrapperEl = document.getElementById('tab3PageWrapper');

        function startDragStamp(e) {
            if (e.target.closest && (e.target.closest('button') || e.target.closest('input'))) return;

            isDraggingStamp = true;
            if (placementStampEl) placementStampEl.classList.add('is-dragging');

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            dragStartX = clientX;
            dragStartY = clientY;

            const pwRect = tab3PageWrapperEl.getBoundingClientRect();
            const sRect = placementStampEl.getBoundingClientRect();

            initialStampLeft = sRect.left - pwRect.left;
            initialStampTop = sRect.top - pwRect.top;

            e.preventDefault();
        }

        function doDragStamp(e) {
            if (!isDraggingStamp || !placementStampEl) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const deltaX = clientX - dragStartX;
            const deltaY = clientY - dragStartY;

            const pwRect = tab3PageWrapperEl.getBoundingClientRect();
            let newX = initialStampLeft + deltaX;
            let newY = initialStampTop + deltaY;

            newX = Math.max(0, Math.min(pwRect.width - placementStampEl.offsetWidth, newX));
            newY = Math.max(0, Math.min(pwRect.height - placementStampEl.offsetHeight, newY));

            const percentX = (newX / pwRect.width) * 100;
            const percentY = (newY / pwRect.height) * 100;

            updatePlacementCoordinates(percentX, percentY);
            e.preventDefault();
        }

        function endDragStamp() {
            if (isDraggingStamp) {
                isLayoutConfirmed = false;
                updateTabNavStyles();
            }
            isDraggingStamp = false;
            if (placementStampEl) placementStampEl.classList.remove('is-dragging');
        }

        if (placementStampEl) {
            placementStampEl.addEventListener('mousedown', startDragStamp);
            placementStampEl.addEventListener('touchstart', startDragStamp, { passive: false });
        }

        // Standalone Barcode QR Drag & Drop Controller
        let isDraggingQr = false;
        let qrDragStartX, qrDragStartY, initialQrLeft, initialQrTop;
        const placementQrEl = document.getElementById('placementQr');

        function startDragQr(e) {
            if (e.target.closest && (e.target.closest('button') || e.target.closest('input'))) return;

            isDraggingQr = true;
            if (placementQrEl) placementQrEl.classList.add('is-dragging');

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            qrDragStartX = clientX;
            qrDragStartY = clientY;

            const pwRect = tab3PageWrapperEl.getBoundingClientRect();
            const qRect = placementQrEl.getBoundingClientRect();

            initialQrLeft = qRect.left - pwRect.left;
            initialQrTop = qRect.top - pwRect.top;

            e.preventDefault();
        }

        function doDragQr(e) {
            if (!isDraggingQr || !placementQrEl) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const deltaX = clientX - qrDragStartX;
            const deltaY = clientY - qrDragStartY;

            const pwRect = tab3PageWrapperEl.getBoundingClientRect();
            let newX = initialQrLeft + deltaX;
            let newY = initialQrTop + deltaY;

            newX = Math.max(0, Math.min(pwRect.width - placementQrEl.offsetWidth, newX));
            newY = Math.max(0, Math.min(pwRect.height - placementQrEl.offsetHeight, newY));

            const percentX = (newX / pwRect.width) * 100;
            const percentY = (newY / pwRect.height) * 100;

            placementQrEl.style.left = percentX.toFixed(1) + '%';
            placementQrEl.style.top = percentY.toFixed(1) + '%';

            currentStampLayout = `custom_${percentX.toFixed(1)}_${percentY.toFixed(1)}`;
            const stampLayoutInput = document.getElementById('stampLayoutInput');
            if (stampLayoutInput) stampLayoutInput.value = currentStampLayout;

            e.preventDefault();
        }

        function endDragQr() {
            if (isDraggingQr) {
                isLayoutConfirmed = false;
                updateTabNavStyles();
            }
            isDraggingQr = false;
            if (placementQrEl) placementQrEl.classList.remove('is-dragging');
        }

        if (placementQrEl) {
            placementQrEl.addEventListener('mousedown', startDragQr);
            placementQrEl.addEventListener('touchstart', startDragQr, { passive: false });
        }

        // Global Drag Event Listeners
        window.addEventListener('mousemove', function(e) {
            if (isDraggingStamp) doDragStamp(e);
            if (isDraggingQr) doDragQr(e);
        });
        window.addEventListener('touchmove', function(e) {
            if (isDraggingStamp) doDragStamp(e);
            if (isDraggingQr) doDragQr(e);
        }, { passive: false });
        window.addEventListener('mouseup', function() {
            if (isDraggingStamp) endDragStamp();
            if (isDraggingQr) endDragQr();
        });
        window.addEventListener('touchend', function() {
            if (isDraggingStamp) endDragStamp();
            if (isDraggingQr) endDragQr();
        });

        // 6. Tab 4 Final Proof Rendering
        function renderTab4FinalProof() {
            const finalCanvas = document.getElementById('tab4FinalCanvas');
            const wrapperEl = document.getElementById('tab4CanvasWrapper');
            const spinnerEl = document.getElementById('tab4LoadingSpinner');
            if (!finalCanvas || !wrapperEl) return;

            if (spinnerEl) spinnerEl.classList.remove('hidden');

            const targetPageNum = parseInt(document.getElementById('inputPageNumber').value) || currentPage || 1;
            const nameVal = document.getElementById('accepted_name').value || '{{ $signer->name }}';
            const titleVal = document.getElementById('signer_title').value || '';
            const posX = parseFloat(document.getElementById('inputPositionX').value) || 60;
            const posY = parseFloat(document.getElementById('inputPositionY').value) || 75;

            document.getElementById('tab4SummaryName').innerText = nameVal;
            document.getElementById('tab4SummaryTitle').innerText = titleVal || '-';
            document.getElementById('tab4SummaryPosition').innerText = `Hal ${targetPageNum} (${posX}% X, ${posY}% Y)`;
            document.getElementById('tab4SummaryDimensions').innerText = document.getElementById('displayDimensions').innerText;
            const methodEl = document.getElementById('tab4SummaryMethod');
            if (methodEl) {
                methodEl.innerText = isQrOnly ? 'Barcode QR Kriptografis Saja' : 'Tanda Tangan & Barcode QR';
            }

            if (pdfDoc) {
                pdfDoc.getPage(targetPageNum).then(function(page) {
                    const containerWidth = Math.min(760, document.getElementById('tabPanel4').clientWidth - 48);
                    const unscaledViewport = page.getViewport({ scale: 1 });
                    currentPdfPageUnscaledWidth = unscaledViewport.width;
                    currentPdfPageUnscaledHeight = unscaledViewport.height;

                    const scale = containerWidth / unscaledViewport.width;
                    const dpr = Math.max(window.devicePixelRatio || 1, 1.5);
                    const viewport = page.getViewport({ scale: scale });

                    finalCanvas.width = Math.round(viewport.width * dpr);
                    finalCanvas.height = Math.round(viewport.height * dpr);
                    finalCanvas.style.width = viewport.width + 'px';
                    finalCanvas.style.height = viewport.height + 'px';
                    wrapperEl.style.width = viewport.width + 'px';
                    wrapperEl.style.height = viewport.height + 'px';

                    const ctx = finalCanvas.getContext('2d');
                    const renderContext = {
                        canvasContext: ctx,
                        transform: [dpr, 0, 0, dpr, 0, 0],
                        viewport: viewport
                    };

                    page.render(renderContext).promise.then(function() {
                        drawStampOntoProofCanvas(ctx, finalCanvas.width, finalCanvas.height, dpr);
                        if (spinnerEl) spinnerEl.classList.add('hidden');
                    });
                });
            } else {
                if (spinnerEl) spinnerEl.classList.add('hidden');
            }
        }

        function drawStampOntoProofCanvas(ctx, canvasW, canvasH, dpr = 1) {
            const posX = parseFloat(document.getElementById('inputPositionX').value) || 60;
            const posY = parseFloat(document.getElementById('inputPositionY').value) || 75;

            const pageMmW = (currentPdfPageUnscaledWidth || 595.28) / 2.83465;
            const pageMmH = (currentPdfPageUnscaledHeight || 841.89) / 2.83465;

            const stampW = (currentStampWidthMm / pageMmW) * canvasW;
            const stampH = (currentStampHeightMm / pageMmH) * canvasH;

            const stampX = (posX / 100) * canvasW;
            const stampY = (posY / 100) * canvasH;

            // Border Card
            if (showStampBorder) {
                ctx.save();
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = Math.max(1, 1 * dpr);
                ctx.fillRect(stampX, stampY, stampW, stampH);
                ctx.strokeRect(stampX, stampY, stampW, stampH);
                ctx.restore();
            }

            if (isQrOnly) {
                // Centered QR Seal inside stamp box
                const qrImg = new Image();
                qrImg.onload = function() {
                    const pad = (showStampBorder ? 4 : 2) * dpr;
                    const qrDim = Math.min(stampW - (pad * 2), stampH - (pad * 2));
                    const qrX = stampX + (stampW - qrDim) / 2;
                    const qrY = stampY + (stampH - qrDim) / 2;
                    ctx.drawImage(qrImg, qrX, qrY, qrDim, qrDim);
                };
                qrImg.src = "{{ route('signature.qr', $signer->signatureRequest->verification_code) }}";
            } else {
                // Draw Signature
                if (trimmedSignatureDataUrl) {
                    const img = new Image();
                    img.onload = function() {
                        const padX = (showStampBorder ? 4 : 1) * dpr;
                        const padY = (showStampBorder ? 3 : 1) * dpr;
                        const availW = Math.max(10 * dpr, stampW - (padX * 2));
                        const availH = Math.max(10 * dpr, stampH - (padY * 2));

                        const scale = Math.min(availW / img.naturalWidth, availH / img.naturalHeight);
                        const drawW = img.naturalWidth * scale;
                        const drawH = img.naturalHeight * scale;

                        const sigX = stampX + padX + (availW - drawW) / 2;
                        const sigY = stampY + padY + (availH - drawH) / 2;

                        ctx.drawImage(img, sigX, sigY, drawW, drawH);
                    };
                    img.src = trimmedSignatureDataUrl;
                }

                // Draw QR Code
                if (showQrCode) {
                    const qrImg = new Image();
                    qrImg.onload = function() {
                        let qrDim = (16.0 / pageMmW) * canvasW;
                        if (!qrDim || isNaN(qrDim) || qrDim <= 0) {
                            qrDim = Math.min(48 * dpr, stampH * 0.85);
                        }

                        let qrX = stampX + stampW + (4 * dpr);
                        let qrY = stampY + (stampH - qrDim) / 2;

                        let customCoordsFound = false;
                        if (currentStampLayout && currentStampLayout.startsWith('custom_')) {
                            const parts = currentStampLayout.split('_');
                            if (parts.length === 3) {
                                const pX = parseFloat(parts[1]);
                                const pY = parseFloat(parts[2]);
                                if (!isNaN(pX) && !isNaN(pY)) {
                                    qrX = (pX / 100) * canvasW;
                                    qrY = (pY / 100) * canvasH;
                                    customCoordsFound = true;
                                }
                            }
                        }

                        if (!customCoordsFound) {
                            const placementQr = document.getElementById('placementQr');
                            if (placementQr && placementQr.style.left && placementQr.style.top) {
                                const pX = parseFloat(placementQr.style.left);
                                const pY = parseFloat(placementQr.style.top);
                                if (!isNaN(pX) && !isNaN(pY)) {
                                    qrX = (pX / 100) * canvasW;
                                    qrY = (pY / 100) * canvasH;
                                    customCoordsFound = true;
                                }
                            }
                        }

                        if (!customCoordsFound) {
                            if (currentStampLayout === 'qr_left') {
                                qrX = stampX - qrDim - (4 * dpr);
                            } else if (currentStampLayout === 'qr_bottom') {
                                qrX = stampX + (stampW - qrDim) / 2;
                                qrY = stampY + stampH + (4 * dpr);
                            } else if (currentStampLayout === 'doc_bottom_right') {
                                qrX = canvasW - qrDim - (16 * dpr);
                                qrY = canvasH - qrDim - (14 * dpr);
                            }
                        }

                        if (showStampBorder) {
                            ctx.save();
                            ctx.fillStyle = '#f8fafc';
                            ctx.strokeStyle = '#e2e8f0';
                            ctx.lineWidth = Math.max(1, 1 * dpr);
                            ctx.fillRect(qrX, qrY, qrDim, qrDim);
                            ctx.strokeRect(qrX, qrY, qrDim, qrDim);
                            ctx.restore();
                            const p = Math.max(2 * dpr, qrDim * 0.06);
                            ctx.drawImage(qrImg, qrX + p, qrY + p, qrDim - (p * 2), qrDim - (p * 2));
                        } else {
                            ctx.drawImage(qrImg, qrX, qrY, qrDim, qrDim);
                        }
                    };
                    qrImg.src = "{{ route('signature.qr', $signer->signatureRequest->verification_code) }}";
                }
            }
        }

        // Form Submission
        document.getElementById('signingForm').addEventListener('submit', function(e) {
            const termsCheckbox = document.getElementById('accept_terms');
            if (termsCheckbox && !termsCheckbox.checked) {
                e.preventDefault();
                showTermsRequiredToast();
                return;
            }

            if (!isQrOnly && (!hasDrawnSignature || !trimmedSignatureDataUrl)) {
                e.preventDefault();
                alert('Silakan buat tanda tangan terlebih dahulu pada Tab 2 atau pilih opsi Barcode QR.');
                switchTab(2);
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<div class="size-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div> <span>Membubuhkan Pengesahan Dokumen...</span>';
            }
        });

        // Window Resize Handler
        window.addEventListener('resize', () => {
            clearTimeout(window._sigResizeTimer);
            window._sigResizeTimer = setTimeout(() => {
                if (activeTab === 2) {
                    initStudioPad();
                } else if (activeTab === 1 || activeTab === 3) {
                    refreshActivePageViewports();
                }
            }, 250);
        });

        // Initialize preview display states on initial load
        updateStampPreviewDisplay();
    </script>
</body>
</html>
