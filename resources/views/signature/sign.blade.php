<!doctype html>
<html lang="id" class="h-full bg-slate-50 antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Penandatanganan Dokumen Elektronik Resmi | RPK Law Firm</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <!-- PDF.js CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <style>
        body { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
        }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .placement-stamp {
            cursor: grab;
            user-select: none;
            touch-action: none;
            transition: box-shadow 0.15s ease, transform 0.15s ease;
        }
        .placement-stamp:active, .placement-stamp.is-dragging {
            cursor: grabbing;
            transform: scale(1.015);
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5), 0 12px 20px -4px rgba(0, 0, 0, 0.15);
        }
        
        .sig-baseline {
            background-image: repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(226, 232, 240, 0.8) 24px);
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
<body class="min-h-screen bg-slate-50 text-slate-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 selection:bg-slate-900 selection:text-white">

    <div class="mx-auto w-full max-w-4xl space-y-4">
        
        <!-- Header -->
        <header class="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div class="flex items-center gap-3">
                <img 
                    src="/logo/logo.png" 
                    alt="RPK Law Firm" 
                    class="h-8 w-auto max-w-[130px] object-contain"
                    onerror="this.onerror=null; this.src='/logo/raf-law-firm-transparent.png';"
                />
                <div class="border-l border-slate-200 pl-3">
                    <span class="text-xs font-bold tracking-tight text-slate-900 uppercase block">RPK LAW FIRM</span>
                    <p class="text-[10.5px] text-slate-500">Legal Practice Workspace</p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <span class="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10.5px] font-medium text-slate-600">
                    UU ITE &amp; SHA-256 Valid
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-emerald-700">
                    <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    VERIFIKASI AKTIF
                </span>
            </div>
        </header>

        <!-- Document Info Banner -->
        <div class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-2.5">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-1.5">
                    <span class="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700 uppercase">
                        Permintaan Tanda Tangan
                    </span>
                    @if ($signer->signatureRequest->document->matter)
                        <span class="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10.5px] font-semibold text-slate-700">
                            Perkara: {{ $signer->signatureRequest->document->matter->matter_number }}
                        </span>
                    @endif
                </div>

                @if ($signer->signatureRequest->expires_at)
                    <span class="font-mono text-[11px] text-slate-500">
                        Batas Waktu: <strong class="text-slate-800">{{ $signer->signatureRequest->expires_at->translatedFormat('d M Y, H:i') }} WIB</strong>
                    </span>
                @endif
            </div>

            <div>
                <h1 class="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                    {{ $signer->signatureRequest->document->title }}
                </h1>
                <p class="text-xs text-slate-500 mt-0.5">
                    Penandatangan: <strong class="text-slate-800">{{ $signer->name }}</strong> (<span class="font-mono">{{ $signer->email }}</span>)
                </p>
            </div>
        </div>

        <!-- Main Form -->
        <form id="signingForm" method="post" action="{{ route('signature.sign.store', $signer->signing_token) }}" class="space-y-4">
            @csrf

            <!-- 1. Identitas & Gelar Penandatangan -->
            <div class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
                <div class="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <span class="flex size-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">1</span>
                    <h2 class="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Identitas &amp; Keterangan Jabatan
                    </h2>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label for="accepted_name" class="text-xs font-bold text-slate-700 block">
                            Nama Lengkap (Sesuai KTP / Akta) *
                        </label>
                        <input 
                            id="accepted_name" 
                            name="accepted_name" 
                            type="text"
                            value="{{ old('accepted_name', $signer->name) }}" 
                            required
                            placeholder="Nama lengkap penandatangan"
                            class="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-hidden transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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
                            placeholder="Contoh: Advokat &amp; Konsultan Hukum / Direktur"
                            class="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 outline-hidden transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        >
                    </div>
                </div>
            </div>

            <!-- 2. Pilihan Format & Tata Letak Stempel -->
            <div class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
                <div class="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <span class="flex size-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">2</span>
                    <h2 class="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Format &amp; Tata Letak Stempel (Layout)
                    </h2>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <!-- Layout Posisi Kolom -->
                    <div class="space-y-1.5">
                        <span class="text-xs font-semibold text-slate-700">Posisi Kolom Tanda Tangan:</span>
                        <div class="grid grid-cols-2 gap-2">
                            <button 
                                type="button" 
                                id="btnLayoutSigLeft" 
                                onclick="setStampLayout('sig_left')" 
                                class="rounded-lg border-2 border-blue-600 bg-blue-50/70 p-2 text-left font-bold text-blue-950 transition-all cursor-pointer"
                            >
                                <div class="text-[11px]">Tanda Tangan Kiri</div>
                                <div class="text-[9.5px] font-normal text-slate-500 mt-0.5">QR Code di Kanan</div>
                            </button>
                            <button 
                                type="button" 
                                id="btnLayoutQrLeft" 
                                onclick="setStampLayout('qr_left')" 
                                class="rounded-lg border border-slate-200 bg-white p-2 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <div class="text-[11px]">QR Code Kiri</div>
                                <div class="text-[9.5px] font-normal text-slate-400 mt-0.5">Tanda Tangan di Kanan</div>
                            </button>
                        </div>
                    </div>

                    <!-- Posisi Nama -->
                    <div class="space-y-1.5">
                        <span class="text-xs font-semibold text-slate-700">Posisi Nama Penandatangan:</span>
                        <div class="grid grid-cols-2 gap-2">
                            <button 
                                type="button" 
                                id="btnNameBottom" 
                                onclick="setNamePosition('bottom')" 
                                class="rounded-lg border-2 border-blue-600 bg-blue-50/70 p-2 text-left font-bold text-blue-950 transition-all cursor-pointer"
                            >
                                <div class="text-[11px]">Nama di Bawah</div>
                                <div class="text-[9.5px] font-normal text-slate-500 mt-0.5">Standar Akta</div>
                            </button>
                            <button 
                                type="button" 
                                id="btnNameTop" 
                                onclick="setNamePosition('top')" 
                                class="rounded-lg border border-slate-200 bg-white p-2 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <div class="text-[11px]">Nama di Atas</div>
                                <div class="text-[9.5px] font-normal text-slate-400 mt-0.5">Format Header</div>
                            </button>
                        </div>
                    </div>
                </div>

                <input type="hidden" name="stamp_layout" id="stampLayoutInput" value="sig_left">
                <input type="hidden" name="name_position" id="namePositionInput" value="bottom">
            </div>

            <!-- 3. Goresan Tanda Tangan Visual -->
            <div class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div class="flex items-center gap-2">
                        <span class="flex size-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">3</span>
                        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-800">
                            Goresan Tanda Tangan Visual
                        </h2>
                    </div>

                    <div class="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-xs">
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
                            id="btnModeUpload" 
                            onclick="switchSignatureMode('upload')" 
                            class="rounded-md px-2.5 py-0.5 font-medium text-[10.5px] text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                        >
                            Unggah Foto
                        </button>
                    </div>
                </div>

                <!-- Ink Color & Clear Toolbar -->
                <div id="drawToolbar" class="flex items-center justify-between text-xs pt-0.5">
                    <div class="flex items-center gap-2">
                        <span class="text-[11px] font-medium text-slate-500">Warna Tinta:</span>
                        <button 
                            type="button" 
                            onclick="setPenColor('#1e3a8a')" 
                            id="btnColorBlue"
                            class="size-5 rounded-full bg-blue-900 ring-2 ring-blue-600 ring-offset-1 transition-all cursor-pointer" 
                            title="Biru Dokumen Legal"
                        ></button>
                        <button 
                            type="button" 
                            onclick="setPenColor('#0f172a')" 
                            id="btnColorNavy"
                            class="size-5 rounded-full bg-slate-900 transition-all cursor-pointer" 
                            title="Hitam Navy"
                        ></button>
                        <button 
                            type="button" 
                            onclick="setPenColor('#000000')" 
                            id="btnColorBlack"
                            class="size-5 rounded-full bg-black transition-all cursor-pointer" 
                            title="Hitam Pekat"
                        ></button>
                    </div>

                    <button 
                        type="button" 
                        onclick="clearCanvas()" 
                        class="cursor-pointer text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                    >
                        <span>Hapus / Ulangi</span>
                    </button>
                </div>

                <!-- Canvas Area -->
                <div id="drawContainer" class="space-y-1">
                    <div class="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-inner sig-baseline">
                        <canvas 
                            id="signatureCanvas" 
                            class="w-full h-32 touch-none cursor-crosshair bg-transparent"
                        ></canvas>
                        <div class="pointer-events-none absolute bottom-2.5 left-3 flex items-center gap-2">
                            <span class="font-mono text-xs font-bold text-slate-300">X</span>
                            <span class="h-px w-20 bg-slate-200"></span>
                            <span class="text-[9.5px] font-mono text-slate-400">Gores tanda tangan di sini</span>
                        </div>
                    </div>
                </div>

                <!-- Upload Area -->
                <div id="uploadContainer" class="hidden space-y-2">
                    <input 
                        type="file" 
                        id="signatureFileInput" 
                        accept="image/png,image/jpeg,image/webp" 
                        class="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-white"
                        onchange="handleSignatureFileUpload(event)"
                    >
                    <div id="uploadPreviewWrapper" class="hidden overflow-hidden rounded-lg border border-slate-200 bg-white p-3 text-center">
                        <img id="uploadPreview" src="" alt="Pratinjau Tanda Tangan" class="mx-auto max-h-20 object-contain">
                    </div>
                </div>

                <input type="hidden" name="signature_data" id="signatureDataInput" value="">
            </div>

            <!-- 4. Penempatan Stempel pada Dokumen PDF -->
            <div class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div class="flex items-center gap-2">
                        <span class="flex size-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">4</span>
                        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-800">
                            Penempatan Stempel pada Dokumen PDF
                        </h2>
                    </div>

                    <!-- Page Navigator -->
                    <div class="flex items-center gap-1">
                        <button 
                            type="button" 
                            id="btnPrevPage" 
                            onclick="prevPage()"
                            class="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-35 transition-colors cursor-pointer"
                        >
                            ◀
                        </button>
                        <span class="font-mono text-xs font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                            <span id="pageNum">1</span> / <span id="pageCount">1</span>
                        </span>
                        <button 
                            type="button" 
                            id="btnNextPage" 
                            onclick="nextPage()"
                            class="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-35 transition-colors cursor-pointer"
                        >
                            ▶
                        </button>
                    </div>
                </div>

                <!-- Presets & Coordinates Bar -->
                <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div class="flex flex-wrap items-center gap-1.5">
                        <span class="text-[11px] text-slate-500">Posisi Cepat:</span>
                        <button 
                            type="button" 
                            onclick="setPresetPosition('bottom-right')"
                            class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            Kanan Bawah
                        </button>
                        <button 
                            type="button" 
                            onclick="setPresetPosition('bottom-left')"
                            class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            Kiri Bawah
                        </button>
                        <button 
                            type="button" 
                            onclick="setPresetPosition('bottom-center')"
                            class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            Tengah Bawah
                        </button>
                    </div>

                    <span class="rounded bg-slate-100 px-2 py-0.5 text-[10.5px] font-mono text-slate-600">
                        Hal <span id="displayPage">1</span> (<span id="displayX">60</span>% X, <span id="displayY">75</span>% Y)
                    </span>
                </div>

                <!-- PDF Viewport Drafting Area -->
                <div class="relative overflow-auto rounded-lg border border-slate-200 bg-slate-100/70 p-3 sm:p-5 flex justify-center min-h-[440px] max-h-[600px] custom-scroll" id="pdfViewportContainer">
                    
                    <!-- Loading Spinner -->
                    <div id="pdfLoadingSpinner" class="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20 space-y-2 text-slate-700">
                        <div class="size-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
                        <span class="text-xs font-semibold">Memuat PDF...</span>
                    </div>

                    <!-- Render Wrapper -->
                    <div class="relative shadow-sm rounded-sm" id="pageWrapper">
                        <canvas id="pdfCanvas" class="bg-white block rounded-sm shadow-xs"></canvas>
                        
                        <!-- Interactive Stamp Box -->
                        <div 
                            id="placementStamp" 
                            class="placement-stamp absolute z-10 rounded-lg border-2 border-blue-600 bg-white p-2 shadow-md select-none cursor-grab"
                            style="width: 210px; height: 86px; left: 60%; top: 75%;"
                            title="Geser untuk memindahkan stempel"
                        >
                            <!-- Stamp Header Badge -->
                            <div class="flex items-center justify-between border-b border-slate-100 pb-0.5 mb-1">
                                <span class="text-[7.5px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                                    <span class="size-1 rounded-full bg-blue-600"></span>
                                    RPK E-STAMP
                                </span>
                                <span class="text-[7px] font-mono text-slate-400">UU ITE</span>
                            </div>

                            <div id="stampInnerFlex" class="flex items-center justify-between gap-1.5 h-[calc(100%-14px)] w-full">
                                
                                <!-- Signature & Signer Text Block -->
                                <div id="stampSigBlock" class="flex flex-col justify-between h-full flex-1 min-w-0">
                                    <!-- Top Name Block -->
                                    <div id="stampNameTop" class="hidden">
                                        <p class="text-[8.5px] font-bold text-slate-900 leading-tight truncate stamp-display-name">
                                            {{ $signer->name }}
                                        </p>
                                        <p class="text-[7px] text-slate-500 leading-none truncate stamp-display-title"></p>
                                    </div>

                                    <!-- Signature Preview Area -->
                                    <div id="stampSigPreview" class="flex-1 flex items-center justify-center overflow-hidden min-h-[30px]">
                                        <span class="text-[8.5px] italic text-slate-400 font-medium">
                                            [Tanda Tangan]
                                        </span>
                                    </div>

                                    <!-- Bottom Name Block -->
                                    <div id="stampNameBottom" class="border-t border-slate-100 pt-0.5">
                                        <p class="text-[8.5px] font-bold text-slate-900 leading-tight truncate stamp-display-name">
                                            {{ $signer->name }}
                                        </p>
                                        <p class="text-[7px] text-slate-500 leading-none truncate stamp-display-title"></p>
                                    </div>
                                </div>

                                <!-- Official QR Verification Seal Block -->
                                <div id="stampQrBlock" class="shrink-0 flex items-center justify-center p-0.5 rounded border border-slate-100 bg-slate-50 size-13">
                                    <img 
                                        src="{{ route('signature.qr', $signer->signatureRequest->verification_code) }}" 
                                        alt="QR" 
                                        class="size-12 object-contain"
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

                <p class="text-[11px] text-slate-500">
                    💡 Klik sembarang area lembar PDF untuk menempatkan stempel secara presisi.
                </p>
            </div>

            <!-- 5. Persetujuan & Tombol Submit -->
            <div class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
                <label class="flex items-start gap-2.5 cursor-pointer text-xs text-slate-800">
                    <input 
                        type="checkbox" 
                        name="accept_terms" 
                        value="1" 
                        required
                        class="mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
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
                    class="h-10 w-full rounded-lg bg-slate-900 font-bold text-xs text-white shadow-2xs hover:bg-black active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                    <svg class="size-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Konfirmasi &amp; Bubuhkan Tanda Tangan Resmi</span>
                </button>
            </div>
        </form>

        <!-- Footer -->
        <footer class="text-center space-y-1 text-xs text-slate-400 pt-2 pb-4">
            <p class="font-medium text-slate-600">&copy; {{ date('Y') }} RPK Law Firm · Advocates &amp; Legal Consultants.</p>
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

            btnBlue.className = 'size-5 rounded-full bg-blue-900 transition-all cursor-pointer ' + (color === '#1e3a8a' ? 'ring-2 ring-blue-600 ring-offset-1' : '');
            btnNavy.className = 'size-5 rounded-full bg-slate-900 transition-all cursor-pointer ' + (color === '#0f172a' ? 'ring-2 ring-blue-600 ring-offset-1' : '');
            btnBlack.className = 'size-5 rounded-full bg-black transition-all cursor-pointer ' + (color === '#000000' ? 'ring-2 ring-blue-600 ring-offset-1' : '');

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
            document.getElementById('stampSigPreview').innerHTML = '<span class="text-[8.5px] italic text-slate-400 font-medium">[Tanda Tangan]</span>';
        }

        // Bounding box auto-trim function
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
                document.getElementById('stampSigPreview').innerHTML = `<img src="${trimmedBase64}" alt="Sig" class="w-full h-full max-h-[42px] object-contain">`;
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
                btnDraw.className = 'rounded-md px-2.5 py-0.5 font-bold text-[10.5px] bg-white text-slate-900 shadow-2xs transition-all cursor-pointer';
                btnUpload.className = 'rounded-md px-2.5 py-0.5 font-medium text-[10.5px] text-slate-600 hover:text-slate-900 transition-all cursor-pointer';
                drawContainer.classList.remove('hidden');
                drawToolbar.classList.remove('hidden');
                uploadContainer.classList.add('hidden');
                syncCanvasData();
            } else {
                btnUpload.className = 'rounded-md px-2.5 py-0.5 font-bold text-[10.5px] bg-white text-slate-900 shadow-2xs transition-all cursor-pointer';
                btnDraw.className = 'rounded-md px-2.5 py-0.5 font-medium text-[10.5px] text-slate-600 hover:text-slate-900 transition-all cursor-pointer';
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
                    document.getElementById('stampSigPreview').innerHTML = `<img src="${trimmedBase64}" alt="Sig" class="w-full h-full max-h-[42px] object-contain">`;
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
                btnSigLeft.className = 'rounded-lg border-2 border-blue-600 bg-blue-50/70 p-2 text-left font-bold text-blue-950 transition-all cursor-pointer';
                btnQrLeft.className = 'rounded-lg border border-slate-200 bg-white p-2 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';
                stampInner.innerHTML = '';
                stampInner.appendChild(sigBlock);
                stampInner.appendChild(qrBlock);
            } else {
                btnQrLeft.className = 'rounded-lg border-2 border-blue-600 bg-blue-50/70 p-2 text-left font-bold text-blue-950 transition-all cursor-pointer';
                btnSigLeft.className = 'rounded-lg border border-slate-200 bg-white p-2 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';
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
                btnBottom.className = 'rounded-lg border-2 border-blue-600 bg-blue-50/70 p-2 text-left font-bold text-blue-950 transition-all cursor-pointer';
                btnTop.className = 'rounded-lg border border-slate-200 bg-white p-2 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';
                nameTopEl.classList.add('hidden');
                nameBottomEl.classList.remove('hidden');
            } else {
                btnTop.className = 'rounded-lg border-2 border-blue-600 bg-blue-50/70 p-2 text-left font-bold text-blue-950 transition-all cursor-pointer';
                btnBottom.className = 'rounded-lg border border-slate-200 bg-white p-2 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';
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
                currentPage = totalPages; // Default to last page
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
                const containerWidth = Math.min(720, document.getElementById('pdfViewportContainer').clientWidth - 30);
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

        document.getElementById('signingForm').addEventListener('submit', function() {
            if (currentMode === 'draw' && hasDrawn) {
                syncCanvasData();
            }
        });
    </script>
</body>
</html>
