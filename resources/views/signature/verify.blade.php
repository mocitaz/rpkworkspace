<!doctype html>
<html lang="id" class="h-full bg-slate-100 antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sertifikat Verifikasi Keabsahan Dokumen | RPK Law Firm</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <style>
        body { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
        }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        @media print {
            body { background: white !important; padding: 0 !important; }
            .no-print { display: none !important; }
        }
    </style>
</head>
<body class="min-h-full bg-slate-100 text-slate-900 flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-[800px] space-y-5">
        
        <!-- Corporate Letterhead Header -->
        <header class="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:px-6 shadow-sm">
            <div class="flex items-center gap-3.5">
                <a href="{{ route('login') }}" title="RPK Law Firm" class="shrink-0">
                    <img 
                        src="/logo/logo.png" 
                        alt="RPK Law Firm" 
                        class="h-9 w-auto max-w-[150px] object-contain"
                        onerror="this.onerror=null; this.src='/logo/raf-law-firm-transparent.png';"
                    />
                </a>
                <div class="border-l border-slate-200 pl-3">
                    <h2 class="text-xs font-black tracking-tight text-slate-900 uppercase">
                        RPK LAW FIRM
                    </h2>
                    <p class="text-[10px] font-semibold text-slate-500">
                        Advocates &amp; Legal Consultants
                    </p>
                </div>
            </div>

            <div class="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1 text-xs font-bold text-white shadow-2xs">
                <svg class="size-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Sertifikat Sah Terverifikasi</span>
            </div>
        </header>

        <!-- Main Certificate Card -->
        <main class="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 divide-y divide-slate-100">
            
            <!-- Hero Top Certificate Section -->
            <div class="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-slate-50/80 via-white to-white">
                
                <!-- Status Banner & Category -->
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="rounded-md bg-slate-900 px-2.5 py-1 font-mono text-[9px] font-extrabold tracking-wider text-white uppercase">
                        VERIFIKASI TANDA TANGAN ELEKTRONIK RESMI
                    </span>

                    @if ($signatureRequest->status === 'completed')
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800">
                            <svg class="size-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            Dokumen Sah Selesai Ditandatangani
                        </span>
                    @elseif ($signatureRequest->status === 'sent' || $signatureRequest->status === 'pending')
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-xs font-bold text-amber-800">
                            Menunggu Penandatanganan
                        </span>
                    @else
                        <span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-700">
                            {{ str($signatureRequest->status)->replace('_', ' ')->title() }}
                        </span>
                    @endif
                </div>

                <!-- Document Title & Key Details -->
                <div class="space-y-2">
                    <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                        {{ $signatureRequest->document->title }}
                    </h1>
                    
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium">
                        @if ($signatureRequest->document->matter)
                            <span>Nomor Perkara: <strong class="font-mono text-slate-900 font-bold">{{ $signatureRequest->document->matter->matter_number }}</strong></span>
                            <span class="text-slate-300">•</span>
                            <span>{{ $signatureRequest->document->matter->title }}</span>
                        @elseif ($signatureRequest->document->client)
                            <span>Klien: <strong class="text-slate-900 font-bold">{{ $signatureRequest->document->client->display_name }}</strong></span>
                        @else
                            <span class="font-semibold text-slate-700">Dokumen Internal RPK Law Firm</span>
                        @endif

                        <span class="text-slate-300">•</span>
                        <span>Versi: <strong class="font-mono text-slate-800">v{{ $signatureRequest->documentVersion->version_number ?? 1 }}.0</strong></span>
                    </div>
                </div>

                <!-- Bento Verification Information Box -->
                <div class="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
                    <div class="flex flex-col sm:flex-row items-center gap-5">
                        <!-- QR Code Container -->
                        <div class="shrink-0 flex items-center justify-center rounded-xl bg-slate-50 p-2.5 border border-slate-200 shadow-inner">
                            <img 
                                src="{{ route('signature.qr', $signatureRequest->verification_code) }}" 
                                alt="QR Code Verifikasi" 
                                style="width: 88px; height: 88px; min-width: 88px; min-height: 88px;"
                                class="object-contain"
                            />
                        </div>

                        <!-- Verification Meta Content -->
                        <div class="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                            <div>
                                <span class="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                    KODE OTENTIKASI &amp; VERIFIKASI RESMI
                                </span>
                                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                                    <code class="font-mono text-lg font-black text-slate-900 tracking-wider select-all">
                                        {{ $signatureRequest->verification_code }}
                                    </code>
                                    <button 
                                        type="button" 
                                        onclick="copyText('{{ $signatureRequest->verification_code }}', this)"
                                        class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all active:scale-95"
                                        title="Salin Kode"
                                    >
                                        <svg class="size-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span>Salin</span>
                                    </button>
                                </div>
                            </div>
                            <p class="text-xs text-slate-500 leading-relaxed">
                                Keabsahan dokumen ini dapat diverifikasi publik kapan saja melalui pemindaian QR Code atau tautan resmi verifikasi RPK Law Firm Workspace sesuai ketentuan UU ITE.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Signers Audit Trail Section -->
            <div class="p-6 sm:p-8 space-y-4 bg-white">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">
                        Jejak Rekam &amp; Pembubuhan Penandatangan (Audit Trail)
                    </h3>
                    <span class="font-mono text-xs font-extrabold text-slate-700">
                        {{ $signatureRequest->signers->where('status', 'signed')->count() }} / {{ $signatureRequest->signers->count() }} Pihak Telah Tanda Tangan
                    </span>
                </div>

                <div class="space-y-4">
                    @foreach ($signatureRequest->signers as $index => $signer)
                        <div class="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 space-y-4">
                            
                            <!-- Header: Signer Info & Badge -->
                            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                                <div class="flex items-center gap-3">
                                    <span class="flex size-7 items-center justify-center rounded-full bg-slate-900 font-mono text-xs font-bold text-white shrink-0">
                                        {{ $index + 1 }}
                                    </span>
                                    <div>
                                        <h4 class="text-sm font-black text-slate-900 leading-tight">
                                            {{ $signer->accepted_name ?: $signer->name }}
                                        </h4>
                                        <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                            @if ($signer->signer_title)
                                                <span class="font-semibold text-slate-700">{{ $signer->signer_title }}</span>
                                                <span>•</span>
                                            @endif
                                            <span class="font-mono">{{ $signer->email }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    @if ($signer->status === 'signed')
                                        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-xs font-bold text-emerald-800">
                                            <svg class="size-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Sah Terverifikasi
                                        </span>
                                    @else
                                        <span class="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1 font-mono text-xs font-bold text-amber-800">
                                            Menunggu Penandatanganan
                                        </span>
                                    @endif
                                </div>
                            </div>

                            <!-- Body: Visual Signature Plate & Audit Details -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                <!-- Visual Signature Display -->
                                <div class="space-y-1.5">
                                    <span class="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                        Goresan Tanda Tangan:
                                    </span>
                                    @if ($signer->status === 'signed' && $signer->signature_data)
                                        <div class="flex h-20 w-52 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-2xs">
                                            <img 
                                                src="{{ $signer->signature_data }}" 
                                                alt="Tanda Tangan {{ $signer->name }}" 
                                                style="max-height: 60px; max-width: 100%; object-fit: contain;"
                                            />
                                        </div>
                                    @elseif ($signer->status === 'signed')
                                        <div class="flex h-16 w-52 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 font-mono text-xs font-bold text-slate-700 shadow-2xs">
                                            Digital Signature Verified
                                        </div>
                                    @else
                                        <div class="flex h-16 w-52 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-2 text-xs italic text-slate-400">
                                            Belum ditandatangani
                                        </div>
                                    @endif
                                </div>

                                <!-- Audit Metadata & Placement -->
                                <div class="space-y-2 sm:text-right">
                                    <div>
                                        <span class="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                            WAKTU PENANDATANGANAN (WIB):
                                        </span>
                                        @if ($signer->status === 'signed' && $signer->signed_at)
                                            <p class="font-mono text-xs font-black text-slate-900">
                                                {{ $signer->signed_at->translatedFormat('d F Y, H:i:s') }} WIB
                                            </p>
                                        @else
                                            <p class="text-xs italic text-amber-600 font-medium">
                                                Menunggu penandatanganan
                                            </p>
                                        @endif
                                    </div>

                                    @if ($signer->page_number)
                                        <div>
                                            <span class="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                                TITIK PEMBUBUHAN DOKUMEN:
                                            </span>
                                            <p class="font-mono text-xs font-bold text-slate-700">
                                                Halaman {{ $signer->page_number }} ({{ round($signer->position_x) }}% X, {{ round($signer->position_y) }}% Y)
                                            </p>
                                        </div>
                                    @endif
                                </div>
                            </div>

                        </div>
                    @endforeach
                </div>
            </div>

            <!-- Download Official Stamped Document Section -->
            @if ($signatureRequest->status === 'completed')
                <div class="p-6 sm:p-8 bg-slate-50/70 space-y-4">
                    <div class="flex items-center gap-2">
                        <svg class="size-4 text-slate-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">
                            Unduh Berkas Resmi Yang Telah Dibubuhi
                        </h4>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed">
                        Dokumen telah lengkap dibubuhi stempel tanda tangan para pihak, QR code verifikasi publik, dan stempel digital resmi.
                    </p>
                    <div class="flex flex-wrap gap-2.5 pt-1">
                        <a
                            href="{{ route('signature.verify.download-signed', $signatureRequest->verification_code) }}"
                            class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-black active:scale-95 transition-all"
                        >
                            <svg class="size-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Unduh Berkas PDF (Dibubuhi TTD &amp; QR Code)</span>
                        </a>

                        <a
                            href="{{ route('signature.verify.download-certificate', $signatureRequest->verification_code) }}"
                            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all"
                        >
                            <svg class="size-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <span>Unduh Sertifikat PDF Resmi</span>
                        </a>
                    </div>
                </div>
            @endif

            <!-- Cryptographic Checksum & Legal Notice -->
            <div class="p-6 sm:p-8 space-y-4 bg-slate-50/40">
                <!-- Checksum Box -->
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                            DIGITAL CHECKSUM (SHA-256 HASH)
                        </span>
                        <button 
                            type="button" 
                            onclick="copyText('{{ $signatureRequest->document_checksum }}', this)"
                            class="cursor-pointer rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Salin Hash
                        </button>
                    </div>
                    <div class="overflow-x-auto rounded-xl bg-white p-3 border border-slate-200">
                        <code class="font-mono text-[11px] text-slate-800 font-bold break-all select-all">
                            {{ $signatureRequest->document_checksum }}
                        </code>
                    </div>
                    <p class="text-[10.5px] text-slate-500">
                        Hash SHA-256 ini menjamin integritas matematis berkas bahwa dokumen tidak mengalami perubahan sejak diterbitkan oleh RPK Law Firm.
                    </p>
                </div>

                <!-- Legal Notice -->
                <div class="rounded-xl border border-slate-200 bg-white p-4 text-xs space-y-1">
                    <p class="font-bold text-slate-900 flex items-center gap-1.5">
                        <svg class="size-3.5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Kekuatan Pembuktian &amp; Kepastian Hukum</span>
                    </p>
                    <p class="text-[11px] text-slate-500 leading-relaxed">
                        Sertifikasi tanda tangan elektronik ini diterbitkan sesuai Pasal 11 Undang-Undang No. 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (UU ITE) serta Peraturan Pemerintah No. 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik.
                    </p>
                </div>
            </div>

        </main>

        <!-- Footer -->
        <footer class="text-center space-y-1 text-xs text-slate-400 pt-1">
            <p class="font-semibold text-slate-600">&copy; {{ date('Y') }} RPK Law Firm · Advocates &amp; Legal Consultants.</p>
            <p class="font-mono text-[10px]">Public Verification Protocol · SHA-256 Validated</p>
        </footer>

    </div>

    <script>
        function copyText(text, btn) {
            navigator.clipboard.writeText(text).then(() => {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<span class="text-emerald-600 font-bold">Tersalin!</span>';
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                }, 2000);
            });
        }
    </script>
</body>
</html>
