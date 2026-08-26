<!doctype html>
<html lang="id" class="h-full bg-slate-100 antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verifikasi Keabsahan Surat Resmi | RPK Law Firm</title>
    <link rel="icon" type="image/png" href="/images/rpkapp.png">
    <link rel="apple-touch-icon" href="/images/rpkapp.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <style>
        body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @media print {
            body { background: white !important; padding: 0 !important; }
            .no-print { display: none !important; }
        }
    </style>
</head>
<body class="min-h-full bg-slate-100 text-slate-900 flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-[820px] space-y-5">
        
        <!-- Corporate Letterhead Header -->
        <header class="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:px-6 shadow-xs">
            <div class="flex items-center gap-3.5">
                <a href="{{ route('home') }}" title="RPK Law Firm" class="shrink-0">
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
                        Advocates &amp; Legal Consultants • Graha RPK Sudirman
                    </p>
                </div>
            </div>

            <div class="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-300 shadow-xs">
                <svg class="size-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Surat Resmi Terverifikasi Sah</span>
            </div>
        </header>

        <!-- Main Verification Certificate Card -->
        <main class="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 divide-y divide-slate-100">
            
            <!-- Hero Top Header -->
            <div class="p-6 sm:p-8 space-y-5 bg-gradient-to-b from-slate-50/80 via-white to-white">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="rounded-md bg-slate-900 px-2.5 py-1 font-mono text-[9px] font-extrabold tracking-wider text-white uppercase">
                        SISTEM VERIFIKASI KORESPONDENSI ELEKTRONIK
                    </span>

                    <span class="inline-flex items-center gap-1.5 rounded-full {{ $correspondence->direction === 'inbound' ? 'bg-blue-50 border border-blue-200 text-blue-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800' }} px-3 py-1 text-xs font-extrabold">
                        {{ $correspondence->direction === 'inbound' ? 'SURAT MASUK RESMI (INBOUND)' : 'SURAT KELUAR RESMI (OUTBOUND)' }}
                    </span>
                </div>

                <div class="space-y-1.5">
                    <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                        {{ $correspondence->subject }}
                    </h1>
                    <p class="text-xs text-slate-500 font-medium">
                        Tercatat secara resmi pada buku registrasi korespondensi perkara RPK Law Firm.
                    </p>
                </div>

                <!-- Bento Info Grid -->
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                    <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perkara Hukum Terkait</span>
                        <p class="font-mono font-bold text-blue-600 text-xs">{{ $correspondence->matter->matter_number }}</p>
                        <p class="text-[11px] font-medium text-slate-700 truncate">{{ $correspondence->matter->title }}</p>
                    </div>

                    <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Klien Terdaftar</span>
                        <p class="font-bold text-slate-900 text-xs truncate">
                            {{ $correspondence->client->display_name ?? '-' }}
                        </p>
                        <p class="text-[10px] text-slate-500">Kanal: {{ strtoupper($correspondence->source) }}</p>
                    </div>

                    <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-1 sm:col-span-2 lg:col-span-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal &amp; Waktu Pengiriman</span>
                        <p class="font-bold text-slate-900 text-xs">
                            {{ $correspondence->occurred_at ? \Illuminate\Support\Carbon::parse($correspondence->occurred_at)->translatedFormat('d F Y • H:i') . ' WIB' : '-' }}
                        </p>
                        <p class="text-[10px] text-slate-500">
                            Staf / Advokat: <strong class="text-slate-800">{{ $correspondence->creator->name ?? 'Staf Firma' }}</strong>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Addresses & Communication Breakdown -->
            <div class="p-6 sm:p-8 space-y-5">
                <h3 class="text-xs font-black tracking-wider text-slate-900 uppercase">
                    Rincian Komunikasi &amp; Pihak Terkait
                </h3>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div class="rounded-xl border border-slate-200/80 bg-white p-4 space-y-2 text-xs">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pihak Pengirim (From)</span>
                        <div class="space-y-1 text-slate-800">
                            @foreach ($correspondence->from_addresses ?? [] as $from)
                                <div class="font-medium">• {{ $from }}</div>
                            @endforeach
                        </div>
                    </div>

                    <div class="rounded-xl border border-slate-200/80 bg-white p-4 space-y-2 text-xs">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pihak Penerima (To / CC)</span>
                        <div class="space-y-1 text-slate-800">
                            @foreach ($correspondence->to_addresses ?? [] as $to)
                                <div class="font-medium">• {{ $to }}</div>
                            @endforeach
                            @foreach ($correspondence->cc_addresses ?? [] as $cc)
                                <div class="text-[11px] text-slate-500">• CC: {{ $cc }}</div>
                            @endforeach
                        </div>
                    </div>
                </div>

                @if ($correspondence->documents->count() > 0)
                    <div class="space-y-2 pt-2">
                        <h4 class="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                            Lampiran Dokumen Sah Terkait ({{ $correspondence->documents->count() }})
                        </h4>
                        <div class="divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-white">
                            @foreach ($correspondence->documents as $doc)
                                <div class="flex items-center justify-between p-3 text-xs">
                                    <div class="flex items-center gap-2">
                                        <svg class="size-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <div>
                                            <p class="font-bold text-slate-900">{{ $doc->title }}</p>
                                            @if ($doc->currentVersion)
                                                <p class="font-mono text-[10px] text-slate-400">
                                                    SHA-256: {{ substr($doc->currentVersion->checksum ?? '', 0, 16) }}...
                                                </p>
                                            @endif
                                        </div>
                                    </div>
                                    <span class="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                                        ✓ TERDAFTAR
                                    </span>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif
            </div>

            <!-- Verification Security Footer -->
            <div class="p-6 sm:p-8 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <img 
                        src="{{ route('verify.correspondence.qr', $correspondence) }}" 
                        alt="QR Code Verifikasi" 
                        class="size-16 rounded-lg border border-slate-200 bg-white p-1 shadow-2xs"
                    />
                    <div class="space-y-0.5 text-left">
                        <p class="text-xs font-extrabold text-slate-900">QR Code Validasi Korespondensi</p>
                        <p class="text-[10px] text-slate-500 max-w-[280px]">
                            Pindai kapan saja untuk memastikan bahwa surat ini resmi dikeluarkan atau diterima oleh kantor hukum RPK.
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-2 no-print">
                    <button 
                        type="button" 
                        onclick="window.print()" 
                        class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95"
                    >
                        <svg class="size-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Cetak Bukti Verifikasi
                    </button>
                </div>
            </div>
        </main>

        <!-- Footer Note -->
        <footer class="text-center text-[11px] text-slate-400 py-2">
            &copy; {{ date('Y') }} RPK Law Firm (Roni, Putra &amp; Kusumah Advocates). Hak Cipta Dilindungi Undang-Undang.
        </footer>
    </div>
</body>
</html>
