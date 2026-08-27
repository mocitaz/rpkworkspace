@php
    $verificationUrl = route('governance.conflict-checks.certificate', $conflictCheck->id);
    $qrDataUri = (new \Endroid\QrCode\Writer\PngWriter())->write(
        new \Endroid\QrCode\QrCode(data: $verificationUrl, size: 180, margin: 0)
    )->getDataUri();

    $isClear = $conflictCheck->status === 'clear' || $conflictCheck->decision === 'cleared' || $conflictCheck->decision === 'approved';
    $isWaived = $conflictCheck->decision === 'waived';
    $isBlocked = $conflictCheck->status === 'blocked' && $conflictCheck->decision !== 'waived';
@endphp
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Sertifikat Pemeriksaan Benturan Kepentingan CC-{{ substr($conflictCheck->id, 0, 10) }} — RPK Law Firm</title>
    <style>
        @page { margin: 24px 30px; size: A4 portrait; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #0f172a; font-family: "DejaVu Sans", Helvetica, Arial, sans-serif; font-size: 8px; line-height: 1.45; background: #ffffff; }
        table { width: 100%; border-collapse: collapse; }
        .mono { font-family: "DejaVu Sans Mono", monospace; }
        .navy { color: #0a1b33; }
        .gold { color: #8f6a22; }
        .muted { color: #64748b; }
        .right { text-align: right; }
        .center { text-align: center; }
        .uppercase { text-transform: uppercase; }

        /* Security Frame */
        .frame-outer {
            border: 2px solid #0a1b33;
            padding: 3px;
            background: #ffffff;
        }
        .frame-inner {
            border: 1px solid #c5a059;
            padding: 16px 20px;
            background: #ffffff;
            position: relative;
        }

        /* Letterhead */
        .letterhead { margin-bottom: 10px; }
        .letterhead td { vertical-align: middle; }
        .logo-cell { width: 50%; }
        .logo-crop { width: 180px; height: 52px; overflow: hidden; }
        .logo-crop img { width: 180px; height: auto; margin-top: -20px; }
        .office-cell { width: 50%; color: #334155; font-size: 6.8px; line-height: 1.45; text-align: right; }
        .gold-divider { height: 2px; border-top: 1.5px solid #8f6a22; border-bottom: 1px solid #d4af37; margin-bottom: 12px; }

        /* Certificate Title Header */
        .cert-header { text-align: center; margin-bottom: 12px; }
        .cert-badge { display: inline-block; background: #0a1b33; color: #ffffff; padding: 2px 10px; font-size: 6.5px; font-weight: bold; letter-spacing: 1.2px; text-transform: uppercase; border-radius: 2px; }
        .cert-title { margin-top: 5px; font-size: 13px; font-weight: bold; color: #0a1b33; letter-spacing: .6px; text-transform: uppercase; }
        .cert-subtitle { margin-top: 2px; font-size: 7px; color: #64748b; font-style: italic; }

        /* Status Box */
        .status-box {
            margin: 10px auto 14px;
            text-align: center;
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 4px;
            padding: 6px 14px;
            width: 75%;
        }
        .status-label { font-size: 6.5px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
        .status-val { font-size: 9.5px; font-weight: bold; color: #0a1b33; margin-top: 2px; }

        /* Preamble */
        .preamble { font-size: 7.2px; color: #334155; line-height: 1.5; margin-bottom: 12px; text-align: justify; }

        /* Summary Meta Table */
        .meta-table { border: 1px solid #cbd5e1; border-radius: 3px; margin-bottom: 12px; }
        .meta-table td { padding: 4px 8px; font-size: 7.2px; vertical-align: top; border-bottom: 1px solid #f1f5f9; }
        .meta-label { width: 30%; font-weight: bold; color: #475569; background: #f8fafc; }
        .meta-val { width: 70%; color: #0f172a; }

        /* Match Findings Table */
        .findings-table { border: 1px solid #cbd5e1; margin-bottom: 12px; }
        .findings-table th { background: #0a1b33; color: #ffffff; font-size: 6.8px; font-weight: bold; padding: 4px 6px; text-transform: uppercase; }
        .findings-table td { padding: 4px 6px; border-bottom: 1px solid #e2e8f0; font-size: 7px; }

        /* Decision Box */
        .decision-box { background: #f8fafc; border: 1px solid #cbd5e1; border-left: 3px solid #8f6a22; padding: 6px 10px; margin-bottom: 14px; font-size: 7.2px; }
        .decision-title { font-weight: bold; color: #8f6a22; font-size: 6.8px; text-transform: uppercase; margin-bottom: 2px; }

        /* Sign-off & QR */
        .closing-layout { margin-top: 14px; page-break-inside: avoid; }
        .closing-layout td { vertical-align: bottom; }
        .qr-cell { width: 45%; }
        .sig-cell { width: 55%; text-align: right; }
        .sig-firm { font-size: 7.5px; font-weight: bold; color: #0a1b33; }
        .sig-space { height: 32px; }
        .sig-line { width: 140px; border-top: 1px solid #0a1b33; margin-left: auto; margin-bottom: 2px; }
        .sig-name { font-size: 7px; font-weight: bold; color: #0a1b33; }
        .sig-title { font-size: 6.5px; color: #64748b; }
    </style>
</head>
<body>
    <div class="frame-outer">
        <div class="frame-inner">
            
            <!-- Letterhead -->
            <table class="letterhead">
                <tr>
                    <td class="logo-cell">
                        <div class="logo-crop">
                            <img src="{{ public_path('logo/logo.png') }}" alt="RPK Law Firm">
                        </div>
                    </td>
                    <td class="office-cell">
                        <strong>RONI, PUTRA &amp; KUSUMAH LAW FIRM</strong><br>
                        Divisi Kepatuhan Etika Profesi &amp; Manajemen Risiko Perkara<br>
                        Jl. Bukit Nirwana VII, Blok CC.04, Sariwangi, Kabupaten Bandung Barat, Jawa Barat<br>
                        Telp: 0852 9560 1417 &nbsp;·&nbsp; Email: contact@gmail.com
                    </td>
                </tr>
            </table>
            <div class="gold-divider"></div>

            <!-- Certificate Header -->
            <div class="cert-header">
                <span class="cert-badge">FORMULIR KEPATUHAN ETIKA NOMOR: CC-RPK-{{ substr($conflictCheck->id, 0, 12) }}</span>
                <div class="cert-title">SURAT KETERANGAN PEMERIKSAAN BENTURAN KEPENTINGAN</div>
                <div class="cert-subtitle">Certificate of Conflict of Interest Clearance &amp; Ethical Review</div>
            </div>

            <!-- Status Box -->
            <div class="status-box">
                <div class="status-label">KESIMPULAN UJI INDEPENDENSI PROFESI &amp; KELAYAKAN PERKARA</div>
                <div class="status-val">
                    @if ($isClear)
                        MEMENUHI SYARAT INDEPENDENSI • LAYAK DITANGANI
                    @elseif ($isWaived)
                        DISETUJUI DENGAN KETENTUAN KHUSUS (ETHICAL WALL WAIVER)
                    @else
                        TIDAK DAPAT DITANGANI • BENTURAN LANGSUNG DITEMUKAN
                    @endif
                </div>
                <div style="font-size: 6.8px; color: #475569; margin-top: 2px; font-style: italic;">
                    @if ($isClear)
                        Berdasarkan penelusuran basis data perkara dan para pihak, tidak ditemukan benturan kepentingan dan perkara dinyatakan sah untuk diproses.
                    @elseif ($isWaived)
                        Terdapat potensi benturan yang telah ditinjau dan disetujui Managing Partner dengan pembatasan akses data (Ethical Barrier).
                    @else
                        Ditemukan benturan kepentingan langsung dengan pihak lawan atau portofolio perkara aktif firma hukum.
                    @endif
                </div>
            </div>

            <!-- Preamble -->
            <div class="preamble">
                Berdasarkan ketentuan Kode Etik Advokat Indonesia (KEAI) serta Standar Kepatuhan Independensi Profesi RPK Law Firm, telah dilaksanakan penelusuran menyeluruh (*Comprehensive Conflict of Interest Scan*) terhadap basis data perkara berjalan, klien aktif, mantan klien, pihak lawan (*adverse parties*), rekanan, dan saksi dengan rincian sebagai berikut:
            </div>

            <!-- Metadata Table -->
            <table class="meta-table">
                <tr>
                    <td class="meta-label">Nama Subjek / Entitas Utama:</td>
                    <td class="meta-val"><strong>{{ $conflictCheck->subject_name }}</strong></td>
                </tr>
                <tr>
                    <td class="meta-label">Daftar Pihak yang Ditelusuri:</td>
                    <td class="meta-val mono">{{ implode(', ', $conflictCheck->searched_names ?? []) }}</td>
                </tr>
                <tr>
                    <td class="meta-label">Perkara / Klien Terkait:</td>
                    <td class="meta-val">
                        @if ($conflictCheck->matter)
                            <strong class="mono">{{ $conflictCheck->matter->matter_number }}</strong> — {{ $conflictCheck->matter->title }}
                        @elseif ($conflictCheck->client)
                            {{ $conflictCheck->client->display_name }} (No. Klien: {{ $conflictCheck->client->client_number }})
                        @else
                            Pemeriksaan Pra-Perkara / Calon Klien Baru
                        @endif
                    </td>
                </tr>
                <tr>
                    <td class="meta-label">Tanggal &amp; Waktu Pemeriksaan:</td>
                    <td class="meta-val mono">{{ $conflictCheck->created_at->format('d/m/Y H:i') }} WIB</td>
                </tr>
                <tr>
                    <td class="meta-label">Masa Berlaku Keterangan:</td>
                    <td class="meta-val mono">{{ $conflictCheck->expires_at ? $conflictCheck->expires_at->format('d/m/Y') : '30 Hari sejak diterbitkan' }}</td>
                </tr>
                <tr>
                    <td class="meta-label">Pemohon Pemeriksaan (Advokat):</td>
                    <td class="meta-val">{{ $conflictCheck->requester->name ?? 'Advokat RPK' }} {{ $conflictCheck->requester?->position_title ? '('.$conflictCheck->requester->position_title.')' : '' }}</td>
                </tr>
            </table>

            <!-- Findings Table -->
            @if ($conflictCheck->matches && count($conflictCheck->matches) > 0)
                <div style="font-size: 7.2px; font-weight: bold; color: #0a1b33; margin-bottom: 4px; text-transform: uppercase;">
                    Rincian Temuan Penelusuran Database ({{ count($conflictCheck->matches) }} Entitas):
                </div>
                <table class="findings-table">
                    <thead>
                        <tr>
                            <th>Nama Entitas / Pihak</th>
                            <th>Kategori Hubungan</th>
                            <th class="center">Kemiripan</th>
                            <th class="center">Tingkat Risiko</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($conflictCheck->matches as $m)
                            <tr>
                                <td>
                                    <strong>{{ $m['name'] ?? '-' }}</strong>
                                    @if (!empty($m['details']))
                                        <br><span class="muted" style="font-size: 6.2px;">{{ $m['details'] }}</span>
                                    @endif
                                </td>
                                <td>{{ $m['role_label'] ?? ($m['type'] ?? '-') }}</td>
                                <td class="center mono">{{ $m['similarity'] ?? 0 }}%</td>
                                <td class="center">
                                    <strong>{{ ($m['risk'] ?? '') === 'blocked' ? 'Benturan Langsung' : 'Potensi Benturan' }}</strong>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <div class="decision-box" style="border-left-color: #059669; margin-bottom: 12px;">
                    <div class="decision-title" style="color: #047857;">&#10003; HASIL PENELUSURAN NIHIL (ZERO CONFLICTS)</div>
                    Tidak ditemukan adanya benturan kepentingan dengan klien aktif, mantan klien, atau pihak lawan pada seluruh portofolio perkara RPK Law Firm.
                </div>
            @endif

            <!-- Partner Note -->
            @if ($conflictCheck->decision_note)
                <div class="decision-box">
                    <div class="decision-title">Catatan &amp; Justifikasi Etik Managing Partner:</div>
                    "{{ $conflictCheck->decision_note }}"
                    @if ($conflictCheck->reviewer)
                        <div style="margin-top: 3px; font-size: 6.5px; color: #64748b;">
                            Ditinjau oleh: <strong>{{ $conflictCheck->reviewer->name }}</strong> ({{ $conflictCheck->reviewer->position_title ?? 'Managing Partner' }})
                        </div>
                    @endif
                </div>
            @endif

            <!-- Closing Signatures & QR -->
            <table class="closing-layout">
                <tr>
                    <td class="qr-cell">
                        <table style="width: auto;">
                            <tr>
                                <td style="vertical-align: middle; padding-right: 8px;">
                                    <img src="{{ $qrDataUri }}" style="width: 44px; height: 44px; border: 1px solid #cbd5e1; padding: 2px; border-radius: 3px;" alt="QR Code" />
                                </td>
                                <td style="vertical-align: middle; font-size: 6px; color: #64748b; line-height: 1.3;">
                                    <strong style="color: #0a1b33;">DOKUMEN TERVERIFIKASI</strong><br>
                                    Pindai untuk validasi keaslian sertifikat di server resmi RPK.<br>
                                    <span class="mono">ID: {{ substr($conflictCheck->id, 0, 14) }}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td class="sig-cell">
                        <div style="font-size: 6.8px; color: #64748b;">Bandung, {{ ($conflictCheck->reviewed_at ?? $conflictCheck->created_at)->format('d F Y') }}</div>
                        <div class="sig-firm">RONI, PUTRA &amp; KUSUMAH LAW FIRM</div>
                        <div class="sig-space"></div>
                        <div class="sig-line"></div>
                        <div class="sig-name">{{ $conflictCheck->reviewer->name ?? 'Managing Partner' }}</div>
                        <div class="sig-title">{{ $conflictCheck->reviewer->position_title ?? 'Managing Partner & Ethics Officer' }}</div>
                    </td>
                </tr>
            </table>

        </div>
    </div>
</body>
</html>
