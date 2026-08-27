<!doctype html>
<html lang="id" class="h-full bg-slate-100 antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Penandatanganan Dokumen Elektronik Resmi | RPK Law Firm</title>
    <link rel="icon" type="image/png" href="/images/rpkapp.png">
    <link rel="apple-touch-icon" href="/images/rpkapp.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&family=Caveat:wght@600;700&family=Dancing+Script:wght@600;700&family=Sacramento&family=Alex+Brush&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <!-- PDF.js CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <style>
        body { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
        }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-sig-caveat { font-family: 'Caveat', cursive; }
        .font-sig-dancing { font-family: 'Dancing Script', cursive; }
        .font-sig-sacramento { font-family: 'Sacramento', cursive; }
        .font-sig-alex { font-family: 'Alex Brush', cursive; }
        
        .security-bg-grid {
            background-image: radial-gradient(rgba(203, 213, 225, 0.6) 1px, transparent 1px);
            background-size: 18px 18px;
        }

        .placement-stamp {
            cursor: grab;
            user-select: none;
            touch-action: none;
            transition: box-shadow 0.15s ease, transform 0.15s ease, width 0.12s ease, height 0.12s ease;
        }
        .placement-stamp:active, .placement-stamp.is-dragging {
            cursor: grabbing;
            transform: scale(1.012);
            box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.7), 0 16px 24px -4px rgba(0, 0, 0, 0.18);
        }
        
        .sig-pad-box {
            background-image: repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(226, 232, 240, 0.7) 24px);
        }

        .custom-scroll::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
    </style>
</head>
<body class="min-h-screen bg-slate-100 text-slate-900 selection:bg-slate-900 selection:text-white security-bg-grid">

    <!-- Top Sticky Corporate Bar -->
    <header class="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-2xs">
        <div class="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div class="flex items-center gap-3">
                <a href="{{ route('home') }}" title="RPK Law Firm" class="shrink-0">
                    <img 
                        src="/logo/logo.png" 
                        alt="RPK Law Firm" 
                        class="h-7 w-auto max-w-[120px] object-contain"
                        onerror="this.onerror=null; this.src='/logo/raf-law-firm-transparent.png';"
                    />
                </a>
                <div class="hidden sm:block border-l border-slate-200 pl-3">
                    <span class="text-[11px] font-black tracking-tight text-slate-900 uppercase block">RPK LAW FIRM</span>
                    <p class="text-[9px] font-semibold text-slate-500">Digital Signing Workspace • UU ITE Compliant</p>
                </div>
            </div>

            <!-- Verification & Compliance Badges -->
            <div class="flex items-center gap-2">
                <div class="hidden md:flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-[10.5px] font-mono text-slate-600">
                    <svg class="size-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>UU ITE &amp; SHA-256 Valid</span>
                </div>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-emerald-800">
                    <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    SESI PENANDATANGANAN RESMI
                </span>
            </div>
        </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-3 sm:px-6 py-4 sm:py-6 space-y-4">

        <!-- Document Context Summary Card -->
        <div class="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-1.5">
                        <span class="rounded bg-blue-50 px-2 py-0.5 font-mono text-[9.5px] font-bold text-blue-700 uppercase tracking-wide">
                            Permintaan Tanda Tangan Elektronik
                        </span>
                        @if ($signer->signatureRequest->document->matter)
                            <span class="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                                Perkara: {{ $signer->signatureRequest->document->matter->matter_number }}
                            </span>
                        @endif
                    </div>
                    <h1 class="text-base sm:text-lg font-black tracking-tight text-slate-900">
                        {{ $signer->signatureRequest->document->title }}
                    </h1>
                </div>

                <div class="flex flex-wrap items-center gap-3 text-xs">
                    <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-1.5 shadow-2xs">
                        <span class="text-[9.5px] font-bold text-slate-400 uppercase block">Penandatangan Terdaftar</span>
                        <span class="font-extrabold text-slate-900">{{ $signer->name }}</span>
                        <span class="font-mono text-[10px] text-slate-500 block">({{ $signer->email }})</span>
                    </div>

                    @if ($signer->signatureRequest->expires_at)
                        <div class="rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-1.5 font-mono text-[11px] text-amber-900 shadow-2xs">
                            <span class="text-[9.5px] font-bold uppercase text-amber-600 block">Batas Waktu</span>
                            <strong>{{ $signer->signatureRequest->expires_at->translatedFormat('d M Y, H:i') }} WIB</strong>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Helpful Guidance Ribbon -->
            <div class="flex flex-wrap items-center justify-between gap-2 pt-2.5 text-xs text-slate-600">
                <div class="flex items-center gap-2">
                    <svg class="size-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Gores atau ketik tanda tangan di panel sebelah kanan, atur elemen stempel, lalu geser kotak stempel ke posisi yang diinginkan pada dokumen.</span>
                </div>
                <span class="font-mono text-[10.5px] text-slate-400">Dimensi &amp; Posisi 100% Presisi (WYSIWYG)</span>
            </div>
        </div>

        <!-- Main Form Grid (Privy-Style Split Layout) -->
        <form id="signingForm" method="post" action="{{ route('signature.sign.store', $signer->signing_token) }}" class="space-y-4">
            @csrf

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

                <!-- LEFT / CENTER: Interactive PDF Document Viewport (7 Cols on LG) -->
                <div class="lg:col-span-7 space-y-3">
                    <div class="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5">
                        
                        <!-- Document Toolbar (Privy Style) -->
                        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 text-xs">
                            
                            <!-- Page Navigator -->
                            <div class="flex items-center gap-1.5">
                                <button 
                                    type="button" 
                                    id="btnPrevPage" 
                                    onclick="prevPage()"
                                    class="size-7 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-35 transition-colors cursor-pointer"
                                    title="Halaman Sebelumnya"
                                >
                                    ◀
                                </button>
                                <span class="font-mono text-xs font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                                    Hal <span id="pageNum">1</span> / <span id="pageCount">1</span>
                                </span>
                                <button 
                                    type="button" 
                                    id="btnNextPage" 
                                    onclick="nextPage()"
                                    class="size-7 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-35 transition-colors cursor-pointer"
                                    title="Halaman Berikutnya"
                                >
                                    ▶
                                </button>
                            </div>

                            <!-- Zoom Controls -->
                            <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                                <button 
                                    type="button" 
                                    onclick="changeZoom(-0.15)"
                                    class="size-6 flex items-center justify-center rounded-md font-bold text-slate-700 hover:bg-white transition-colors cursor-pointer"
                                    title="Zoom Out"
                                >
                                    −
                                </button>
                                <span id="zoomLevelDisplay" class="font-mono text-[10.5px] font-semibold text-slate-600 px-1.5 min-w-[42px] text-center">
                                    100%
                                </span>
                                <button 
                                    type="button" 
                                    onclick="changeZoom(0.15)"
                                    class="size-6 flex items-center justify-center rounded-md font-bold text-slate-700 hover:bg-white transition-colors cursor-pointer"
                                    title="Zoom In"
                                >
                                    +
                                </button>
                                <button 
                                    type="button" 
                                    onclick="resetZoom()"
                                    class="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-600 hover:bg-white transition-colors cursor-pointer"
                                    title="Fit Page"
                                >
                                    Fit
                                </button>
                            </div>

                            <!-- Placement Presets -->
                            <div class="flex items-center gap-1 text-[10.5px]">
                                <span class="text-slate-400 font-medium hidden sm:inline">Snap:</span>
                                <button 
                                    type="button" 
                                    onclick="setPresetPosition('bottom-right')"
                                    class="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    Kanan Bawah
                                </button>
                                <button 
                                    type="button" 
                                    onclick="setPresetPosition('bottom-left')"
                                    class="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    Kiri Bawah
                                </button>
                            </div>
                        </div>

                        <!-- Live Coordinate & Scale Meta Bar -->
                        <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
                            <span class="flex items-center gap-1.5">
                                <span class="size-2 rounded-full bg-blue-600"></span>
                                <span>Posisi: Hal <strong id="displayPage" class="text-slate-800">1</strong> (<strong id="displayX" class="text-slate-800">60</strong>% X, <strong id="displayY" class="text-slate-800">75</strong>% Y)</span>
                            </span>
                            <span class="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                                Ukuran Stempel: <span id="displayDimensions">50 × 30 mm</span>
                            </span>
                        </div>

                        <!-- PDF Render Viewport Area -->
                        <div class="relative overflow-auto rounded-xl border border-slate-200 bg-slate-200/70 p-2 sm:p-4 flex justify-center min-h-[460px] max-h-[620px] custom-scroll" id="pdfViewportContainer">
                            
                            <!-- Loading Spinner -->
                            <div id="pdfLoadingSpinner" class="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20 space-y-2 text-slate-700 rounded-xl">
                                <div class="size-7 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
                                <span class="text-xs font-bold">Memuat Pratinjau PDF Asli...</span>
                            </div>

                            <!-- Page Canvas Wrapper -->
                            <div class="relative shadow-md rounded-sm bg-white" id="pageWrapper">
                                <canvas id="pdfCanvas" class="bg-white block rounded-sm"></canvas>
                                
                                <!-- Interactive Draggable & Proportional Stamp Box (Privy Style) -->
                                <div 
                                    id="placementStamp" 
                                    class="placement-stamp absolute z-10 rounded-lg border-2 border-blue-700 bg-white p-2 shadow-lg select-none cursor-grab"
                                    style="width: 160px; height: 96px; left: 60%; top: 75%;"
                                    title="Geser untuk memindahkan stempel ke posisi yang diinginkan"
                                >
                                    <!-- Stamp Header Badge (Optional/Compact) -->
                                    <div id="stampHeaderBar" class="flex items-center justify-between border-b border-slate-100 pb-0.5 mb-1">
                                        <span class="text-[7.5px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1">
                                            <span class="size-1 rounded-full bg-blue-600"></span>
                                            RPK E-SIGN
                                        </span>
                                        <span class="text-[6.5px] font-mono text-slate-400">UU ITE VALID</span>
                                    </div>

                                    <div id="stampInnerFlex" class="flex items-center justify-between gap-1.5 h-[calc(100%-14px)] w-full">
                                        
                                        <!-- Signature & Signer Text Block -->
                                        <div id="stampSigBlock" class="flex flex-col justify-between h-full flex-1 min-w-0">
                                            <!-- Top Name Block -->
                                            <div id="stampNameTop" class="hidden">
                                                <p class="text-[8px] font-bold text-slate-900 leading-tight truncate stamp-display-name">
                                                    {{ $signer->name }}
                                                </p>
                                                <p class="text-[6.5px] text-slate-500 leading-none truncate stamp-display-title"></p>
                                            </div>

                                            <!-- Signature Visual Area -->
                                            <div id="stampSigPreview" class="flex-1 flex items-center justify-center overflow-hidden min-h-[26px]">
                                                <span class="text-[8px] italic text-slate-400 font-medium">
                                                    [Tanda Tangan]
                                                </span>
                                            </div>

                                            <!-- Bottom Name Block -->
                                            <div id="stampNameBottom" class="border-t border-slate-100 pt-0.5">
                                                <p class="text-[8px] font-bold text-slate-900 leading-tight truncate stamp-display-name">
                                                    {{ $signer->name }}
                                                </p>
                                                <p class="text-[6.5px] text-slate-500 leading-none truncate stamp-display-title"></p>
                                            </div>
                                        </div>

                                        <!-- Official QR Verification Seal Block -->
                                        <div id="stampQrBlock" class="shrink-0 flex items-center justify-center p-0.5 rounded border border-slate-100 bg-slate-50 size-11">
                                            <img 
                                                src="{{ route('signature.qr', $signer->signatureRequest->verification_code) }}" 
                                                alt="QR" 
                                                class="size-10 object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- Hidden Coordinate & Dimensional Form Inputs -->
                        <input type="hidden" name="page_number" id="inputPageNumber" value="1">
                        <input type="hidden" name="position_x" id="inputPositionX" value="60">
                        <input type="hidden" name="position_y" id="inputPositionY" value="75">
                        <input type="hidden" name="stamp_width" id="inputStampWidth" value="50">
                        <input type="hidden" name="stamp_height" id="inputStampHeight" value="30">
                        <input type="hidden" name="show_qr" id="inputShowQr" value="1">
                        <input type="hidden" name="show_name" id="inputShowName" value="1">
                        <input type="hidden" name="show_title" id="inputShowTitle" value="1">
                        <input type="hidden" name="show_border" id="inputShowBorder" value="1">
                        <input type="hidden" name="stamp_layout" id="stampLayoutInput" value="sig_left">
                        <input type="hidden" name="name_position" id="namePositionInput" value="bottom">
                        <input type="hidden" name="signature_type" id="signatureTypeInput" value="draw">
                        <input type="hidden" name="signature_data" id="signatureDataInput" value="">
                    </div>
                </div>

                <!-- RIGHT: Privy-Style Signature & Customization Inspector (5 Cols on LG) -->
                <div class="lg:col-span-5 space-y-3">
                    
                    <!-- 1. Identitas Penandatangan Card -->
                    <div class="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
                        <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
                            <span class="flex size-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">1</span>
                            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Identitas &amp; Gelar
                            </h2>
                        </div>

                        <div class="space-y-2.5">
                            <div>
                                <label for="accepted_name" class="text-xs font-bold text-slate-700 block">
                                    Nama Lengkap (Sesuai KTP / Akta) <span class="text-red-500">*</span>
                                </label>
                                <input 
                                    id="accepted_name" 
                                    name="accepted_name" 
                                    type="text"
                                    value="{{ old('accepted_name', $signer->name) }}" 
                                    required
                                    placeholder="Nama lengkap penandatangan"
                                    class="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-hidden transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                >
                                @error('accepted_name')
                                    <p class="mt-1 text-xs text-rose-600 font-bold">{{ $message }}</p>
                                @enderror
                            </div>

                            <div>
                                <label for="signer_title" class="text-xs font-semibold text-slate-700 block">
                                    Jabatan / Gelar / Keterangan (Opsional)
                                </label>
                                <input 
                                    id="signer_title" 
                                    name="signer_title" 
                                    type="text"
                                    value="{{ old('signer_title') }}" 
                                    placeholder="Contoh: Advokat &amp; Konsultan Hukum / Direktur"
                                    class="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 outline-hidden transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                >
                            </div>
                        </div>
                    </div>

                    <!-- 2. Goresan Tanda Tangan Visual (Privy 3 Modes: Draw / Type / Upload) -->
                    <div class="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div class="flex items-center gap-2">
                                <span class="flex size-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">2</span>
                                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-800">
                                    Bubuhkan Tanda Tangan
                                </h2>
                            </div>

                            <!-- Privy 3 Modes Switcher -->
                            <div class="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5 text-xs">
                                <button 
                                    type="button" 
                                    id="btnModeDraw" 
                                    onclick="switchSignatureMode('draw')" 
                                    class="rounded-md px-2.5 py-0.5 font-bold text-[10.5px] bg-white text-slate-900 shadow-2xs transition-all cursor-pointer"
                                >
                                    Gores Pad
                                </button>
                                <button 
                                    type="button" 
                                    id="btnModeType" 
                                    onclick="switchSignatureMode('type')" 
                                    class="rounded-md px-2.5 py-0.5 font-medium text-[10.5px] text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                                >
                                    Ketik Nama
                                </button>
                                <button 
                                    type="button" 
                                    id="btnModeUpload" 
                                    onclick="switchSignatureMode('upload')" 
                                    class="rounded-md px-2.5 py-0.5 font-medium text-[10.5px] text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                                >
                                    Unggah
                                </button>
                            </div>
                        </div>

                        <!-- MODE 1: Gores Pad (Compact Square Box, not overly wide!) -->
                        <div id="drawContainer" class="space-y-2">
                            <div class="flex items-center justify-between text-xs">
                                <div class="flex items-center gap-1.5">
                                    <span class="text-[10.5px] font-medium text-slate-500">Tinta:</span>
                                    <button 
                                        type="button" 
                                        onclick="setPenColor('#1e3a8a')" 
                                        id="btnColorBlue"
                                        class="size-4.5 rounded-full bg-blue-900 ring-2 ring-blue-600 ring-offset-1 transition-all cursor-pointer" 
                                        title="Biru Dokumen Legal"
                                    ></button>
                                    <button 
                                        type="button" 
                                        onclick="setPenColor('#0f172a')" 
                                        id="btnColorNavy"
                                        class="size-4.5 rounded-full bg-slate-900 transition-all cursor-pointer" 
                                        title="Hitam Navy"
                                    ></button>
                                    <button 
                                        type="button" 
                                        onclick="setPenColor('#000000')" 
                                        id="btnColorBlack"
                                        class="size-4.5 rounded-full bg-black transition-all cursor-pointer" 
                                        title="Hitam Pekat"
                                    ></button>
                                </div>

                                <button 
                                    type="button" 
                                    onclick="clearCanvas()" 
                                    class="cursor-pointer text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
                                >
                                    <span>Hapus / Ulangi</span>
                                </button>
                            </div>

                            <!-- Compact Square Signature Canvas Box -->
                            <div class="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-inner sig-pad-box max-w-sm mx-auto">
                                <canvas 
                                    id="signatureCanvas" 
                                    class="w-full h-28 touch-none cursor-crosshair bg-transparent block"
                                ></canvas>
                                <div class="pointer-events-none absolute bottom-2 left-2.5 flex items-center gap-1.5">
                                    <span class="font-mono text-[11px] font-bold text-slate-300">✍</span>
                                    <span class="text-[9px] font-mono text-slate-400">Gores tanda tangan di sini</span>
                                </div>
                            </div>
                        </div>

                        <!-- MODE 2: Ketik Nama (Privy Calligraphy Generator) -->
                        <div id="typeContainer" class="hidden space-y-2">
                            <p class="text-[11px] text-slate-500">Pilih salah satu gaya kaligrafi tanda tangan otomatis di bawah:</p>
                            
                            <div class="grid grid-cols-2 gap-2 text-center" id="fontStylesGrid">
                                <button 
                                    type="button" 
                                    onclick="selectTypeFont('Caveat')"
                                    class="font-preview-card active-font rounded-xl border-2 border-blue-600 bg-blue-50/60 p-2.5 text-center cursor-pointer transition-all hover:bg-blue-50"
                                >
                                    <div class="font-sig-caveat text-xl text-blue-950 font-display-preview truncate">
                                        {{ $signer->name }}
                                    </div>
                                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Caveat Modern</span>
                                </button>

                                <button 
                                    type="button" 
                                    onclick="selectTypeFont('Dancing Script')"
                                    class="font-preview-card rounded-xl border border-slate-200 bg-white p-2.5 text-center cursor-pointer transition-all hover:bg-slate-50"
                                >
                                    <div class="font-sig-dancing text-lg text-slate-900 font-display-preview truncate">
                                        {{ $signer->name }}
                                    </div>
                                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Dancing Flow</span>
                                </button>

                                <button 
                                    type="button" 
                                    onclick="selectTypeFont('Sacramento')"
                                    class="font-preview-card rounded-xl border border-slate-200 bg-white p-2.5 text-center cursor-pointer transition-all hover:bg-slate-50"
                                >
                                    <div class="font-sig-sacramento text-2xl text-slate-900 font-display-preview truncate">
                                        {{ $signer->name }}
                                    </div>
                                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Sacramento Loop</span>
                                </button>

                                <button 
                                    type="button" 
                                    onclick="selectTypeFont('Alex Brush')"
                                    class="font-preview-card rounded-xl border border-slate-200 bg-white p-2.5 text-center cursor-pointer transition-all hover:bg-slate-50"
                                >
                                    <div class="font-sig-alex text-xl text-slate-900 font-display-preview truncate">
                                        {{ $signer->name }}
                                    </div>
                                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Alex Brush Pen</span>
                                </button>
                            </div>
                        </div>

                        <!-- MODE 3: Unggah Foto TTD -->
                        <div id="uploadContainer" class="hidden space-y-2">
                            <input 
                                type="file" 
                                id="signatureFileInput" 
                                accept="image/png,image/jpeg,image/webp" 
                                class="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-900 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-white cursor-pointer"
                                onchange="handleSignatureFileUpload(event)"
                            >
                            <div id="uploadPreviewWrapper" class="hidden overflow-hidden rounded-xl border border-slate-200 bg-white p-3 text-center">
                                <img id="uploadPreview" src="" alt="Pratinjau Tanda Tangan" class="mx-auto max-h-16 object-contain">
                            </div>
                        </div>
                    </div>

                    <!-- 3. Kustomisasi Ukuran & Toggles Stempel (User Requirements 1, 2, 3) -->
                    <div class="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
                        <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
                            <span class="flex size-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">3</span>
                            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Pengaturan Stempel &amp; Ukuran Presisi
                            </h2>
                        </div>

                        <!-- Ukuran Stempel Presets & Custom Slider -->
                        <div class="space-y-2">
                            <div class="flex items-center justify-between text-xs">
                                <span class="font-bold text-slate-700">Format &amp; Ukuran Stempel:</span>
                                <span id="sizeBadge" class="font-mono text-[10.5px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">Standar (50×30 mm)</span>
                            </div>

                            <div class="grid grid-cols-3 gap-1.5 text-xs">
                                <button 
                                    type="button" 
                                    id="btnSizeCompact" 
                                    onclick="setStampDimensions(40, 24, 'Compact')" 
                                    class="rounded-xl border border-slate-200 bg-white p-2 text-center font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                                >
                                    <div class="text-[11px]">Ringkas</div>
                                    <div class="text-[9px] font-mono text-slate-400 mt-0.5">40 × 24 mm</div>
                                </button>
                                <button 
                                    type="button" 
                                    id="btnSizeStandard" 
                                    onclick="setStampDimensions(50, 30, 'Standar')" 
                                    class="rounded-xl border-2 border-blue-600 bg-blue-50/70 p-2 text-center font-bold text-blue-950 transition-all cursor-pointer"
                                >
                                    <div class="text-[11px]">Standar Kotak</div>
                                    <div class="text-[9px] font-mono text-blue-700 mt-0.5">50 × 30 mm</div>
                                </button>
                                <button 
                                    type="button" 
                                    id="btnSizeLarge" 
                                    onclick="setStampDimensions(60, 36, 'Besar')" 
                                    class="rounded-xl border border-slate-200 bg-white p-2 text-center font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                                >
                                    <div class="text-[11px]">Besar / Formal</div>
                                    <div class="text-[9px] font-mono text-slate-400 mt-0.5">60 × 36 mm</div>
                                </button>
                            </div>

                            <!-- Slider for Custom Scale -->
                            <div class="pt-1 space-y-1">
                                <div class="flex items-center justify-between text-[10.5px] text-slate-500 font-mono">
                                    <span>Skala Proporsional:</span>
                                    <span id="sliderScaleValue">100%</span>
                                </div>
                                <input 
                                    type="range" 
                                    id="scaleSlider" 
                                    min="70" 
                                    max="140" 
                                    value="100" 
                                    step="5"
                                    oninput="handleScaleSlider(this.value)"
                                    class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                >
                            </div>
                        </div>

                        <!-- Toggleable Components (User Requirement 3: Tanpa QR / Tanpa Nama / etc.) -->
                        <div class="border-t border-slate-100 pt-2.5 space-y-2 text-xs">
                            <span class="font-bold text-slate-700 block text-[11.5px]">Elemen yang Ditampilkan:</span>
                            
                            <div class="grid grid-cols-2 gap-2">
                                <!-- Toggle QR Code -->
                                <label class="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-50 transition-colors">
                                    <span class="text-xs font-semibold text-slate-800">Sertakan QR Code</span>
                                    <input 
                                        type="checkbox" 
                                        id="toggleQr" 
                                        checked 
                                        onchange="handleToggleElement('qr', this.checked)"
                                        class="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                    >
                                </label>

                                <!-- Toggle Signer Name -->
                                <label class="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-50 transition-colors">
                                    <span class="text-xs font-semibold text-slate-800">Nama Penandatangan</span>
                                    <input 
                                        type="checkbox" 
                                        id="toggleName" 
                                        checked 
                                        onchange="handleToggleElement('name', this.checked)"
                                        class="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                    >
                                </label>

                                <!-- Toggle Title / Jabatan -->
                                <label class="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-50 transition-colors">
                                    <span class="text-xs font-semibold text-slate-800">Jabatan / Gelar</span>
                                    <input 
                                        type="checkbox" 
                                        id="toggleTitle" 
                                        checked 
                                        onchange="handleToggleElement('title', this.checked)"
                                        class="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                    >
                                </label>

                                <!-- Toggle Border Frame -->
                                <label class="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-50 transition-colors">
                                    <span class="text-xs font-semibold text-slate-800">Bingkai Stempel</span>
                                    <input 
                                        type="checkbox" 
                                        id="toggleBorder" 
                                        checked 
                                        onchange="handleToggleElement('border', this.checked)"
                                        class="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                    >
                                </label>
                            </div>
                        </div>

                        <!-- Posisi Tata Letak (Layout) -->
                        <div class="border-t border-slate-100 pt-2.5 space-y-2 text-xs">
                            <span class="font-bold text-slate-700 block text-[11.5px]">Tata Letak (Layout):</span>
                            <div class="grid grid-cols-2 gap-2">
                                <button 
                                    type="button" 
                                    id="btnLayoutSigLeft" 
                                    onclick="setStampLayout('sig_left')" 
                                    class="rounded-xl border-2 border-blue-600 bg-blue-50/70 p-2 text-left font-bold text-blue-950 transition-all cursor-pointer"
                                >
                                    <div class="text-[11px]">Tanda Tangan Kiri</div>
                                    <div class="text-[9px] font-normal text-slate-500 mt-0.5">QR Code di Kanan</div>
                                </button>
                                <button 
                                    type="button" 
                                    id="btnLayoutQrLeft" 
                                    onclick="setStampLayout('qr_left')" 
                                    class="rounded-xl border border-slate-200 bg-white p-2 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                                >
                                    <div class="text-[11px]">QR Code Kiri</div>
                                    <div class="text-[9px] font-normal text-slate-400 mt-0.5">Tanda Tangan Kanan</div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 4. Konfirmasi Hukum & Submit Button -->
                    <div class="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
                        <label class="flex items-start gap-2.5 cursor-pointer text-xs text-slate-800">
                            <input 
                                type="checkbox" 
                                name="accept_terms" 
                                value="1" 
                                required
                                class="mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                            >
                            <span class="text-xs text-slate-700 leading-relaxed">
                                Saya menyatakan telah meninjau isi dokumen dan secara sah menyetujui pembubuhan tanda tangan elektronik resmi pada dokumen <strong>{{ $signer->signatureRequest->document->title }}</strong> ini sesuai ketentuan UU ITE.
                            </span>
                        </label>
                        @error('accept_terms')
                            <p class="text-xs text-rose-600 font-bold">{{ $message }}</p>
                        @enderror

                        <button 
                            type="submit"
                            id="submitBtn"
                            class="h-11 w-full rounded-xl bg-slate-900 font-bold text-xs text-white shadow-2xs hover:bg-black active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            <svg class="size-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Bubuhkan Tanda Tangan Resmi</span>
                        </button>
                    </div>

                </div>

            </div>
        </form>

        <!-- Footer -->
        <footer class="text-center space-y-1 text-xs text-slate-400 pt-2 pb-6">
            <p class="font-medium text-slate-600">&copy; {{ date('Y') }} Roni, Putra &amp; Kusumah Law Firm. Advocates &amp; Legal Consultants.</p>
            <p class="font-mono text-[10px]">Secure Digital Signature Protocol · UU ITE Compliant · SHA-256 Verified</p>
        </footer>

    </main>

    <!-- Interactive JavaScript Engine (PDF.js, 1:1 Scale Mapping, Privy Fonts & Stamp Customizer) -->
    <script>
        // State variables
        let baseStampWidthMm = 50.0;
        let baseStampHeightMm = 30.0;
        let currentScaleRatio = 1.0;
        let currentStampWidthMm = 50.0;
        let currentStampHeightMm = 30.0;

        let showQrCode = true;
        let showSignerName = true;
        let showSignerTitle = true;
        let showStampBorder = true;
        let currentStampLayout = 'sig_left';
        let currentNamePosition = 'bottom';
        let currentSignatureType = 'draw';

        // 1. Signature Pad Logic (Mode: Draw)
        const canvas = document.getElementById('signatureCanvas');
        const ctx = canvas.getContext('2d');
        const signatureDataInput = document.getElementById('signatureDataInput');
        let isDrawing = false;
        let hasDrawn = false;
        let strokeColor = '#1e3a8a';
        let lastPoint = null;
        let midPoint = null;

        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.max(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.strokeStyle = strokeColor;
            ctx.fillStyle = strokeColor;
            ctx.lineWidth = 2.6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }

        window.addEventListener('resize', resizeCanvas);
        setTimeout(resizeCanvas, 100);

        function setPenColor(color) {
            strokeColor = color;
            ctx.strokeStyle = strokeColor;
            ctx.fillStyle = strokeColor;

            const btnBlue = document.getElementById('btnColorBlue');
            const btnNavy = document.getElementById('btnColorNavy');
            const btnBlack = document.getElementById('btnColorBlack');

            btnBlue.className = 'size-4.5 rounded-full bg-blue-900 transition-all cursor-pointer ' + (color === '#1e3a8a' ? 'ring-2 ring-blue-600 ring-offset-1' : '');
            btnNavy.className = 'size-4.5 rounded-full bg-slate-900 transition-all cursor-pointer ' + (color === '#0f172a' ? 'ring-2 ring-blue-600 ring-offset-1' : '');
            btnBlack.className = 'size-4.5 rounded-full bg-black transition-all cursor-pointer ' + (color === '#000000' ? 'ring-2 ring-blue-600 ring-offset-1' : '');

            if (hasDrawn) {
                syncCanvasData();
            }
        }

        function getCanvasPos(e) {
            const rect = canvas.getBoundingClientRect();
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
            }
            return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        }

        function startDrawing(e) {
            isDrawing = true;
            hasDrawn = true;
            const pos = getCanvasPos(e);
            lastPoint = pos;
            midPoint = pos;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, ctx.lineWidth / 2.5, 0, Math.PI * 2, true);
            ctx.fill();
            e.preventDefault();
        }

        function draw(e) {
            if (!isDrawing) return;
            const currentPoint = getCanvasPos(e);
            const currentMid = {
                x: (lastPoint.x + currentPoint.x) / 2,
                y: (lastPoint.y + currentPoint.y) / 2
            };

            ctx.beginPath();
            ctx.moveTo(midPoint.x, midPoint.y);
            ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, currentMid.x, currentMid.y);
            ctx.stroke();

            lastPoint = currentPoint;
            midPoint = currentMid;
            e.preventDefault();
        }

        function stopDrawing() {
            if (isDrawing) {
                isDrawing = false;
                if (lastPoint && midPoint) {
                    ctx.beginPath();
                    ctx.moveTo(midPoint.x, midPoint.y);
                    ctx.lineTo(lastPoint.x, lastPoint.y);
                    ctx.stroke();
                }
                lastPoint = null;
                midPoint = null;
                syncCanvasData();
            }
        }

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        window.addEventListener('touchend', stopDrawing);

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hasDrawn = false;
            signatureDataInput.value = '';
            document.getElementById('stampSigPreview').innerHTML = '<span class="text-[8px] italic text-slate-400 font-medium">[Tanda Tangan]</span>';
        }

        function getTrimmedSignatureDataUrl(srcCanvas) {
            const w = srcCanvas.width;
            const h = srcCanvas.height;
            const context = srcCanvas.getContext('2d');
            const imgData = context.getImageData(0, 0, w, h);
            const data = imgData.data;

            let minX = w, minY = h, maxX = 0, maxY = 0;
            let found = false;

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const alpha = data[(y * w + x) * 4 + 3];
                    if (alpha > 15) {
                        found = true;
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            if (!found) {
                return srcCanvas.toDataURL('image/png');
            }

            const pad = 14;
            minX = Math.max(0, minX - pad);
            minY = Math.max(0, minY - pad);
            maxX = Math.min(w, maxX + pad);
            maxY = Math.min(h, maxY + pad);

            const trimWidth = maxX - minX;
            const trimHeight = maxY - minY;

            const trimCanvas = document.createElement('canvas');
            trimCanvas.width = trimWidth;
            trimCanvas.height = trimHeight;
            const trimCtx = trimCanvas.getContext('2d');

            trimCtx.drawImage(
                srcCanvas,
                minX, minY, trimWidth, trimHeight,
                0, 0, trimWidth, trimHeight
            );

            return trimCanvas.toDataURL('image/png');
        }

        function syncCanvasData() {
            if (hasDrawn && currentSignatureType === 'draw') {
                const trimmedBase64 = getTrimmedSignatureDataUrl(canvas);
                signatureDataInput.value = trimmedBase64;
                document.getElementById('stampSigPreview').innerHTML = `<img src="${trimmedBase64}" alt="Sig" class="w-full h-full max-h-[38px] object-contain">`;
            }
        }

        // 2. Mode Switcher (Draw / Type / Upload)
        function switchSignatureMode(mode) {
            currentSignatureType = mode;
            document.getElementById('signatureTypeInput').value = mode;

            const btnDraw = document.getElementById('btnModeDraw');
            const btnType = document.getElementById('btnModeType');
            const btnUpload = document.getElementById('btnModeUpload');

            const drawContainer = document.getElementById('drawContainer');
            const typeContainer = document.getElementById('typeContainer');
            const uploadContainer = document.getElementById('uploadContainer');

            btnDraw.className = 'rounded-md px-2.5 py-0.5 text-[10.5px] transition-all cursor-pointer ' + (mode === 'draw' ? 'font-bold bg-white text-slate-900 shadow-2xs' : 'font-medium text-slate-600 hover:text-slate-900');
            btnType.className = 'rounded-md px-2.5 py-0.5 text-[10.5px] transition-all cursor-pointer ' + (mode === 'type' ? 'font-bold bg-white text-slate-900 shadow-2xs' : 'font-medium text-slate-600 hover:text-slate-900');
            btnUpload.className = 'rounded-md px-2.5 py-0.5 text-[10.5px] transition-all cursor-pointer ' + (mode === 'upload' ? 'font-bold bg-white text-slate-900 shadow-2xs' : 'font-medium text-slate-600 hover:text-slate-900');

            drawContainer.classList.toggle('hidden', mode !== 'draw');
            typeContainer.classList.toggle('hidden', mode !== 'type');
            uploadContainer.classList.toggle('hidden', mode !== 'upload');

            if (mode === 'draw') {
                syncCanvasData();
            } else if (mode === 'type') {
                generateTypedSignature('Caveat');
            }
        }

        // 3. Privy-Style Calligraphy Font Generator
        function selectTypeFont(fontFamily) {
            document.querySelectorAll('.font-preview-card').forEach(card => {
                card.className = 'font-preview-card rounded-xl border border-slate-200 bg-white p-2.5 text-center cursor-pointer transition-all hover:bg-slate-50';
            });
            event.currentTarget.className = 'font-preview-card active-font rounded-xl border-2 border-blue-600 bg-blue-50/60 p-2.5 text-center cursor-pointer transition-all hover:bg-blue-50';
            generateTypedSignature(fontFamily);
        }

        function generateTypedSignature(fontFamily) {
            const name = document.getElementById('accepted_name').value || '{{ $signer->name }}';
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 600;
            tempCanvas.height = 200;
            const tCtx = tempCanvas.getContext('2d');

            tCtx.font = `64px "${fontFamily}", cursive`;
            tCtx.fillStyle = strokeColor;
            tCtx.textAlign = 'center';
            tCtx.textBaseline = 'middle';
            tCtx.fillText(name, 300, 100);

            const trimmedBase64 = getTrimmedSignatureDataUrl(tempCanvas);
            signatureDataInput.value = trimmedBase64;
            document.getElementById('stampSigPreview').innerHTML = `<img src="${trimmedBase64}" alt="Sig" class="w-full h-full max-h-[38px] object-contain">`;
        }

        function handleSignatureFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                const rawBase64 = e.target.result;
                const img = new Image();
                img.onload = function() {
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = img.naturalWidth;
                    tempCanvas.height = img.naturalHeight;
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCtx.drawImage(img, 0, 0);
                    const trimmedBase64 = getTrimmedSignatureDataUrl(tempCanvas);

                    signatureDataInput.value = trimmedBase64;
                    const previewImg = document.getElementById('uploadPreview');
                    const previewWrapper = document.getElementById('uploadPreviewWrapper');
                    previewImg.src = trimmedBase64;
                    previewWrapper.classList.remove('hidden');
                    document.getElementById('stampSigPreview').innerHTML = `<img src="${trimmedBase64}" alt="Sig" class="w-full h-full max-h-[38px] object-contain">`;
                };
                img.src = rawBase64;
            };
            reader.readAsDataURL(file);
        }

        // 4. Customizer & Live Synchronizer
        function updateSignerTexts() {
            const nameVal = document.getElementById('accepted_name').value || 'Penanda Tangan';
            const titleVal = document.getElementById('signer_title').value || '';

            document.querySelectorAll('.stamp-display-name').forEach(el => el.innerText = nameVal);
            document.querySelectorAll('.font-display-preview').forEach(el => el.innerText = nameVal);
            document.querySelectorAll('.stamp-display-title').forEach(el => {
                el.innerText = titleVal;
                el.style.display = (titleVal && showSignerTitle) ? 'block' : 'none';
            });

            if (currentSignatureType === 'type') {
                const activeFontCard = document.querySelector('.font-preview-card.active-font');
                const fontName = activeFontCard ? activeFontCard.querySelector('span').innerText.split(' ')[0] : 'Caveat';
                generateTypedSignature(fontName);
            }
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

            document.getElementById('btnSizeCompact').className = 'rounded-xl border border-slate-200 bg-white p-2 text-center font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';
            document.getElementById('btnSizeStandard').className = 'rounded-xl border border-slate-200 bg-white p-2 text-center font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';
            document.getElementById('btnSizeLarge').className = 'rounded-xl border border-slate-200 bg-white p-2 text-center font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';

            if (label === 'Compact') {
                document.getElementById('btnSizeCompact').className = 'rounded-xl border-2 border-blue-600 bg-blue-50/70 p-2 text-center font-bold text-blue-950 transition-all cursor-pointer';
            } else if (label === 'Standar') {
                document.getElementById('btnSizeStandard').className = 'rounded-xl border-2 border-blue-600 bg-blue-50/70 p-2 text-center font-bold text-blue-950 transition-all cursor-pointer';
            } else if (label === 'Besar') {
                document.getElementById('btnSizeLarge').className = 'rounded-xl border-2 border-blue-600 bg-blue-50/70 p-2 text-center font-bold text-blue-950 transition-all cursor-pointer';
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

            // Calculate pixel size on current rendered canvas scale
            if (currentPdfViewport) {
                // PDF viewport width corresponds to PDF points/mm
                // Standard A4 width = 595.28 points = 210 mm (1mm = 2.83465 pt)
                const pageOriginalWidthMm = currentPdfPageUnscaledWidth / 2.83465;
                const pageOriginalHeightMm = currentPdfPageUnscaledHeight / 2.83465;

                const renderedPageWidthPx = currentPdfViewport.width;
                const renderedPageHeightPx = currentPdfViewport.height;

                const stampPxWidth = Math.round(renderedPageWidthPx * (currentStampWidthMm / pageOriginalWidthMm));
                const stampPxHeight = Math.round(renderedPageHeightPx * (currentStampHeightMm / pageOriginalHeightMm));

                const placementStamp = document.getElementById('placementStamp');
                placementStamp.style.width = Math.max(90, stampPxWidth) + 'px';
                placementStamp.style.height = Math.max(50, stampPxHeight) + 'px';
            }
        }

        // Toggle Element Handlers (QR, Name, Title, Border)
        function handleToggleElement(elem, isChecked) {
            const qrBlock = document.getElementById('stampQrBlock');
            const nameTop = document.getElementById('stampNameTop');
            const nameBottom = document.getElementById('stampNameBottom');
            const placementStamp = document.getElementById('placementStamp');
            const stampHeaderBar = document.getElementById('stampHeaderBar');

            if (elem === 'qr') {
                showQrCode = isChecked;
                document.getElementById('inputShowQr').value = isChecked ? '1' : '0';
                qrBlock.style.display = isChecked ? 'flex' : 'none';
            } else if (elem === 'name') {
                showSignerName = isChecked;
                document.getElementById('inputShowName').value = isChecked ? '1' : '0';
                if (currentNamePosition === 'top') {
                    nameTop.style.display = isChecked ? 'block' : 'none';
                } else {
                    nameBottom.style.display = isChecked ? 'block' : 'none';
                }
            } else if (elem === 'title') {
                showSignerTitle = isChecked;
                document.getElementById('inputShowTitle').value = isChecked ? '1' : '0';
                document.querySelectorAll('.stamp-display-title').forEach(el => {
                    el.style.display = (isChecked && el.innerText) ? 'block' : 'none';
                });
            } else if (elem === 'border') {
                showStampBorder = isChecked;
                document.getElementById('inputShowBorder').value = isChecked ? '1' : '0';
                if (isChecked) {
                    placementStamp.className = 'placement-stamp absolute z-10 rounded-lg border-2 border-blue-700 bg-white p-2 shadow-lg select-none cursor-grab';
                    stampHeaderBar.style.display = 'flex';
                } else {
                    placementStamp.className = 'placement-stamp absolute z-10 rounded-lg border-2 border-dashed border-blue-500 bg-white/80 p-2 shadow-xs select-none cursor-grab';
                    stampHeaderBar.style.display = 'none';
                }
            }
        }

        function setStampLayout(layout) {
            currentStampLayout = layout;
            document.getElementById('stampLayoutInput').value = layout;

            const btnSigLeft = document.getElementById('btnLayoutSigLeft');
            const btnQrLeft = document.getElementById('btnLayoutQrLeft');
            const stampInner = document.getElementById('stampInnerFlex');
            const sigBlock = document.getElementById('stampSigBlock');
            const qrBlock = document.getElementById('stampQrBlock');

            if (layout === 'sig_left') {
                btnSigLeft.className = 'rounded-xl border-2 border-blue-600 bg-blue-50/70 p-2 text-left font-bold text-blue-950 transition-all cursor-pointer';
                btnQrLeft.className = 'rounded-xl border border-slate-200 bg-white p-2 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';
                stampInner.innerHTML = '';
                stampInner.appendChild(sigBlock);
                stampInner.appendChild(qrBlock);
            } else {
                btnQrLeft.className = 'rounded-xl border-2 border-blue-600 bg-blue-50/70 p-2 text-left font-bold text-blue-950 transition-all cursor-pointer';
                btnSigLeft.className = 'rounded-xl border border-slate-200 bg-white p-2 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';
                stampInner.innerHTML = '';
                stampInner.appendChild(qrBlock);
                stampInner.appendChild(sigBlock);
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

        if (window.pdfjsLib) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf) {
                pdfDoc = pdf;
                totalPages = pdf.numPages;
                currentPage = totalPages; // Default to last signature page
                document.getElementById('pageCount').innerText = totalPages;
                document.getElementById('pdfLoadingSpinner').classList.add('hidden');
                
                renderPage(currentPage);
                updateCoordinates(currentPage, 60, 75);
            }).catch(function(err) {
                console.error('PDF load error:', err);
                document.getElementById('pdfLoadingSpinner').classList.add('hidden');
            });
        }

        function renderPage(pageNum) {
            if (!pdfDoc) return;
            pdfDoc.getPage(pageNum).then(function(page) {
                const containerWidth = Math.min(800, document.getElementById('pdfViewportContainer').clientWidth - 32);
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

        pageWrapper.addEventListener('click', function(e) {
            if (e.target === placementStamp || placementStamp.contains(e.target)) return;
            const rect = pageWrapper.getBoundingClientRect();
            let clickX = e.clientX - rect.left - (placementStamp.offsetWidth / 2);
            let clickY = e.clientY - rect.top - (placementStamp.offsetHeight / 2);

            clickX = Math.max(0, Math.min(rect.width - placementStamp.offsetWidth, clickX));
            clickY = Math.max(0, Math.min(rect.height - placementStamp.offsetHeight, clickY));

            const percentX = (clickX / rect.width) * 100;
            const percentY = (clickY / rect.height) * 100;
            updateCoordinates(currentPage, percentX, percentY);
        });

        // Form Submit Handler
        document.getElementById('signingForm').addEventListener('submit', function(e) {
            if (currentSignatureType === 'draw' && hasDrawn) {
                syncCanvasData();
            } else if (currentSignatureType === 'type') {
                const activeFontCard = document.querySelector('.font-preview-card.active-font');
                const fontName = activeFontCard ? activeFontCard.querySelector('span').innerText.split(' ')[0] : 'Caveat';
                generateTypedSignature(fontName);
            }
            
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div> <span>Membubuhkan Tanda Tangan...</span>';
        });

        // Initial setup
        updateSignerTexts();
    </script>
</body>
</html>

