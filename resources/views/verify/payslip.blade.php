<!doctype html>
<html lang="id" class="h-full bg-slate-100 antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verifikasi Keabsahan Slip Gaji {{ $payroll->payslip_number }} | RPK Law Firm</title>
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
                        Advocates &amp; Legal Consultants • Bandung
                    </p>
                </div>
            </div>

            <div class="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-300 shadow-xs">
                <svg class="size-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Slip Gaji Sah &amp; Otentik</span>
            </div>
        </header>

        <!-- Main Verification Certificate Card -->
        <main class="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 divide-y divide-slate-100">
            
            <!-- Hero Top Header -->
            <div class="p-6 sm:p-8 space-y-5 bg-gradient-to-b from-slate-50/80 via-white to-white">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="rounded-md bg-slate-900 px-2.5 py-1 font-mono text-[9px] font-extrabold tracking-wider text-white uppercase">
                        RPK APP VERIFIED PAYROLL
                    </span>
                    <span class="text-xs font-medium text-slate-500">
                        Diverifikasi pada {{ now()->timezone(config('raf.timezone'))->translatedFormat('d F Y, H:i') }} WIB
                    </span>
                </div>

                <div>
                    <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Verifikasi Keabsahan Slip Gaji
                    </h1>
                    <p class="mt-1 text-xs sm:text-sm text-slate-600">
                        Dokumen slip penghasilan resmi yang diterbitkan melalui sistem terkomputerisasi RPK Law Firm.
                    </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div class="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Nomor Slip Gaji</div>
                        <div class="mt-1 font-mono text-sm sm:text-base font-black text-slate-900">{{ $payroll->payslip_number }}</div>
                    </div>
                    <div class="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Periode</div>
                        <div class="mt-1 text-sm sm:text-base font-black text-emerald-700">
                            {{ \Carbon\Carbon::parse($payroll->period . '-01')->translatedFormat('F Y') }}
                        </div>
                    </div>
                    <div class="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Status Pembayaran</div>
                        <div class="mt-1">
                            @if ($payroll->status === 'paid')
                                <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                                    LUNAS (PAID)
                                </span>
                            @elseif ($payroll->status === 'approved')
                                <span class="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-800">
                                    DISETUJUI (APPROVED)
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                                    DRAFT
                                </span>
                            @endif
                        </div>
                    </div>
                </div>
            </div>

            <!-- Employee & Financial Summary -->
            <div class="p-6 sm:p-8 space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div class="space-y-3">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Informasi Pegawai / Advokat</h3>
                        <div class="rounded-2xl border border-slate-200 p-4 space-y-2 bg-slate-50/50">
                            <div class="text-base font-black text-slate-900">{{ $payroll->user->name }}</div>
                            <div class="text-xs text-slate-600">
                                <div><span class="text-slate-400">Jabatan:</span> {{ $payroll->user->position_title ?: 'Advokat / Staf' }}</div>
                                <div><span class="text-slate-400">Departemen:</span> {{ $payroll->user->department ?: 'Legal Practice' }}</div>
                                <div><span class="text-slate-400">Email:</span> {{ $payroll->user->email }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Ringkasan Penghasilan</h3>
                        <div class="rounded-2xl border border-amber-200/80 p-4 bg-amber-50/40 space-y-2">
                            <div class="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Take Home Pay (Bersih)</div>
                            <div class="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                                Rp {{ number_format($payroll->net_salary, 0, ',', '.') }}
                            </div>
                            <div class="text-xs text-slate-600">
                                Rekening Pembayar: <span class="font-semibold text-slate-800">{{ $payroll->paymentAccount->name ?? 'Kas / Bank Operasional' }}</span>
                            </div>
                        </div>
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
</body>
</html>
