<!doctype html>
<html lang="id" class="h-full bg-[#f8fafc] antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sertifikat Verifikasi Digital | RPK Law Firm</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <style>
        body { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #f8fafc;
        }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        @media print {
            body { background: white !important; padding: 0 !important; }
            .no-print { display: none !important; }
            .card-shadow { box-shadow: none !important; border: 1px solid #cbd5e1 !important; }
        }
    </style>
</head>
<body class="min-h-full text-slate-900 flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6">
    <div class="mx-auto w-full max-w-[820px] space-y-4">
        
        <!-- 1. Corporate Header -->
        <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 sm:px-6 shadow-2xs">
            <div class="flex items-center gap-3.5">
                <a href="{{ route('login') }}" title="RPK Law Firm" class="shrink-0">
                    <img 
                        src="/logo/logo.png" 
                        alt="RPK Law Firm Logo" 
                        class="h-10 w-auto max-w-[150px] object-contain"
                        onerror="this.onerror=null; this.src='/logo/raf-law-firm-transparent.png';"
                    />
                </a>
                <div class="border-l border-slate-200 pl-3.5">
                    <div class="flex items-center gap-1.5">
                        <h2 class="text-xs font-black tracking-tight text-slate-900 uppercase">
                            RPK LAW FIRM
                        </h2>
                        <span class="rounded bg-slate-900 px-1.5 py-0.2 font-mono text-[8.5px] font-bold text-white tracking-wider">
                            SECURE
                        </span>
                    </div>
                    <p class="text-[11px] font-medium text-slate-500">
                        Roni, Putra &amp; Kusumah · Advocates &amp; Legal Consultants
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-2 self-start sm:self-center">
                <div class="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
                    <span class="relative flex size-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full size-2 bg-emerald-600"></span>
                    </span>
                    Portal Verifikasi Resmi
                </div>
            </div>
        </header>

        <!-- 2. Main Certificate Card -->
        <main class="card-shadow overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-lg shadow-slate-200/50">
            
            <!-- Hero Top Banner: Status, Title, and QR Code -->
            <div class="border-b border-slate-100 bg-slate-50/60 p-5 sm:p-6">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                    
                    <!-- Left: Document Details -->
                    <div class="space-y-3 flex-1 min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-wider text-white uppercase">
                                SERTIFIKAT DIGITAL E-SIGN
                            </span>
                            
                            @if ($signatureRequest->status === 'completed')
                                <span class="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-2xs">
                                    <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Dokumen telah ditandatangani
                                </span>
                            @elseif ($signatureRequest->status === 'sent' || $signatureRequest->status === 'pending')
                                <span class="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-2xs">
                                    <svg class="size-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Menunggu Penandatanganan
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1 rounded-md bg-slate-700 px-2 py-0.5 text-xs font-bold text-white">
                                    {{ str($signatureRequest->status)->replace('_', ' ')->title() }}
                                </span>
                            @endif
                        </div>

                        <div>
                            <h1 class="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-snug">
                                {{ $signatureRequest->document->title }}
                            </h1>
                            
                            <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-1">
                                @if ($signatureRequest->document->matter)
                                    <span class="inline-flex items-center gap-1 text-slate-700">
                                        <strong class="font-bold font-mono text-slate-900">{{ $signatureRequest->document->matter->matter_number }}</strong>
                                        <span>· {{ $signatureRequest->document->matter->title }}</span>
                                    </span>
                                @elseif ($signatureRequest->document->client)
                                    <span class="inline-flex items-center gap-1 text-slate-700">
                                        Klien: <strong class="font-bold text-slate-900">{{ $signatureRequest->document->client->display_name }}</strong>
                                    </span>
                                @else
                                    <span class="text-slate-700 font-semibold">Dokumen Resmi Internal RPK</span>
                                @endif

                                <span class="text-slate-300">•</span>
                                <span>Versi {{ $signatureRequest->documentVersion->version_number ?? 1 }}.0</span>
                            </div>
                        </div>

                        <!-- Date Summary Strip -->
                        <div class="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                            <span>Diterbitkan: <strong class="text-slate-700">{{ $signatureRequest->created_at->translatedFormat('d F Y, H:i') }} WIB</strong></span>
                            @if ($signatureRequest->completed_at)
                                <span class="text-slate-300">•</span>
                                <span class="text-emerald-700 font-semibold">
                                    Selesai Ditandatangani: <strong>{{ $signatureRequest->completed_at->translatedFormat('d F Y, H:i') }} WIB</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    <!-- Right: Compact Focused QR Code Tile -->
                    <div class="flex flex-row sm:flex-col items-center justify-center gap-2.5 rounded-xl border border-slate-200/90 bg-white p-3 text-center shrink-0 shadow-2xs">
                        <img 
                            src="{{ route('signature.qr', $signatureRequest->verification_code) }}" 
                            alt="QR Code Verifikasi" 
                            class="size-24 rounded-lg bg-white object-contain"
                        />
                        <div class="text-left sm:text-center space-y-1">
                            <span class="block font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                KODE VERIFIKASI
                            </span>
                            <div class="flex items-center gap-1">
                                <code class="font-mono text-xs font-black text-blue-600">
                                    {{ $signatureRequest->verification_code }}
                                </code>
                                <button 
                                    type="button" 
                                    onclick="copyText('{{ $signatureRequest->verification_code }}', this)"
                                    class="cursor-pointer rounded border border-slate-200 bg-slate-50 px-1.5 py-0.2 text-[9.5px] font-bold text-slate-700 hover:bg-slate-100 transition-all"
                                    title="Salin Kode"
                                >
                                    Salin
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Content Body -->
            <div class="p-5 sm:p-6 space-y-5">
                
                @if (session('success'))
                    <div class="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-900">
                        <svg class="size-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{{ session('success') }}</span>
                    </div>
                @endif

                <!-- 3. Signers Section (Clean Card Layout - Anti Clutter) -->
                <div class="space-y-2.5">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">
                            Jejak Penandatangan (Signers Audit Log)
                        </h3>
                        <span class="font-mono text-[11px] font-bold text-slate-500">
                            {{ $signatureRequest->signers->where('status', 'signed')->count() }} / {{ $signatureRequest->signers->count() }} Pihak Telah Tanda Tangan
                        </span>
                    </div>

                    <div class="space-y-2">
                        @foreach ($signatureRequest->signers as $index => $signer)
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50">
                                
                                <!-- Signer Info -->
                                <div class="flex items-center gap-3 min-w-0">
                                    <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200/80 font-mono text-xs font-bold text-slate-700">
                                        {{ $index + 1 }}
                                    </div>
                                    <div class="min-w-0 space-y-0.5">
                                        <div class="flex items-center gap-1.5">
                                            <p class="truncate text-xs font-bold text-slate-900">
                                                {{ $signer->name }}
                                            </p>
                                            <span class="text-[11px] text-slate-400 font-mono">
                                                ({{ $signer->email }})
                                            </span>
                                        </div>
                                        <p class="text-[10.5px] text-slate-500">
                                            @if ($signer->status === 'signed' && $signer->signed_at)
                                                Ditandatangani pada <span class="font-semibold text-slate-700">{{ $signer->signed_at->translatedFormat('d/m/Y H:i:s') }} WIB</span>
                                            @else
                                                <span class="italic text-amber-600">Menunggu giliran penandatanganan</span>
                                            @endif
                                        </p>
                                    </div>
                                </div>

                                <!-- Signature Drawing & Status Pill -->
                                <div class="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                    @if ($signer->status === 'signed')
                                        @if ($signer->signature_data)
                                            <div class="flex items-center justify-center rounded-lg border border-slate-200/90 bg-white px-2 py-0.5 shadow-2xs" title="Tanda Tangan Visual">
                                                <img 
                                                    src="{{ $signer->signature_data }}" 
                                                    alt="Tanda Tangan {{ $signer->name }}" 
                                                    class="h-7 max-w-[110px] object-contain"
                                                />
                                            </div>
                                        @else
                                            <span class="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-500">
                                                OTP Digital
                                            </span>
                                        @endif

                                        <span class="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 font-mono text-[10.5px] font-bold text-emerald-700">
                                            <svg class="size-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Sah
                                        </span>
                                    @else
                                        <span class="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200/80 px-2.5 py-1 font-mono text-[10.5px] font-bold text-amber-700">
                                            Pending
                                        </span>
                                    @endif
                                </div>

                            </div>
                        @endforeach
                    </div>
                </div>

                <!-- 4. Download Actions Banner (If completed) -->
                @if ($signatureRequest->status === 'completed')
                    <div class="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2.5">
                        <div class="flex items-center gap-2">
                            <svg class="size-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h4 class="text-xs font-black uppercase tracking-wider text-emerald-950">
                                Unduh Berkas Resmi &amp; Sertifikat Digital
                            </h4>
                        </div>
                        <p class="text-xs text-emerald-900/90 leading-relaxed">
                            Dokumen telah lengkap dibubuhi tanda tangan visual para pihak, QR code verifikasi publik, dan stempel digital resmi.
                        </p>
                        <div class="flex flex-wrap gap-2 pt-1">
                            <a
                                href="{{ route('signature-requests.signed-final', $signatureRequest->id) }}"
                                class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-95 transition-all"
                            >
                                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Unduh Berkas PDF (Dibubuhi TTD &amp; QR Code)
                            </a>

                            @if ($signatureRequest->certificate_path)
                                <a
                                    href="{{ route('signature-requests.certificate', $signatureRequest->id) }}"
                                    class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all"
                                >
                                    <svg class="size-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    Unduh Sertifikat PDF
                                </a>
                            @endif
                        </div>
                    </div>
                @endif

                <!-- 5. Checksum & Security Strip -->
                <div class="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 space-y-1.5">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                            DIGITAL CHECKSUM (SHA-256 HASH)
                        </span>
                        <button 
                            type="button" 
                            onclick="copyText('{{ $signatureRequest->document_checksum }}', this)"
                            class="cursor-pointer rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Salin Hash
                        </button>
                    </div>
                    <div class="overflow-x-auto rounded-lg bg-white p-2 border border-slate-200/80">
                        <code class="font-mono text-[11px] text-slate-800 font-bold break-all select-all">
                            {{ $signatureRequest->document_checksum }}
                        </code>
                    </div>
                    <p class="text-[10.5px] text-slate-500">
                        Hash kriptografis SHA-256 menjamin keutuhan berkas digital dan membuktikan tidak ada modifikasi pada isi dokumen sejak diterbitkan.
                    </p>
                </div>

                <!-- 6. Legal Compliance Notice -->
                <div class="rounded-xl border border-blue-200/70 bg-blue-50/40 p-3.5 text-xs space-y-0.5">
                    <p class="font-bold text-blue-950 flex items-center gap-1.5">
                        <svg class="size-3.5 text-blue-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Keabsahan &amp; Kepatuhan Hukum:
                    </p>
                    <p class="text-[11px] text-blue-900/80 leading-relaxed pl-5">
                        Sertifikat verifikasi digital ini diterbitkan secara elektronik oleh sistem <strong>RPK Law Firm Workspace</strong> sesuai ketentuan UU No. 11/2008 jo. UU No. 1/2024 tentang Informasi dan Transaksi Elektronik (UU ITE).
                    </p>
                </div>

            </div>
        </main>

        <!-- 7. Footer -->
        <footer class="text-center space-y-0.5 text-xs text-slate-400 pt-1 no-print">
            <p class="font-medium text-slate-600">&copy; {{ date('Y') }} RPK Law Firm · Advocates &amp; Legal Consultants.</p>
            <p class="font-mono text-[10px]">Sistem Verifikasi Dokumen Digital · 256-Bit Cryptographic Integrity</p>
        </footer>

    </div>

    <script>
        function copyText(text, btnElement) {
            navigator.clipboard.writeText(text).then(() => {
                const originalContent = btnElement.innerHTML;
                btnElement.innerHTML = '<span>Tersalin!</span>';
                btnElement.classList.add('bg-emerald-600', 'text-white');
                setTimeout(() => {
                    btnElement.innerHTML = originalContent;
                    btnElement.classList.remove('bg-emerald-600', 'text-white');
                }, 2000);
            });
        }
    </script>
</body>
</html>
