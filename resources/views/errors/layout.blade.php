<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>@yield('code') - RPK Law Firm Workspace</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
    <style>
        :root {
            color-scheme: light dark;
            font-family: 'Instrument Sans', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        * { box-sizing: border-box; }
        body {
            min-height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fafafc;
            color: #0f172a;
            padding: 2rem 1.5rem;
        }
        .container {
            width: 100%;
            max-width: 28rem;
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 1rem;
            padding: 2.5rem 2rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 10px 24px rgba(0,0,0,0.02);
            text-align: center;
        }
        .logo-wrap {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
        }
        .logo-wrap img {
            height: 2.5rem;
            width: auto;
        }
        .badge {
            display: inline-block;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 0.6875rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            padding: 0.25rem 0.625rem;
            border-radius: 0.375rem;
            background: #eff6ff;
            color: #1d4ed8;
            margin-bottom: 1rem;
            text-transform: uppercase;
        }
        h1 {
            margin: 0 0 0.5rem 0;
            font-size: 1.375rem;
            font-weight: 700;
            letter-spacing: -0.025em;
            color: #0f172a;
        }
        p {
            margin: 0 0 1.75rem 0;
            color: #64748b;
            font-size: 0.8125rem;
            line-height: 1.6;
        }
        .btn-home {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.375rem;
            height: 2.25rem;
            padding: 0 1.25rem;
            background: #0f172a;
            color: #ffffff;
            border-radius: 0.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.15s ease, transform 0.05s ease;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .btn-home:hover {
            background: #1e293b;
        }
        .btn-home:active {
            transform: scale(0.98);
        }
        .legal-notice {
            margin-top: 2rem;
            padding-top: 1.25rem;
            border-top: 1px solid #f1f5f9;
            font-size: 0.6875rem;
            color: #94a3b8;
        }
        @media (prefers-color-scheme: dark) {
            body {
                background: #0c0d10;
                color: #ffffff;
            }
            .container {
                background: #14161b;
                border-color: rgba(255, 255, 255, 0.08);
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            }
            .logo-wrap img {
                filter: brightness(0) invert(1);
            }
            .badge {
                background: rgba(30, 58, 138, 0.4);
                color: #93c5fd;
            }
            h1 {
                color: #ffffff;
            }
            p {
                color: #a1a1aa;
            }
            .btn-home {
                background: #ffffff;
                color: #0f172a;
            }
            .btn-home:hover {
                background: #f1f5f9;
            }
            .legal-notice {
                border-top-color: rgba(255, 255, 255, 0.05);
                color: #71717a;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo-wrap">
            <img src="/logo/raf-law-firm-transparent.png" alt="RPK Law Firm Logo" />
        </div>
        <div>
            <span class="badge">ERROR @yield('code')</span>
        </div>
        <h1>@yield('title')</h1>
        <p>@yield('message')</p>
        <div>
            <a href="{{ route('home') }}" class="btn-home">
                &larr; Kembali ke RPK Workspace
            </a>
        </div>
        <div class="legal-notice">
            RPK Law Firm Internal Legal Workspace &middot; Kerahasiaan Terjamin
        </div>
    </div>
</body>
</html>
