<!doctype html>
<html lang="id" class="h-full bg-slate-100 antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verifikasi Keabsahan Faktur {{ $invoice->invoice_number }} | RPK Law Firm</title>
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
                <span>Faktur Tagihan Sah &amp; Otentik</span>
            </div>
        </header>

        <!-- Main Verification Certificate Card -->
        <main class="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 divide-y divide-slate-100">
            
            <!-- Hero Top Header -->
            <div class="p-6 sm:p-8 space-y-5 bg-gradient-to-b from-slate-50/80 via-white to-white">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="rounded-md bg-slate-900 px-2.5 py-1 font-mono text-[9px] font-extrabold tracking-wider text-white uppercase">
                        SISTEM VERIFIKASI KEABSAHAN TAGIHAN RESMI
                    </span>

                    @if ($invoice->status === 'paid')
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300/80 px-3 py-1 text-xs font-extrabold text-emerald-800">
                            <svg class="size-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            STATUS: LUNAS (PAID)
                        </span>
                    @elseif ($invoice->status === 'partial')
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300/80 px-3 py-1 text-xs font-extrabold text-amber-800">
                            STATUS: DIBAYAR SEBAGIAN (PARTIALLY PAID)
                        </span>
                    @elseif ($invoice->status === 'cancelled')
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-300/80 px-3 py-1 text-xs font-extrabold text-rose-800">
                            STATUS: DIBATALKAN (CANCELLED)
                        </span>
                    @else
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-300/80 px-3 py-1 text-xs font-extrabold text-blue-800">
                            STATUS: MENUNGGU PEMBAYARAN (UNPAID)
                        </span>
                    @endif
                </div>

                <div class="space-y-1.5">
                    <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                        Faktur Tagihan: <span class="font-mono text-blue-600">{{ $invoice->invoice_number }}</span>
                    </h1>
                    <p class="text-xs text-slate-500 font-medium">
                        Diterbitkan resmi oleh RPK Law Firm untuk perikatan jasa bantuan hukum &amp; advokasi.
                    </p>
                </div>

                <!-- Bento Info Grid -->
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                    <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Klien Penerima Tagihan</span>
                        <p class="font-bold text-slate-900 text-sm truncate">
                            {{ $invoice->client->display_name ?? 'Klien Terdaftar' }}
                        </p>
                        @if ($invoice->client?->legal_name)
                            <p class="text-[11px] text-slate-500 truncate">{{ $invoice->client->legal_name }}</p>
                        @endif
                    </div>

                    <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Terkait Perkara</span>
                        @if ($invoice->matter)
                            <p class="font-mono font-bold text-blue-600 text-xs">{{ $invoice->matter->matter_number }}</p>
                            <p class="text-[11px] font-medium text-slate-700 truncate">{{ $invoice->matter->title }}</p>
                        @else
                            <p class="text-xs font-semibold text-slate-600">Jasa Hukum Umum / Non-Litigasi</p>
                        @endif
                    </div>

                    <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-1 sm:col-span-2 lg:col-span-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Penerbitan</span>
                        <p class="font-bold text-slate-900 text-xs">
                            {{ $invoice->issued_at ? \Illuminate\Support\Carbon::parse($invoice->issued_at)->translatedFormat('d F Y') : '-' }}
                        </p>
                        <p class="text-[10px] text-slate-500">
                            Jatuh Tempo: <strong class="text-rose-600">{{ $invoice->due_at ? \Illuminate\Support\Carbon::parse($invoice->due_at)->translatedFormat('d F Y') : '-' }}</strong>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Financial Details & Items -->
            <div class="p-6 sm:p-8 space-y-5">
                <h3 class="text-xs font-black tracking-wider text-slate-900 uppercase">
                    Rincian Item Jasa &amp; Tagihan
                </h3>

                <div class="overflow-hidden rounded-xl border border-slate-200/90">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider">
                            <tr>
                                <th class="px-3.5 py-2.5">Deskripsi Jasa</th>
                                <th class="px-3.5 py-2.5 text-center">Kuantitas</th>
                                <th class="px-3.5 py-2.5 text-right">Tarif Satuan</th>
                                <th class="px-3.5 py-2.5 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 bg-white">
                            @forelse ($invoice->lineItems as $item)
                                <tr>
                                    <td class="px-3.5 py-2.5 font-medium text-slate-900">{{ $item->description }}</td>
                                    <td class="px-3.5 py-2.5 text-center font-mono text-slate-600">{{ $item->quantity }}</td>
                                    <td class="px-3.5 py-2.5 text-right font-mono text-slate-600">{{ $invoice->currency }} {{ number_format($item->unit_amount, 0, ',', '.') }}</td>
                                    <td class="px-3.5 py-2.5 text-right font-mono font-bold text-slate-900">{{ $invoice->currency }} {{ number_format($item->total_amount, 0, ',', '.') }}</td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="px-3.5 py-3 text-center text-slate-400">Honorarium Jasa Hukum Berkas Perkara</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                <!-- Total Amount Highlights -->
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div class="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 space-y-2 text-xs">
                        <p class="font-bold text-slate-800 text-[11px] uppercase">Instruksi Pembayaran Rekening Resmi Firma</p>
                        <div class="space-y-1 font-mono text-[11.5px] text-slate-700">
                            <div>• <strong>BCA:</strong> 872-009-8811 (a.n. RPK LAW FIRM &amp; PARTNERS)</div>
                            <div>• <strong>Mandiri:</strong> 137-00-198899-2 (a.n. RPK LAW FIRM)</div>
                        </div>
                        <p class="text-[10px] text-slate-500 italic">
                            *Pembayaran di luar nomor rekening di atas bukan tanggung jawab RPK Law Firm.
                        </p>
                    </div>

                    <div class="rounded-xl border border-slate-200/80 bg-slate-900 p-4 text-white space-y-2 text-xs">
                        <div class="flex justify-between text-slate-300">
                            <span>Subtotal:</span>
                            <span class="font-mono font-bold">{{ $invoice->currency }} {{ number_format($invoice->subtotal_amount, 0, ',', '.') }}</span>
                        </div>
                        @if ($invoice->discount_amount > 0)
                            <div class="flex justify-between text-emerald-400">
                                <span>Potongan / Diskon:</span>
                                <span class="font-mono font-bold">- {{ $invoice->currency }} {{ number_format($invoice->discount_amount, 0, ',', '.') }}</span>
                            </div>
                        @endif
                        @if ($invoice->tax_amount > 0)
                            <div class="flex justify-between text-slate-300">
                                <span>PPN:</span>
                                <span class="font-mono font-bold">{{ $invoice->currency }} {{ number_format($invoice->tax_amount, 0, ',', '.') }}</span>
                            </div>
                        @endif
                        <div class="border-t border-white/20 pt-2 flex justify-between items-baseline font-black text-sm">
                            <span class="text-amber-400 uppercase tracking-wide">Total Tagihan:</span>
                            <span class="font-mono text-base text-white">{{ $invoice->currency }} {{ number_format($invoice->total_amount, 0, ',', '.') }}</span>
                        </div>
                        @if ($invoice->paid_amount > 0)
                            <div class="flex justify-between text-xs text-emerald-400 border-t border-white/10 pt-1.5">
                                <span>Telah Dibayar:</span>
                                <span class="font-mono">{{ $invoice->currency }} {{ number_format($invoice->paid_amount, 0, ',', '.') }}</span>
                            </div>
                            <div class="flex justify-between text-xs text-rose-400 font-bold">
                                <span>Sisa Tagihan:</span>
                                <span class="font-mono">{{ $invoice->currency }} {{ number_format($invoice->outstanding_amount, 0, ',', '.') }}</span>
                            </div>
                        @endif
                    </div>
                </div>
            </div>

            <!-- Verification Security Footer -->
            <div class="p-6 sm:p-8 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <img 
                        src="{{ route('verify.invoice.qr', $invoice->invoice_number) }}" 
                        alt="QR Code Verifikasi" 
                        class="size-16 rounded-lg border border-slate-200 bg-white p-1 shadow-2xs"
                    />
                    <div class="space-y-0.5 text-left">
                        <p class="text-xs font-extrabold text-slate-900">QR Code Verifikasi Otentik</p>
                        <p class="text-[10px] text-slate-500 max-w-[280px]">
                            Pindai kapan saja untuk memastikan keaslian tagihan ini langsung dari basis data server kantor hukum RPK.
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
                        Cetak Sertifikat
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
