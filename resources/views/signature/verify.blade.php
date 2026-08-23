<!doctype html>
<html lang="id" class="h-full bg-[#f5f5f7] antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sertifikat Verifikasi Tanda Tangan & Penerimaan Internal | RPK Law Firm</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <style>
        body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="min-h-full bg-[#f5f5f7] text-[#1d1d1f] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-[760px] space-y-6">
        
        <!-- Corporate Letterhead Header -->
        <header class="flex items-center justify-between border-b border-black/[0.06] pb-5">
            <div class="flex items-center gap-3">
                <div class="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1d1d1f] to-[#2c2c2e] text-[#c5a880] shadow-md shadow-black/10 font-bold text-sm">
                    RPK
                </div>
                <div>
                    <h2 class="text-xs font-bold uppercase tracking-wider text-[#1d1d1f]">RPK Law Firm</h2>
                    <p class="text-[10px] text-[#86868b]">Advocates &amp; Legal Consultants · Jakarta, Indonesia</p>
                </div>
            </div>
            <div class="text-right">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                    <svg class="size-3.5 fill-current" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                    </svg>
                    Audit Trail Terverifikasi
                </span>
            </div>
        </header>

        <!-- Main Certificate Container Card -->
        <main class="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] space-y-7">
            
            <!-- Certificate Hero Title -->
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-black/[0.05] pb-6">
                <div class="space-y-1.5 flex-1">
                    <div class="flex items-center gap-2">
                        <span class="font-mono text-[10px] font-semibold tracking-wider uppercase text-[#86868b]">
                            Sertifikat Penerimaan Internal Dokumen
                        </span>
                    </div>
                    <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
                        {{ $signatureRequest->document->title }}
                    </h1>
                    <p class="text-xs text-[#86868b]">
                        Status Proses: 
                        <span class="font-semibold {{ $signatureRequest->status === 'completed' ? 'text-emerald-600' : 'text-amber-600' }}">
                            {{ $signatureRequest->status === 'completed' ? 'Selesai Ditandatangani' : str($signatureRequest->status)->replace('_', ' ')->title() }}
                        </span>
                        @if ($signatureRequest->completed_at)
                            · Selesai pada {{ $signatureRequest->completed_at->translatedFormat('d F Y, H:i') }} WIB
                        @endif
                    </p>
                </div>

                <!-- QR Code Block -->
                <div class="flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-[#fbfbfd] p-3 text-center shrink-0">
                    <img 
                        src="{{ route('signature.qr', $signatureRequest->verification_code) }}" 
                        alt="QR Code Verifikasi" 
                        class="size-24 rounded-lg bg-white p-1"
                    />
                    <span class="mt-1 font-mono text-[9px] font-semibold text-[#86868b]">
                        Scan to Verify
                    </span>
                </div>
            </div>

            @if (session('success'))
                <div class="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs font-medium text-emerald-800">
                    {{ session('success') }}
                </div>
            @endif

            <!-- 2-Column Bento Information Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-2xl border border-black/5 bg-[#fbfbfd] p-4 space-y-1">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">Kode Verifikasi Autentik</span>
                    <p class="font-mono text-sm font-bold text-[#0071e3] tracking-wide">
                        {{ $signatureRequest->verification_code }}
                    </p>
                    <p class="text-[10px] text-[#86868b]">ID Unik Verifikasi Sistem</p>
                </div>

                <div class="rounded-2xl border border-black/5 bg-[#fbfbfd] p-4 space-y-1">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">Versi Dokumen Terverifikasi</span>
                    <p class="font-mono text-sm font-bold text-[#1d1d1f]">
                        Versi {{ $signatureRequest->documentVersion->version_number }}.0 (Master)
                    </p>
                    <p class="text-[10px] text-[#86868b]">Integritas file terkunci</p>
                </div>
            </div>

            <!-- SHA-256 Checksum Container -->
            <div class="rounded-2xl border border-black/5 bg-[#fbfbfd] p-4 space-y-1.5">
                <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">Digital Checksum (SHA-256 Hash)</span>
                    <span class="font-mono text-[9px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Kriptografi Sah</span>
                </div>
                <div class="overflow-x-auto rounded-xl bg-white p-2.5 border border-black/[0.04]">
                    <code class="font-mono text-xs text-[#1d1d1f] font-medium break-all select-all">
                        {{ $signatureRequest->document_checksum }}
                    </code>
                </div>
                <p class="text-[10px] text-[#86868b]">
                    Setiap perubahan 1 karakter pada file akan mengubah nilai hash ini secara total.
                </p>
            </div>

            <!-- Signers Audit Trail Timeline -->
            <div class="space-y-3 pt-2">
                <div class="flex items-center justify-between border-b border-black/[0.05] pb-2.5">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-[#1d1d1f]">
                        Jejak Rekam &amp; Log Penanda Tangan
                    </h3>
                    <span class="font-mono text-[11px] text-[#86868b]">
                        Mode {{ $signatureRequest->mode === 'sequential' ? 'Berurutan' : 'Paralel' }}
                    </span>
                </div>

                <div class="divide-y divide-black/[0.04]">
                    @foreach ($signatureRequest->signers as $index => $signer)
                        <div class="flex items-center justify-between py-3.5 text-xs">
                            <div class="flex items-center gap-3">
                                <div class="flex size-7 items-center justify-center rounded-full {{ $signer->status === 'signed' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600' }} font-bold text-[11px]">
                                    {{ $index + 1 }}
                                </div>
                                <div>
                                    <h4 class="font-bold text-[#1d1d1f]">{{ $signer->name }}</h4>
                                    <p class="text-[11px] text-[#86868b]">{{ $signer->email }}</p>
                                </div>
                            </div>

                            <div class="text-right space-y-0.5">
                                <span class="inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold {{ $signer->status === 'signed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700' }}">
                                    {{ $signer->status === 'signed' ? 'Telah Diterima & Sah' : str($signer->status)->replace('_', ' ')->title() }}
                                </span>
                                @if ($signer->signed_at)
                                    <p class="font-mono text-[10px] text-[#86868b]">
                                        {{ $signer->signed_at->translatedFormat('d/m/Y H:i:s') }} WIB
                                    </p>
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <!-- Legal Notice & Disclaimer Banner -->
            <div class="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-[#0071e3] space-y-1">
                <p class="font-bold">Ketentuan &amp; Keabsahan Hukum Internal:</p>
                <p class="text-[11px] text-blue-900/80 leading-relaxed">
                    Sertifikat ini membuktikan pencatatan <strong>Internal Acceptance</strong> dan jejak audit digital pada sistem RPK Law Firm Workspace. Data penandatanganan dijamin keutuhannya melalui algoritma hash SHA-256 dan rekaman stempel waktu resmi firma.
                </p>
            </div>

        </main>

        <!-- Footer -->
        <footer class="text-center space-y-1 text-[11px] text-[#86868b] pt-2">
            <p>&copy; {{ date('Y') }} RPK Law Firm · Advocates &amp; Legal Consultants. Hak Cipta Dilindungi.</p>
            <p class="font-mono text-[10px]">Sistem Verifikasi Dokumen Digital · Secure SSL SHA-256 Encrypted</p>
        </footer>

    </div>
</body>
</html>
