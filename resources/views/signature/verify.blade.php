@php
    $isCompleted = $signatureRequest->status === 'completed';
    $isPending = in_array($signatureRequest->status, ['sent', 'pending']);
@endphp
<!doctype html>
<html lang="id" class="h-full bg-slate-100 antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sertifikat Verifikasi Keabsahan Dokumen | RPK Law Firm</title>
    <link rel="icon" type="image/png" href="/images/rpkapp.png">
    <link rel="apple-touch-icon" href="/images/rpkapp.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <style>
        body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .security-bg-grid {
            background-image: radial-gradient(rgba(203, 213, 225, 0.6) 1px, transparent 1px);
            background-size: 18px 18px;
        }

        .cert-border-glow {
            box-shadow: 0 0 0 1px rgba(226, 232, 240, 0.9), 0 20px 35px -8px rgba(15, 23, 42, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.04);
        }

        @media print {
            body { background: white !important; padding: 0 !important; }
            .no-print { display: none !important; }
            .cert-border-glow { box-shadow: none !important; border: 1px solid #cbd5e1 !important; }
        }
    </style>
</head>
<body class="min-h-full bg-slate-100 text-slate-900 flex flex-col justify-between py-6 sm:py-10 px-3 sm:px-6 lg:px-8 security-bg-grid">
    <div class="mx-auto w-full max-w-[840px] space-y-4">
        
        <!-- Corporate Letterhead & Security Header -->
        <header class="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xs p-3.5 sm:px-6 shadow-2xs">
            <div class="flex items-center gap-3.5">
                <a href="{{ route('home') }}" title="RPK Law Firm" class="shrink-0">
                    <img 
                        src="/logo/logo.png" 
                        alt="RPK Law Firm" 
                        class="h-8 sm:h-9 w-auto max-w-[140px] object-contain"
                        onerror="this.onerror=null; this.src='/logo/raf-law-firm-transparent.png';"
                    />
                </a>
                <div class="border-l border-slate-200 pl-3">
                    <h2 class="text-[11.5px] font-black tracking-tight text-slate-900 uppercase">
                        RPK LAW FIRM
                    </h2>
                    <p class="text-[9.5px] font-semibold text-slate-500">
                        Otentikasi &amp; Sertifikasi Tanda Tangan Digital Resmi
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <div class="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-mono text-slate-600">
                    <svg class="size-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>UU ITE &amp; SHA-256 Valid</span>
                </div>

                @if ($isCompleted)
                    <span class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-emerald-800">
                        <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        SAH TERVERIFIKASI
                    </span>
                @elseif ($isPending)
                    <span class="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-amber-800">
                        <span class="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        PROSES TANDA TANGAN
                    </span>
                @else
                    <span class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-slate-700">
                        {{ str($signatureRequest->status)->replace('_', ' ')->upper() }}
                    </span>
                @endif
            </div>
        </header>

        <!-- Main Verification Certificate Card -->
        <main class="overflow-hidden rounded-3xl border border-slate-200/90 bg-white cert-border-glow divide-y divide-slate-100">
            
            <!-- Top Gradient Accent Line -->
            <div class="h-1.5 w-full bg-gradient-to-r from-blue-800 via-indigo-600 to-slate-900"></div>

            <!-- Hero Top Header -->
            <div class="p-5 sm:p-7 space-y-4 bg-gradient-to-b from-slate-50/70 via-white to-white">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div class="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                        <span class="font-bold text-slate-900">RPK Law Firm Legal Workspace</span>
                        <span>•</span>
                        <span>Sertifikat Otentisitas Elektronik</span>
                    </div>
                    <span class="text-[11px] font-mono text-slate-400">
                        Diverifikasi: <strong class="font-semibold text-slate-700">{{ now()->timezone(config('raf.timezone'))->translatedFormat('d F Y, H:i') }} WIB</strong>
                    </span>
                </div>

                <div>
                    <div class="flex flex-wrap items-center gap-1.5 mb-1">
                        <span class="rounded bg-blue-50 px-2 py-0.5 font-mono text-[9.5px] font-bold text-blue-700 uppercase tracking-wide">
                            Dokumen Resmi Bertanda Tangan Digital
                        </span>
                        @if ($signatureRequest->document->matter)
                            <span class="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                                Perkara: {{ $signatureRequest->document->matter->matter_number }}
                            </span>
                        @endif
                    </div>
                    <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {{ $signatureRequest->document->title }}
                    </h1>
                    <p class="mt-1 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                        Sertifikat verifikasi keabsahan penandatanganan elektronik dokumen hukum resmi yang memiliki kekuatan hukum mengikat sesuai Pasal 11 UU ITE.
                    </p>
                </div>

                <!-- Unified 3-Column Data Bar -->
                <div class="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/70 shadow-2xs grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
                    <div class="p-3.5 sm:px-4 sm:py-3 flex flex-col justify-center">
                        <span class="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Kode Otentikasi</span>
                        <div class="flex items-center gap-1.5 mt-0.5">
                            <span class="font-mono text-xs sm:text-sm font-black text-slate-900 truncate select-all">
                                {{ $signatureRequest->verification_code }}
                            </span>
                            <button 
                                type="button" 
                                onclick="copyText('{{ $signatureRequest->verification_code }}', this)"
                                class="text-[10px] font-semibold text-blue-600 hover:underline cursor-pointer"
                                title="Salin Kode"
                            >
                                Salin
                            </button>
                        </div>
                    </div>

                    <div class="p-3.5 sm:px-4 sm:py-3 flex flex-col justify-center">
                        <span class="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Perkara / Versi Dokumen</span>
                        <span class="mt-0.5 text-xs sm:text-sm font-bold text-slate-900 truncate">
                            @if ($signatureRequest->document->matter)
                                <span class="font-mono text-blue-700">{{ $signatureRequest->document->matter->matter_number }}</span> (v{{ $signatureRequest->documentVersion->version_number ?? 1 }}.0)
                            @else
                                Internal Firma (v{{ $signatureRequest->documentVersion->version_number ?? 1 }}.0)
                            @endif
                        </span>
                    </div>

                    <div class="p-3.5 sm:px-4 sm:py-3 flex flex-col justify-center {{ $isCompleted ? 'bg-emerald-50/70' : 'bg-amber-50/70' }}">
                        <span class="text-[9.5px] font-bold uppercase tracking-wider {{ $isCompleted ? 'text-emerald-700' : 'text-amber-700' }}">
                            Status Keabsahan
                        </span>
                        <div class="mt-0.5 flex items-center gap-1.5 font-extrabold text-xs sm:text-[13px] {{ $isCompleted ? 'text-emerald-950' : 'text-amber-950' }}">
                            @if ($isCompleted)
                                <svg class="size-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Sah (Dokumen telah ditandatangani)</span>
                            @else
                                <svg class="size-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Menunggu Selesai</span>
                            @endif
                        </div>
                    </div>
                </div>
            </div>

            <!-- Signers Audit Trail Section (Jejak Rekam Pembubuhan) -->
            <div class="p-5 sm:p-7 space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <span>Jejak Rekam Pembubuhan Penandatangan (Audit Trail)</span>
                    </h3>
                    <span class="font-mono text-xs font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {{ $signatureRequest->signers->where('status', 'signed')->count() }} / {{ $signatureRequest->signers->count() }} Pihak Telah Tanda Tangan
                    </span>
                </div>

                <div class="space-y-3">
                    @foreach ($signatureRequest->signers as $index => $signer)
                        <div class="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4 space-y-3 shadow-2xs">
                            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-2.5">
                                <div class="flex items-center gap-2.5">
                                    <span class="flex size-6 items-center justify-center rounded-full bg-slate-900 font-mono text-[11px] font-bold text-white shrink-0">
                                        {{ $index + 1 }}
                                    </span>
                                    <div>
                                        <h4 class="text-sm font-extrabold text-slate-900 leading-snug">
                                            {{ $signer->accepted_name ?: $signer->name }}
                                        </h4>
                                        <div class="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                                            @if ($signer->signer_title)
                                                <span class="font-semibold text-slate-700">{{ $signer->signer_title }}</span>
                                                <span>•</span>
                                            @endif
                                            <span class="font-mono text-[11px]">{{ $signer->email }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    @if ($signer->status === 'signed')
                                        <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                                            <svg class="size-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Sah Terverifikasi
                                        </span>
                                    @else
                                        <span class="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                                            Menunggu Tanda Tangan
                                        </span>
                                    @endif
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                <div>
                                    <span class="block text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                                        Goresan Tanda Tangan:
                                    </span>
                                    @if ($signer->status === 'signed' && $signer->signature_data)
                                        <div class="mt-1 flex h-16 w-48 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-2xs">
                                            <img 
                                                src="{{ $signer->signature_data }}" 
                                                alt="Tanda Tangan {{ $signer->name }}" 
                                                style="max-height: 52px; max-width: 100%; object-fit: contain;"
                                            />
                                        </div>
                                    @elseif ($signer->status === 'signed')
                                        <div class="mt-1 flex h-14 w-48 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 font-mono text-xs font-bold text-slate-700 shadow-2xs">
                                            Digital Signature Verified
                                        </div>
                                    @else
                                        <div class="mt-1 flex h-14 w-48 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-2 text-xs italic text-slate-400">
                                            Belum ditandatangani
                                        </div>
                                    @endif
                                </div>

                                <div class="space-y-1.5 sm:text-right text-xs">
                                    <div>
                                        <span class="block text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                                            Waktu Pembubuhan:
                                        </span>
                                        @if ($signer->status === 'signed' && $signer->signed_at)
                                            <p class="font-mono text-xs font-bold text-slate-900">
                                                {{ $signer->signed_at->translatedFormat('d F Y, H:i:s') }} WIB
                                            </p>
                                        @else
                                            <p class="text-xs italic text-amber-600">
                                                Menunggu penandatanganan
                                            </p>
                                        @endif
                                    </div>
                                    @if ($signer->page_number)
                                        <div class="text-[11px] text-slate-500">
                                            <span>Posisi Lembar Dokumen:</span>
                                            <strong class="font-mono text-slate-800">Halaman {{ $signer->page_number }}</strong>
                                        </div>
                                    @endif
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

                <!-- Action & Download Hub -->
                @if ($isCompleted)
                    <div class="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-2.5">
                        <div class="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                            <svg class="size-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Unduh Berkas Resmi Yang Telah Dibubuhi Tanda Tangan</span>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <a
                                href="{{ route('signature.verify.download-signed', $signatureRequest->verification_code) }}"
                                class="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-black active:scale-98 transition-all"
                            >
                                <svg class="size-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Unduh PDF Bertanda Tangan (Final)</span>
                            </a>
                            <a
                                href="{{ route('signature.verify.download-certificate', $signatureRequest->verification_code) }}"
                                class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-98 transition-all"
                            >
                                <svg class="size-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                                </svg>
                                <span>Unduh Sertifikat Verifikasi PDF</span>
                            </a>
                        </div>
                    </div>
                @endif

                <!-- Cryptographic Checksum (SHA-256) -->
                <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-1.5 text-xs text-slate-600">
                    <div class="flex items-center justify-between">
                        <span class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <svg class="size-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>DIGITAL CHECKSUM (SHA-256 INTEGRITY HASH)</span>
                        </span>
                        <button 
                            type="button" 
                            onclick="copyText('{{ $signatureRequest->document_checksum }}', this)"
                            class="cursor-pointer rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50"
                        >
                            Salin Hash
                        </button>
                    </div>
                    <code class="block font-mono text-[11px] text-slate-800 font-bold break-all select-all bg-white p-2 rounded-lg border border-slate-200/80">
                        {{ $signatureRequest->document_checksum }}
                    </code>
                </div>

                <!-- QR Code & Verification Security Box -->
                <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-3.5">
                        <div class="shrink-0 rounded-xl bg-white p-1.5 border border-slate-200 shadow-2xs">
                            <img 
                                src="{{ route('signature.qr', $signatureRequest->verification_code) }}" 
                                alt="QR Code Verifikasi Tanda Tangan" 
                                class="size-16 sm:size-18 object-contain"
                            />
                        </div>
                        <div class="space-y-0.5 text-xs">
                            <div class="font-bold text-slate-900 flex items-center gap-1.5">
                                <svg class="size-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Dokumen Terdaftar &amp; Terverifikasi Resmi</span>
                            </div>
                            <p class="text-slate-500 text-[11px] leading-tight">
                                Sertifikasi tanda tangan elektronik sah sesuai Pasal 11 UU ITE &amp; PP No. 71 Tahun 2019.
                            </p>
                            <div class="font-mono text-[10px] text-slate-400 truncate max-w-[320px] pt-0.5">
                                Kode Otentikasi: {{ $signatureRequest->verification_code }}
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 w-full sm:w-auto no-print">
                        <button 
                            type="button" 
                            onclick="window.print()" 
                            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                        >
                            <svg class="size-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>Cetak</span>
                        </button>
                        <button 
                            type="button" 
                            onclick="copyLink()" 
                            id="copyBtn"
                            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
                        >
                            <svg class="size-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span id="copyBtnText">Salin Tautan</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- System Disclaimer Footer -->
            <div class="p-4 sm:px-8 bg-slate-50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                <span>&copy; {{ date('Y') }} Roni, Putra &amp; Kusumah Law Firm · All Rights Reserved.</span>
                <span>RPK App — Integrated Legal Practice &amp; Digital Signature Protocol</span>
            </div>
        </main>
    </div>

    <script>
        function copyText(text, btn) {
            navigator.clipboard.writeText(text).then(() => {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<span class="text-emerald-600 font-bold">Tersalin!</span>';
                setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
            });
        }
        function copyLink() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const btn = document.getElementById('copyBtnText');
                const prev = btn.innerText;
                btn.innerText = 'Tersalin!';
                setTimeout(() => { btn.innerText = prev; }, 2000);
            });
        }
    </script>
</body>
</html>

