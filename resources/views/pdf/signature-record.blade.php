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
    <title>Rekaman Dokumen Sah {{ $signatureRequest->verification_code }} — RPK Law Firm</title>
    <style>
        @page { margin: 30px 36px 36px; size: A4 portrait; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #1e293b; font-family: "DejaVu Sans", Helvetica, Arial, sans-serif; font-size: 8.2px; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; }
        .mono { font-family: "DejaVu Sans Mono", monospace; }
        .navy { color: #0a1b33; }
        .gold { color: #8f6a22; }
        .muted { color: #64748b; }
        .right { text-align: right; }
        .center { text-align: center; }

        .letterhead { margin-bottom: 14px; }
        .letterhead td { vertical-align: middle; }
        .logo-cell { width: 55%; }
        .logo-crop { width: 190px; height: 60px; overflow: hidden; }
        .logo-crop img { width: 190px; height: auto; margin-top: -24px; }
        .office-cell { width: 45%; color: #475569; font-size: 7px; line-height: 1.55; text-align: right; }
        
        .gold-rule { height: 2px; border-top: 1.5px solid #8f6a22; border-bottom: 1px solid #e2d2aa; margin-bottom: 16px; }

        .record-title-box { margin-bottom: 16px; }
        .record-badge { display: inline-block; background: #0a1b33; color: #ffffff; padding: 2.5px 8px; font-size: 6.8px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-radius: 3px; }
        .record-title { margin-top: 5px; font-size: 16px; font-weight: bold; color: #0a1b33; }
        .record-subtitle { margin-top: 2px; font-size: 7.5px; color: #64748b; }

        .info-grid { border: 1px solid #cbd5e1; background: #f8fafc; padding: 10px 14px; margin-bottom: 14px; border-radius: 4px; }
        .info-table td { padding: 2.5px 0; font-size: 7.8px; vertical-align: top; }
        .info-label { width: 28%; color: #64748b; font-weight: bold; }
        .info-value { width: 72%; color: #0f172a; font-weight: bold; }

        .checksum-container { background: #ffffff; border: 1px solid #cbd5e1; padding: 6px 10px; margin-top: 6px; font-size: 7px; border-radius: 3px; }

        .section-title { font-size: 8.5px; font-weight: bold; color: #0a1b33; text-transform: uppercase; letter-spacing: .8px; margin-bottom: 6px; padding-bottom: 3px; border-bottom: 1.5px solid #0a1b33; }

        .signers-table { margin-bottom: 16px; }
        .signers-table th { background: #0a1b33; color: #ffffff; font-size: 7px; font-weight: bold; padding: 6px 8px; text-align: left; text-transform: uppercase; letter-spacing: .5px; }
        .signers-table td { padding: 7px 8px; border-bottom: 1px solid #e2e8f0; font-size: 7.5px; vertical-align: top; }

        .footer-box { border-top: 1.5px solid #0a1b33; padding-top: 12px; margin-top: 18px; }
        .footer-box td { vertical-align: middle; }
        .qr-col { width: 22%; text-align: center; }
        .desc-col { width: 78%; padding-left: 14px; font-size: 7.2px; color: #475569; line-height: 1.5; }
    </style>
</head>
<body>

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
                Tel: +62 22 420 8899 &nbsp;·&nbsp; Email: compliance@rpklaw.co.id
            </td>
        </tr>
    </table>
    
    <div class="gold-rule"></div>

    <!-- Title Area -->
    <div class="record-title-box">
        <span class="record-badge">OFFICIAL SIGNED DOCUMENT RECORD</span>
        <div class="record-title">REKAMAN RESMI PENGESAHAN DOKUMEN</div>
        <div class="record-subtitle">Bukti pengikatan kriptografi versi berkas asli dengan tanda tangan para pihak.</div>
    </div>

    <!-- Document Info Grid -->
    <div class="info-grid">
        <table class="info-table">
            <tr>
                <td class="info-label">DOKUMEN:</td>
                <td class="info-value" style="font-size: 8.5px;">{{ $signatureRequest->document->title }}</td>
            </tr>
            <tr>
                <td class="info-label">PERKARA (MATTER):</td>
                <td class="info-value">
                    @if ($signatureRequest->document && $signatureRequest->document->matter)
                        <span class="mono" style="color: #0369a1;">{{ $signatureRequest->document->matter->matter_number }}</span> — {{ $signatureRequest->document->matter->title }}
                    @else
                        Umum / Dokumen Korporasi
                    @endif
                </td>
            </tr>
            <tr>
                <td class="info-label">VERSI DOKUMEN:</td>
                <td class="info-value">Versi {{ $signatureRequest->documentVersion->version_number }}.0 ({{ $signatureRequest->documentVersion->original_filename }})</td>
            </tr>
            <tr>
                <td class="info-label">KODE VERIFIKASI:</td>
                <td class="info-value mono" style="color: #0369a1; font-weight: bold;">{{ $signatureRequest->verification_code }}</td>
            </tr>
            <tr>
                <td class="info-label">CHECKSUM SHA-256:</td>
                <td class="info-value">
                    <div class="checksum-container mono">{{ $signatureRequest->documentVersion->checksum ?? hash('sha256', $signatureRequest->verification_code) }}</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Signers List -->
    <div class="section-title">DAFTAR PENGESAHAN TANDA TANGAN ELEKTRONIK</div>
    <table class="signers-table">
        <thead>
            <tr>
                <th style="width: 30%;">Penandatangan</th>
                <th style="width: 25%;">Email</th>
                <th style="width: 25%;">Waktu Ditandatangani</th>
                <th style="width: 20%;">Status</th>
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
                    <td class="mono">{{ $signer->email }}</td>
                    <td class="mono">
                        {{ $signer->signed_at ? \Carbon\Carbon::parse($signer->signed_at)->translatedFormat('d M Y, H:i') . ' WIB' : '-' }}
                    </td>
                    <td>
                        <strong style="color: #047857;">SAH &amp; TERVERIFIKASI</strong>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" class="center muted" style="padding: 10px;">Belum ada data penandatangan.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Footer Box with Verification URL & QR -->
    <table class="footer-box">
        <tr>
            <td class="qr-col">
                <img src="{{ $qrDataUri }}" alt="QR Code" style="width: 75px; height: 75px; border: 1px solid #cbd5e1; padding: 2px;">
            </td>
            <td class="desc-col">
                <strong style="color: #0a1b33;">PENGESAHAN DOKUMEN HUKUM RPK LAW FIRM</strong><br>
                Setiap tanda tangan dalam dokumen ini memiliki kekuatan hukum yang sah dan mengikat para pihak. Keaslian dokumen dan status tanda tangan dapat diverifikasi setiap saat melalui portal resmi:<br>
                <span class="mono" style="color: #0369a1; font-weight: bold;">{{ $verificationUrl }}</span>
            </td>
        </tr>
    </table>

</body>
</html>
