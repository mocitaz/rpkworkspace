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
            .btn-full { display: block !important; width: 100% !important; text-align: center !important; }
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
                            <a href="https://app.rpklawoffice.com" target="_blank" style="display: inline-block;">
                                <img src="https://app.rpklawoffice.com/logo/raf-law-firm-transparent.png" alt="RPK Law Firm" width="160" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" />
                            </a>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td class="mobile-padding" style="padding: 32px 36px 36px 36px;">
                            
                            <!-- Main Title (Clean & Elegant) -->
                            @if(isset($heading))
                            <h1 class="mobile-title" style="margin: 0 0 20px 0; font-size: 19px; font-weight: 700; line-height: 26px; color: #0f172a; letter-spacing: -0.01em;">
                                {{ $heading }}
                            </h1>
                            @endif

                            <!-- Greeting -->
                            <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #334155;">
                                Yth. <strong>{{ $recipientName ?? 'Rekan Kerja' }}</strong>,
                            </p>

                            <!-- Custom Main Content -->
                            @yield('content')

                            <!-- Call to Action Button -->
                            @if(isset($actionUrl) && isset($actionText))
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 32px; margin-bottom: 8px;">
                                <tr>
                                    <td align="center">
                                        <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                            <tr>
                                                <td align="center" style="background-color: #0f172a; border-radius: 8px;">
                                                    <a href="{{ $actionUrl }}" target="_blank" class="btn-full" style="display: inline-block; padding: 12px 26px; font-size: 13px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; letter-spacing: 0.01em;">
                                                        {{ $actionText }} &rarr;
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
                            <p style="margin: 20px 0 0 0; font-size: 11px; line-height: 16px; color: #94a3b8; word-break: break-all; text-align: center;">
                                Tautan langsung: <a href="{{ $actionUrl }}" style="color: #64748b; font-weight: 500;">{{ $actionUrl }}</a>
                            </p>
                            @endif
                        </td>
                    </tr>

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
                                            Menara Batavia Lt. 18, Jl. K.H. Mas Mansyur Kav. 126, Jakarta Pusat
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

                </table>
                <!-- End Main Container -->
            </td>
        </tr>
    </table>
</body>
</html>
