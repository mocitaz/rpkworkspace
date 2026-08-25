@php
    $verificationUrl = route('signature.verify', $signatureRequest->verification_code);
    $qrDataUri = (new \Endroid\QrCode\Writer\PngWriter())->write(
        new \Endroid\QrCode\QrCode(data: $verificationUrl, size: 240, margin: 0)
    )->getDataUri();
@endphp
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Sertifikat Pengesahan Digital {{ $signatureRequest->verification_code }} — RPK Law Firm</title>
    <style>
        @page { margin: 20px 24px; size: A4 portrait; }
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

        /* Guilloche Security Frame */
        .guilloche-outer {
            border: 3px double #0a1b33;
            padding: 4px;
            background: #ffffff;
        }
        .guilloche-mid {
            border: 1px solid #c5a059;
            padding: 3px;
        }
        .guilloche-inner {
            border: 1px dashed #0a1b33;
            padding: 16px 20px;
            background: #ffffff;
            position: relative;
        }

        /* Letterhead */
        .letterhead { margin-bottom: 12px; }
        .letterhead td { vertical-align: middle; }
        .logo-cell { width: 52%; }
        .logo-crop { width: 185px; height: 56px; overflow: hidden; }
        .logo-crop img { width: 185px; height: auto; margin-top: -22px; }
        .office-cell { width: 48%; color: #334155; font-size: 6.8px; line-height: 1.5; text-align: right; }
        .gold-divider { height: 2px; border-top: 1.5px solid #8f6a22; border-bottom: 1px solid #d4af37; margin-bottom: 14px; }

        /* Certificate Title Header */
        .cert-header { text-align: center; margin-bottom: 14px; }
        .cert-badge { display: inline-block; background: #0a1b33; color: #d4af37; border: 1px solid #8f6a22; padding: 2px 12px; font-size: 6.8px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 2px; }
        .cert-title { margin-top: 6px; font-size: 15px; font-weight: bold; color: #0a1b33; letter-spacing: .8px; text-transform: uppercase; }
        .cert-subtitle { margin-top: 2px; font-size: 7.2px; color: #64748b; font-style: italic; }

        /* Summary Meta Box */
        .summary-card {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-top: 2.5px solid #0a1b33;
            border-radius: 3px;
            padding: 9px 12px;
            margin-bottom: 12px;
        }
        .summary-table td { padding: 2.2px 0; vertical-align: top; font-size: 7.4px; }
        .summary-label { width: 30%; color: #475569; font-weight: bold; }
        .summary-value { width: 70%; color: #0a1b33; font-weight: bold; }

        .hash-box {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-left: 3px solid #0369a1;
            border-radius: 2px;
            padding: 4px 8px;
            margin-top: 4px;
            font-size: 6.8px;
            color: #0f172a;
        }

        /* Section Headings */
        .section-header {
            font-size: 7.8px;
            font-weight: bold;
            color: #0a1b33;
            text-transform: uppercase;
            letter-spacing: .8px;
            margin-bottom: 6px;
            padding-bottom: 2.5px;
            border-bottom: 1.5px solid #0a1b33;
        }

        /* Signers Audit Table */
        .signers-table { margin-bottom: 12px; }
        .signers-table th { background: #0a1b33; color: #ffffff; font-size: 6.8px; font-weight: bold; padding: 5.5px 7px; text-align: left; text-transform: uppercase; letter-spacing: .4px; }
        .signers-table td { padding: 6px 7px; border-bottom: 1px solid #e2e8f0; font-size: 7.2px; vertical-align: middle; }
        .status-badge-valid { display: inline-block; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; font-weight: bold; padding: 1.5px 5px; font-size: 6.2px; border-radius: 2px; }

        /* Security Seal & QR */
        .seal-card {
            background: #fafaf9;
            border: 1px solid #e7e5e4;
            border-radius: 3px;
            padding: 8px 10px;
            margin-top: 10px;
        }
        .seal-card td { vertical-align: middle; }
        .qr-cell { width: 22%; text-align: center; }
        .seal-info { width: 78%; padding-left: 12px; color: #334155; font-size: 6.8px; line-height: 1.48; }
        .seal-title { font-size: 7.8px; font-weight: bold; color: #0a1b33; margin-bottom: 2px; }

        /* Legal Footer */
        .legal-notice { margin-top: 10px; padding-top: 6px; border-top: 1px dashed #cbd5e1; text-align: center; font-size: 5.8px; color: #64748b; line-height: 1.35; }
    </style>
</head>
<body>

<div class="guilloche-outer">
    <div class="guilloche-mid">
        <div class="guilloche-inner">
            
            <!-- Letterhead Header -->
            <table class="letterhead">
                <tr>
                    <td class="logo-cell">
                        <div class="logo-crop">
                            <img src="{{ public_path('logo/logo.png') }}" alt="RPK Law Firm">
                        </div>
                    </td>
                    <td class="office-cell">
                        <strong>RONI, PUTRA &amp; KUSUMAH LAW FIRM</strong><br>
                        Menara Hukum RPK, Lantai 5, Jl. LLRE Martadinata No. 88, Bandung 40115<br>
                        Tel: +62 22 420 8899 &nbsp;·&nbsp; Email: verify@rpklaw.co.id &nbsp;·&nbsp; www.rpklaw.co.id
                    </td>
                </tr>
            </table>
            <div class="gold-divider"></div>

            <!-- Title Banner -->
            <div class="cert-header">
                <span class="cert-badge">SERTIFIKAT INTEGRITAS DIGITAL &amp; VALIDITAS HUKUM</span>
                <div class="cert-title">SERTIFIKAT PENGESAHAN TANDA TANGAN ELEKTRONIK</div>
                <div class="cert-subtitle">Certificate of Digital Authenticity, Signatures Verification &amp; Immutable Audit Trail</div>
            </div>

            <!-- Document & Verification Meta -->
            <div class="summary-card">
                <table class="summary-table">
                    <tr>
                        <td class="summary-label">KODE VERIFIKASI RESMI:</td>
                        <td class="summary-value mono" style="color: #0369a1; font-size: 8.5px;">{{ $signatureRequest->verification_code }}</td>
                    </tr>
                    <tr>
                        <td class="summary-label">JUDUL DOKUMEN:</td>
                        <td class="summary-value" style="font-size: 8px;">{{ $signatureRequest->document->title ?? 'Dokumen Perkara Resmi' }}</td>
                    </tr>
                    <tr>
                        <td class="summary-label">NOMOR &amp; JUDUL PERKARA:</td>
                        <td class="summary-value">
                            @if ($signatureRequest->document && $signatureRequest->document->matter)
                                <span class="mono" style="color: #0369a1;">{{ $signatureRequest->document->matter->matter_number }}</span> — {{ $signatureRequest->document->matter->title }}
                            @else
                                <span class="muted">Dokumen Hukum Korporasi &amp; Non-Litigasi</span>
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td class="summary-label">KLIEN TERKAIT:</td>
                        <td class="summary-value">
                            {{ $signatureRequest->document->client->display_name ?? 'Klien Terdaftar' }}
                        </td>
                    </tr>
                    <tr>
                        <td class="summary-label">WAKTU PENYELESAIAN LENGKAP:</td>
                        <td class="summary-value mono">{{ $signatureRequest->completed_at ? \Carbon\Carbon::parse($signatureRequest->completed_at)->translatedFormat('d F Y, H:i:s') . ' WIB' : now()->translatedFormat('d F Y, H:i:s') . ' WIB' }}</td>
                    </tr>
                    <tr>
                        <td class="summary-label">INTEGRITAS HASH KRIPTOGRAFI:</td>
                        <td class="summary-value">
                            <div class="hash-box mono"><strong>SHA-256 Sumber:</strong> {{ $signatureRequest->document_checksum }}</div>
                            @if ($signatureRequest->signed_final_checksum)
                                <div class="hash-box mono" style="border-left-color: #047857; margin-top: 3px;"><strong>SHA-256 PDF Final:</strong> {{ $signatureRequest->signed_final_checksum }}</div>
                            @endif
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Signers Audit Log Table -->
            <div class="section-header">DAFTAR PENANDATANGAN RESMI &amp; LOG AUDIT PENANDATANGANAN</div>
            <table class="signers-table">
                <thead>
                    <tr>
                        <th style="width: 28%;">Pihak Penandatangan</th>
                        <th style="width: 26%;">Identitas / Email</th>
                        <th style="width: 24%;">Waktu Pengesahan</th>
                        <th style="width: 22%;">IP &amp; Status Hukum</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($signatureRequest->signers ?? [] as $signer)
                        <tr>
                            <td>
                                <strong style="color: #0a1b33; font-size: 7.6px;">{{ $signer->accepted_name ?: $signer->name }}</strong>
                                @if ($signer->signing_order)
                                    <div style="font-size: 6.2px; color: #64748b;">Urutan Penandatanganan: #{{ $signer->signing_order }}</div>
                                @endif
                            </td>
                            <td>
                                <span class="mono" style="font-size: 7px;">{{ $signer->email }}</span>
                            </td>
                            <td class="mono" style="font-size: 7px;">
                                {{ $signer->signed_at ? \Carbon\Carbon::parse($signer->signed_at)->translatedFormat('d M Y, H:i:s') . ' WIB' : '-' }}
                            </td>
                            <td>
                                <span class="mono" style="font-size: 6.8px;">IP: {{ $signer->signed_ip_address ?? '127.0.0.1' }}</span><br>
                                <span class="status-badge-valid">&#10003; TERVERIFIKASI (SIGNED)</span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="center muted" style="padding: 8px;">Belum ada data penandatangan resmi.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>

            <!-- Security Seal & QR Code Validation -->
            <table class="seal-card">
                <tr>
                    <td class="qr-cell">
                        <img src="{{ $qrDataUri }}" alt="QR Code Verifikasi" style="width: 76px; height: 76px; border: 1px solid #cbd5e1; padding: 2px; background: #ffffff;">
                    </td>
                    <td class="seal-info">
                        <div class="seal-title">PENGESAHAN ELEKTRONIK RESMI (DIGITAL AUTHENTICITY SEAL)</div>
                        <div>Dokumen ini telah ditandatangani dan diverifikasi secara elektronik melalui sistem terenkripsi RPK Law Firm Workspace sesuai ketentuan <strong>Pasal 11 Undang-Undang No. 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (UU ITE)</strong> beserta perubahannya dan Peraturan Pemerintah No. 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik.</div>
                        <div style="margin-top: 3px;" class="mono">Verifikasi Online: <strong style="color: #0369a1;">{{ $verificationUrl }}</strong></div>
                    </td>
                </tr>
            </table>

            <div class="legal-notice">
                Sertifikat ini diterbitkan secara otomatis oleh sistem RPK Workspace dan mengikat sebagai alat bukti elektronik yang sah menurut hukum Republik Indonesia. Dilarang menduplikasi atau merekayasa kode kriptografi pada sertifikat ini.
            </div>

        </div>
    </div>
</div>

</body>
</html>
