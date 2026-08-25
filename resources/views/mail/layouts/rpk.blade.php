<!DOCTYPE html>
<html lang="id" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $subject ?? 'Pemberitahuan RPK Law Firm Workspace' }}</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }
    </style>
    <![endif]-->
    <style type="text/css">
        /* Base Reset */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
        
        /* Interactive Link Styling */
        a { color: #2563eb; text-decoration: none; font-weight: 600; }
        a:hover { text-decoration: underline; }

        /* Responsive Media Query */
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: auto !important; }
            .fluid { max-width: 100% !important; height: auto !important; margin-left: auto !important; margin-right: auto !important; }
            .stack-column, .stack-column-center { display: block !important; width: 100% !important; max-width: 100% !important; direction: ltr !important; }
            .stack-column-center { text-align: center !important; }
            .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
            .mobile-title { font-size: 18px !important; line-height: 24px !important; }
            .btn-full { display: block !important; width: 100% !important; text-align: center !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; -webkit-font-smoothing: antialiased;">
    <!-- Preheader Hidden Text -->
    <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
        {{ $preheader ?? $subject ?? 'Pemberitahuan Resmi dari RPK Law Firm Workspace' }}
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #f8fafc; padding: 32px 0;">
        <tr>
            <td align="center">
                <!-- Main Card Container (Max 600px) -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td align="center" style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #f1f5f9; background-color: #ffffff;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="{{ config('app.url') }}" target="_blank" style="display: inline-block;">
                                            <img src="{{ config('app.url') }}/logo/raf-law-firm-transparent.png" alt="RPK Law Firm Logo" width="180" style="display: block; max-width: 180px; width: 180px; height: auto; border: 0;" />
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 8px;">
                                        <span style="font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #94a3b8;">
                                            LEGAL &amp; CASE MANAGEMENT WORKSPACE
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td class="mobile-padding" style="padding: 32px 36px 36px 36px;">
                            <!-- Priority / Category Badge (Optional) -->
                            @if(isset($badgeText))
                            <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                                <tr>
                                    <td style="background-color: {{ $badgeBg ?? '#f1f5f9' }}; color: {{ $badgeColor ?? '#334155' }}; border: 1px solid {{ $badgeBorder ?? '#e2e8f0' }}; border-radius: 6px; padding: 4px 10px; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
                                        {{ $badgeText }}
                                    </td>
                                </tr>
                            </table>
                            @endif

                            <!-- Main Title -->
                            @if(isset($heading))
                            <h1 class="mobile-title" style="margin: 0 0 16px 0; font-size: 20px; font-weight: 800; line-height: 28px; color: #0f172a; letter-spacing: -0.02em;">
                                {{ $heading }}
                            </h1>
                            @endif

                            <!-- Greeting -->
                            <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #334155;">
                                Yth. <strong>{{ $recipientName ?? 'Rekan Advokat' }}</strong>,
                            </p>

                            <!-- Custom Yielded Main Content -->
                            @yield('content')

                            <!-- Call to Action Button -->
                            @if(isset($actionUrl) && isset($actionText))
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 28px; margin-bottom: 8px;">
                                <tr>
                                    <td align="center">
                                        <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                            <tr>
                                                <td align="center" style="background-color: #0f172a; border-radius: 10px;">
                                                    <a href="{{ $actionUrl }}" target="_blank" class="btn-full" style="display: inline-block; padding: 13px 28px; font-size: 13px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px; letter-spacing: 0.02em;">
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
                            <p style="margin: 24px 0 0 0; font-size: 11px; line-height: 18px; color: #94a3b8; word-break: break-all; text-align: center;">
                                Jika tombol di atas tidak berfungsi, salin dan buka tautan berikut di browser Anda:<br>
                                <a href="{{ $actionUrl }}" style="color: #64748b; font-weight: 500;">{{ $actionUrl }}</a>
                            </p>
                            @endif
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td class="mobile-padding" style="padding: 24px 36px 32px 36px; background-color: #fafbfc; border-top: 1px solid #f1f5f9;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 12px;">
                                        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #475569; letter-spacing: 0.02em;">
                                            RPK LAW FIRM (RAF &amp; PARTNERS KONSULTAN)
                                        </p>
                                        <p style="margin: 3px 0 0 0; font-size: 10px; color: #94a3b8; line-height: 16px;">
                                            Menara Batavia Lt. 18, Jl. K.H. Mas Mansyur Kav. 126, Jakarta Pusat 10220
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="border-top: 1px solid #edf2f7; padding-top: 12px;">
                                        <p style="margin: 0; font-size: 9px; line-height: 14px; color: #94a3b8; text-align: justify;">
                                            <strong>CONFIDENTIALITY &amp; PRIVILEGE NOTICE:</strong> Informasi yang termuat dalam transmisi email ini bersifat rahasia dan memiliki perlindungan hak istimewa hubungan Advokat-Klien (Attorney-Client Privilege) berdasarkan Kode Etik Advokat Indonesia dan peraturan perundang-undangan yang berlaku. Jika Anda bukan penerima yang dituju, dilarang menyalin, menyebarluaskan, atau mengambil tindakan berdasarkan informasi ini.
                                        </p>
                                        <p style="margin: 8px 0 0 0; font-size: 9.5px; color: #cbd5e1; text-align: center;">
                                            &copy; {{ date('Y') }} RPK Law Firm Workspace. Hak cipta dilindungi undang-undang.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
                <!-- End Main Card Container -->
            </td>
        </tr>
    </table>
</body>
</html>
