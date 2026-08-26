<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>@yield('code') - @yield('title') · RPK Law App</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800|jetbrains-mono:500,600" rel="stylesheet" />
    <style>
        :root {
            --bg-base: #fafafc;
            --text-primary: #0f172a;
            --text-secondary: #64748b;
            --text-muted: #94a3b8;
            --num-gradient: linear-gradient(180deg, #0f172a 20%, #64748b 100%);
            --badge-bg: #f1f5f9;
            --badge-border: #e2e8f0;
            --badge-text: #475569;
            --btn-primary-bg: #0f172a;
            --btn-primary-hover: #1e293b;
            --btn-primary-text: #ffffff;
            --btn-primary-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.18);
            --btn-sec-bg: #ffffff;
            --btn-sec-border: #e2e8f0;
            --btn-sec-text: #334155;
            --grid-color: rgba(148, 163, 184, 0.07);
            --glow-color: rgba(59, 130, 246, 0.08);
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --bg-base: #090a0f;
                --text-primary: #f8fafc;
                --text-secondary: #94a3b8;
                --text-muted: #64748b;
                --num-gradient: linear-gradient(180deg, #ffffff 20%, #64748b 100%);
                --badge-bg: rgba(255, 255, 255, 0.05);
                --badge-border: rgba(255, 255, 255, 0.1);
                --badge-text: #cbd5e1;
                --btn-primary-bg: #ffffff;
                --btn-primary-hover: #f1f5f9;
                --btn-primary-text: #090a0f;
                --btn-primary-shadow: 0 10px 25px -5px rgba(255, 255, 255, 0.15);
                --btn-sec-bg: rgba(255, 255, 255, 0.05);
                --btn-sec-border: rgba(255, 255, 255, 0.12);
                --btn-sec-text: #f1f5f9;
                --grid-color: rgba(255, 255, 255, 0.03);
                --glow-color: rgba(96, 165, 250, 0.12);
            }
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--bg-base);
            color: var(--text-primary);
            font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 2rem 1.5rem;
            position: relative;
            overflow-x: hidden;
        }

        /* 1. Subtle Background Grid & Ambient Glow */
        .bg-grid {
            position: fixed;
            inset: 0;
            background-image: 
                linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
                linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
            background-size: 40px 40px;
            mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 80%);
            -webkit-mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 80%);
            pointer-events: none;
            z-index: 0;
        }

        .ambient-glow {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            height: 500px;
            background: var(--glow-color);
            border-radius: 50%;
            filter: blur(120px);
            pointer-events: none;
            z-index: 0;
        }

        /* 2. Simple, Elegant, Open Layout */
        .error-container {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 36rem;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        /* 3. Firm Brand Logo */
        .firm-brand {
            display: inline-flex;
            align-items: center;
            margin-bottom: 2.25rem;
            transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .firm-brand:hover {
            transform: scale(1.02);
            opacity: 0.9;
        }
        .firm-brand img {
            height: 2.75rem;
            width: auto;
            object-fit: contain;
        }
        @media (prefers-color-scheme: dark) {
            .firm-brand img {
                filter: brightness(0) invert(1) drop-shadow(0 2px 8px rgba(255,255,255,0.08));
            }
        }

        /* 4. Giant Clean Numerals */
        .hero-numeral {
            font-family: 'JetBrains Mono', monospace;
            font-size: clamp(5.5rem, 16vw, 9rem);
            font-weight: 800;
            line-height: 0.85;
            letter-spacing: -0.07em;
            background: var(--num-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1.25rem;
            user-select: none;
        }

        /* 5. Minimalist Status Pill */
        .status-pill {
            display: inline-flex;
            align-items: center;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.725rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 0.3rem 0.85rem;
            border-radius: 9999px;
            background: var(--badge-bg);
            border: 1px solid var(--badge-border);
            color: var(--badge-text);
            margin-bottom: 1.25rem;
        }

        /* 6. Typography */
        h1 {
            font-size: clamp(1.5rem, 4vw, 2rem);
            font-weight: 800;
            letter-spacing: -0.035em;
            color: var(--text-primary);
            margin-bottom: 0.625rem;
            line-height: 1.25;
        }

        p {
            font-size: clamp(0.875rem, 2.5vw, 0.95rem);
            color: var(--text-secondary);
            line-height: 1.6;
            max-width: 26rem;
            margin-bottom: 2.25rem;
        }

        /* 7. Action Button Group */
        .actions-group {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            margin-bottom: 3.5rem;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            height: 2.625rem;
            padding: 0 1.375rem;
            border-radius: 0.75rem;
            font-size: 0.8125rem;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
        }

        .btn-primary {
            background: var(--btn-primary-bg);
            color: var(--btn-primary-text);
            box-shadow: var(--btn-primary-shadow);
            border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .btn-primary:hover {
            background: var(--btn-primary-hover);
            transform: translateY(-1px);
        }
        .btn-primary:active {
            transform: translateY(0px);
        }

        .btn-secondary {
            background: var(--btn-sec-bg);
            border: 1px solid var(--btn-sec-border);
            color: var(--btn-sec-text);
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .btn-secondary:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
            transform: translateY(-1px);
        }
        @media (prefers-color-scheme: dark) {
            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.2);
            }
        }
        .btn-secondary:active {
            transform: translateY(0px);
        }

        .btn svg {
            width: 14px;
            height: 14px;
            transition: transform 0.15s ease;
        }
        .btn-primary:hover svg {
            transform: translateX(-2px);
        }

        /* 8. Minimalist Footer */
        .footer-brand {
            font-size: 0.8125rem;
            font-weight: 600;
            color: var(--text-muted);
            letter-spacing: 0.01em;
        }
    </style>
</head>
<body>
    <!-- Subtle Grid & Ambient Glow Background -->
    <div class="bg-grid"></div>
    <div class="ambient-glow"></div>

    <!-- Main Content -->
    <main class="error-container">
        <!-- 1. Law Firm Logo -->
        <a href="{{ route('home') }}" class="firm-brand" title="RPK Law App">
            <img src="/logo/raf-law-firm-transparent.png" alt="RPK Law Firm Logo" onerror="this.onerror=null; this.src='/logo/logo.png';" />
        </a>

        <!-- 2. Giant Clean Numerals -->
        <div class="hero-numeral">@yield('code')</div>

        <!-- 3. Status Pill -->
        <div class="status-pill">
            <span>ERROR @yield('code') &middot; @yield('badge_label', 'SYSTEM EVENT')</span>
        </div>

        <!-- 4. Headline & Message -->
        <h1>@yield('title')</h1>
        <p>@yield('message')</p>

        <!-- 5. Action Buttons -->
        <div class="actions-group">
            <a href="{{ route('home') }}" class="btn btn-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Kembali ke Workspace</span>
            </a>

            <button type="button" onclick="window.location.reload()" class="btn btn-secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                <span>Muat Ulang</span>
            </button>
        </div>

        <!-- 6. Footer -->
        <div class="footer-brand">
            RPK Law App
        </div>
    </main>
</body>
</html>
