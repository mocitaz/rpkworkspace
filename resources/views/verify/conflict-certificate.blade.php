@php
    $isClear = $conflictCheck->status === 'clear' || $conflictCheck->decision === 'cleared' || $conflictCheck->decision === 'approved';
    $isWaived = $conflictCheck->decision === 'waived';
    $isBlocked = ($conflictCheck->status === 'blocked' || $conflictCheck->status === 'conflict') && $conflictCheck->decision !== 'waived';

    $certNumber = 'CC-RPK-' . strtoupper(substr($conflictCheck->id, 0, 10));
@endphp
<!doctype html>
<html lang="id" class="h-full bg-slate-100 antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Surat Keterangan Bebas Benturan Kepentingan {{ $certNumber }} | RPK Law Firm</title>
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
                        Ethics &amp; Professional Governance Division • Bandung
                    </p>
                </div>
            </div>

            <div>
                @if ($isClear)
                    <div class="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3 py-1.5 shadow-2xs">
                        <svg class="size-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div class="text-left">
                            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status Validasi</div>
                            <div class="text-[11.5px] font-extrabold text-slate-900 leading-tight">Clearance Disetujui</div>
                        </div>
                    </div>
                @elseif ($isWaived)
                    <div class="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-1.5 shadow-2xs">
                        <svg class="size-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div class="text-left">
                            <div class="text-[9px] font-bold text-amber-700 uppercase tracking-wider">Status Validasi</div>
                            <div class="text-[11.5px] font-extrabold text-amber-900 leading-tight">Dispensasi Bersyarat</div>
                        </div>
                    </div>
                @else
                    <div class="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 px-3 py-1.5 shadow-2xs">
                        <svg class="size-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div class="text-left">
                            <div class="text-[9px] font-bold text-rose-700 uppercase tracking-wider">Status Validasi</div>
                            <div class="text-[11.5px] font-extrabold text-rose-900 leading-tight">Benturan Terdeteksi</div>
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
                        <span>Divisi Kepatuhan Etika Profesi</span>
                    </div>
                    <span class="text-[11px] text-slate-400">
                        Diverifikasi: <span class="font-medium text-slate-600">{{ now()->timezone(config('raf.timezone'))->translatedFormat('d F Y, H:i') }} WIB</span>
                    </span>
                </div>

                <div>
                    <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Surat Keterangan Bebas Benturan Kepentingan
                    </h1>
                    <p class="mt-1 text-xs sm:text-sm text-slate-600">
                        Pemeriksaan Independen Kepatuhan Kode Etik Advokat Indonesia (Conflict of Interest Clearance).
                    </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                    <div class="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nomor Registrasi</div>
                        <div class="mt-1 font-mono text-xs sm:text-sm font-black text-slate-900 truncate">{{ $certNumber }}</div>
                    </div>
                    <div class="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tanggal Pemeriksaan</div>
                        <div class="mt-1 text-xs sm:text-sm font-bold text-slate-900">
                            {{ $conflictCheck->created_at?->translatedFormat('d F Y') ?? now()->translatedFormat('d F Y') }}
                        </div>
                    </div>
                    <div class="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status Hasil Uji</div>
                        <div class="mt-1">
                            @if ($isClear)
                                <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                                    BEBAS BENTURAN (CLEAR)
                                </span>
                            @elseif ($isWaived)
                                <span class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                                    DISPENSASI (WAIVED)
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                                    TERDAPAT BENTURAN (BLOCKED)
                                </span>
                            @endif
                        </div>
                    </div>
                </div>
            </div>

            <!-- Subject & Parties Details -->
            <div class="p-6 sm:p-8 space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div class="space-y-2.5">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Subjek yang Diperiksa</h3>
                        <div class="rounded-2xl border border-slate-200 p-4 space-y-2 bg-slate-50/50">
                            <div class="text-base font-black text-slate-900">{{ $conflictCheck->subject_name }}</div>
                            <div class="text-xs text-slate-600 space-y-1">
                                @if ($conflictCheck->client)
                                    <div><span class="text-slate-400">Klien Terkait:</span> <strong class="text-slate-800">{{ $conflictCheck->client->display_name }}</strong></div>
                                @endif
                                @if ($conflictCheck->matter)
                                    <div><span class="text-slate-400">Perkara:</span> {{ $conflictCheck->matter->title }} ({{ $conflictCheck->matter->matter_number }})</div>
                                @else
                                    <div><span class="text-slate-400">Perkara:</span> Penjajakan Awal / Klien Baru</div>
                                @endif
                                <div><span class="text-slate-400">Pemohon Uji:</span> {{ $conflictCheck->requester->name ?? 'Tim Legal Practice' }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2.5">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Otorisasi &amp; Peninjauan Etika</h3>
                        <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
                            <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pejabat Kepatuhan Etika</div>
                            <div class="text-base font-black text-slate-900">
                                {{ $conflictCheck->reviewer->name ?? 'Managing Partner RPK' }}
                            </div>
                            <div class="text-xs text-slate-600">
                                Jabatan: <span class="font-semibold text-slate-800">{{ $conflictCheck->reviewer->position_title ?? 'Managing Partner' }}</span>
                            </div>
                            <div class="text-xs text-slate-600">
                                Tanggal Otorisasi: <span class="font-semibold text-slate-800">{{ $conflictCheck->reviewed_at ? $conflictCheck->reviewed_at->translatedFormat('d F Y, H:i') . ' WIB' : ($conflictCheck->created_at?->translatedFormat('d F Y, H:i') . ' WIB' ?? '-') }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                @if (is_array($conflictCheck->searched_names) && count($conflictCheck->searched_names) > 0)
                    <div class="space-y-2 pt-1">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Entitas &amp; Nama yang Disisir Database</h3>
                        <div class="flex flex-wrap gap-1.5">
                            @foreach ($conflictCheck->searched_names as $name)
                                <span class="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                                    {{ $name }}
                                </span>
                            @endforeach
                        </div>
                    </div>
                @endif

                @if ($conflictCheck->decision_note)
                    <div class="space-y-2 pt-1">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Catatan &amp; Pertimbangan Legal</h3>
                        <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-700 leading-relaxed">
                            {{ $conflictCheck->decision_note }}
                        </div>
                    </div>
                @endif

                <!-- QR Code & Verification Security Box -->
                <div class="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="shrink-0 rounded-xl bg-white p-2 border border-slate-200 shadow-2xs">
                            <img 
                                src="{{ route('verify.conflict-certificate.qr', $conflictCheck) }}" 
                                alt="QR Code Verifikasi" 
                                class="size-16 sm:size-18 object-contain"
                            />
                        </div>
                        <div class="space-y-1 text-xs">
                            <div class="font-bold text-slate-900 flex items-center gap-1.5">
                                <svg class="size-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Dokumen Terdaftar Resmi</span>
                            </div>
                            <p class="text-slate-500 text-[11px]">
                                Dokumen ini diterbitkan melalui sistem terkomputerisasi RPK Law Firm dan sah tanpa tanda tangan basah.
                            </p>
                            <div class="font-mono text-[10px] text-slate-400 truncate max-w-[340px]">
                                ID: {{ $conflictCheck->id }}
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 w-full sm:w-auto no-print">
                        <button 
                            type="button" 
                            onclick="window.print()" 
                            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
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
                            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
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
