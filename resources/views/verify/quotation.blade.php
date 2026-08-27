@php
    $isAccepted = in_array($quotation->status, ['accepted', 'converted']);
    $isSent = $quotation->status === 'sent';
    $isRejected = $quotation->status === 'rejected';
@endphp
<!doctype html>
<html lang="id" class="h-full bg-slate-100 antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verifikasi Surat Penawaran {{ $quotation->quotation_number }} | RPK Law Firm</title>
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
    <div class="mx-auto w-full max-w-[820px] space-y-4">
        
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
                        Practice Development &amp; Proposals • Bandung
                    </p>
                </div>
            </div>

            <div>
                @if ($isAccepted)
                    <div class="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3 py-1.5 shadow-2xs">
                        <svg class="size-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div class="text-left">
                            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status Penawaran</div>
                            <div class="text-[11.5px] font-extrabold text-slate-900 leading-tight">Disetujui / Aktif</div>
                        </div>
                    </div>
                @elseif ($isSent)
                    <div class="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-1.5 shadow-2xs">
                        <svg class="size-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <div class="text-left">
                            <div class="text-[9px] font-bold text-blue-700 uppercase tracking-wider">Status Penawaran</div>
                            <div class="text-[11.5px] font-extrabold text-blue-900 leading-tight">Terkirim (Sent)</div>
                        </div>
                    </div>
                @elseif ($isRejected)
                    <div class="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 px-3 py-1.5 shadow-2xs">
                        <svg class="size-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div class="text-left">
                            <div class="text-[9px] font-bold text-rose-700 uppercase tracking-wider">Status Penawaran</div>
                            <div class="text-[11.5px] font-extrabold text-rose-900 leading-tight">Ditolak (Rejected)</div>
                        </div>
                    </div>
                @else
                    <div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 shadow-2xs">
                        <svg class="size-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div class="text-left">
                            <div class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Status Penawaran</div>
                            <div class="text-[11.5px] font-extrabold text-slate-800 leading-tight">Konsep (Draft)</div>
                        </div>
                    </div>
                @endif
            </div>
        </header>

        <!-- Main Verification Certificate Card -->
        <main class="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 divide-y divide-slate-100">
            
            <!-- Hero Top Header -->
            <div class="p-6 sm:p-8 space-y-4 bg-gradient-to-b from-slate-50/80 via-white to-white">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div class="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                        <span class="font-bold text-slate-900">RPK Law Firm</span>
                        <span>•</span>
                        <span>Divisi Penawaran Jasa Hukum</span>
                    </div>
                    <span class="text-[11px] text-slate-400">
                        Diverifikasi: <span class="font-medium text-slate-600">{{ now()->timezone(config('raf.timezone'))->translatedFormat('d F Y, H:i') }} WIB</span>
                    </span>
                </div>

                <div>
                    <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Verifikasi Surat Penawaran Biaya Jasa Hukum
                    </h1>
                    <p class="mt-1 text-xs sm:text-sm text-slate-600">
                        Dokumen proposal penawaran jasa hukum &amp; estimasi honorarium resmi RPK Law Firm.
                    </p>
                </div>

                <!-- Unified 3-Column Data Bar -->
                <div class="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/60 shadow-2xs grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
                    <div class="p-3.5 sm:px-4 sm:py-3 flex flex-col justify-center">
                        <span class="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Nomor Penawaran</span>
                        <span class="mt-0.5 font-mono text-xs sm:text-sm font-black text-slate-900 truncate">
                            {{ $quotation->quotation_number }}
                        </span>
                    </div>

                    <div class="p-3.5 sm:px-4 sm:py-3 flex flex-col justify-center">
                        <span class="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Masa Berlaku</span>
                        <span class="mt-0.5 text-xs sm:text-sm font-bold text-slate-900">
                            {{ $quotation->valid_until ? $quotation->valid_until->translatedFormat('d F Y') : '30 Hari Sejak Diterbitkan' }}
                        </span>
                    </div>

                    <div class="p-3.5 sm:px-4 sm:py-3 flex flex-col justify-center {{ $isAccepted ? 'bg-emerald-50/60' : ($isSent ? 'bg-blue-50/60' : 'bg-slate-50/60') }}">
                        <span class="text-[9.5px] font-bold uppercase tracking-wider {{ $isAccepted ? 'text-emerald-700' : ($isSent ? 'text-blue-700' : 'text-slate-500') }}">
                            Status Penawaran
                        </span>
                        <div class="mt-0.5 flex items-center gap-1.5 font-extrabold text-xs sm:text-[13px] {{ $isAccepted ? 'text-emerald-950' : ($isSent ? 'text-blue-950' : 'text-slate-900') }}">
                            @if ($isAccepted)
                                <svg class="size-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Disetujui / Aktif</span>
                            @elseif ($isSent)
                                <svg class="size-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                <span>Terkirim (Sent)</span>
                            @else
                                <svg class="size-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Konsep (Draft)</span>
                            @endif
                        </div>
                    </div>
                </div>
            </div>

            <!-- Client & Proposal Summary -->
            <div class="p-6 sm:p-8 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Left: Ditujukan Kepada Klien -->
                    <div class="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4 space-y-3">
                        <div>
                            <span class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                                Ditujukan Kepada Klien
                            </span>
                            <h2 class="mt-0.5 text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                                {{ $quotation->client->display_name }}
                            </h2>
                        </div>

                        <div class="space-y-1.5 border-t border-slate-200/70 pt-2.5 text-xs text-slate-600">
                            @if ($quotation->client->legal_name && $quotation->client->legal_name !== $quotation->client->display_name)
                                <div class="flex items-center justify-between gap-2">
                                    <span class="text-slate-400">Nama Badan Hukum:</span>
                                    <span class="font-semibold text-slate-800">{{ $quotation->client->legal_name }}</span>
                                </div>
                            @endif
                            @if ($quotation->client->email)
                                <div class="flex items-center justify-between gap-2">
                                    <span class="text-slate-400">Email:</span>
                                    <span class="font-mono text-[11px] text-slate-700">{{ $quotation->client->email }}</span>
                                </div>
                            @endif
                            @if ($quotation->client->address_line_1)
                                <div class="flex items-start justify-between gap-2">
                                    <span class="text-slate-400 shrink-0">Alamat:</span>
                                    <span class="text-slate-800 text-right text-[11.5px] leading-tight max-w-[220px]">
                                        {{ $quotation->client->address_line_1 }}@if ($quotation->client->city), {{ $quotation->client->city }}@endif
                                    </span>
                                </div>
                            @endif
                        </div>
                    </div>

                    <!-- Right: Total Estimasi Honorarium -->
                    <div class="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4 space-y-3">
                        <div>
                            <span class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                                Total Penawaran Honorarium
                            </span>
                            <div class="mt-0.5 font-mono text-xl sm:text-2xl font-black text-slate-900">
                                {{ $quotation->currency ?: 'IDR' }} {{ number_format($quotation->total_amount, 0, ',', '.') }}
                            </div>
                        </div>

                        <div class="space-y-1.5 border-t border-slate-200/70 pt-2.5 text-xs text-slate-600">
                            <div class="flex items-start justify-between gap-2">
                                <span class="text-slate-400 shrink-0">Perihal / Judul:</span>
                                <span class="font-semibold text-slate-800 text-right text-[11.5px] leading-tight max-w-[220px]">
                                    {{ $quotation->title }}
                                </span>
                            </div>
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-slate-400">Mata Uang:</span>
                                <span class="font-mono font-semibold text-slate-800">{{ $quotation->currency ?: 'IDR' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                @if ($quotation->lineItems->isNotEmpty())
                    <div class="rounded-2xl border border-slate-200/90 overflow-hidden text-xs">
                        <div class="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Rincian Ruang Lingkup Pekerjaan &amp; Honorarium
                        </div>
                        <table class="w-full text-left">
                            <thead class="bg-slate-100/60 text-slate-600 text-[10.5px] font-bold border-b border-slate-200">
                                <tr>
                                    <th class="p-3">Deskripsi Pekerjaan</th>
                                    <th class="p-3 text-center">Kuantitas</th>
                                    <th class="p-3 text-right">Tarif Satuan</th>
                                    <th class="p-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 bg-white">
                                @foreach ($quotation->lineItems as $item)
                                    <tr>
                                        <td class="p-3 font-medium text-slate-900">{{ $item->description }}</td>
                                        <td class="p-3 text-center font-mono text-slate-600">{{ $item->quantity }}</td>
                                        <td class="p-3 text-right font-mono text-slate-600">{{ $quotation->currency ?: 'IDR' }} {{ number_format($item->unit_amount, 0, ',', '.') }}</td>
                                        <td class="p-3 text-right font-mono font-bold text-slate-900">{{ $quotation->currency ?: 'IDR' }} {{ number_format($item->total_amount, 0, ',', '.') }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endif

                <!-- QR Code & Verification Security Box -->
                <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-3.5">
                        <div class="shrink-0 rounded-xl bg-white p-1.5 border border-slate-200 shadow-2xs">
                            <img 
                                src="{{ route('verify.quotation.qr', $quotation->quotation_number) }}" 
                                alt="QR Code Verifikasi Penawaran" 
                                class="size-16 sm:size-18 object-contain"
                            />
                        </div>
                        <div class="space-y-0.5 text-xs">
                            <div class="font-bold text-slate-900 flex items-center gap-1.5">
                                <svg class="size-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Dokumen Terdaftar Resmi</span>
                            </div>
                            <p class="text-slate-500 text-[11px] leading-tight">
                                Proposal penawaran ini diterbitkan secara sah dan terekam dalam sistem RPK Law Firm.
                            </p>
                            <div class="font-mono text-[10px] text-slate-400 truncate max-w-[320px] pt-0.5">
                                Ref: {{ $quotation->quotation_number }}
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
            <div class="p-4 sm:px-8 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                <span>© {{ date('Y') }} Roni, Putra &amp; Kusumah Law Firm</span>
                <span>RPK App - Integrated Legal Practice System</span>
            </div>
        </main>
    </div>

    <script>
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
