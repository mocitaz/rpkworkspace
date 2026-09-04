<!DOCTYPE html>
<html lang="id" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $email->subject ?? 'Korespondensi Resmi RPK Law Firm' }}</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td, a { font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif !important; }
    </style>
    <![endif]-->
    <style type="text/css">
        body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        a { color: #0f172a; }
        @media screen and (max-width: 600px) {
            .email-wrap { padding: 18px 16px 28px 16px !important; }
            .signature-table td { display: block !important; width: 100% !important; }
            .signature-logo-cell { padding-right: 0 !important; padding-bottom: 10px !important; border-right: none !important; border-bottom: 1.5px solid #e2e8f0 !important; }
            .signature-info-cell { padding-left: 0 !important; padding-top: 10px !important; }
        }
    </style>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;color:#1e293b;-webkit-font-smoothing:antialiased;">
    <div class="email-wrap" style="max-width:620px;margin:0 auto;padding:24px 20px 36px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        
        <!-- Natural Email Body (Gmail / Outlook POV) -->
        <div style="font-size:14px;line-height:23px;color:#1e293b;word-break:break-word;">
            {!! nl2br(e($cleanBody ?? $body)) !!}
        </div>

        @if($email->matter)
        <!-- Matter Reference Badge -->
        <div style="margin:20px 0 0;padding:10px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid #0f172a;border-radius:4px;font-size:11.5px;line-height:17px;color:#475569;">
            <strong style="color:#0f172a;">Perkara Terkait:</strong> {{ $email->matter->matter_number }} &bull; {{ $email->matter->title }}
        </div>
        @endif

        @if($hasSignature ?? false)
        <!-- Executive Law Firm Signature Letterhead -->
        <div style="margin-top:32px;padding-top:18px;border-top:1px solid #e2e8f0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="signature-table" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                <tr>
                    <td valign="top" class="signature-logo-cell" style="padding-right:16px;border-right:2px solid #0f172a;width:130px;">
                        <img src="{{ rtrim((string) config('app.url'), '/') }}/logo/raf-law-firm-transparent.png" alt="RPK Law Firm" height="42" style="display:block;height:42px;width:auto;border:0;" />
                    </td>
                    <td valign="top" class="signature-info-cell" style="padding-left:16px;">
                        <div style="font-size:14px;font-weight:700;color:#0f172a;line-height:19px;">
                            {{ $signerName ?? $email->sender?->name ?? 'Tim Advokat &amp; Konsultan Hukum' }}
                        </div>
                        <div style="font-size:12px;font-weight:500;color:#475569;line-height:17px;margin-top:2px;">
                            {{ $signerTitle ?? $email->sender?->position_title ?? 'Advokat &amp; Konsultan Hukum' }}
                        </div>
                        <div style="font-size:11px;font-weight:700;color:#0f172a;letter-spacing:0.03em;margin-top:3px;">
                            RONI, PUTRA &amp; KUSUMAH LAW FIRM
                        </div>
                    </td>
                </tr>
            </table>

            <!-- Contact & Office Info -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;font-size:11px;line-height:17px;color:#64748b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                <tr>
                    <td style="padding-bottom:2px;">
                        <span style="color:#0f172a;font-weight:600;">Tel / WA:</span> 0852 9560 1417 &nbsp;&bull;&nbsp;
                        <span style="color:#0f172a;font-weight:600;">Email:</span> <a href="mailto:{{ $email->from_address }}" style="color:#2563eb;text-decoration:none;">{{ $email->from_address }}</a> &nbsp;&bull;&nbsp;
                        <span style="color:#0f172a;font-weight:600;">Web:</span> <a href="https://rpklawoffice.com" target="_blank" style="color:#2563eb;text-decoration:none;">rpklawoffice.com</a>
                    </td>
                </tr>
                <tr>
                    <td style="font-size:10.5px;color:#94a3b8;padding-top:1px;">
                        Jl. Bukit Nirwana VII, Blok CC.04, Sariwangi, Bandung Barat, Jawa Barat
                    </td>
                </tr>
            </table>

            <!-- Professional Subdued Disclaimer -->
            <div style="margin-top:14px;padding-top:10px;border-top:1px dashed #e2e8f0;font-size:9.5px;line-height:14.5px;color:#94a3b8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;text-align:justify;">
                <strong style="color:#64748b;font-weight:600;">KERAHASIAAN PROFESI ADVOKAT (ATTORNEY-CLIENT PRIVILEGE):</strong>
                Surat elektronik ini beserta lampirannya bersifat rahasia dan dilindungi oleh hak istimewa hukum kerahasiaan profesi advokat (Pasal 19 UU No. 18 Tahun 2003 tentang Advokat). Apabila Anda bukan penerima yang dimaksud, dilarang menyalin, mendistribusikan, atau memanfaatkan isi pesan ini. Mohon segera beritahukan pengirim dan hapus pesan ini dari sistem Anda.
            </div>
        </div>
        @else
        <div style="margin-top:28px;padding-top:12px;border-top:1px solid #f1f5f9;font-size:11px;color:#94a3b8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            RONI, PUTRA &amp; KUSUMAH LAW FIRM &bull; {{ $email->from_address }}
        </div>
        @endif

    </div>
</body>
</html>
