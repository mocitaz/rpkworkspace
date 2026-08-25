<!doctype html>
<html lang="id" class="h-full bg-slate-100 antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Penerimaan &amp; Pembubuhan Tanda Tangan Resmi | RPK Law Firm</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <!-- PDF.js CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <style>
        body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .pdf-drafting-bg {
            background-color: #1e293b;
            background-image: radial-gradient(#334155 1px, transparent 1px);
            background-size: 16px 16px;
        }

        .placement-stamp {
            cursor: move;
            user-select: none;
            touch-action: none;
            transition: box-shadow 0.15s ease, transform 0.05s ease;
        }
        .placement-stamp:active {
            cursor: grabbing;
            transform: scale(1.02);
            box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.4), 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }
        
        .sig-baseline {
            background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, #e2e8f0 20px);
        }
    </style>
</head>
<body class="min-h-full bg-slate-100 text-slate-900 flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-[840px] space-y-5">
        
        <!-- Corporate Header -->
        <header class="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:px-6 shadow-sm">
            <div class="flex items-center gap-3.5">
                <img 
                    src="/logo/logo.png" 
                    alt="RPK Law Firm" 
                    class="h-9 w-auto max-w-[150px] object-contain"
                    onerror="this.onerror=null; this.src='/logo/raf-law-firm-transparent.png';"
                />
                <div class="border-l border-slate-200 pl-3">
                    <h2 class="text-xs font-black tracking-tight text-slate-900 uppercase">RPK LAW FIRM</h2>
                    <p class="text-[10px] font-semibold text-slate-500">Advocates &amp; Legal Consultants</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-mono text-[11px] font-bold text-slate-800 border border-slate-200">
                    <span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    VERIFIKASI DIGITAL AKTIF
                </span>
            </div>
        </header>

        <!-- Main Form Card -->
        <main class="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-7">
            
            <!-- Document Meta Header -->
            <div class="space-y-3 border-b border-slate-100 pb-5">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="rounded-md bg-slate-900 px-2.5 py-1 font-mono text-[9px] font-extrabold tracking-wider text-white uppercase">
                        PERMINTAAN TANDA TANGAN ELEKTRONIK
                    </span>
                    @if ($signer->signatureRequest->expires_at)
                        <span class="rounded-md bg-amber-50 border border-amber-200/80 px-2.5 py-1 font-mono text-[11px] font-bold text-amber-900">
                            Batas Waktu: {{ $signer->signatureRequest->expires_at->translatedFormat('d F Y, H:i') }} WIB
                        </span>
                    @endif
                </div>

                <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                    {{ $signer->signatureRequest->document->title }}
                </h1>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-medium pt-1">
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400">Penandatangan:</span>
                        <strong class="text-slate-900">{{ $signer->name }}</strong>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400">Email:</span>
                        <strong class="font-mono text-slate-800">{{ $signer->email }}</strong>
                    </div>
                    @if ($signer->signatureRequest->document->matter)
                        <div class="flex items-center gap-2">
                            <span class="text-slate-400">Nomor Perkara:</span>
                            <strong class="font-mono text-slate-800">{{ $signer->signatureRequest->document->matter->matter_number }}</strong>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Signing Form -->
            <form id="signingForm" method="post" action="{{ route('signature.sign.store', $signer->signing_token) }}" class="space-y-7">
                @csrf

                <!-- Section 01: Identitas Nama -->
                <div class="space-y-2">
                    <div class="flex items-center gap-2">
                        <span class="flex size-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">01</span>
                        <label for="accepted_name" class="text-xs font-bold uppercase tracking-wider text-slate-800">
                            Nama Lengkap Penandatangan (Sesuai KTP / Identitas Resmi) *
                        </label>
                    </div>
                    <input 
                        id="accepted_name" 
                        name="accepted_name" 
                        type="text"
                        value="{{ old('accepted_name', $signer->name) }}" 
                        required
                        placeholder="Masukkan nama lengkap berserta gelar (bila ada)"
                        class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-xs font-semibold text-slate-900 outline-none transition-colors focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                    >
                    @error('accepted_name')
                        <p class="text-xs text-rose-600 font-bold">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Section 02: Goresan Tanda Tangan Pad -->
                <div class="space-y-3 rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 sm:p-5">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                        <div class="flex items-center gap-2">
                            <span class="flex size-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">02</span>
                            <div>
                                <label class="text-xs font-bold uppercase tracking-wider text-slate-800">
                                    Goreskan Tanda Tangan Visual
                                </label>
                                <p class="text-[11px] text-slate-500">
                                    Tanda tangan visual ini akan ditempelkan pada stempel resmi dokumen PDF.
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 rounded-xl bg-white p-1 border border-slate-200 text-xs self-start sm:self-auto shadow-2xs">
                            <button 
                                type="button" 
                                id="btnModeDraw" 
                                onclick="switchSignatureMode('draw')" 
                                class="rounded-lg px-3 py-1 font-bold text-[11px] bg-slate-900 text-white transition-all cursor-pointer"
                            >
                                Goreskan Pad
                            </button>
                            <button 
                                type="button" 
                                id="btnModeUpload" 
                                onclick="switchSignatureMode('upload')" 
                                class="rounded-lg px-3 py-1 font-bold text-[11px] text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                                Unggah Berkas Gambar
                            </button>
                        </div>
                    </div>

                    <!-- Canvas Area -->
                    <div id="drawContainer" class="space-y-2">
                        <div class="relative overflow-hidden rounded-xl border border-slate-300 bg-white shadow-inner sig-baseline">
                            <canvas 
                                id="signatureCanvas" 
                                class="w-full h-36 touch-none cursor-crosshair bg-transparent"
                            ></canvas>
                            <div class="pointer-events-none absolute bottom-3 left-4 flex items-center gap-2">
                                <span class="font-mono text-xs font-bold text-slate-300">X</span>
                                <span class="h-px w-32 bg-slate-300"></span>
                                <span class="text-[10px] font-mono font-medium text-slate-400">Goreskan tanda tangan Anda di atas garis</span>
                            </div>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-[11px] text-slate-400 font-medium">Goresan akan otomatis diperbarui secara langsung ke stempel di bawah.</span>
                            <button 
                                type="button" 
                                onclick="clearCanvas()" 
                                class="cursor-pointer font-bold text-rose-600 hover:text-rose-700 hover:underline"
                            >
                                Hapus / Ulangi Goresan
                            </button>
                        </div>
                    </div>

                    <!-- Upload Area -->
                    <div id="uploadContainer" class="hidden space-y-2">
                        <input 
                            type="file" 
                            id="signatureFileInput" 
                            accept="image/png,image/jpeg,image/webp" 
                            class="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1 file:text-xs file:font-bold file:text-white"
                            onchange="handleSignatureFileUpload(event)"
                        >
                        <div id="uploadPreviewWrapper" class="hidden overflow-hidden rounded-xl border border-slate-200 bg-white p-4 text-center">
                            <img id="uploadPreview" src="" alt="Pratinjau Tanda Tangan" class="mx-auto max-h-24 object-contain">
                        </div>
                    </div>

                    <input type="hidden" name="signature_data" id="signatureDataInput" value="">
                </div>

                <!-- Section 03: Interactive PDF Placement Layer -->
                <div class="space-y-3 rounded-2xl border border-slate-300/80 bg-slate-50/60 p-4 sm:p-5">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                        <div class="flex items-center gap-2">
                            <span class="flex size-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">03</span>
                            <div>
                                <label class="text-xs font-bold uppercase tracking-wider text-slate-900">
                                    Tentukan Posisi Tanda Tangan &amp; QR Code pada Dokumen
                                </label>
                                <p class="text-[11px] text-slate-500">
                                    Klik di mana saja pada halaman atau geser kotak stempel ke titik pembubuhan yang diinginkan.
                                </p>
                            </div>
                        </div>

                        <!-- Page Nav Controls -->
                        <div class="flex items-center gap-1.5 self-start sm:self-auto">
                            <button 
                                type="button" 
                                id="btnPrevPage" 
                                onclick="prevPage()"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
                            >
                                Sebelumnya
                            </button>
                            <span class="font-mono text-xs font-extrabold text-slate-800 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                                Halaman <span id="pageNum">1</span> / <span id="pageCount">1</span>
                            </span>
                            <button 
                                type="button" 
                                id="btnNextPage" 
                                onclick="nextPage()"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>

                    <!-- Preset Placement Shortcuts -->
                    <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div class="flex flex-wrap items-center gap-1.5">
                            <span class="text-slate-500 font-semibold text-[11px]">Pilihan Posisi Cepat:</span>
                            <button 
                                type="button" 
                                onclick="setPresetPosition('bottom-right')"
                                class="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 shadow-2xs cursor-pointer"
                            >
                                Kanan Bawah
                            </button>
                            <button 
                                type="button" 
                                onclick="setPresetPosition('bottom-left')"
                                class="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 shadow-2xs cursor-pointer"
                            >
                                Kiri Bawah
                            </button>
                            <button 
                                type="button" 
                                onclick="setPresetPosition('bottom-center')"
                                class="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 shadow-2xs cursor-pointer"
                            >
                                Tengah Bawah
                            </button>
                        </div>

                        <span class="text-[11px] text-slate-500 font-medium">
                            Koordinat: <strong class="font-mono text-slate-900">Hal <span id="displayPage">1</span> (<span id="displayX">60</span>% X, <span id="displayY">75</span>% Y)</strong>
                        </span>
                    </div>

                    <!-- PDF Viewport Drafting Area -->
                    <div class="relative overflow-auto rounded-xl border border-slate-700 pdf-drafting-bg p-4 flex justify-center min-h-[460px]" id="pdfViewportContainer">
                        
                        <div id="pdfLoadingSpinner" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-20 space-y-2 text-white">
                            <div class="size-7 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            <span class="text-xs font-bold">Memuat berkas PDF...</span>
                        </div>

                        <!-- Render Wrapper -->
                        <div class="relative shadow-2xl rounded-sm" id="pageWrapper">
                            <canvas id="pdfCanvas" class="bg-white block rounded-sm"></canvas>
                            
                            <!-- Movable Corporate Stamp Box -->
                            <div 
                                id="placementStamp" 
                                class="placement-stamp absolute z-10 flex items-center justify-between rounded-lg border-2 border-dashed border-slate-800 bg-white/95 p-2 shadow-2xl ring-1 ring-black/10 backdrop-blur-xs"
                                style="width: 180px; height: 72px; left: 60%; top: 75%;"
                                title="Klik &amp; Geser untuk memindahkan posisi stempel"
                            >
                                <div class="flex flex-col justify-between h-full pr-1.5 overflow-hidden flex-1">
                                    <div class="flex items-center justify-between">
                                        <span class="text-[7.5px] font-black uppercase tracking-wider text-slate-900 font-mono">
                                            RPK E-SIGN
                                        </span>
                                        <span class="text-[7px] font-mono text-slate-400">
                                            UU ITE
                                        </span>
                                    </div>
                                    <div id="stampSigPreview" class="flex-1 flex items-center justify-center py-0.5">
                                        <span class="text-[9px] italic text-slate-400 font-medium">
                                            [Tanda Tangan]
                                        </span>
                                    </div>
                                    <div class="border-t border-slate-200/80 pt-0.5">
                                        <p class="text-[7.5px] font-bold text-slate-900 truncate" id="stampSignerName">
                                            {{ $signer->name }}
                                        </p>
                                    </div>
                                </div>
                                <div class="shrink-0 flex items-center justify-center size-13 bg-slate-50 rounded border border-slate-200 p-0.5">
                                    <img 
                                        src="{{ route('signature.qr', $signer->signatureRequest->verification_code) }}" 
                                        alt="QR" 
                                        class="size-11 object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Hidden Coordinate Form Inputs -->
                    <input type="hidden" name="page_number" id="inputPageNumber" value="1">
                    <input type="hidden" name="position_x" id="inputPositionX" value="60">
                    <input type="hidden" name="position_y" id="inputPositionY" value="75">

                    <p class="text-[11px] text-slate-500 font-medium">
                        Tips: Klik di mana saja pada lembar dokumen untuk menempatkan stempel secara presisi pada kolom tanda tangan Anda.
                    </p>
                </div>

                <!-- Section 04: Pernyataan & Persetujuan -->
                <div class="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 sm:p-5">
                    <label class="flex items-start gap-3 cursor-pointer text-xs leading-relaxed text-slate-800">
                        <input 
                            type="checkbox" 
                            name="accept_terms" 
                            value="1" 
                            required
                            class="mt-0.5 size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        >
                        <span>
                            Saya menyatakan bahwa saya telah membaca, memahami isi dokumen, dan secara sah menyetujui pembubuhan tanda tangan elektronik resmi pada dokumen <strong>{{ $signer->signatureRequest->document->title }}</strong> ini sesuai ketentuan peraturan perundang-undangan (UU ITE).
                        </span>
                    </label>
                    @error('accept_terms')
                        <p class="mt-2 text-xs text-rose-600 font-bold">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit"
                    id="submitBtn"
                    class="h-12 w-full rounded-xl bg-slate-900 font-bold text-xs text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-black active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                    <svg class="size-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Konfirmasi &amp; Bubuhkan Tanda Tangan Resmi</span>
                </button>
            </form>

            <div class="rounded-xl bg-slate-50 p-3.5 text-[11px] text-slate-500 leading-relaxed border border-slate-200/60 font-medium">
                <strong>Integritas Kriptografi &amp; Audit Trail:</strong> Pembubuhan tanda tangan visual dan QR Code verifikasi pada koordinat terpilih akan dicatat secara permanen dengan hash SHA-256 dan stempel waktu resmi WIB pada sistem RPK Law Firm Workspace.
            </div>

        </main>

        <!-- Footer -->
        <footer class="text-center space-y-1 text-xs text-slate-400 pt-1">
            <p class="font-semibold text-slate-600">&copy; {{ date('Y') }} RPK Law Firm · Advocates &amp; Legal Consultants.</p>
            <p class="font-mono text-[10px]">Secure Digital Signature Protocol · UU ITE Compliant</p>
        </footer>

    </div>

    <!-- Scripts: Signature Pad & PDF.js Drag-and-Drop Placement Engine -->
    <script>
        // 1. Signature Pad Logic
        const canvas = document.getElementById('signatureCanvas');
        const ctx = canvas.getContext('2d');
        const signatureDataInput = document.getElementById('signatureDataInput');
        let isDrawing = false;
        let hasDrawn = false;
        let currentMode = 'draw';

        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }

        window.addEventListener('resize', resizeCanvas);
        setTimeout(resizeCanvas, 100);

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
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            e.preventDefault();
        }

        function draw(e) {
            if (!isDrawing) return;
            const pos = getCanvasPos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            e.preventDefault();
        }

        function stopDrawing() {
            if (isDrawing) {
                isDrawing = false;
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
            document.getElementById('stampSigPreview').innerHTML = '<span class="text-[9px] italic text-slate-400 font-medium">[Tanda Tangan]</span>';
        }

        function syncCanvasData() {
            if (hasDrawn && currentMode === 'draw') {
                const base64 = canvas.toDataURL('image/png');
                signatureDataInput.value = base64;
                document.getElementById('stampSigPreview').innerHTML = `<img src="${base64}" alt="Sig" style="max-height: 30px; max-width: 100%; object-fit: contain;">`;
            }
        }

        function switchSignatureMode(mode) {
            currentMode = mode;
            const btnDraw = document.getElementById('btnModeDraw');
            const btnUpload = document.getElementById('btnModeUpload');
            const drawContainer = document.getElementById('drawContainer');
            const uploadContainer = document.getElementById('uploadContainer');

            if (mode === 'draw') {
                btnDraw.className = 'rounded-lg px-3 py-1 font-bold text-[11px] bg-slate-900 text-white transition-all cursor-pointer';
                btnUpload.className = 'rounded-lg px-3 py-1 font-bold text-[11px] text-slate-600 hover:bg-slate-100 transition-all cursor-pointer';
                drawContainer.classList.remove('hidden');
                uploadContainer.classList.add('hidden');
                syncCanvasData();
            } else {
                btnUpload.className = 'rounded-lg px-3 py-1 font-bold text-[11px] bg-slate-900 text-white transition-all cursor-pointer';
                btnDraw.className = 'rounded-lg px-3 py-1 font-bold text-[11px] text-slate-600 hover:bg-slate-100 transition-all cursor-pointer';
                uploadContainer.classList.remove('hidden');
                drawContainer.classList.add('hidden');
            }
        }

        function handleSignatureFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                const base64 = e.target.result;
                signatureDataInput.value = base64;
                const previewImg = document.getElementById('uploadPreview');
                const previewWrapper = document.getElementById('uploadPreviewWrapper');
                previewImg.src = base64;
                previewWrapper.classList.remove('hidden');
                document.getElementById('stampSigPreview').innerHTML = `<img src="${base64}" alt="Sig" style="max-height: 30px; max-width: 100%; object-fit: contain;">`;
            };
            reader.readAsDataURL(file);
        }

        document.getElementById('accepted_name').addEventListener('input', function(e) {
            document.getElementById('stampSignerName').innerText = e.target.value || 'Penanda Tangan';
        });

        // 2. PDF.js & Visual Placement Layer
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
                currentPage = totalPages; // Default to last page for signing
                document.getElementById('pageCount').innerText = totalPages;
                document.getElementById('pdfLoadingSpinner').classList.add('hidden');
                
                renderPage(currentPage);
                updateCoordinates(currentPage, 60, 75);
            }).catch(function(err) {
                console.error('PDF load error:', err);
                document.getElementById('pdfLoadingSpinner').innerHTML = '<span class="text-xs font-bold text-slate-300">Pratinjau visual dokumen siap.</span>';
                setTimeout(() => document.getElementById('pdfLoadingSpinner').classList.add('hidden'), 800);
            });
        }

        function renderPage(pageNum) {
            if (!pdfDoc) return;
            pdfDoc.getPage(pageNum).then(function(page) {
                const containerWidth = Math.min(720, document.getElementById('pdfViewportContainer').clientWidth - 40);
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

        // 3. Drag and Click-to-place logic
        let isDraggingStamp = false;
        let dragStartX, dragStartY, initialStampLeft, initialStampTop;

        function startDrag(e) {
            isDraggingStamp = true;
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
