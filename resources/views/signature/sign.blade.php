<!doctype html>
<html lang="id" class="h-full bg-[#f1f5f9] antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Penerimaan & Tanda Tangan Dokumen Internal | RPK Law Firm</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <style>
        body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="min-h-full bg-[#f1f5f9] text-slate-900 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-[660px] space-y-5">
        
        <!-- Corporate Letterhead Header -->
        <header class="flex items-center justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div class="flex items-center gap-3.5">
                <img 
                    src="/logo/logo.png" 
                    alt="RPK Law Firm" 
                    class="h-10 w-auto max-w-[160px] object-contain"
                    onerror="this.onerror=null; this.src='/logo/raf-law-firm-transparent.png';"
                />
                <div class="border-l border-slate-200 pl-3">
                    <h2 class="text-xs font-black tracking-tight text-slate-900 uppercase">RPK LAW FIRM</h2>
                    <p class="text-[10px] font-medium text-slate-500">Advocates &amp; Legal Consultants · Bandung, Indonesia</p>
                </div>
            </div>
            <span class="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-600/20">
                E-Sign Dokumen
            </span>
        </header>

        <!-- Main Card Container -->
        <main class="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">
            
            <div class="space-y-2 border-b border-slate-100 pb-5">
                <div class="flex items-center gap-2">
                    <span class="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[9.5px] font-extrabold tracking-wider text-white uppercase">
                        PERMINTAAN TANDA TANGAN ELEKTRONIK
                    </span>
                </div>
                <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                    {{ $signer->signatureRequest->document->title }}
                </h1>
                <p class="text-xs text-slate-500 font-medium">
                    Ditujukan kepada: <strong class="font-bold text-slate-900">{{ $signer->name }}</strong> ({{ $signer->email }})
                </p>
                @if ($signer->signatureRequest->expires_at)
                    <p class="text-xs text-amber-700 font-bold">
                        Tenggat Waktu: {{ $signer->signatureRequest->expires_at->translatedFormat('d F Y, H:i') }} WIB
                    </p>
                @endif
            </div>

            <!-- Signing Form -->
            <form id="signingForm" method="post" action="{{ route('signature.sign.store', $signer->signing_token) }}" class="space-y-5">
                @csrf

                <div class="space-y-1.5">
                    <label for="accepted_name" class="text-xs font-bold text-slate-700">
                        Nama Lengkap Penanda Tangan *
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

                <!-- Visual Signature Mode Switcher & Canvas -->
                <div class="space-y-3 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4">
                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <label class="text-xs font-bold text-slate-800">
                                Bubuhkan Tanda Tangan Visual (Signature Pad)
                            </label>
                            <p class="text-[11px] text-slate-500 font-medium">
                                Goreskan tanda tangan langsung atau unggah gambar tanda tangan Anda.
                            </p>
                        </div>
                        <div class="flex items-center gap-1 rounded-xl bg-white p-1 border border-slate-200 text-xs">
                            <button 
                                type="button" 
                                id="btnModeDraw" 
                                onclick="switchSignatureMode('draw')" 
                                class="rounded-lg px-2.5 py-1 font-bold text-[11px] bg-slate-900 text-white transition-all"
                            >
                                Goreskan (Canvas)
                            </button>
                            <button 
                                type="button" 
                                id="btnModeUpload" 
                                onclick="switchSignatureMode('upload')" 
                                class="rounded-lg px-2.5 py-1 font-bold text-[11px] text-slate-600 hover:bg-slate-100 transition-all"
                            >
                                Unggah Gambar
                            </button>
                        </div>
                    </div>

                    <!-- 1. Canvas Drawing Area -->
                    <div id="drawContainer" class="space-y-2">
                        <div class="relative overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white shadow-2xs">
                            <canvas 
                                id="signatureCanvas" 
                                class="w-full h-36 touch-none cursor-crosshair bg-white"
                            ></canvas>
                            <span class="pointer-events-none absolute bottom-2 left-3 text-[10px] font-mono font-semibold text-slate-400">
                                Area goresan tanda tangan · Sentuh / Gerakkan kursor di sini
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

                    <!-- 2. Image Upload Area -->
                    <div id="uploadContainer" class="hidden space-y-2">
                        <input 
                            type="file" 
                            id="signatureFileInput" 
                            accept="image/png,image/jpeg,image/webp" 
                            class="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-200 file:px-2.5 file:py-1 file:text-xs file:font-bold"
                            onchange="handleSignatureFileUpload(event)"
                        >
                        <div id="uploadPreviewWrapper" class="hidden overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white p-3 text-center">
                            <img id="uploadPreview" src="" alt="Pratinjau Tanda Tangan" class="mx-auto max-h-24 object-contain">
                        </div>
                    </div>

                    <!-- Hidden Base64 Payload -->
                    <input type="hidden" name="signature_data" id="signatureDataInput" value="">
                </div>

                <!-- Terms & Confirmation Checkbox -->
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
                            Saya menyatakan bahwa saya telah membaca, memahami, dan menyetujui isi dokumen <strong>{{ $signer->signatureRequest->document->title }}</strong> ini sebagai bentuk penerimaan dan persetujuan internal resmi pada sistem RPK Law Firm Workspace.
                        </span>
                    </label>
                    @error('accept_terms')
                        <p class="mt-2 text-xs text-rose-600 font-bold">{{ $message }}</p>
                    @enderror
                </div>

                <button 
                    type="submit"
                    id="submitBtn"
                    class="h-11 w-full rounded-xl bg-blue-600 font-bold text-xs text-white shadow-xs transition-all hover:bg-blue-700 active:scale-98 cursor-pointer"
                >
                    Konfirmasi &amp; Catat Penerimaan Internal
                </button>
            </form>

            <div class="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 leading-relaxed border border-slate-200/60 font-medium">
                <strong>Catatan Kepatuhan:</strong> Rekaman ini disimpan secara permanen bersama stempel waktu kriptografi dan checksum dokumen SHA-256 untuk audit trail internal kantor hukum.
            </div>

        </main>

        <!-- Footer -->
        <footer class="text-center space-y-1 text-xs text-slate-500 pt-2">
            <p class="font-semibold">&copy; {{ date('Y') }} RPK Law Firm · Advocates &amp; Legal Consultants.</p>
        </footer>

    </div>

    <!-- Interactive Canvas & Signature Capture Script -->
    <script>
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
                return {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                };
            }
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
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
        }

        function syncCanvasData() {
            if (hasDrawn && currentMode === 'draw') {
                signatureDataInput.value = canvas.toDataURL('image/png');
            }
        }

        function switchSignatureMode(mode) {
            currentMode = mode;
            const btnDraw = document.getElementById('btnModeDraw');
            const btnUpload = document.getElementById('btnModeUpload');
            const drawContainer = document.getElementById('drawContainer');
            const uploadContainer = document.getElementById('uploadContainer');

            if (mode === 'draw') {
                btnDraw.className = 'rounded-lg px-2.5 py-1 font-bold text-[11px] bg-slate-900 text-white transition-all';
                btnUpload.className = 'rounded-lg px-2.5 py-1 font-bold text-[11px] text-slate-600 hover:bg-slate-100 transition-all';
                drawContainer.classList.remove('hidden');
                uploadContainer.classList.add('hidden');
                syncCanvasData();
            } else {
                btnUpload.className = 'rounded-lg px-2.5 py-1 font-bold text-[11px] bg-slate-900 text-white transition-all';
                btnDraw.className = 'rounded-lg px-2.5 py-1 font-bold text-[11px] text-slate-600 hover:bg-slate-100 transition-all';
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
            };
            reader.readAsDataURL(file);
        }

        document.getElementById('signingForm').addEventListener('submit', function() {
            if (currentMode === 'draw' && hasDrawn) {
                syncCanvasData();
            }
        });
    </script>
</body>
</html>
