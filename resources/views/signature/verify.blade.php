<!doctype html>
<html lang="id" class="h-full bg-[#fafafc] antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sertifikat Verifikasi Tanda Tangan Digital | RPK Law Firm</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <style>
        body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="min-h-full bg-[#fafafc] text-slate-900 flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-[920px] space-y-4">
        
        <!-- Main Certificate Container Card -->
        <main class="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs">
            
            <!-- 1. Corporate Letterhead Top Bar -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-5 sm:px-7">
                <div class="flex items-center gap-3.5">
                    <div class="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white font-black text-sm tracking-wider">
                        RPK
                    </div>
                    <div class="border-l border-slate-200 pl-3.5">
                        <div class="flex items-center gap-2">
                            <h2 class="text-xs font-bold tracking-tight text-slate-900 uppercase">RPK LAW FIRM</h2>
                            <span class="rounded bg-slate-900 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-white">
                                SECURE VAULT
                            </span>
                        </div>
                        <p class="text-[11px] text-slate-500">Roni, Putra &amp; Kusumah · Advocates &amp; Legal Consultants</p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <span class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Audit Trail Sah &amp; Terverifikasi
                    </span>
                </div>
            </div>

            <!-- 2. Certificate Body -->
            <div class="p-5 sm:p-7 space-y-5">
                
                <!-- Document Hero Title & QR Code -->
                <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-5 border-b border-slate-100 pb-5">
                    <div class="space-y-2 flex-1 min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700 uppercase">
                                SERTIFIKAT DIGITAL E-SIGN
                            </span>
                            <span class="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold {{ $signatureRequest->status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700' }}">
                                @if ($signatureRequest->status === 'completed')
                                    <svg class="size-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Dokumen telah ditandatangani
                                @else
                                    {{ str($signatureRequest->status)->replace('_', ' ')->title() }}
                                @endif
                            </span>
                        </div>

                        <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
                            {{ $signatureRequest->document->title }}
                        </h1>

                        <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            @if ($signatureRequest->document->matter)
                                <span>Perkara: <strong class="font-semibold text-slate-900">{{ $signatureRequest->document->matter->matter_number }} - {{ $signatureRequest->document->matter->title }}</strong></span>
                            @elseif ($signatureRequest->document->client)
                                <span>Klien: <strong class="font-semibold text-slate-900">{{ $signatureRequest->document->client->display_name }}</strong></span>
                            @else
                                <span>Dokumen Resmi Internal Firma</span>
                            @endif
                            @if ($signatureRequest->completed_at)
                                <span>·</span>
                                <span>Diselesaikan pada <strong class="font-mono text-slate-900">{{ $signatureRequest->completed_at->translatedFormat('d F Y, H:i') }} WIB</strong></span>
                            @endif
                        </div>
                    </div>

                    <!-- QR Code Block -->
                    <div class="flex flex-row lg:flex-col items-center justify-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-3 text-center shrink-0">
                        <img 
                            src="{{ route('signature.qr', $signatureRequest->verification_code) }}" 
                            alt="QR Code Verifikasi" 
                            class="size-16 rounded-lg bg-white p-1 shadow-2xs"
                        />
                        <div class="text-left lg:text-center">
                            <span class="block font-mono text-[9px] font-semibold text-slate-500 uppercase">
                                Scan to Verify
                            </span>
                            <span class="font-mono text-[9.5px] font-bold text-blue-600">
                                {{ $signatureRequest->verification_code }}
                            </span>
                        </div>
                    </div>
                </div>

                @if (session('success'))
                    <div class="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/90 p-3 text-xs font-semibold text-emerald-800">
                        <svg class="size-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {{ session('success') }}
                    </div>
                @endif

                <!-- 4 Compact Bento KPI Stat Strips -->
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <!-- 1. Kode Verifikasi -->
                    <div class="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs">
                        <div class="space-y-1">
                            <span class="text-[10px] font-semibold uppercase text-slate-500">KODE VERIFIKASI</span>
                            <div class="flex items-center justify-between gap-1">
                                <p class="font-mono text-xs font-bold text-blue-600 truncate" id="verifCode">
                                    {{ $signatureRequest->verification_code }}
                                </p>
                                <button 
                                    type="button" 
                                    onclick="copyText('{{ $signatureRequest->verification_code }}', this)"
                                    class="cursor-pointer rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9.5px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
                                >
                                    Salin
                                </button>
                            </div>
                        </div>
                        <div class="mt-1.5 border-t border-slate-100 pt-1.5 text-[10px] text-slate-500">ID Unik Sertifikat</div>
                    </div>

                    <!-- 2. Versi Dokumen -->
                    <div class="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs">
                        <div class="space-y-1">
                            <span class="text-[10px] font-semibold uppercase text-slate-500">VERSI BERKAS</span>
                            <p class="font-mono text-xs font-bold text-slate-900">
                                Versi {{ $signatureRequest->documentVersion->version_number }}.0 (Master)
                            </p>
                        </div>
                        <div class="mt-1.5 border-t border-slate-100 pt-1.5 text-[10px] text-slate-500">Integritas Terkunci</div>
                    </div>

                    <!-- 3. Mode Alur -->
                    <div class="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs">
                        <div class="space-y-1">
                            <span class="text-[10px] font-semibold uppercase text-slate-500">ALUR E-SIGN</span>
                            <p class="text-xs font-semibold text-slate-900">
                                {{ $signatureRequest->mode === 'sequential' ? 'Berurutan (Sequential)' : 'Serentak (Paralel)' }}
                            </p>
                        </div>
                        <div class="mt-1.5 border-t border-slate-100 pt-1.5 text-[10px] text-slate-500">Protokol Otorisasi</div>
                    </div>

                    <!-- 4. Total Signer -->
                    <div class="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs">
                        <div class="space-y-1">
                            <span class="text-[10px] font-semibold uppercase text-slate-500">STATUS PERSETUJUAN</span>
                            <p class="font-mono text-xs font-bold text-emerald-600">
                                {{ $signatureRequest->signers->where('status', 'signed')->count() }} / {{ $signatureRequest->signers->count() }} Pihak Sah
                            </p>
                        </div>
                        <div class="mt-1.5 border-t border-slate-100 pt-1.5 text-[10px] text-slate-500">Penerimaan Lengkap</div>
                    </div>
                </div>

                <!-- Cryptographic SHA-256 Checksum Container -->
                <div class="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 space-y-1.5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-semibold uppercase text-slate-500">DIGITAL CHECKSUM (SHA-256 HASH)</span>
                            <span class="font-mono text-[9px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">Kriptografi Sah</span>
                        </div>
                        <button 
                            type="button" 
                            onclick="copyText('{{ $signatureRequest->document_checksum }}', this)"
                            class="cursor-pointer rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Salin Hash
                        </button>
                    </div>
                    <div class="overflow-x-auto rounded-lg bg-white p-2.5 border border-slate-200/70">
                        <code class="font-mono text-xs text-slate-900 font-semibold break-all select-all tracking-wide">
                            {{ $signatureRequest->document_checksum }}
                        </code>
                    </div>
                    <p class="text-[10.5px] text-slate-500">
                        Nilai hash kriptografi SHA-256 di atas menjamin berkas asli tidak pernah mengalami modifikasi sejak tanggal penerbitan.
                    </p>
                </div>

                <!-- Signers Audit Trail Table -->
                <div class="space-y-2.5 pt-1">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 class="text-xs font-bold uppercase text-slate-900">
                            Jejak Rekam &amp; Log Penanda Tangan
                        </h3>
                        <span class="font-mono text-xs font-semibold text-slate-500">
                            {{ $signatureRequest->signers->count() }} Pihak Terdaftar
                        </span>
                    </div>

                    <div class="overflow-hidden rounded-lg border border-slate-200/70 bg-white">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase">
                                    <th class="py-2.5 pr-2 pl-3 w-10 text-center">#</th>
                                    <th class="px-3 py-2.5">Nama Penanda Tangan</th>
                                    <th class="px-3 py-2.5">Tanda Tangan</th>
                                    <th class="px-3 py-2.5">Alamat Email</th>
                                    <th class="px-3 py-2.5">Status</th>
                                    <th class="py-2.5 pr-3 pl-3 text-right">Waktu Penandatanganan</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                @foreach ($signatureRequest->signers as $index => $signer)
                                    <tr class="transition-colors hover:bg-slate-50/50">
                                        <td class="py-2.5 pr-2 pl-3 text-center font-mono text-[10px] text-slate-400">
                                            {{ $index + 1 }}
                                        </td>
                                        <td class="px-3 py-2.5 font-semibold text-slate-900">
                                            {{ $signer->name }}
                                        </td>
                                        <td class="px-3 py-2.5">
                                            @if ($signer->signature_data)
                                                <img 
                                                    src="{{ $signer->signature_data }}" 
                                                    alt="Tanda Tangan {{ $signer->name }}" 
                                                    class="h-7 max-w-[90px] object-contain rounded border border-slate-200 bg-white p-0.5 shadow-2xs"
                                                />
                                            @else
                                                <span class="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[9.5px] font-semibold text-slate-500">
                                                    OTP Verifikasi
                                                </span>
                                            @endif
                                        </td>
                                        <td class="px-3 py-2.5 text-slate-500">
                                            {{ $signer->email }}
                                        </td>
                                        <td class="px-3 py-2.5 whitespace-nowrap">
                                            <span class="inline-flex items-center gap-1 rounded px-1.5 py-0.2 font-mono text-[10px] font-semibold {{ $signer->status === 'signed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700' }}">
                                                @if ($signer->status === 'signed')
                                                    <svg class="size-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Sah
                                                @else
                                                    {{ str($signer->status)->replace('_', ' ')->title() }}
                                                @endif
                                            </span>
                                        </td>
                                        <td class="py-2.5 pr-3 pl-3 text-right font-mono text-[10.5px] font-semibold text-slate-600 whitespace-nowrap">
                                            @if ($signer->signed_at)
                                                {{ $signer->signed_at->translatedFormat('d/m/Y H:i:s') }} WIB
                                            @else
                                                <span class="text-slate-400 font-normal">Menunggu persetujuan</span>
                                            @endif
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Legal Notice & Disclaimer Banner -->
                <div class="rounded-lg border border-blue-200/70 bg-blue-50/60 p-3 text-xs space-y-0.5">
                    <p class="font-semibold text-blue-950">Ketentuan &amp; Keabsahan Hukum Internal:</p>
                    <p class="text-[11px] text-blue-900/90 leading-relaxed">
                        Sertifikat ini membuktikan pencatatan <strong>Internal Acceptance</strong> dan jejak audit digital pada sistem RPK Law Firm Workspace. Data penandatanganan dijamin keutuhannya melalui algoritma hash SHA-256 dan rekaman stempel waktu resmi firma.
                    </p>
                </div>

            </div>
        </main>

        <!-- Footer -->
        <footer class="text-center space-y-0.5 text-xs text-slate-500 pt-1">
            <p class="font-medium">&copy; {{ date('Y') }} RPK Law Firm · Advocates &amp; Legal Consultants.</p>
            <p class="font-mono text-[10px]">Sistem Verifikasi Dokumen Digital · SHA-256 Encrypted</p>
        </footer>

    </div>

    <script>
        function copyText(text, btnElement) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = btnElement.innerText;
                btnElement.innerText = 'Disalin';
                btnElement.classList.add('text-emerald-700', 'bg-emerald-50');
                setTimeout(() => {
                    btnElement.innerText = originalText;
                    btnElement.classList.remove('text-emerald-700', 'bg-emerald-50');
                }, 2000);
            });
        }
    </script>
</body>
</html>
