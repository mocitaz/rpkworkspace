<!DOCTYPE html>
<html lang="id" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $subject ?? 'Pemberitahuan RPK Law Firm Workspace' }}</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td, a { font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif !important; }
    </style>
    <![endif]-->
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        a { box-sizing: border-box; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
        a { color: #0f172a; text-decoration: none; font-weight: 600; }
        a:hover { text-decoration: underline; }

        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: auto !important; border-radius: 0 !important; border: none !important; }
            .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
            .mobile-title { font-size: 18px !important; line-height: 24px !important; }
            .btn-full { display: block !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; padding: 12px 16px !important; text-align: center !important; white-space: normal !important; }
            .action-button-table { width: 100% !important; max-width: 100% !important; }
            .email-container td[width="50%"] { display: block !important; width: 100% !important; box-sizing: border-box !important; padding-right: 0 !important; padding-bottom: 12px !important; padding-left: 0 !important; }
            .email-container td[width="50%"]:last-child { padding-bottom: 0 !important; }
            .email-container td, .email-container span, .email-container a { overflow-wrap: anywhere !important; word-break: break-word !important; }
            .fallback-link { margin-top: 16px !important; line-height: 18px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; -webkit-font-smoothing: antialiased;">
    <!-- Preheader Hidden Text -->
    <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
        {{ $preheader ?? $subject ?? 'Pemberitahuan Resmi RPK Law Firm' }}
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #f8fafc; padding: 36px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    
                    <!-- Header with High-Res Logo -->
                    <tr>
                        <td align="center" style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #f1f5f9; background-color: #ffffff;">
                            <a href="{{ rtrim((string) config('app.url'), '/') }}" target="_blank" style="display: inline-block;">
                                <img src="{{ rtrim((string) config('app.url'), '/') }}/logo/raf-law-firm-transparent.png" alt="RPK Law Firm" width="160" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" />
                            </a>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td class="mobile-padding" style="padding: 32px 36px 36px 36px;">

                            @if(isset($badgeText))
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 0 14px 0;">
                                <tr>
                                    <td style="padding: 5px 10px; border: 1px solid {{ $badgeBorder ?? '#cbd5e1' }}; border-radius: 999px; background-color: {{ $badgeBg ?? '#f8fafc' }}; color: {{ $badgeColor ?? '#475569' }}; font-size: 10px; font-weight: 700; line-height: 14px; letter-spacing: 0.06em; text-transform: uppercase;">
                                        {{ $badgeText }}
                                    </td>
                                </tr>
                            </table>
                            @endif
                            
                            <!-- Main Title (Clean & Elegant) -->
                            @if(isset($heading))
                            <h1 class="mobile-title" style="margin: 0 0 20px 0; font-size: 19px; font-weight: 700; line-height: 26px; color: #0f172a; letter-spacing: -0.01em;">
                                {{ $heading }}
                            </h1>
                            @endif

                            @if(isset($recipientName) && filled($recipientName))
                            <!-- Greeting -->
                            <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #334155;">
                                Yth. <strong>{{ $recipientName }}</strong>,
                            </p>
                            @endif

                            <!-- Custom Main Content -->
                            @yield('content')

                            <!-- Call to Action Button -->
                            @if(isset($actionUrl) && isset($actionText))
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 32px; margin-bottom: 8px;">
                                <tr>
                                    <td align="center">
                                        <table border="0" cellpadding="0" cellspacing="0" class="action-button-table" style="max-width: 360px; margin: 0 auto;">
                                            <tr>
                                                <td align="center" style="background-color: #0f172a; border-radius: 8px;">
                                                    <a href="{{ $actionUrl }}" target="_blank" class="btn-full" style="display: inline-block; max-width: 100%; box-sizing: border-box; padding: 12px 20px; font-size: 13px; font-weight: 600; line-height: 18px; color: #ffffff; text-decoration: none; border-radius: 8px; letter-spacing: 0.01em; white-space: normal;">
                                                        {{ $actionText }}
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            @endif

                            <!-- Fallback Link -->
                            @if(isset($actionUrl))
                            <p class="fallback-link" style="margin: 18px 0 0 0; font-size: 11px; line-height: 17px; color: #94a3b8; text-align: center;">
                                Jika tombol tidak berfungsi, gunakan <a href="{{ $actionUrl }}" style="color: #475569; font-weight: 600; text-decoration: underline;">Buka tautan alternatif</a>.
                            </p>
                            @endif
                        </td>
                    </tr>

                    @if(!($hideFooter ?? false))
                    <!-- Footer Section -->
                    <tr>
                        <td class="mobile-padding" style="padding: 24px 36px; background-color: #fafbfc; border-top: 1px solid #f1f5f9;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 8px;">
                                        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #334155; letter-spacing: 0.02em;">
                                            RPK LAW FIRM
                                        </p>
                                        <p style="margin: 2px 0 0 0; font-size: 10.5px; color: #64748b;">
                                            Jl. Bukit Nirwana VII, Blok CC.04, Sariwangi, Kabupaten Bandung Barat, Jawa Barat<br>
                                            Telp: 0852 9560 1417 &bull; contact@rpklawoffice.com
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="border-top: 1px solid #f1f5f9; padding-top: 10px;">
                                        <p style="margin: 0; font-size: 9px; line-height: 14px; color: #94a3b8; text-align: justify;">
                                            <strong>CONFIDENTIALITY NOTICE:</strong> Transmisi email ini bersifat rahasia dan memiliki perlindungan hukum (Attorney-Client Privilege). Jika Anda bukan penerima yang sah, mohon beritahukan pengirim dan hapus pesan ini.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    @endif

                </table>
                <!-- End Main Container -->
            </td>
        </tr>
    </table>
</body>
</html>
