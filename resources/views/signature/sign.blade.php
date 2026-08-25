<!doctype html>
<html lang="id" class="h-full bg-slate-50 antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Penandatanganan Dokumen Elektronik Resmi | RPK Law Firm</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <!-- PDF.js CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <style>
        body { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
            background-color: #f8fafc;
            background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
            background-size: 24px 24px;
        }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .pdf-studio-bg {
            background-color: #0f172a;
            background-image: 
                radial-gradient(circle at 50% 0%, rgba(30, 58, 138, 0.3) 0%, transparent 70%),
                radial-gradient(#334155 1px, transparent 1px);
            background-size: 100% 100%, 20px 20px;
        }

        .placement-stamp {
            cursor: grab;
            user-select: none;
            touch-action: none;
            transition: box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease;
        }
        .placement-stamp:active, .placement-stamp.is-dragging {
            cursor: grabbing;
            transform: scale(1.02);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.4), 0 20px 25px -5px rgba(15, 23, 42, 0.4);
        }
        
        .sig-baseline {
            background-image: repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(226, 232, 240, 0.8) 24px);
        }

        /* Custom Scrollbar for Smooth Viewport */
        .custom-scroll::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.6);
            border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
            background: rgba(71, 85, 105, 0.8);
            border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(100, 116, 139, 1);
        }
    </style>
</head>
<body class="min-h-screen text-slate-900 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">

    <div class="mx-auto w-full max-w-3xl space-y-5">
        
        <!-- Corporate Header -->
        <header class="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-4 sm:px-6 shadow-xs">
            <div class="flex items-center gap-3">
                <img 
                    src="/logo/logo.png" 
                    alt="RPK Law Firm" 
                    class="h-8 sm:h-9 w-auto max-w-[140px] object-contain"
                    onerror="this.onerror=null; this.src='/logo/raf-law-firm-transparent.png';"
                />
                <div class="border-l border-slate-200 pl-3">
                    <span class="text-xs font-black tracking-tight text-slate-900 uppercase block">RPK LAW FIRM</span>
                    <p class="text-[10px] font-semibold text-slate-500">Advocates &amp; Legal Consultants</p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <div class="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    <svg class="size-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>UU ITE &amp; SHA-256</span>
                </div>
                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-[11px] font-bold text-emerald-700">
                    <span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    VERIFIKASI AKTIF
                </span>
            </div>
        </header>

        <!-- Document Overview Hero Banner -->
        <div class="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-slate-50 p-4 sm:p-5 shadow-xs space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="rounded-md bg-blue-600 px-2.5 py-0.5 font-mono text-[9.5px] font-extrabold tracking-wider text-white uppercase">
                        PERMINTAAN TANDA TANGAN ELEKTRONIK
                    </span>
                    @if ($signer->signatureRequest->document->matter)
                        <span class="rounded-md bg-white border border-slate-200 px-2.5 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                            Perkara: {{ $signer->signatureRequest->document->matter->matter_number }}
                        </span>
                    @endif
                </div>

                @if ($signer->signatureRequest->expires_at)
                    <span class="rounded-md bg-amber-50 border border-amber-200 px-2.5 py-0.5 font-mono text-[11px] font-bold text-amber-900">
                        Batas Waktu: {{ $signer->signatureRequest->expires_at->translatedFormat('d M Y, H:i') }} WIB
                    </span>
                @endif
            </div>

            <h1 class="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-snug">
                {{ $signer->signatureRequest->document->title }}
            </h1>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-600 pt-1 border-t border-slate-100">
                <div class="flex items-center gap-2">
                    <span class="text-slate-400">Penandatangan:</span>
                    <strong class="text-slate-900">{{ $signer->name }}</strong>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-slate-400">Email:</span>
                    <strong class="font-mono text-slate-800">{{ $signer->email }}</strong>
                </div>
            </div>
        </div>

        <!-- Main Signing Form -->
        <form id="signingForm" method="post" action="{{ route('signature.sign.store', $signer->signing_token) }}" class="space-y-4">
            @csrf

            <!-- Section 01: Identitas & Gelar Penandatangan -->
            <div class="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3">
                <div class="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <span class="flex size-5.5 items-center justify-center rounded-full bg-blue-600 font-mono text-[10px] font-bold text-white shadow-xs">1</span>
                    <label class="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Identitas &amp; Keterangan Jabatan
                    </label>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label for="accepted_name" class="text-xs font-bold text-slate-700 block">
                            Nama Lengkap (Sesuai KTP / Akta Resmi) *
                        </label>
                        <input 
                            id="accepted_name" 
                            name="accepted_name" 
                            type="text"
                            value="{{ old('accepted_name', $signer->name) }}" 
                            required
                            placeholder="Nama lengkap penandatangan"
                            class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs font-bold text-slate-900 outline-hidden transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                        >
                        @error('accepted_name')
                            <p class="mt-1 text-xs text-rose-600 font-bold">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="space-y-1">
                        <label for="signer_title" class="text-xs font-bold text-slate-700 block">
                            Jabatan / Gelar / Keterangan (Opsional)
                        </label>
                        <input 
                            id="signer_title" 
                            name="signer_title" 
                            type="text"
                            value="{{ old('signer_title') }}" 
                            placeholder="Contoh: Advokat &amp; Konsultan Hukum / Direktur Utama"
                            class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs font-medium text-slate-900 outline-hidden transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                        >
                    </div>
                </div>
            </div>

            <!-- Section 02: Pilihan Format & Tata Letak Stempel (Layout) -->
            <div class="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3">
                <div class="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <span class="flex size-5.5 items-center justify-center rounded-full bg-blue-600 font-mono text-[10px] font-bold text-white shadow-xs">2</span>
                    <label class="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Tata Letak Stempel Resmi (Layout)
                    </label>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <!-- Layout Posisi Kolom -->
                    <div class="space-y-1.5">
                        <span class="text-xs font-bold text-slate-700">Posisi Kolom Tanda Tangan:</span>
                        <div class="grid grid-cols-2 gap-2">
                            <button 
                                type="button" 
                                id="btnLayoutSigLeft" 
                                onclick="setStampLayout('sig_left')" 
                                class="rounded-xl border-2 border-blue-600 bg-blue-50/90 p-2.5 text-left font-bold text-blue-950 transition-all cursor-pointer shadow-xs"
                            >
                                <div class="flex items-center justify-between text-[11px]">
                                    <span>Tanda Tangan Kiri</span>
                                    <span class="size-2 rounded-full bg-blue-600"></span>
                                </div>
                                <div class="text-[9.5px] font-normal text-slate-500 mt-0.5">QR Code di Kanan</div>
                            </button>
                            <button 
                                type="button" 
                                id="btnLayoutQrLeft" 
                                onclick="setStampLayout('qr_left')" 
                                class="rounded-xl border border-slate-200 bg-white p-2.5 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <div class="flex items-center justify-between text-[11px]">
                                    <span>QR Code Kiri</span>
                                    <span class="size-2 rounded-full bg-transparent"></span>
                                </div>
                                <div class="text-[9.5px] font-normal text-slate-400 mt-0.5">Tanda Tangan di Kanan</div>
                            </button>
                        </div>
                    </div>

                    <!-- Posisi Nama -->
                    <div class="space-y-1.5">
                        <span class="text-xs font-bold text-slate-700">Posisi Nama Penandatangan:</span>
                        <div class="grid grid-cols-2 gap-2">
                            <button 
                                type="button" 
                                id="btnNameBottom" 
                                onclick="setNamePosition('bottom')" 
                                class="rounded-xl border-2 border-blue-600 bg-blue-50/90 p-2.5 text-left font-bold text-blue-950 transition-all cursor-pointer shadow-xs"
                            >
                                <div class="text-[11px]">Nama di Bawah</div>
                                <div class="text-[9.5px] font-normal text-slate-500 mt-0.5">Format Standar Akta</div>
                            </button>
                            <button 
                                type="button" 
                                id="btnNameTop" 
                                onclick="setNamePosition('top')" 
                                class="rounded-xl border border-slate-200 bg-white p-2.5 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <div class="text-[11px]">Nama di Atas</div>
                                <div class="text-[9.5px] font-normal text-slate-400 mt-0.5">Format Header Akta</div>
                            </button>
                        </div>
                    </div>
                </div>

                <input type="hidden" name="stamp_layout" id="stampLayoutInput" value="sig_left">
                <input type="hidden" name="name_position" id="namePositionInput" value="bottom">
            </div>

            <!-- Section 03: Goresan Tanda Tangan Visual (Pad) -->
            <div class="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div class="flex items-center gap-2">
                        <span class="flex size-5.5 items-center justify-center rounded-full bg-blue-600 font-mono text-[10px] font-bold text-white shadow-xs">3</span>
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Goresan Tanda Tangan Visual
                            </label>
                            <p class="text-[11px] text-slate-500">
                                Goresan tanda tangan akan otomatis disinkronkan ke stempel dokumen.
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-1 rounded-xl bg-slate-100 p-0.5 text-xs self-start sm:self-auto">
                        <button 
                            type="button" 
                            id="btnModeDraw" 
                            onclick="switchSignatureMode('draw')" 
                            class="rounded-lg px-3 py-1 font-bold text-[11px] bg-white text-slate-900 shadow-2xs transition-all cursor-pointer"
                        >
                            Gores Pad
                        </button>
                        <button 
                            type="button" 
                            id="btnModeUpload" 
                            onclick="switchSignatureMode('upload')" 
                            class="rounded-lg px-3 py-1 font-semibold text-[11px] text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                        >
                            Unggah Foto
                        </button>
                    </div>
                </div>

                <!-- Ink Color Selector & Tool Bar -->
                <div id="drawToolbar" class="flex items-center justify-between text-xs pt-0.5">
                    <div class="flex items-center gap-2">
                        <span class="text-[11px] font-bold text-slate-500">Pilihan Warna Tinta:</span>
                        <button 
                            type="button" 
                            onclick="setPenColor('#1e3a8a')" 
                            id="btnColorBlue"
                            class="size-6 rounded-full bg-blue-900 ring-2 ring-blue-600 ring-offset-2 transition-all cursor-pointer" 
                            title="Biru Dokumen Legal Resmi"
                        ></button>
                        <button 
                            type="button" 
                            onclick="setPenColor('#0f172a')" 
                            id="btnColorNavy"
                            class="size-6 rounded-full bg-slate-900 transition-all cursor-pointer" 
                            title="Hitam Navy"
                        ></button>
                        <button 
                            type="button" 
                            onclick="setPenColor('#000000')" 
                            id="btnColorBlack"
                            class="size-6 rounded-full bg-black transition-all cursor-pointer" 
                            title="Hitam Pekat"
                        ></button>
                    </div>

                    <button 
                        type="button" 
                        onclick="clearCanvas()" 
                        class="cursor-pointer text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                    >
                        <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Hapus / Ulangi Goresan</span>
                    </button>
                </div>

                <!-- Canvas Area -->
                <div id="drawContainer" class="space-y-1.5">
                    <div class="relative overflow-hidden rounded-xl border border-slate-300 bg-white shadow-inner sig-baseline">
                        <canvas 
                            id="signatureCanvas" 
                            class="w-full h-36 touch-none cursor-crosshair bg-transparent"
                        ></canvas>
                        <div class="pointer-events-none absolute bottom-3 left-4 flex items-center gap-2">
                            <span class="font-mono text-xs font-bold text-slate-300">X</span>
                            <span class="h-px w-28 bg-slate-300"></span>
                            <span class="text-[10px] font-mono font-medium text-slate-400">Goreskan tanda tangan Anda di atas garis</span>
                        </div>
                    </div>
                </div>

                <!-- Upload Area -->
                <div id="uploadContainer" class="hidden space-y-2">
                    <input 
                        type="file" 
                        id="signatureFileInput" 
                        accept="image/png,image/jpeg,image/webp" 
                        class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-xs file:font-bold file:text-white"
                        onchange="handleSignatureFileUpload(event)"
                    >
                    <div id="uploadPreviewWrapper" class="hidden overflow-hidden rounded-xl border border-slate-200 bg-white p-4 text-center">
                        <img id="uploadPreview" src="" alt="Pratinjau Tanda Tangan" class="mx-auto max-h-24 object-contain">
                    </div>
                </div>

                <input type="hidden" name="signature_data" id="signatureDataInput" value="">
            </div>

            <!-- Section 04: Interactive PDF Placement Studio -->
            <div class="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="flex size-5.5 items-center justify-center rounded-full bg-blue-600 font-mono text-[10px] font-bold text-white shadow-xs">4</span>
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Posisi Stempel pada Dokumen PDF
                            </label>
                            <p class="text-[11px] text-slate-500">
                                Klik lembar dokumen atau geser kotak stempel ke posisi tanda tangan yang diinginkan.
                            </p>
                        </div>
                    </div>

                    <!-- Page Navigator -->
                    <div class="flex items-center gap-1.5 self-start sm:self-auto">
                        <button 
                            type="button" 
                            id="btnPrevPage" 
                            onclick="prevPage()"
                            class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-35 transition-colors cursor-pointer shadow-2xs"
                        >
                            ◀ Sebelumnya
                        </button>
                        <span class="font-mono text-xs font-bold text-slate-800 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                            Halaman <span id="pageNum">1</span> / <span id="pageCount">1</span>
                        </span>
                        <button 
                            type="button" 
                            id="btnNextPage" 
                            onclick="nextPage()"
                            class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-35 transition-colors cursor-pointer shadow-2xs"
                        >
                            Selanjutnya ▶
                        </button>
                    </div>
                </div>

                <!-- Presets & Coordinates Bar -->
                <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div class="flex flex-wrap items-center gap-1.5">
                        <span class="text-[11px] font-semibold text-slate-500">Pilihan Posisi Cepat:</span>
                        <button 
                            type="button" 
                            onclick="setPresetPosition('bottom-right')"
                            class="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer shadow-2xs"
                        >
                            Kanan Bawah
                        </button>
                        <button 
                            type="button" 
                            onclick="setPresetPosition('bottom-left')"
                            class="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer shadow-2xs"
                        >
                            Kiri Bawah
                        </button>
                        <button 
                            type="button" 
                            onclick="setPresetPosition('bottom-center')"
                            class="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer shadow-2xs"
                        >
                            Tengah Bawah
                        </button>
                    </div>

                    <span class="rounded-lg bg-slate-100 border border-slate-200/80 px-2.5 py-1 text-[10.5px] font-mono font-bold text-slate-700">
                        Hal <span id="displayPage">1</span> (<span id="displayX">60</span>% X, <span id="displayY">75</span>% Y)
                    </span>
                </div>

                <!-- PDF Viewport Drafting Area -->
                <div class="relative overflow-auto rounded-xl border border-slate-700 pdf-studio-bg p-4 sm:p-6 flex justify-center min-h-[480px] max-h-[640px] custom-scroll" id="pdfViewportContainer">
                    
                    <!-- Loading Spinner -->
                    <div id="pdfLoadingSpinner" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-20 space-y-2 text-white">
                        <div class="size-8 animate-spin rounded-full border-3 border-blue-500 border-t-transparent"></div>
                        <span class="text-xs font-bold tracking-wide">Memuat berkas PDF...</span>
                    </div>

                    <!-- Render Wrapper -->
                    <div class="relative shadow-2xl rounded-sm" id="pageWrapper">
                        <canvas id="pdfCanvas" class="bg-white block rounded-sm shadow-xl"></canvas>
                        
                        <!-- High-End Interactive Stamp Box -->
                        <div 
                            id="placementStamp" 
                            class="placement-stamp absolute z-10 rounded-xl border-2 border-blue-600 bg-white/98 backdrop-blur-md p-2.5 shadow-2xl ring-4 ring-blue-500/20 select-none cursor-grab"
                            style="width: 220px; height: 92px; left: 60%; top: 75%;"
                            title="Klik &amp; Geser untuk memindahkan posisi stempel"
                        >
                            <!-- Stamp Header Badge -->
                            <div class="flex items-center justify-between border-b border-slate-100 pb-1 mb-1">
                                <span class="text-[7.5px] font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                                    <span class="size-1.5 rounded-full bg-blue-600"></span>
                                    RPK OFFICIAL E-STAMP
                                </span>
                                <span class="text-[7px] font-mono text-slate-400">UU ITE</span>
                            </div>

                            <div id="stampInnerFlex" class="flex items-center justify-between gap-2 h-[calc(100%-16px)] w-full">
                                
                                <!-- Signature & Signer Text Block -->
                                <div id="stampSigBlock" class="flex flex-col justify-between h-full flex-1 min-w-0">
                                    <!-- Top Name Block -->
                                    <div id="stampNameTop" class="hidden">
                                        <p class="text-[9px] font-black text-slate-900 leading-tight truncate stamp-display-name">
                                            {{ $signer->name }}
                                        </p>
                                        <p class="text-[7px] font-semibold text-slate-500 leading-none truncate stamp-display-title"></p>
                                    </div>

                                    <!-- Signature Preview Area -->
                                    <div id="stampSigPreview" class="flex-1 flex items-center justify-center overflow-hidden min-h-[34px]">
                                        <span class="text-[9px] italic text-slate-400 font-medium">
                                            [Goresan Tanda Tangan]
                                        </span>
                                    </div>

                                    <!-- Bottom Name Block -->
                                    <div id="stampNameBottom" class="border-t border-slate-100 pt-0.5">
                                        <p class="text-[9px] font-black text-slate-900 leading-tight truncate stamp-display-name">
                                            {{ $signer->name }}
                                        </p>
                                        <p class="text-[7px] font-semibold text-slate-500 leading-none truncate stamp-display-title"></p>
                                    </div>
                                </div>

                                <!-- Official QR Verification Seal Block -->
                                <div id="stampQrBlock" class="shrink-0 flex flex-col items-center justify-center p-1 rounded-lg border border-blue-100 bg-blue-50/60 size-15">
                                    <img 
                                        src="{{ route('signature.qr', $signer->signatureRequest->verification_code) }}" 
                                        alt="QR" 
                                        class="size-13 object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Hidden Coordinate Form Inputs -->
                <input type="hidden" name="page_number" id="inputPageNumber" value="1">
                <input type="hidden" name="position_x" id="inputPositionX" value="60">
                <input type="hidden" name="position_y" id="inputPositionY" value="75">

                <p class="text-[11px] text-slate-500 font-medium">
                    💡 Tips: Klik sembarang area lembar PDF untuk menempatkan stempel secara presisi pada kolom tanda tangan Anda.
                </p>
            </div>

            <!-- Section 05: Pernyataan Hukum & Persetujuan -->
            <div class="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4">
                <label class="flex items-start gap-3 cursor-pointer text-xs leading-relaxed text-slate-800">
                    <input 
                        type="checkbox" 
                        name="accept_terms" 
                        value="1" 
                        required
                        class="mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    >
                    <span class="text-xs text-slate-700 font-medium leading-relaxed">
                        Saya menyatakan bahwa saya telah membaca, memahami isi dokumen, dan secara sah menyetujui pembubuhan tanda tangan elektronik resmi pada dokumen <strong>{{ $signer->signatureRequest->document->title }}</strong> ini sesuai ketentuan peraturan perundang-undangan (UU ITE).
                    </span>
                </label>
                @error('accept_terms')
                    <p class="text-xs text-rose-600 font-bold">{{ $message }}</p>
                @enderror

                <!-- Primary Submit Action Button -->
                <button 
                    type="submit"
                    id="submitBtn"
                    class="h-12 w-full rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 font-bold text-xs text-white shadow-lg shadow-blue-600/25 transition-all hover:from-blue-800 hover:to-indigo-800 hover:shadow-blue-600/35 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                    <svg class="size-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Konfirmasi &amp; Bubuhkan Tanda Tangan Resmi</span>
                </button>
            </div>
        </form>

        <!-- Cryptographic Assurance Badge -->
        <div class="rounded-xl border border-slate-200/80 bg-white/80 p-3.5 text-[11px] text-slate-500 leading-relaxed shadow-2xs font-medium">
            <strong>Integritas Kriptografi &amp; Audit Trail:</strong> Pembubuhan tanda tangan visual dan QR Code verifikasi pada koordinat terpilih akan dicatat secara permanen dengan hash SHA-256 dan stempel waktu resmi WIB pada sistem RPK Law Firm Workspace.
        </div>

        <!-- Footer -->
        <footer class="text-center space-y-1 text-xs text-slate-400 pt-2 pb-6">
            <p class="font-semibold text-slate-600">&copy; {{ date('Y') }} RPK Law Firm · Advocates &amp; Legal Consultants.</p>
            <p class="font-mono text-[10px]">Secure Digital Signature Protocol · UU ITE Compliant</p>
        </footer>

    </div>

    <!-- Scripts: Signature Pad, Layout Customizer & PDF.js Drag-and-Drop Placement Engine -->
    <script>
        // 1. Signature Pad Logic
        const canvas = document.getElementById('signatureCanvas');
        const ctx = canvas.getContext('2d');
        const signatureDataInput = document.getElementById('signatureDataInput');
        let isDrawing = false;
        let hasDrawn = false;
        let currentMode = 'draw';
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
            ctx.lineWidth = 2.8;
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

            btnBlue.className = 'size-6 rounded-full bg-blue-900 transition-all cursor-pointer ' + (color === '#1e3a8a' ? 'ring-2 ring-blue-600 ring-offset-2' : '');
            btnNavy.className = 'size-6 rounded-full bg-slate-900 transition-all cursor-pointer ' + (color === '#0f172a' ? 'ring-2 ring-blue-600 ring-offset-2' : '');
            btnBlack.className = 'size-6 rounded-full bg-black transition-all cursor-pointer ' + (color === '#000000' ? 'ring-2 ring-blue-600 ring-offset-2' : '');

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
            document.getElementById('stampSigPreview').innerHTML = '<span class="text-[9px] italic text-slate-400 font-medium">[Goresan Tanda Tangan]</span>';
        }

        // Bounding box auto-trim function to remove empty whitespace
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

            const pad = 16;
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
            if (hasDrawn && currentMode === 'draw') {
                const trimmedBase64 = getTrimmedSignatureDataUrl(canvas);
                signatureDataInput.value = trimmedBase64;
                document.getElementById('stampSigPreview').innerHTML = `<img src="${trimmedBase64}" alt="Sig" class="w-full h-full max-h-[46px] object-contain drop-shadow-2xs">`;
            }
        }

        function switchSignatureMode(mode) {
            currentMode = mode;
            const btnDraw = document.getElementById('btnModeDraw');
            const btnUpload = document.getElementById('btnModeUpload');
            const drawContainer = document.getElementById('drawContainer');
            const drawToolbar = document.getElementById('drawToolbar');
            const uploadContainer = document.getElementById('uploadContainer');

            if (mode === 'draw') {
                btnDraw.className = 'rounded-lg px-3 py-1 font-bold text-[11px] bg-white text-slate-900 shadow-2xs transition-all cursor-pointer';
                btnUpload.className = 'rounded-lg px-3 py-1 font-semibold text-[11px] text-slate-600 hover:text-slate-900 transition-all cursor-pointer';
                drawContainer.classList.remove('hidden');
                drawToolbar.classList.remove('hidden');
                uploadContainer.classList.add('hidden');
                syncCanvasData();
            } else {
                btnUpload.className = 'rounded-lg px-3 py-1 font-bold text-[11px] bg-white text-slate-900 shadow-2xs transition-all cursor-pointer';
                btnDraw.className = 'rounded-lg px-3 py-1 font-semibold text-[11px] text-slate-600 hover:text-slate-900 transition-all cursor-pointer';
                uploadContainer.classList.remove('hidden');
                drawContainer.classList.add('hidden');
                drawToolbar.classList.add('hidden');
            }
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
                    document.getElementById('stampSigPreview').innerHTML = `<img src="${trimmedBase64}" alt="Sig" class="w-full h-full max-h-[46px] object-contain">`;
                };
                img.src = rawBase64;
            };
            reader.readAsDataURL(file);
        }

        // 2. Custom Layout & Name Placement Controller
        let currentStampLayout = 'sig_left';
        let currentNamePosition = 'bottom';

        function updateSignerTexts() {
            const nameVal = document.getElementById('accepted_name').value || 'Penanda Tangan';
            const titleVal = document.getElementById('signer_title').value || '';

            document.querySelectorAll('.stamp-display-name').forEach(el => el.innerText = nameVal);
            document.querySelectorAll('.stamp-display-title').forEach(el => {
                el.innerText = titleVal;
                el.style.display = titleVal ? 'block' : 'none';
            });
        }

        document.getElementById('accepted_name').addEventListener('input', updateSignerTexts);
        document.getElementById('signer_title').addEventListener('input', updateSignerTexts);

        function setStampLayout(layout) {
            currentStampLayout = layout;
            document.getElementById('stampLayoutInput').value = layout;

            const btnSigLeft = document.getElementById('btnLayoutSigLeft');
            const btnQrLeft = document.getElementById('btnLayoutQrLeft');
            const stampInner = document.getElementById('stampInnerFlex');
            const sigBlock = document.getElementById('stampSigBlock');
            const qrBlock = document.getElementById('stampQrBlock');

            if (layout === 'sig_left') {
                btnSigLeft.className = 'rounded-xl border-2 border-blue-600 bg-blue-50/90 p-2.5 text-left font-bold text-blue-950 transition-all cursor-pointer shadow-xs';
                btnQrLeft.className = 'rounded-xl border border-slate-200 bg-white p-2.5 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';
                stampInner.innerHTML = '';
                stampInner.appendChild(sigBlock);
                stampInner.appendChild(qrBlock);
            } else {
                btnQrLeft.className = 'rounded-xl border-2 border-blue-600 bg-blue-50/90 p-2.5 text-left font-bold text-blue-950 transition-all cursor-pointer shadow-xs';
                btnSigLeft.className = 'rounded-xl border border-slate-200 bg-white p-2.5 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';
                stampInner.innerHTML = '';
                stampInner.appendChild(qrBlock);
                stampInner.appendChild(sigBlock);
            }
        }

        function setNamePosition(pos) {
            currentNamePosition = pos;
            document.getElementById('namePositionInput').value = pos;

            const btnBottom = document.getElementById('btnNameBottom');
            const btnTop = document.getElementById('btnNameTop');
            const nameTopEl = document.getElementById('stampNameTop');
            const nameBottomEl = document.getElementById('stampNameBottom');

            if (pos === 'bottom') {
                btnBottom.className = 'rounded-xl border-2 border-blue-600 bg-blue-50/90 p-2.5 text-left font-bold text-blue-950 transition-all cursor-pointer shadow-xs';
                btnTop.className = 'rounded-xl border border-slate-200 bg-white p-2.5 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';
                nameTopEl.classList.add('hidden');
                nameBottomEl.classList.remove('hidden');
            } else {
                btnTop.className = 'rounded-xl border-2 border-blue-600 bg-blue-50/90 p-2.5 text-left font-bold text-blue-950 transition-all cursor-pointer shadow-xs';
                btnBottom.className = 'rounded-xl border border-slate-200 bg-white p-2.5 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';
                nameBottomEl.classList.add('hidden');
                nameTopEl.classList.remove('hidden');
            }
        }

        // Initialize display texts
        updateSignerTexts();

        // 3. PDF.js & Visual Placement Layer
        const pdfUrl = "{{ route('signature.sign.pdf', $signer->signing_token) }}";
        let pdfDoc = null;
        let currentPage = 1;
        let totalPages = 1;
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
                currentPage = totalPages; // Default to last page for signature
                document.getElementById('pageCount').innerText = totalPages;
                document.getElementById('pdfLoadingSpinner').classList.add('hidden');
                
                renderPage(currentPage);
                updateCoordinates(currentPage, 60, 75);
            }).catch(function(err) {
                console.error('PDF load error:', err);
                document.getElementById('pdfLoadingSpinner').innerHTML = '<span class="text-xs font-bold text-slate-300">Pratinjau visual siap.</span>';
                setTimeout(() => document.getElementById('pdfLoadingSpinner').classList.add('hidden'), 800);
            });
        }

        function renderPage(pageNum) {
            if (!pdfDoc) return;
            pdfDoc.getPage(pageNum).then(function(page) {
                const containerWidth = Math.min(640, document.getElementById('pdfViewportContainer').clientWidth - 40);
                const unscaledViewport = page.getViewport({ scale: 1 });
                const scale = containerWidth / unscaledViewport.width;
                const viewport = page.getViewport({ scale: scale });

                pdfCanvas.height = viewport.height;
                pdfCanvas.width = viewport.width;
                pageWrapper.style.width = viewport.width + 'px';
                pageWrapper.style.height = viewport.height + 'px';

                const renderContext = {
                    canvasContext: pdfCtx,
                    viewport: viewport
                };
                page.render(renderContext);

                document.getElementById('pageNum').innerText = pageNum;
                document.getElementById('btnPrevPage').disabled = pageNum <= 1;
                document.getElementById('btnNextPage').disabled = pageNum >= totalPages;
                
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

        // 4. Drag and Click-to-place logic
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
            
            // Boundary constraints inside pageWrapper
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

        // Click anywhere on wrapper to place stamp
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

        document.getElementById('signingForm').addEventListener('submit', function() {
            if (currentMode === 'draw' && hasDrawn) {
                syncCanvasData();
            }
        });
    </script>
</body>
</html>
