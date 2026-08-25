<!doctype html>
<html lang="id" class="h-full bg-[#f1f5f9] antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sertifikat Verifikasi Tanda Tangan Digital | RPK Law Firm</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <style>
        body { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #f1f5f9;
        }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        @media print {
            body { background: white !important; padding: 0 !important; }
            .no-print { display: none !important; }
            .shadow-custom { box-shadow: none !important; }
        }
    </style>
</head>
<body class="min-h-full text-slate-900 flex flex-col justify-between py-8 px-4 sm:px-6">
    <div class="mx-auto w-full max-w-[760px] space-y-4">
        
        <!-- 1. Header with Official Logo -->
        <header class="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:px-6 shadow-xs">
            <div class="flex items-center gap-3.5">
                <a href="{{ route('login') }}" title="RPK Law Firm" class="shrink-0">
                    <img 
                        src="/logo/logo.png" 
                        alt="RPK Law Firm Logo" 
                        class="h-9 w-auto max-w-[140px] object-contain"
                        onerror="this.onerror=null; this.src='/logo/raf-law-firm-transparent.png';"
                    />
                </a>
                <div class="border-l border-slate-200 pl-3">
                    <h2 class="text-xs font-black tracking-tight text-slate-900 uppercase">
                        RPK LAW FIRM
                    </h2>
                    <p class="text-[10.5px] font-medium text-slate-500">
                        Advocates &amp; Legal Consultants
                    </p>
                </div>
            </div>

            <div class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
                <span class="relative flex size-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full size-2 bg-emerald-600"></span>
                </span>
                Verifikasi Resmi
            </div>
        </header>

        <!-- 2. Main Certificate Card -->
        <main class="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/60 divide-y divide-slate-100">
            
            <!-- Hero Top Certificate Section -->
            <div class="p-6 sm:p-8 space-y-5 bg-gradient-to-b from-slate-50/70 to-white">
                
                <!-- Status Badge -->
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="rounded-md bg-slate-900 px-2.5 py-1 font-mono text-[9px] font-extrabold tracking-wider text-white uppercase">
                        SERTIFIKAT DIGITAL E-SIGN
                    </span>

                    @if ($signatureRequest->status === 'completed')
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700 shadow-2xs">
                            <svg class="size-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            Dokumen telah ditandatangani
                        </span>
                    @elseif ($signatureRequest->status === 'sent' || $signatureRequest->status === 'pending')
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700 shadow-2xs">
                            <svg class="size-3.5 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Menunggu Penandatanganan
                        </span>
                    @else
                        <span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                            {{ str($signatureRequest->status)->replace('_', ' ')->title() }}
                        </span>
                    @endif
                </div>

                <!-- Document Title & Key Meta -->
                <div class="space-y-2">
                    <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-snug">
                        {{ $signatureRequest->document->title }}
                    </h1>
                    
                    <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                        @if ($signatureRequest->document->matter)
                            <span class="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800">
                                {{ $signatureRequest->document->matter->matter_number }}
                            </span>
                            <span class="text-slate-700 font-semibold">{{ $signatureRequest->document->matter->title }}</span>
                        @elseif ($signatureRequest->document->client)
                            <span>Klien: <strong class="font-bold text-slate-900">{{ $signatureRequest->document->client->display_name }}</strong></span>
                        @else
                            <span class="text-slate-700 font-semibold">Dokumen Resmi Internal RPK</span>
                        @endif

                        <span class="text-slate-300">•</span>
                        <span>Versi Berkas: <strong>v{{ $signatureRequest->documentVersion->version_number ?? 1 }}.0</strong></span>
                    </div>
                </div>

                <!-- Compact QR & Verification Code Banner -->
                <div class="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
                    <!-- Fixed size QR code -->
                    <div class="shrink-0 flex size-24 items-center justify-center rounded-xl bg-slate-50 p-1.5 border border-slate-200">
                        <img 
                            src="{{ route('signature.qr', $signatureRequest->verification_code) }}" 
                            alt="QR Code Verifikasi" 
                            style="width: 80px; height: 80px;"
                            class="object-contain"
                        />
                    </div>

                    <!-- Verification details -->
                    <div class="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
                        <span class="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            KODE VERIFIKASI PUBLIK RESMI
                        </span>
                        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <code class="font-mono text-base font-black text-blue-600 tracking-wider">
                                {{ $signatureRequest->verification_code }}
                            </code>
                            <button 
                                type="button" 
                                onclick="copyText('{{ $signatureRequest->verification_code }}', this)"
                                class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all active:scale-95"
                                title="Salin Kode"
                            >
                                <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span>Salin</span>
                            </button>
                        </div>
                        <p class="text-[11px] text-slate-500">
                            Pindai QR code dengan kamera ponsel untuk membuka sertifikat audit keaslian dokumen ini secara publik.
                        </p>
                    </div>
                </div>

            </div>

            <!-- Signers Audit Trail Section -->
            <div class="p-6 sm:p-8 space-y-4 bg-white">
                <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">
                        Jejak Rekam Penanda Tangan (Audit Trail)
                    </h3>
                    <span class="font-mono text-xs font-bold text-slate-500">
                        {{ $signatureRequest->signers->where('status', 'signed')->count() }} / {{ $signatureRequest->signers->count() }} Telah Tanda Tangan
                    </span>
                </div>

                <div class="space-y-3">
                    @foreach ($signatureRequest->signers as $index => $signer)
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                            
                            <!-- Signer Details -->
                            <div class="space-y-1 min-w-0">
                                <div class="flex items-center gap-2">
                                    <span class="flex size-6 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white shrink-0">
                                        {{ $index + 1 }}
                                    </span>
                                    <p class="font-bold text-sm text-slate-900">
                                        {{ $signer->name }}
                                    </p>
                                </div>
                                <p class="text-xs text-slate-500 font-mono pl-8">
                                    {{ $signer->email }}
                                </p>
                                <p class="text-[11px] text-slate-500 pl-8">
                                    @if ($signer->status === 'signed' && $signer->signed_at)
                                        Ditandatangani pada <strong class="text-slate-800">{{ $signer->signed_at->translatedFormat('d F Y, H:i:s') }} WIB</strong>
                                    @else
                                        <span class="italic text-amber-600 font-medium">Menunggu giliran penandatanganan</span>
                                    @endif
                                </p>
                            </div>

                            <!-- Visual Signature Box & Status -->
                            <div class="flex items-center gap-3 shrink-0 self-start sm:self-center pl-8 sm:pl-0">
                                @if ($signer->status === 'signed')
                                    @if ($signer->signature_data)
                                        <div class="flex h-12 w-32 items-center justify-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xs" title="Goresan Tanda Tangan Visual">
                                            <img 
                                                src="{{ $signer->signature_data }}" 
                                                alt="Tanda Tangan {{ $signer->name }}" 
                                                class="max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                    @else
                                        <span class="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600 border border-slate-200">
                                            OTP Digital
                                        </span>
                                    @endif

                                    <span class="inline-flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 font-mono text-xs font-bold text-emerald-700 shadow-2xs">
                                        <svg class="size-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Sah
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-1 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 font-mono text-xs font-bold text-amber-700">
                                        Pending
                                    </span>
                                @endif
                            </div>

                        </div>
                    @endforeach
                </div>
            </div>

            <!-- Download Artifacts Actions (If Completed) -->
            @if ($signatureRequest->status === 'completed')
                <div class="p-6 sm:p-8 bg-emerald-50/40 space-y-3">
                    <div class="flex items-center gap-2">
                        <svg class="size-4 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 class="text-xs font-black uppercase tracking-wider text-emerald-950">
                            Unduh Berkas Resmi Yang Telah Dibubuhi
                        </h4>
                    </div>
                    <p class="text-xs text-emerald-900/90 leading-relaxed">
                        Dokumen telah lengkap dibubuhi stempel tanda tangan para pihak, QR code verifikasi publik, dan stempel digital resmi.
                    </p>
                    <div class="flex flex-wrap gap-2.5 pt-1">
                        <a
                            href="{{ route('signature.verify.download-signed', $signatureRequest->verification_code) }}"
                            class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
                        >
                            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Unduh Berkas PDF (Dibubuhi TTD &amp; QR Code)
                        </a>

                        <a
                            href="{{ route('signature.verify.download-certificate', $signatureRequest->verification_code) }}"
                            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 active:scale-95 transition-all"
                        >
                            <svg class="size-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            Unduh Sertifikat PDF
                        </a>
                    </div>
                </div>
            @endif

            <!-- Cryptographic Checksum & Legal Notice -->
            <div class="p-6 sm:p-8 space-y-4 bg-slate-50/60">
                <!-- Checksum Box -->
                <div class="space-y-1.5">
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
                    <div class="overflow-x-auto rounded-xl bg-white p-2.5 border border-slate-200">
                        <code class="font-mono text-[11px] text-slate-800 font-bold break-all select-all">
                            {{ $signatureRequest->document_checksum }}
                        </code>
                    </div>
                    <p class="text-[10.5px] text-slate-500">
                        Hash kriptografis SHA-256 membuktikan integritas matematis dokumen sejak pertama kali diterbitkan oleh sistem RPK Law Firm.
                    </p>
                </div>

                <!-- Legal Notice -->
                <div class="rounded-xl border border-blue-200/70 bg-blue-50/50 p-3.5 text-xs space-y-0.5">
                    <p class="font-bold text-blue-950 flex items-center gap-1.5">
                        <svg class="size-3.5 text-blue-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Landasan Hukum &amp; Keabsahan Pembuktian:
                    </p>
                    <p class="text-[11px] text-blue-900/80 leading-relaxed pl-5">
                        Sertifikat verifikasi digital ini diterbitkan secara elektronik oleh sistem <strong>RPK Law Firm Workspace</strong> sesuai ketentuan UU No. 11/2008 jo. UU No. 1/2024 tentang Informasi dan Transaksi Elektronik (UU ITE).
                    </p>
                </div>
            </div>

        </main>

        <!-- 3. Footer -->
        <footer class="text-center space-y-0.5 text-xs text-slate-400 pt-2 no-print">
            <p class="font-medium text-slate-600">&copy; {{ date('Y') }} RPK Law Firm · Advocates &amp; Legal Consultants.</p>
            <p class="font-mono text-[10px]">Sistem Verifikasi Dokumen Digital · 256-Bit Cryptographic Integrity</p>
        </footer>

    </div>

    <script>
        function copyText(text, btnElement) {
            navigator.clipboard.writeText(text).then(() => {
                const originalContent = btnElement.innerHTML;
                btnElement.innerHTML = '<span>Tersalin!</span>';
                btnElement.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600');
                setTimeout(() => {
                    btnElement.innerHTML = originalContent;
                    btnElement.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-600');
                }, 2000);
            });
        }
    </script>
</body>
</html>
