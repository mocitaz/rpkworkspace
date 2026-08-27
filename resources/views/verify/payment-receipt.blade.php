<!doctype html>
<html lang="id" class="h-full bg-slate-100 antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verifikasi Kuitansi Pembayaran {{ $payment->reference_number ?: ('PAY-' . $payment->id) }} | RPK Law Firm</title>
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
                        Treasury &amp; Financial Governance • Bandung
                    </p>
                </div>
            </div>

            <div>
                <div class="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3 py-1.5 shadow-2xs">
                    <svg class="size-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div class="text-left">
                        <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status Transaksi</div>
                        <div class="text-[11.5px] font-extrabold text-slate-900 leading-tight">Pembayaran Sah Diterima</div>
                    </div>
                </div>
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
                        <span>Divisi Keuangan &amp; Akuntansi Perkara</span>
                    </div>
                    <span class="text-[11px] text-slate-400">
                        Diverifikasi: <span class="font-medium text-slate-600">{{ now()->timezone(config('raf.timezone'))->translatedFormat('d F Y, H:i') }} WIB</span>
                    </span>
                </div>

                <div>
                    <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Verifikasi Keabsahan Kuitansi Pembayaran
                    </h1>
                    <p class="mt-1 text-xs sm:text-sm text-slate-600">
                        Tanda terima setoran dan pelunasan honorarium jasa hukum serta biaya perkara resmi RPK Law Firm.
                    </p>
                </div>

                <!-- Unified 3-Column Data Bar -->
                <div class="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/60 shadow-2xs grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
                    <div class="p-3.5 sm:px-4 sm:py-3 flex flex-col justify-center">
                        <span class="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Nomor Kuitansi / Referensi</span>
                        <span class="mt-0.5 font-mono text-xs sm:text-sm font-black text-slate-900 truncate">
                            {{ $payment->reference_number ?: ('PAY-' . $payment->id) }}
                        </span>
                    </div>

                    <div class="p-3.5 sm:px-4 sm:py-3 flex flex-col justify-center">
                        <span class="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Penerimaan</span>
                        <span class="mt-0.5 text-xs sm:text-sm font-bold text-slate-900">
                            {{ $payment->received_at ? $payment->received_at->translatedFormat('d F Y, H:i') . ' WIB' : now()->translatedFormat('d F Y') }}
                        </span>
                    </div>

                    <div class="p-3.5 sm:px-4 sm:py-3 flex flex-col justify-center bg-emerald-50/60">
                        <span class="text-[9.5px] font-bold uppercase tracking-wider text-emerald-700">
                            Metode Pembayaran
                        </span>
                        <div class="mt-0.5 flex items-center gap-1.5 font-extrabold text-xs sm:text-[13px] text-emerald-950">
                            <svg class="size-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>{{ strtoupper($payment->method ?: 'BANK TRANSFER') }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment Details & Allocation -->
            <div class="p-6 sm:p-8 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Left: Penyetor / Klien -->
                    <div class="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4 space-y-3">
                        <div>
                            <span class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                                Diterima Dari (Penyetor)
                            </span>
                            <h2 class="mt-0.5 text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                                {{ $payment->client->display_name ?? 'Klien Terdaftar' }}
                            </h2>
                        </div>

                        <div class="space-y-1.5 border-t border-slate-200/70 pt-2.5 text-xs text-slate-600">
                            @if ($payment->client?->legal_name && $payment->client->legal_name !== $payment->client->display_name)
                                <div class="flex items-center justify-between gap-2">
                                    <span class="text-slate-400">Nama Badan Hukum:</span>
                                    <span class="font-semibold text-slate-800">{{ $payment->client->legal_name }}</span>
                                </div>
                            @endif
                            @if ($payment->matter)
                                <div class="flex items-start justify-between gap-2">
                                    <span class="text-slate-400 shrink-0">Perkara:</span>
                                    <span class="font-semibold text-slate-800 text-right text-[11.5px] leading-tight max-w-[220px]">
                                        {{ $payment->matter->title }} <span class="font-mono font-bold text-blue-600">({{ $payment->matter->matter_number }})</span>
                                    </span>
                                </div>
                            @endif
                            @if ($payment->notes)
                                <div class="flex items-start justify-between gap-2 pt-1">
                                    <span class="text-slate-400 shrink-0">Catatan:</span>
                                    <span class="text-slate-700 italic text-right max-w-[220px]">{{ $payment->notes }}</span>
                                </div>
                            @endif
                        </div>
                    </div>

                    <!-- Right: Nominal & Rekening Penerima -->
                    <div class="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4 space-y-3">
                        <div>
                            <span class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                                Jumlah Setoran Diterima
                            </span>
                            <div class="mt-0.5 font-mono text-xl sm:text-2xl font-black text-slate-900">
                                {{ $payment->currency ?: 'IDR' }} {{ number_format($payment->amount, 0, ',', '.') }}
                            </div>
                        </div>

                        <div class="space-y-1.5 border-t border-slate-200/70 pt-2.5 text-xs text-slate-600">
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-slate-400">Rekening Penerima:</span>
                                <span class="font-semibold text-slate-800">{{ $payment->account->name ?? 'Rekening Bank Operasional Firma' }}</span>
                            </div>
                            @if ($payment->account?->account_number)
                                <div class="flex items-center justify-between gap-2">
                                    <span class="text-slate-400">Nomor Rekening:</span>
                                    <span class="font-mono text-[11px] font-semibold text-slate-800">{{ $payment->account->account_number }} ({{ $payment->account->bank_name ?? 'Bank' }})</span>
                                </div>
                            @endif
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-slate-400">Status Dana:</span>
                                <span class="font-semibold text-emerald-700 flex items-center gap-1">
                                    <svg class="size-3 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Tercatat Efektif di Kas Firma</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                @if ($payment->allocations->isNotEmpty())
                    <div class="rounded-2xl border border-slate-200/90 overflow-hidden text-xs">
                        <div class="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Alokasi Pelunasan Faktur Tagihan
                        </div>
                        <table class="w-full text-left">
                            <thead class="bg-slate-100/60 text-slate-600 text-[10.5px] font-bold border-b border-slate-200">
                                <tr>
                                    <th class="p-3">Nomor Faktur Tagihan</th>
                                    <th class="p-3">Perihal / Deskripsi</th>
                                    <th class="p-3 text-right">Jumlah Dialokasikan</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 bg-white">
                                @foreach ($payment->allocations as $alloc)
                                    <tr>
                                        <td class="p-3 font-mono font-bold text-blue-600">{{ $alloc->invoice?->invoice_number ?? '-' }}</td>
                                        <td class="p-3 font-medium text-slate-800">{{ $alloc->invoice?->title ?? 'Tagihan Jasa Hukum' }}</td>
                                        <td class="p-3 text-right font-mono font-bold text-slate-900">{{ $payment->currency ?: 'IDR' }} {{ number_format($alloc->amount, 0, ',', '.') }}</td>
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
                                src="{{ route('verify.payment-receipt.qr', $payment->reference_number ?: $payment->id) }}" 
                                alt="QR Code Verifikasi Kuitansi" 
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
                                Kuitansi elektronik ini sah dan diakui sebagai bukti setoran pembayaran resmi RPK Law Firm.
                            </p>
                            <div class="font-mono text-[10px] text-slate-400 truncate max-w-[320px] pt-0.5">
                                ID: {{ $payment->id }}
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
