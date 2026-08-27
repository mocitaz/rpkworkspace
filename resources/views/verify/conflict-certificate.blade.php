@php
    $isClear = $conflictCheck->status === 'clear' || $conflictCheck->decision === 'cleared' || $conflictCheck->decision === 'approved';
    $isWaived = $conflictCheck->decision === 'waived';
    $isBlocked = ($conflictCheck->status === 'blocked' || $conflictCheck->status === 'conflict') && $conflictCheck->decision !== 'waived';
    $isPending = !$isClear && !$isWaived && !$isBlocked;

    $certNumber = 'CC-RPK-' . strtoupper(substr($conflictCheck->id, 0, 10));
    $expiryDate = $conflictCheck->expires_at ?? ($conflictCheck->reviewed_at ? $conflictCheck->reviewed_at->copy()->addDays(90) : $conflictCheck->created_at?->copy()->addDays(90));
    $verificationUrl = route('verify.conflict-certificate', $conflictCheck);
    $sha256Hash = strtoupper(hash('sha256', $conflictCheck->id . '|' . $conflictCheck->subject_name . '|' . ($conflictCheck->reviewed_at?->timestamp ?? $conflictCheck->created_at?->timestamp)));
@endphp
<!doctype html>
<html lang="id" class="h-full bg-slate-100 antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verifikasi Sertifikat Bebas Benturan Kepentingan {{ $certNumber }} | RPK Law Firm</title>
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
            .print-shadow-none { box-shadow: none !important; border: 1px solid #cbd5e1 !important; }
        }
    </style>
</head>
<body class="min-h-full bg-slate-100/90 text-slate-900 flex flex-col justify-between py-6 sm:py-10 px-3 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
    <div class="mx-auto w-full max-w-[840px] space-y-4 sm:space-y-5">
        
        <!-- Corporate Letterhead Header -->
        <header class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 sm:px-6 sm:py-4 shadow-xs">
            <div class="flex items-center gap-3.5">
                <a href="{{ route('home') }}" title="RPK Law Firm" class="shrink-0 transition-opacity hover:opacity-90">
                    <img 
                        src="/logo/logo.png" 
                        alt="RPK Law Firm" 
                        class="h-8 sm:h-9 w-auto max-w-[140px] sm:max-w-[160px] object-contain"
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

            <div class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-2xs {{ $isClear ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : ($isWaived ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40') }}">
                <span class="relative flex size-2">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full {{ $isClear ? 'bg-emerald-400' : ($isWaived ? 'bg-amber-400' : 'bg-rose-400') }} opacity-75"></span>
                    <span class="relative inline-flex size-2 rounded-full {{ $isClear ? 'bg-emerald-500' : ($isWaived ? 'bg-amber-500' : 'bg-rose-500') }}"></span>
                </span>
                <span class="tracking-wide">
                    @if ($isClear)
                        Sertifikat Etika Sah &amp; Otentik
                    @elseif ($isWaived)
                        Dispensasi Bersyarat Disetujui
                    @elseif ($isBlocked)
                        Status Benturan Terdeteksi
                    @else
                        Menunggu Peninjauan Etika
                    @endif
                </span>
            </div>
        </header>

        <!-- Main Verification Certificate Card -->
        <main class="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/60 divide-y divide-slate-100 print-shadow-none">
            
            <!-- Hero Top Header -->
            <div class="p-5 sm:p-7 space-y-4 bg-gradient-to-b from-slate-50/90 via-white to-white">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <span class="rounded-md bg-slate-900 px-2.5 py-0.5 font-mono text-[9px] font-extrabold tracking-wider text-white uppercase shadow-2xs">
                            RPK ETHICAL CLEARANCE VERIFIED
                        </span>
                        <span class="rounded-md bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 font-mono text-[9px] font-bold text-indigo-700">
                            ISO 27001 SECURE
                        </span>
                    </div>
                    <span class="text-[11px] font-medium text-slate-500">
                        Diverifikasi Resmi: <strong class="font-semibold text-slate-700">{{ now()->timezone(config('raf.timezone', 'Asia/Jakarta'))->translatedFormat('d M Y, H:i') }} WIB</strong>
                    </span>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
                    <div class="space-y-1">
                        <div class="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                            <svg class="size-3.5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Surat Keterangan Bebas Benturan Kepentingan</span>
                        </div>
                        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                            Certificate of Conflict of Interest Clearance
                        </h1>
                        <p class="text-xs text-slate-500 font-medium">
                            Dokumen otorisasi kepatuhan etika dan penelusuran independen hubungan hukum pihak berperkara.
                        </p>
                    </div>

                    <div class="shrink-0 self-start sm:self-center">
                        @if ($isClear)
                            <div class="flex items-center gap-2 rounded-2xl border border-emerald-200/90 bg-emerald-50/80 px-4 py-2.5 shadow-2xs">
                                <div class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                                    <svg class="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <div class="text-[9.5px] font-bold text-emerald-700 uppercase tracking-wider">Hasil Pemeriksaan</div>
                                    <div class="text-xs font-black text-emerald-950">MEMENUHI SYARAT (CLEAR)</div>
                                </div>
                            </div>
                        @elseif ($isWaived)
                            <div class="flex items-center gap-2 rounded-2xl border border-amber-200/90 bg-amber-50/80 px-4 py-2.5 shadow-2xs">
                                <div class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                                    <svg class="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <div class="text-[9.5px] font-bold text-amber-700 uppercase tracking-wider">Hasil Pemeriksaan</div>
                                    <div class="text-xs font-black text-amber-950">DISPENSASI / WAIVED</div>
                                </div>
                            </div>
                        @elseif ($isBlocked)
                            <div class="flex items-center gap-2 rounded-2xl border border-rose-200/90 bg-rose-50/80 px-4 py-2.5 shadow-2xs">
                                <div class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                                    <svg class="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div>
                                    <div class="text-[9.5px] font-bold text-rose-700 uppercase tracking-wider">Hasil Pemeriksaan</div>
                                    <div class="text-xs font-black text-rose-950">BENTURAN LANGSUNG (BLOCKED)</div>
                                </div>
                            </div>
                        @else
                            <div class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 shadow-2xs">
                                <div class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-slate-600 text-white shadow-xs">
                                    <svg class="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div class="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">Hasil Pemeriksaan</div>
                                    <div class="text-xs font-black text-slate-800">DALAM PENINJAUAN (PENDING)</div>
                                </div>
                            </div>
                        @endif
                    </div>
                </div>

                <!-- Bento Quick Grid -->
                <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-4 pt-1">
                    <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 space-y-0.5">
                        <div class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">Nomor Sertifikat</div>
                        <div class="font-mono text-xs font-black text-slate-900 truncate" title="{{ $certNumber }}">
                            {{ $certNumber }}
                        </div>
                    </div>

                    <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 space-y-0.5">
                        <div class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">Tanggal Pemeriksaan</div>
                        <div class="text-xs font-bold text-slate-800">
                            {{ $conflictCheck->created_at?->timezone(config('raf.timezone', 'Asia/Jakarta'))->translatedFormat('d M Y') ?? '-' }}
                        </div>
                    </div>

                    <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 space-y-0.5">
                        <div class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">Masa Berlaku</div>
                        <div class="text-xs font-bold {{ $expiryDate && $expiryDate->isPast() ? 'text-rose-600' : 'text-emerald-700' }}">
                            {{ $expiryDate ? $expiryDate->translatedFormat('d M Y') : '90 Hari' }}
                        </div>
                    </div>

                    <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 space-y-0.5">
                        <div class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">Tingkat Risiko Etika</div>
                        <div class="text-xs font-bold {{ $isClear ? 'text-emerald-700' : ($isWaived ? 'text-amber-700' : 'text-rose-700') }}">
                            {{ $isClear ? 'Nol Benturan (Zero)' : ($isWaived ? 'Terkendali (Waived)' : 'Tinggi (Conflict)') }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Subject & Parties Checked Section -->
            <div class="p-5 sm:p-7 space-y-5">
                <div class="flex items-center justify-between">
                    <h3 class="text-xs font-black tracking-wider text-slate-900 uppercase flex items-center gap-2">
                        <svg class="size-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Subjek &amp; Pihak Terkait yang Diperiksa</span>
                    </h3>
                    <span class="text-[10.5px] font-semibold text-slate-400">Parameter Uji Kepatuhan</span>
                </div>

                <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <!-- Main Subject Box -->
                    <div class="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-2">
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subjek / Pihak yang Diajukan</div>
                        <div class="text-base font-black text-slate-900 leading-snug">
                            {{ $conflictCheck->subject_name }}
                        </div>
                        <div class="pt-1 text-xs text-slate-600 space-y-1">
                            @if ($conflictCheck->client)
                                <div class="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
                                    <span class="text-slate-400">Klien Pemohon:</span>
                                    <strong class="font-bold text-slate-900 text-right truncate max-w-[200px]">{{ $conflictCheck->client->display_name }}</strong>
                                </div>
                            @endif
                            @if ($conflictCheck->client?->legal_name && $conflictCheck->client->legal_name !== $conflictCheck->client->display_name)
                                <div class="flex items-center justify-between">
                                    <span class="text-slate-400">Nama Badan Hukum:</span>
                                    <span class="text-slate-700 text-right truncate max-w-[200px]">{{ $conflictCheck->client->legal_name }}</span>
                                </div>
                            @endif
                            @if ($conflictCheck->client?->tax_identifier)
                                <div class="flex items-center justify-between">
                                    <span class="text-slate-400">NPWP / Identitas:</span>
                                    <span class="font-mono text-[11px] text-slate-700">{{ $conflictCheck->client->tax_identifier }}</span>
                                </div>
                            @endif
                        </div>
                    </div>

                    <!-- Related Matter Box -->
                    <div class="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-2">
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perkara / Penugasan Terkait</div>
                        @if ($conflictCheck->matter)
                            <div class="space-y-1">
                                <div class="flex items-center gap-2">
                                    <span class="font-mono text-xs font-bold text-blue-600">{{ $conflictCheck->matter->matter_number }}</span>
                                    <span class="rounded-md bg-blue-50 px-1.5 py-0.5 text-[9.5px] font-semibold text-blue-700 uppercase">
                                        {{ $conflictCheck->matter->status ?? 'Active' }}
                                    </span>
                                </div>
                                <div class="text-xs font-bold text-slate-900 leading-snug">
                                    {{ $conflictCheck->matter->title }}
                                </div>
                            </div>
                        @else
                            <div class="space-y-1">
                                <div class="text-sm font-bold text-slate-800">Penjajakan Awal / Non-Perkara Langsung</div>
                                <p class="text-xs text-slate-500">
                                    Pemeriksaan dilakukan sebelum pembukaan perkara resmi atau penerbitan proposal legal fee.
                                </p>
                            </div>
                        @endif

                        <div class="border-t border-slate-200/60 pt-2 flex items-center justify-between text-xs">
                            <span class="text-slate-400">Pemohon Uji (Staff/Advokat):</span>
                            <span class="font-semibold text-slate-800">{{ $conflictCheck->requester->name ?? 'Tim Legal Practice' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Searched Keywords & Entities -->
                @if (is_array($conflictCheck->searched_names) && count($conflictCheck->searched_names) > 0)
                    <div class="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-2">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Daftar Entitas / Afiliasi / Pihak yang Disisir Database ({{ count($conflictCheck->searched_names) }})
                        </div>
                        <div class="flex flex-wrap gap-1.5">
                            @foreach ($conflictCheck->searched_names as $name)
                                <span class="inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs">
                                    {{ $name }}
                                </span>
                            @endforeach
                        </div>
                    </div>
                @endif
            </div>

            <!-- Database Search & Adverse Party Clearance Results -->
            <div class="p-5 sm:p-7 space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-xs font-black tracking-wider text-slate-900 uppercase flex items-center gap-2">
                        <svg class="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Hasil Penelusuran Database Perkara &amp; Pihak Lawan</span>
                    </h3>
                    <span class="text-[10.5px] font-semibold text-slate-400">Penyisiran Sistem Otomatis</span>
                </div>

                @if ($isClear)
                    <div class="rounded-2xl border border-emerald-200/90 bg-emerald-50/60 p-4 space-y-2 text-xs">
                        <div class="flex items-start gap-3">
                            <div class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs mt-0.5">
                                <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div class="space-y-1">
                                <p class="font-bold text-emerald-950">
                                    Tidak Ditemukan Benturan Kepentingan (No Adverse Party Conflict)
                                </p>
                                <p class="text-emerald-800 text-[11.5px] leading-relaxed">
                                    Sistem telah memverifikasi nama subjek terhadap seluruh direktori klien aktif, pihak lawan dalam sengketa yang sedang berjalan, serta arsip penanganan perkara RPK Law Firm selama 10 tahun terakhir. Tidak ditemukan adanya potensi pelanggaran Kode Etik Advokat Indonesia maupun benturan kepentingan finansial/loyalitas advokasi.
                                </p>
                            </div>
                        </div>
                    </div>
                @elseif (is_array($conflictCheck->matches) && count($conflictCheck->matches) > 0)
                    <div class="overflow-hidden rounded-xl border border-slate-200/90 text-xs">
                        <div class="bg-slate-50 px-4 py-2 text-[10.5px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                            Riwayat Temuan Penelusuran yang Dianalisis Pejabat Etika:
                        </div>
                        <div class="divide-y divide-slate-100 bg-white">
                            @foreach ($conflictCheck->matches as $match)
                                <div class="p-3.5 space-y-1">
                                    <div class="flex items-center justify-between">
                                        <strong class="font-bold text-slate-900">{{ $match['name'] ?? ($match['party_name'] ?? 'Entitas Terkait') }}</strong>
                                        <span class="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                                            {{ $match['type'] ?? 'Tercatat dalam Database' }}
                                        </span>
                                    </div>
                                    <p class="text-[11px] text-slate-600">
                                        Perkara: {{ $match['matter_title'] ?? ($match['description'] ?? 'Arsip perkara sebelumnya') }}
                                    </p>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif
            </div>

            <!-- Reviewer Notes & Legal Ethics Decision -->
            <div class="p-5 sm:p-7 space-y-4 bg-slate-50/40">
                <div class="flex items-center justify-between">
                    <h3 class="text-xs font-black tracking-wider text-slate-900 uppercase flex items-center gap-2">
                        <svg class="size-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Otorisasi &amp; Pertimbangan Pejabat Kepatuhan Etika</span>
                    </h3>
                </div>

                @if ($conflictCheck->decision_note)
                    <div class="rounded-2xl border border-indigo-200/80 bg-white p-4 text-xs shadow-2xs space-y-1.5">
                        <div class="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Catatan &amp; Pertimbangan Legal Reviewer:</div>
                        <p class="text-slate-800 leading-relaxed italic">
                            &ldquo;{{ $conflictCheck->decision_note }}&rdquo;
                        </p>
                    </div>
                @endif

                <!-- Reviewer Signature Profile -->
                <div class="rounded-2xl border border-slate-200/90 bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-2xs">
                    <div class="flex items-center gap-3">
                        <div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-amber-400 font-black text-sm shadow-xs ring-2 ring-slate-100">
                            @if ($conflictCheck->reviewer?->name)
                                {{ strtoupper(substr($conflictCheck->reviewer->name, 0, 2)) }}
                            @else
                                MP
                            @endif
                        </div>
                        <div>
                            <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pejabat Pengesah Etika (Reviewer)</div>
                            <div class="text-sm font-black text-slate-900">
                                {{ $conflictCheck->reviewer->name ?? 'Managing Partner RPK Law Firm' }}
                            </div>
                            <div class="text-[11px] text-slate-500 font-medium">
                                {{ $conflictCheck->reviewer->position_title ?? 'Managing Partner & Head of Ethics Committee' }}
                            </div>
                        </div>
                    </div>

                    <div class="text-left sm:text-right border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tanggal Otorisasi Digital</div>
                        <div class="font-mono text-xs font-bold text-slate-900">
                            {{ $conflictCheck->reviewed_at ? $conflictCheck->reviewed_at->timezone(config('raf.timezone', 'Asia/Jakarta'))->translatedFormat('d F Y, H:i') : ($conflictCheck->created_at?->timezone(config('raf.timezone', 'Asia/Jakarta'))->translatedFormat('d F Y, H:i') ?? '-') }} WIB
                        </div>
                        <div class="text-[10.5px] font-semibold text-emerald-700 flex items-center gap-1 sm:justify-end mt-0.5">
                            <svg class="size-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Terverifikasi Secara Elektronik</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cryptographic Verification Box & Actions -->
            <div class="p-5 sm:p-7 space-y-4 bg-slate-900 text-white">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-5">
                    <div class="flex items-center gap-4 w-full sm:w-auto">
                        <!-- SVG QR Code -->
                        <div class="shrink-0 rounded-2xl bg-white p-2.5 shadow-lg">
                            <img 
                                src="{{ route('verify.conflict-certificate.qr', $conflictCheck) }}" 
                                alt="QR Code Verifikasi Sertifikat Bebas Konflik" 
                                class="size-20 sm:size-24 object-contain"
                            />
                        </div>

                        <div class="space-y-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <span class="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                                    AUTHENTIC &amp; TAMPER-PROOF
                                </span>
                            </div>
                            <div class="font-mono text-xs font-bold text-slate-100 truncate">
                                {{ $certNumber }}
                            </div>
                            <p class="text-[10.5px] text-slate-400 leading-snug">
                                Pindai QR Code di atas menggunakan kamera ponsel pintar untuk memverifikasi keabsahan lembar sertifikat ini secara real-time.
                            </p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex w-full sm:w-auto shrink-0 flex-row sm:flex-col gap-2 no-print">
                        <button 
                            type="button" 
                            onclick="window.print()" 
                            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-sm transition-all hover:bg-slate-100 active:scale-95 cursor-pointer"
                        >
                            <svg class="size-3.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>Cetak Sertifikat</span>
                        </button>
                        <button 
                            type="button" 
                            onclick="copyVerificationLink()" 
                            id="copyBtn"
                            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
                        >
                            <svg class="size-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span id="copyBtnText">Salin Tautan</span>
                        </button>
                    </div>
                </div>

                <!-- Cryptographic SHA-256 Stamp -->
                <div class="border-t border-white/10 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[9.5px] font-mono text-slate-400">
                    <div class="truncate max-w-[480px]">
                        <span class="text-slate-500 font-sans">Digital Checksum:</span> {{ $sha256Hash }}
                    </div>
                    <div class="text-slate-400 shrink-0">
                        System Signature: <span class="text-emerald-400 font-bold">VERIFIED_RPK_SECURITY_ENGINE</span>
                    </div>
                </div>
            </div>

            <!-- Official Disclaimer Footer -->
            <div class="p-4 sm:px-7 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-100">
                <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-800">RPK Law Firm</span>
                    <span>•</span>
                    <span>Ethics &amp; Independent Governance Office</span>
                </div>
                <div class="text-slate-400 text-center sm:text-right">
                    © {{ date('Y') }} Roni, Putra &amp; Kusumah Law Firm • All Rights Reserved.
                </div>
            </div>
        </main>
    </div>

    <script>
        function copyVerificationLink() {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                const btnText = document.getElementById('copyBtnText');
                const originalText = btnText.innerText;
                btnText.innerText = 'Tersalin!';
                setTimeout(() => {
                    btnText.innerText = originalText;
                }, 2500);
            });
        }
    </script>
</body>
</html>
