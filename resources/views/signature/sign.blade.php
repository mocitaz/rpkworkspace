<!doctype html>
<html lang="id" class="h-full bg-[#f1f5f9] antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Penerimaan & Tanda Tangan Dokumen | RPK Law Firm</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <!-- PDF.js CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <style>
        body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .placement-stamp {
            cursor: move;
            user-select: none;
            touch-action: none;
            transition: box-shadow 0.15s ease;
        }
        .placement-stamp:active {
            cursor: grabbing;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5), 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }
    </style>
</head>
<body class="min-h-full bg-[#f1f5f9] text-slate-900 flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-[800px] space-y-4">
        
        <!-- Corporate Letterhead Header -->
        <header class="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:px-6 shadow-2xs">
            <div class="flex items-center gap-3.5">
                <img 
                    src="/logo/logo.png" 
                    alt="RPK Law Firm" 
                    class="h-9 w-auto max-w-[140px] object-contain"
                    onerror="this.onerror=null; this.src='/logo/raf-law-firm-transparent.png';"
                />
                <div class="border-l border-slate-200 pl-3">
                    <h2 class="text-xs font-black tracking-tight text-slate-900 uppercase">RPK LAW FIRM</h2>
                    <p class="text-[10px] font-medium text-slate-500">Advocates &amp; Legal Consultants</p>
                </div>
            </div>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-600/20">
                E-Sign Dokumen
            </span>
        </header>

        <!-- Main Card Container -->
        <main class="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xl shadow-slate-200/50 space-y-6">
            
            <!-- Document Meta Header -->
            <div class="space-y-2 border-b border-slate-100 pb-4">
                <div class="flex items-center gap-2">
                    <span class="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-wider text-white uppercase">
                        PERMINTAAN E-SIGN RESMI
                    </span>
                    @if ($signer->signatureRequest->expires_at)
                        <span class="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-800">
                            Batas Waktu: {{ $signer->signatureRequest->expires_at->translatedFormat('d/m/Y H:i') }} WIB
                        </span>
                    @endif
                </div>
                <h1 class="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-snug">
                    {{ $signer->signatureRequest->document->title }}
                </h1>
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                    <span>Penandatangan: <strong class="text-slate-900">{{ $signer->name }}</strong> ({{ $signer->email }})</span>
                    @if ($signer->signatureRequest->document->matter)
                        <span>•</span>
                        <span>Perkara: <strong class="font-mono text-slate-800">{{ $signer->signatureRequest->document->matter->matter_number }}</strong></span>
                    @endif
                </div>
            </div>

            <!-- Signing Form -->
            <form id="signingForm" method="post" action="{{ route('signature.sign.store', $signer->signing_token) }}" class="space-y-6">
                @csrf

                <!-- 1. Nama Penanda Tangan -->
                <div class="space-y-1.5">
                    <label for="accepted_name" class="text-xs font-bold text-slate-700">
                        Nama Lengkap Yang Dicantumkan *
                    </label>
                    <input 
                        id="accepted_name" 
                        name="accepted_name" 
                        type="text"
                        value="{{ old('accepted_name', $signer->name) }}" 
                        required
                        class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-medium text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    >
                    @error('accepted_name')
                        <p class="text-xs text-rose-600 font-bold">{{ $message }}</p>
                    @enderror
                </div>

                <!-- 2. Goresan Tanda Tangan Visual (Pad) -->
                <div class="space-y-3 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4">
                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <label class="text-xs font-bold text-slate-800">
                                Langkah 1: Goreskan Tanda Tangan Visual
                            </label>
                            <p class="text-[11px] text-slate-500">
                                Tanda tangan Anda akan dibubuhkan ke posisi yang Anda tentukan pada berkas PDF di bawah.
                            </p>
                        </div>
                        <div class="flex items-center gap-1 rounded-xl bg-white p-1 border border-slate-200 text-xs">
                            <button 
                                type="button" 
                                id="btnModeDraw" 
                                onclick="switchSignatureMode('draw')" 
                                class="rounded-lg px-2.5 py-1 font-bold text-[11px] bg-slate-900 text-white transition-all cursor-pointer"
                            >
                                Goreskan
                            </button>
                            <button 
                                type="button" 
                                id="btnModeUpload" 
                                onclick="switchSignatureMode('upload')" 
                                class="rounded-lg px-2.5 py-1 font-bold text-[11px] text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                                Unggah Gambar
                            </button>
                        </div>
                    </div>

                    <!-- Canvas Drawing Area -->
                    <div id="drawContainer" class="space-y-2">
                        <div class="relative overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white shadow-2xs">
                            <canvas 
                                id="signatureCanvas" 
                                class="w-full h-32 touch-none cursor-crosshair bg-white"
                            ></canvas>
                            <span class="pointer-events-none absolute bottom-2 left-3 text-[10px] font-mono font-semibold text-slate-400">
                                Goreskan tanda tangan di sini
                            </span>
                        </div>
                        <div class="flex justify-end">
                            <button 
                                type="button" 
                                onclick="clearCanvas()" 
                                class="cursor-pointer text-xs font-bold text-rose-600 hover:text-rose-700 underline underline-offset-2"
                            >
                                Hapus / Ulangi Goresan
                            </button>
                        </div>
                    </div>

                    <!-- Image Upload Area -->
                    <div id="uploadContainer" class="hidden space-y-2">
                        <input 
                            type="file" 
                            id="signatureFileInput" 
                            accept="image/png,image/jpeg,image/webp" 
                            class="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-200 file:px-2.5 file:py-1 file:text-xs file:font-bold"
                            onchange="handleSignatureFileUpload(event)"
                        >
                        <div id="uploadPreviewWrapper" class="hidden overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white p-3 text-center">
                            <img id="uploadPreview" src="" alt="Pratinjau Tanda Tangan" class="mx-auto max-h-20 object-contain">
                        </div>
                    </div>

                    <input type="hidden" name="signature_data" id="signatureDataInput" value="">
                </div>

                <!-- 3. Visual PDF Placement Layer (DocuSign / Privy Style) -->
                <div class="space-y-3 rounded-2xl border border-blue-200 bg-blue-50/30 p-4">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-3">
                        <div>
                            <label class="text-xs font-black uppercase tracking-wider text-blue-950">
                                Langkah 2: Tentukan Letak Tanda Tangan &amp; QR Code di PDF
                            </label>
                            <p class="text-[11px] text-blue-900/80">
                                Klik atau geser (*drag-and-drop*) kotak stempel di atas pratinjau halaman dokumen ke posisi yang Anda inginkan.
                            </p>
                        </div>

                        <!-- Page Nav Controls -->
                        <div class="flex items-center gap-1.5 self-start sm:self-center">
                            <button 
                                type="button" 
                                id="btnPrevPage" 
                                onclick="prevPage()"
                                class="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
                            >
                                &larr; Prev
                            </button>
                            <span class="font-mono text-xs font-extrabold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                                Hal <span id="pageNum">1</span> / <span id="pageCount">1</span>
                            </span>
                            <button 
                                type="button" 
                                id="btnNextPage" 
                                onclick="nextPage()"
                                class="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
                            >
                                Next &rarr;
                            </button>
                        </div>
                    </div>

                    <!-- Preset Placement Shortcuts -->
                    <div class="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span class="text-slate-500 font-semibold">Preset Cepat:</span>
                        <button 
                            type="button" 
                            onclick="setPresetPosition('bottom-right')"
                            class="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-bold text-slate-700 hover:bg-slate-100 shadow-2xs cursor-pointer"
                        >
                            📍 Kanan Bawah
                        </button>
                        <button 
                            type="button" 
                            onclick="setPresetPosition('bottom-left')"
                            class="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-bold text-slate-700 hover:bg-slate-100 shadow-2xs cursor-pointer"
                        >
                            📍 Kiri Bawah
                        </button>
                        <button 
                            type="button" 
                            onclick="setPresetPosition('bottom-center')"
                            class="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-bold text-slate-700 hover:bg-slate-100 shadow-2xs cursor-pointer"
                        >
                            📍 Tengah Bawah
                        </button>
                    </div>

                    <!-- PDF Viewport & Interactive Layer Container -->
                    <div class="relative overflow-hidden rounded-xl border border-slate-300 bg-slate-200 shadow-inner flex justify-center p-2 min-h-[420px]" id="pdfViewportContainer">
                        
                        <div id="pdfLoadingSpinner" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/90 z-20 space-y-2">
                            <div class="size-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                            <span class="text-xs font-bold text-slate-600">Memuat berkas PDF...</span>
                        </div>

                        <!-- Render Wrapper with exact aspect ratio -->
                        <div class="relative max-w-full" id="pageWrapper">
                            <canvas id="pdfCanvas" class="rounded-lg shadow-md bg-white block max-w-full"></canvas>
                            
                            <!-- Draggable / Clickable Stamp Box -->
                            <div 
                                id="placementStamp" 
                                class="placement-stamp absolute z-10 flex items-center justify-between rounded-lg border-2 border-dashed border-blue-600 bg-white/95 p-1.5 shadow-lg backdrop-blur-xs cursor-move"
                                style="width: 170px; height: 68px; left: 60%; top: 75%;"
                                title="Klik & Geser untuk memindahkan posisi stempel TTD & QR Code"
                            >
                                <div class="flex flex-col justify-between h-full pr-1 overflow-hidden">
                                    <div class="flex items-center gap-1">
                                        <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span class="text-[8px] font-black uppercase tracking-wider text-blue-900 truncate">
                                            RPK E-SIGN
                                        </span>
                                    </div>
                                    <div id="stampSigPreview" class="flex-1 flex items-center justify-center py-0.5">
                                        <span class="text-[9px] italic text-slate-400 font-medium">
                                            [Tanda Tangan]
                                        </span>
                                    </div>
                                    <span class="text-[7.5px] font-bold text-slate-700 truncate" id="stampSignerName">
                                        {{ $signer->name }}
                                    </span>
                                </div>
                                <div class="shrink-0 flex items-center justify-center size-12 bg-slate-50 rounded border border-slate-200">
                                    <img 
                                        src="{{ route('signature.qr', $signer->signatureRequest->verification_code) }}" 
                                        alt="QR" 
                                        class="size-10 object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Hidden Coordinate Form Inputs -->
                    <input type="hidden" name="page_number" id="inputPageNumber" value="1">
                    <input type="hidden" name="position_x" id="inputPositionX" value="60">
                    <input type="hidden" name="position_y" id="inputPositionY" value="75">

                    <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Koordinat Aktif: <strong>Halaman <span id="displayPage">1</span> (<span id="displayX">60</span>% X, <span id="displayY">75</span>% Y)</strong></span>
                        <span class="text-blue-600 font-semibold">💡 Sentuh/klik area di atas PDF untuk memindahkan</span>
                    </div>
                </div>

                <!-- 4. Terms & Confirmation Checkbox -->
                <div class="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                    <label class="flex items-start gap-3 cursor-pointer text-xs leading-relaxed text-slate-800">
                        <input 
                            type="checkbox" 
                            name="accept_terms" 
                            value="1" 
                            required
                            class="mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        >
                        <span>
                            Saya menyatakan bahwa saya telah membaca, memahami, dan menyetujui pembubuhan tanda tangan elektronik resmi pada dokumen <strong>{{ $signer->signatureRequest->document->title }}</strong> ini sesuai ketentuan UU ITE.
                        </span>
                    </label>
                    @error('accept_terms')
                        <p class="mt-2 text-xs text-rose-600 font-bold">{{ $message }}</p>
                    @enderror
                </div>

                <button 
                    type="submit"
                    id="submitBtn"
                    class="h-12 w-full rounded-xl bg-emerald-600 font-bold text-xs text-white shadow-md transition-all hover:bg-emerald-700 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                    <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Konfirmasi &amp; Bubuhkan Tanda Tangan Resmi</span>
                </button>
            </form>

            <div class="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 leading-relaxed border border-slate-200/60 font-medium">
                <strong>Integritas Kriptografi:</strong> Tanda tangan visual dan QR Code verifikasi akan dibubuhkan secara permanen pada koordinat yang Anda tentukan, disertai pencatatan jejak audit SHA-256 pada sistem RPK Law Firm Workspace.
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
        // 1. Signature Pad logic
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
                document.getElementById('stampSigPreview').innerHTML = `<img src="${base64}" alt="Sig" style="max-height: 28px; max-width: 100%; object-fit: contain;">`;
            }
        }

        function switchSignatureMode(mode) {
            currentMode = mode;
            const btnDraw = document.getElementById('btnModeDraw');
            const btnUpload = document.getElementById('btnModeUpload');
            const drawContainer = document.getElementById('drawContainer');
            const uploadContainer = document.getElementById('uploadContainer');

            if (mode === 'draw') {
                btnDraw.className = 'rounded-lg px-2.5 py-1 font-bold text-[11px] bg-slate-900 text-white transition-all cursor-pointer';
                btnUpload.className = 'rounded-lg px-2.5 py-1 font-bold text-[11px] text-slate-600 hover:bg-slate-100 transition-all cursor-pointer';
                drawContainer.classList.remove('hidden');
                uploadContainer.classList.add('hidden');
                syncCanvasData();
            } else {
                btnUpload.className = 'rounded-lg px-2.5 py-1 font-bold text-[11px] bg-slate-900 text-white transition-all cursor-pointer';
                btnDraw.className = 'rounded-lg px-2.5 py-1 font-bold text-[11px] text-slate-600 hover:bg-slate-100 transition-all cursor-pointer';
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
                document.getElementById('stampSigPreview').innerHTML = `<img src="${base64}" alt="Sig" style="max-height: 28px; max-width: 100%; object-fit: contain;">`;
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
                currentPage = totalPages; // Default to last page for signature!
                document.getElementById('pageCount').innerText = totalPages;
                document.getElementById('pdfLoadingSpinner').classList.add('hidden');
                
                renderPage(currentPage);
                updateCoordinates(currentPage, 60, 75);
            }).catch(function(err) {
                console.error('PDF error:', err);
                document.getElementById('pdfLoadingSpinner').innerHTML = '<span class="text-xs font-bold text-slate-600">Pratinjau visual siap. Klik di bawah untuk menempatkan posisi.</span>';
                setTimeout(() => document.getElementById('pdfLoadingSpinner').classList.add('hidden'), 1000);
            });
        }

        function renderPage(pageNum) {
            if (!pdfDoc) return;
            pdfDoc.getPage(pageNum).then(function(page) {
                const containerWidth = Math.min(680, document.getElementById('pdfViewportContainer').clientWidth - 20);
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

        // 3. Drag and Click-to-place logic on pageWrapper
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
            
            // Constrain inside pageWrapper
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
