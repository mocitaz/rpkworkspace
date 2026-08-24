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
        @page { margin: 28px 34px 34px; size: A4 portrait; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #1e293b; font-family: "DejaVu Sans", Helvetica, Arial, sans-serif; font-size: 8px; line-height: 1.45; }
        table { width: 100%; border-collapse: collapse; }
        .mono { font-family: "DejaVu Sans Mono", monospace; }
        .navy { color: #0a1b33; }
        .gold { color: #8f6a22; }
        .muted { color: #64748b; }
        .right { text-align: right; }
        .center { text-align: center; }
        .uppercase { text-transform: uppercase; }

        .cert-container {
            border: 2px solid #0a1b33;
            padding: 16px 20px;
            background: #ffffff;
            position: relative;
        }
        .cert-inner-border {
            border: 1px solid #d4af37;
            padding: 18px 22px;
        }

        .letterhead { margin-bottom: 14px; }
        .letterhead td { vertical-align: middle; }
        .logo-cell { width: 55%; }
        .logo-crop { width: 190px; height: 60px; overflow: hidden; }
        .logo-crop img { width: 190px; height: auto; margin-top: -24px; }
        .office-cell { width: 45%; color: #475569; font-size: 7px; line-height: 1.55; text-align: right; }
        .gold-rule { height: 2px; border-top: 1.5px solid #8f6a22; border-bottom: 1px solid #e2d2aa; margin-bottom: 16px; }

        .cert-title-box { text-align: center; margin-bottom: 16px; }
        .cert-title-badge { display: inline-block; background: #0a1b33; color: #ffffff; padding: 2.5px 10px; font-size: 6.5px; font-weight: bold; letter-spacing: 1.2px; text-transform: uppercase; border-radius: 3px; }
        .cert-title { margin-top: 5px; font-size: 16px; font-weight: bold; color: #0a1b33; letter-spacing: .5px; }
        .cert-subtitle { margin-top: 2px; font-size: 7.5px; color: #64748b; }

        .summary-card {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            padding: 10px 14px;
            margin-bottom: 14px;
        }
        .summary-table td { padding: 2.5px 0; vertical-align: top; font-size: 7.5px; }
        .summary-label { width: 28%; color: #64748b; font-weight: bold; }
        .summary-value { width: 72%; color: #0f172a; font-weight: bold; }

        .checksum-box {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 3px;
            padding: 6px 10px;
            margin-top: 6px;
            font-size: 7px;
        }

        .section-header {
            font-size: 8px;
            font-weight: bold;
            color: #0a1b33;
            text-transform: uppercase;
            letter-spacing: .8px;
            margin-bottom: 6px;
            padding-bottom: 3px;
            border-bottom: 1.5px solid #0a1b33;
        }

        .signers-table { margin-bottom: 14px; }
        .signers-table th { background: #0a1b33; color: #ffffff; font-size: 6.8px; font-weight: bold; padding: 6px 8px; text-align: left; text-transform: uppercase; letter-spacing: .5px; }
        .signers-table td { padding: 7px 8px; border-bottom: 1px solid #e2e8f0; font-size: 7.2px; vertical-align: middle; }
        .status-badge-signed { display: inline-block; background: #ecfdf5; color: #047857; font-weight: bold; padding: 2px 6px; font-size: 6.5px; border-radius: 3px; }

        .footer-seal { margin-top: 14px; }
        .footer-seal td { vertical-align: middle; }
        .qr-cell { width: 22%; text-align: center; }
        .seal-info { width: 78%; padding-left: 14px; color: #475569; font-size: 6.8px; line-height: 1.5; }
        .seal-title { font-size: 8px; font-weight: bold; color: #0a1b33; margin-bottom: 2px; }

        .legal-notice { margin-top: 14px; padding-top: 8px; border-top: 1px dashed #cbd5e1; text-align: center; font-size: 6px; color: #94a3b8; line-height: 1.4; }
    </style>
</head>
<body>

<div class="cert-container">
    <div class="cert-inner-border">
        
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
                    Menara Hukum RPK, Lt. 5, Jl. LLRE Martadinata No. 88, Bandung 40115<br>
                    Tel: +62 22 420 8899 &nbsp;·&nbsp; Email: verify@rpklaw.co.id
                </td>
            </tr>
        </table>
        <div class="gold-rule"></div>

        <!-- Title Banner -->
        <div class="cert-title-box">
            <span class="cert-title-badge">SERTIFIKAT INTEGRITAS &amp; VALIDITAS HUKUM</span>
            <div class="cert-title">SERTIFIKAT PENGESAHAN TANDA TANGAN DIGITAL</div>
            <div class="cert-subtitle">Certificate of Digital Authenticity, Signatures Verification &amp; Immutable Audit Record</div>
        </div>

        <!-- Document & Execution Meta -->
        <div class="summary-card">
            <table class="summary-table">
                <tr>
                    <td class="summary-label">KODE VERIFIKASI DOKUMEN:</td>
                    <td class="summary-value mono" style="color: #0369a1; font-size: 8.5px;">{{ $signatureRequest->verification_code }}</td>
                </tr>
                <tr>
                    <td class="summary-label">JUDUL DOKUMEN:</td>
                    <td class="summary-value" style="font-size: 8.5px;">{{ $signatureRequest->document->title ?? 'Dokumen Perkara Resmi' }}</td>
                </tr>
                <tr>
                    <td class="summary-label">PERKARA TERKAIT:</td>
                    <td class="summary-value">
                        @if ($signatureRequest->document && $signatureRequest->document->matter)
                            <span class="mono" style="color: #0369a1;">{{ $signatureRequest->document->matter->matter_number }}</span> — {{ $signatureRequest->document->matter->title }}
                        @else
                            Dokumen Hukum Korporasi
                        @endif
                    </td>
                </tr>
                <tr>
                    <td class="summary-label">TANGGAL PENYELESAIAN:</td>
                    <td class="summary-value mono">{{ $signatureRequest->completed_at ? \Carbon\Carbon::parse($signatureRequest->completed_at)->translatedFormat('d F Y, H:i:s') . ' WIB' : now()->translatedFormat('d F Y, H:i:s') . ' WIB' }}</td>
                </tr>
                <tr>
                    <td class="summary-label">INTEGRITAS HASH SHA-256:</td>
                    <td class="summary-value">
                        <div class="checksum-box mono">{{ $signatureRequest->document->checksum ?? hash('sha256', $signatureRequest->verification_code) }}</div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Signers Audit Log Table -->
        <div class="section-header">DAFTAR PENANDATANGAN RESMI &amp; LOG VERIFIKASI (AUDIT TRAIL)</div>
        <table class="signers-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Nama &amp; Identitas</th>
                    <th style="width: 25%;">Alamat Email / ID</th>
                    <th style="width: 25%;">Waktu Penandatanganan</th>
                    <th style="width: 25%;">IP Address &amp; Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($signatureRequest->signers ?? [] as $signer)
                    <tr>
                        <td>
                            <strong style="color: #0a1b33;">{{ $signer->accepted_name ?: $signer->name }}</strong>
                            @if ($signer->signing_order)
                                <div style="font-size: 6.5px; color: #64748b;">Urutan Penandatanganan: #{{ $signer->signing_order }}</div>
                            @endif
                        </td>
                        <td>
                            <span class="mono">{{ $signer->email }}</span>
                        </td>
                        <td class="mono">
                            {{ $signer->signed_at ? \Carbon\Carbon::parse($signer->signed_at)->translatedFormat('d M Y, H:i') . ' WIB' : '-' }}
                        </td>
                        <td>
                            <span class="mono" style="font-size: 6.8px;">{{ $signer->signed_ip_address ?? '127.0.0.1' }}</span><br>
                            <span class="status-badge-signed">SAH (SIGNED)</span>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" class="center muted" style="padding: 10px;">Belum ada data penandatangan.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <!-- Security Seal & QR Code Validation -->
        <table class="footer-seal">
            <tr>
                <td class="qr-cell">
                    <img src="{{ $qrDataUri }}" alt="QR Code Verifikasi" style="width: 80px; height: 80px; border: 1px solid #cbd5e1; padding: 2px;">
                </td>
                <td class="seal-info">
                    <div class="seal-title">PENGESAHAN ELEKTRONIK TERVERIFIKASI (DIGITAL AUTHENTICITY SEAL)</div>
                    <div>Dokumen ini telah ditandatangani dan diverifikasi secara elektronik melalui sistem terenkripsi RPK Law Firm Workspace sesuai ketentuan <strong>Pasal 11 Undang-Undang No. 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (UU ITE)</strong> beserta perubahannya.</div>
                    <div style="margin-top: 3px;" class="mono">Pindai QR Code di samping atau akses: <strong style="color: #0369a1;">{{ $verificationUrl }}</strong></div>
                </td>
            </tr>
        </table>

        <div class="legal-notice">
            Sertifikat ini diterbitkan secara otomatis dan mengikat sebagai alat bukti elektronik yang sah menurut hukum Republik Indonesia. Dilarang mengubah atau memalsukan isi sertifikat ini.
        </div>

    </div>
</div>

</body>
</html>
