<!doctype html>
<html lang="id" class="h-full bg-[#f8fafc] antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verifikasi Keaslian Dokumen &amp; E-Sign | RPK Law Firm</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <style>
        body { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
            background: linear-gradient(180deg, #f1f5f9 0%, #f8fafc 100%);
        }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .qr-card {
            background: radial-gradient(circle at 50% 0%, #ffffff 0%, #f8fafc 100%);
            box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.05);
        }
        
        .security-badge {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%);
        }

        @media print {
            body { background: white !important; }
            .no-print { display: none !important; }
            .print-border { border: 1px solid #e2e8f0 !important; }
        }
    </style>
</head>
<body class="min-h-full text-slate-900 flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-[960px] space-y-6">
        
        <!-- 1. Header with Official Logo & Trust Badge -->
        <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:px-7 shadow-xs">
            <div class="flex items-center gap-4">
                <a href="{{ route('login') }}" title="RPK Law Firm Workspace" class="shrink-0">
                    <img 
                        src="/logo/logo.png" 
                        alt="RPK Law Firm Logo" 
                        class="h-12 w-auto max-w-[170px] object-contain"
                        onerror="this.onerror=null; this.src='/logo/raf-law-firm-transparent.png';"
                    />
                </a>
                <div class="border-l border-slate-200 pl-4">
                    <div class="flex items-center gap-2">
                        <h2 class="text-xs font-black tracking-tight text-slate-900 uppercase">
                            RPK LAW FIRM
                        </h2>
                        <span class="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white tracking-wider">
                            LEGAL VAULT
                        </span>
                    </div>
                    <p class="text-[11px] font-medium text-slate-500">
                        Roni, Putra &amp; Kusumah · Advocates &amp; Legal Consultants
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-2 self-start sm:self-center">
                <div class="inline-flex items-center gap-2 rounded-xl bg-emerald-50/90 border border-emerald-200/70 px-3.5 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs">
                    <span class="relative flex size-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full size-2 bg-emerald-600"></span>
                    </span>
                    Portal Verifikasi Resmi
                </div>
            </div>
        </header>

        <!-- 2. Main Verification Certificate Card -->
        <main class="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/40">
            
            <!-- Hero Banner: Status Overview & Verification Code & QR Focus -->
            <div class="border-b border-slate-100 bg-slate-50/50 p-6 sm:p-8">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    <!-- Left: Document Verification Hero & Status Details -->
                    <div class="lg:col-span-7 space-y-4">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="rounded-lg bg-slate-900 px-2.5 py-1 font-mono text-[10px] font-extrabold tracking-wider text-white uppercase shadow-2xs">
                                SERTIFIKAT DIGITAL E-SIGN
                            </span>
                            
                            @if ($signatureRequest->status === 'completed')
                                <span class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-2xs">
                                    <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Dokumen telah ditandatangani
                                </span>
                            @elseif ($signatureRequest->status === 'sent' || $signatureRequest->status === 'pending')
                                <span class="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-2xs">
                                    <svg class="size-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Menunggu Penandatanganan
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1.5 rounded-lg bg-slate-700 px-2.5 py-1 text-xs font-bold text-white">
                                    {{ str($signatureRequest->status)->replace('_', ' ')->title() }}
                                </span>
                            @endif
                        </div>

                        <div class="space-y-1.5">
                            <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-snug">
                                {{ $signatureRequest->document->title }}
                            </h1>
                            
                            <div class="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 font-medium">
                                @if ($signatureRequest->document->matter)
                                    <span class="inline-flex items-center gap-1 text-slate-700">
                                        <strong class="font-bold text-slate-900 font-mono">{{ $signatureRequest->document->matter->matter_number }}</strong>
                                        <span>· {{ $signatureRequest->document->matter->title }}</span>
                                    </span>
                                @elseif ($signatureRequest->document->client)
                                    <span class="inline-flex items-center gap-1 text-slate-700">
                                        Klien: <strong class="font-bold text-slate-900">{{ $signatureRequest->document->client->display_name }}</strong>
                                    </span>
                                @else
                                    <span class="text-slate-700 font-semibold">Dokumen Resmi Kantor Hukum RPK</span>
                                @endif

                                @if ($signatureRequest->completed_at)
                                    <span class="text-slate-300">•</span>
                                    <span class="text-emerald-700 font-semibold">
                                        Selesai: {{ $signatureRequest->completed_at->translatedFormat('d F Y, H:i') }} WIB
                                    </span>
                                @else
                                    <span class="text-slate-300">•</span>
                                    <span>
                                        Diterbitkan: {{ $signatureRequest->created_at->translatedFormat('d F Y, H:i') }} WIB
                                    </span>
                                @endif
                            </div>
                        </div>

                        <!-- Verification Statement Box -->
                        <div class="rounded-xl border border-slate-200/90 bg-white p-3.5 text-xs space-y-1 shadow-2xs">
                            <div class="flex items-center gap-2 font-bold text-slate-900">
                                <svg class="size-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Pernyataan Keaslian Elektronik:</span>
                            </div>
                            <p class="text-[11.5px] text-slate-600 leading-relaxed pl-6">
                                Dokumen ini terdaftar pada basis data sertifikasi tanda tangan internal RPK Law Firm. Kode verifikasi dan barcode QR code di samping merepresentasikan identitas unik berkas dan riwayat penandatanganan para pihak.
                            </p>
                        </div>
                    </div>

                    <!-- Right: Large Focused QR Code Card -->
                    <div class="lg:col-span-5 flex flex-col items-center justify-center">
                        <div class="qr-card w-full max-w-[310px] rounded-2xl border-2 border-slate-200/90 p-5 text-center space-y-3">
                            <div class="flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                <span>SCAN QR RESMI</span>
                                <span class="font-mono text-blue-600">RPK SECURE</span>
                            </div>

                            <!-- QR Code Visual Frame -->
                            <div class="relative mx-auto flex size-44 items-center justify-center rounded-2xl bg-white p-2 border border-slate-200/90 shadow-md">
                                <img 
                                    src="{{ route('signature.qr', $signatureRequest->verification_code) }}" 
                                    alt="QR Code Verifikasi RPK Law Firm" 
                                    class="size-full object-contain rounded-lg"
                                />
                            </div>

                            <!-- Verification Code Container with Copy Button -->
                            <div class="space-y-1.5 pt-1">
                                <span class="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                                    KODE VERIFIKASI DOKUMEN
                                </span>
                                <div class="flex items-center justify-between gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 pl-3 shadow-2xs">
                                    <code class="font-mono text-sm font-extrabold tracking-wider text-blue-600 truncate">
                                        {{ $signatureRequest->verification_code }}
                                    </code>
                                    <button 
                                        type="button" 
                                        onclick="copyText('{{ $signatureRequest->verification_code }}', this)"
                                        class="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-slate-800 transition-all active:scale-95 shrink-0"
                                        title="Salin Kode Verifikasi"
                                    >
                                        <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span>Salin</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- 3. Key Metrics & Status Bento Strip -->
            <div class="p-6 sm:p-8 space-y-6">
                
                @if (session('success'))
                    <div class="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 shadow-xs">
                        <svg class="size-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{{ session('success') }}</span>
                    </div>
                @endif

                <!-- KPI Grid -->
                <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                    <!-- 1. Status Verifikasi -->
                    <div class="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-2xs space-y-1">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">STATUS AUDIT</span>
                        <p class="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                            @if ($signatureRequest->status === 'completed')
                                <span class="size-2 rounded-full bg-emerald-500"></span>
                                Sah &amp; Terverifikasi
                            @else
                                <span class="size-2 rounded-full bg-amber-500"></span>
                                Menunggu TTD
                            @endif
                        </p>
                        <p class="text-[10.5px] text-slate-500">Jejak integritas aktif</p>
                    </div>

                    <!-- 2. Versi Dokumen -->
                    <div class="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-2xs space-y-1">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">VERSI BERKAS</span>
                        <p class="font-mono text-xs font-extrabold text-slate-900">
                            Versi {{ $signatureRequest->documentVersion->version_number ?? 1 }}.0 (Master)
                        </p>
                        <p class="text-[10.5px] text-slate-500">Terkunci secara kriptografis</p>
                    </div>

                    <!-- 3. Alur Penandatanganan -->
                    <div class="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-2xs space-y-1">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">ALUR PENANDATANGANAN</span>
                        <p class="text-xs font-extrabold text-slate-900">
                            {{ $signatureRequest->mode === 'sequential' ? 'Berurutan (Sequential)' : 'Serentak (Paralel)' }}
                        </p>
                        <p class="text-[10.5px] text-slate-500">Protokol otorisasi internal</p>
                    </div>

                    <!-- 4. Signers Status -->
                    <div class="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-2xs space-y-1">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">TOTAL PENANDATANGAN</span>
                        <p class="font-mono text-xs font-extrabold text-emerald-600">
                            {{ $signatureRequest->signers->where('status', 'signed')->count() }} / {{ $signatureRequest->signers->count() }} Pihak
                        </p>
                        <p class="text-[10.5px] text-slate-500">
                            {{ $signatureRequest->status === 'completed' ? 'Telah lengkap ditandatangani' : 'Sebagian masih diproses' }}
                        </p>
                    </div>
                </div>

                <!-- Cryptographic SHA-256 Checksum Container -->
                <div class="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5 space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-600">
                                DIGITAL CHECKSUM HASH (SHA-256)
                            </span>
                            <span class="inline-flex items-center gap-1 font-mono text-[9.5px] text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                                <svg class="size-2.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                </svg>
                                Anti-Tampering Valid
                            </span>
                        </div>
                        <button 
                            type="button" 
                            onclick="copyText('{{ $signatureRequest->document_checksum }}', this)"
                            class="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all active:scale-95"
                        >
                            Salin Hash
                        </button>
                    </div>
                    
                    <div class="overflow-x-auto rounded-xl bg-white p-3 border border-slate-200/90 shadow-2xs">
                        <code class="font-mono text-xs text-slate-900 font-bold break-all select-all tracking-wide">
                            {{ $signatureRequest->document_checksum }}
                        </code>
                    </div>
                    <p class="text-[11px] text-slate-500 leading-relaxed">
                        Nilai hash kriptografi SHA-256 di atas membuktikan integritas matematis berkas asli. Jika ada perubahan sekecil satu karakter pun pada dokumen, nilai hash ini akan berbeda.
                    </p>
                </div>

                <!-- Signers Table & Audit Trail -->
                <div class="space-y-3 pt-2">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div class="flex items-center gap-2">
                            <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">
                                Daftar Penanda Tangan &amp; Jejak Rekam
                            </h3>
                            <span class="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                                {{ $signatureRequest->signers->count() }} Pihak
                            </span>
                        </div>
                        <span class="text-[11px] text-slate-500">Zona Waktu: WIB (UTC+7)</span>
                    </div>

                    <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-slate-100 bg-slate-50/80 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th class="py-3 pr-2 pl-4 w-10 text-center">#</th>
                                    <th class="px-4 py-3">Nama Lengkap</th>
                                    <th class="px-4 py-3">Tanda Tangan Visual</th>
                                    <th class="px-4 py-3">Email</th>
                                    <th class="px-4 py-3">Status</th>
                                    <th class="py-3 pr-4 pl-4 text-right">Waktu Penyelesaian</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                @foreach ($signatureRequest->signers as $index => $signer)
                                    <tr class="transition-colors hover:bg-slate-50/60">
                                        <td class="py-3 pr-2 pl-4 text-center font-mono text-[11px] font-bold text-slate-400">
                                            {{ $index + 1 }}
                                        </td>
                                        <td class="px-4 py-3 font-bold text-slate-900">
                                            {{ $signer->name }}
                                        </td>
                                        <td class="px-4 py-3">
                                            @if ($signer->signature_data)
                                                <img 
                                                    src="{{ $signer->signature_data }}" 
                                                    alt="Tanda Tangan {{ $signer->name }}" 
                                                    class="h-8 max-w-[100px] object-contain rounded border border-slate-200 bg-white p-1 shadow-2xs"
                                                />
                                            @else
                                                <span class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-500">
                                                    {{ $signer->status === 'signed' ? 'OTP Terverifikasi' : 'Belum Ditandatangani' }}
                                                </span>
                                            @endif
                                        </td>
                                        <td class="px-4 py-3 text-slate-500 font-mono text-[11px]">
                                            {{ $signer->email }}
                                        </td>
                                        <td class="px-4 py-3 whitespace-nowrap">
                                            @if ($signer->status === 'signed')
                                                <span class="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-[10.5px] font-bold text-emerald-700 border border-emerald-200/60">
                                                    <svg class="size-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Sah
                                                </span>
                                            @else
                                                <span class="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 font-mono text-[10.5px] font-bold text-amber-700 border border-amber-200/60">
                                                    Menunggu
                                                </span>
                                            @endif
                                        </td>
                                        <td class="py-3 pr-4 pl-4 text-right font-mono text-[11px] font-semibold text-slate-600 whitespace-nowrap">
                                            @if ($signer->signed_at)
                                                {{ $signer->signed_at->translatedFormat('d/m/Y H:i:s') }} WIB
                                            @else
                                                <span class="text-slate-400 font-normal italic">Menunggu giliran</span>
                                            @endif
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Download Artifacts when completed -->
                @if ($signatureRequest->status === 'completed')
                    <div class="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-3">
                        <div class="flex items-center gap-2">
                            <svg class="size-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h4 class="text-xs font-black uppercase tracking-wider text-emerald-950">
                                Berkas Resmi &amp; Sertifikat Digital Tersedia
                            </h4>
                        </div>
                        <p class="text-xs text-emerald-900 leading-relaxed">
                            Dokumen telah lengkap dibubuhi tanda tangan para pihak, QR code verifikasi publik, dan stempel digital resmi. Anda dapat mengunduh berkas final maupun sertifikat keasliannya di bawah ini:
                        </p>
                        <div class="flex flex-wrap gap-2.5 pt-1">
                            @if ($signatureRequest->signed_final_path && $signatureRequest->signed_final_status === 'completed')
                                <a
                                    href="{{ route('signature-requests.signed-final', $signatureRequest->id) }}"
                                    class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
                                >
                                    <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Unduh Signed-Final PDF (QR Code)
                                </a>
                            @endif

                            @if ($signatureRequest->certificate_path)
                                <a
                                    href="{{ route('signature-requests.certificate', $signatureRequest->id) }}"
                                    class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all"
                                >
                                    <svg class="size-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    Unduh Sertifikat Keaslian PDF
                                </a>
                            @endif
                        </div>
                    </div>
                @endif

                <!-- Legal Notice & Disclaimer Banner -->
                <div class="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-4 sm:p-5 text-xs space-y-1">
                    <p class="font-bold text-blue-950 flex items-center gap-1.5">
                        <svg class="size-4 text-blue-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Landasan Hukum &amp; Keabsahan Pembuktian:
                    </p>
                    <p class="text-[11.5px] text-blue-900/90 leading-relaxed pl-5.5">
                        Sertifikat verifikasi digital ini diterbitkan secara elektronik oleh sistem <strong>RPK Law Firm Workspace</strong> sesuai ketentuan Undang-Undang No. 11 Tahun 2008 jo. UU No. 1 Tahun 2024 tentang Informasi dan Transaksi Elektronik (UU ITE). Data penandatanganan dan stempel digital dilindungi enkripsi kriptografis dan disimpan dalam jejak audit resmi firma.
                    </p>
                </div>

            </div>
        </main>

        <!-- 4. Institutional Corporate Footer -->
        <footer class="text-center space-y-1 text-xs text-slate-500 pt-2 no-print">
            <p class="font-semibold text-slate-700">
                &copy; {{ date('Y') }} RPK Law Firm (Roni, Putra &amp; Kusumah Advocates &amp; Legal Consultants).
            </p>
            <p class="font-mono text-[10.5px] text-slate-400">
                Official Document Verification Portal · SHA-256 Cryptographic Audit Trail
            </p>
        </footer>

    </div>

    <script>
        function copyText(text, btnElement) {
            navigator.clipboard.writeText(text).then(() => {
                const originalContent = btnElement.innerHTML;
                btnElement.innerHTML = '<span>Tersalin!</span>';
                btnElement.classList.add('bg-emerald-600');
                setTimeout(() => {
                    btnElement.innerHTML = originalContent;
                    btnElement.classList.remove('bg-emerald-600');
                }, 2000);
            });
        }
    </script>
</body>
</html>
