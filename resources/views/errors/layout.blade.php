<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>@yield('code') - @yield('title') · RPK Law App</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800|jetbrains-mono:500,700" rel="stylesheet" />
    <style>
        :root {
            --bg-base: #f8fafc;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --text-muted: #94a3b8;
            --accent-blue: #2563eb;
            --accent-cyan: #06b6d4;
            --accent-glow: rgba(37, 99, 235, 0.16);
            --num-gradient: linear-gradient(180deg, #1e293b 0%, #64748b 100%);
            --num-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
            --badge-bg: rgba(239, 246, 255, 0.95);
            --badge-border: rgba(191, 219, 254, 0.8);
            --badge-text: #1d4ed8;
            --emblem-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.85));
            --emblem-border: rgba(255, 255, 255, 0.9);
            --btn-primary-bg: #0f172a;
            --btn-primary-hover: #1e293b;
            --btn-primary-text: #ffffff;
            --btn-primary-shadow: 0 12px 24px -6px rgba(15, 23, 42, 0.25);
            --btn-sec-bg: rgba(255, 255, 255, 0.85);
            --btn-sec-border: rgba(203, 213, 225, 0.8);
            --btn-sec-text: #334155;
            --quick-link-bg: rgba(255, 255, 255, 0.6);
            --quick-link-border: rgba(226, 232, 240, 0.8);
            --quick-link-text: #64748b;
            --grid-color: rgba(148, 163, 184, 0.08);
            --orb-1: rgba(37, 99, 235, 0.12);
            --orb-2: rgba(6, 182, 212, 0.10);
            --platform-glow: radial-gradient(ellipse at center, rgba(37, 99, 235, 0.2) 0%, rgba(6, 182, 212, 0.06) 50%, transparent 75%);
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --bg-base: #090a0f;
                --text-primary: #f8fafc;
                --text-secondary: #94a3b8;
                --text-muted: #64748b;
                --accent-blue: #60a5fa;
                --accent-cyan: #38bdf8;
                --accent-glow: rgba(96, 165, 250, 0.22);
                --num-gradient: linear-gradient(180deg, #ffffff 0%, #94a3b8 100%);
                --num-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                --badge-bg: rgba(30, 58, 138, 0.35);
                --badge-border: rgba(96, 165, 250, 0.3);
                --badge-text: #93c5fd;
                --emblem-bg: linear-gradient(135deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.9));
                --emblem-border: rgba(255, 255, 255, 0.12);
                --btn-primary-bg: #ffffff;
                --btn-primary-hover: #f1f5f9;
                --btn-primary-text: #090a0f;
                --btn-primary-shadow: 0 12px 28px -6px rgba(255, 255, 255, 0.2);
                --btn-sec-bg: rgba(255, 255, 255, 0.06);
                --btn-sec-border: rgba(255, 255, 255, 0.12);
                --btn-sec-text: #f1f5f9;
                --quick-link-bg: rgba(255, 255, 255, 0.04);
                --quick-link-border: rgba(255, 255, 255, 0.08);
                --quick-link-text: #94a3b8;
                --grid-color: rgba(255, 255, 255, 0.03);
                --orb-1: rgba(59, 130, 246, 0.18);
                --orb-2: rgba(56, 189, 248, 0.12);
                --platform-glow: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.28) 0%, rgba(56, 189, 248, 0.12) 50%, transparent 75%);
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
            padding: 2.5rem 1.5rem;
            position: relative;
            overflow-x: hidden;
            perspective: 1200px;
        }

        /* 1. Ambient Background Grid & Floating Lights */
        .bg-grid {
            position: fixed;
            inset: 0;
            background-image: 
                linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
                linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
            background-size: 36px 36px;
            mask-image: radial-gradient(circle at 50% 50%, black 50%, transparent 85%);
            -webkit-mask-image: radial-gradient(circle at 50% 50%, black 50%, transparent 85%);
            pointer-events: none;
            z-index: 0;
        }

        .ambient-light {
            position: fixed;
            border-radius: 50%;
            filter: blur(100px);
            pointer-events: none;
            z-index: 0;
            opacity: 0.85;
            animation: lightFloat 18s ease-in-out infinite alternate;
        }
        .light-1 {
            width: 500px;
            height: 500px;
            background: var(--orb-1);
            top: -15%;
            left: 20%;
        }
        .light-2 {
            width: 460px;
            height: 460px;
            background: var(--orb-2);
            bottom: -15%;
            right: 20%;
            animation-delay: -7s;
        }
        @keyframes lightFloat {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(35px, -25px) scale(1.1); }
            100% { transform: translate(-25px, 35px) scale(0.95); }
        }

        /* 2. Open Hero Layout (No Container Box) */
        .error-layout {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 44rem;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            animation: heroFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
            transform-style: preserve-3d;
        }

        @keyframes heroFadeIn {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        /* 3. Firm Brand Header */
        .firm-brand {
            display: inline-flex;
            align-items: center;
            margin-bottom: 2rem;
            transition: transform 0.2s ease;
        }
        .firm-brand:hover {
            transform: scale(1.03);
        }
        .firm-brand img {
            height: 2.75rem;
            width: auto;
            object-fit: contain;
        }
        @media (prefers-color-scheme: dark) {
            .firm-brand img {
                filter: brightness(0) invert(1) drop-shadow(0 2px 8px rgba(255,255,255,0.1));
            }
        }

        /* 4. Interactive 3D Kinetic Sculpture */
        .kinetic-sculpture {
            position: relative;
            width: 180px;
            height: 180px;
            margin: 0 auto 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transform-style: preserve-3d;
            transition: transform 0.2s cubic-bezier(0.2, 0, 0.2, 1);
        }

        /* Ambient glowing floor under sculpture */
        .stage-glow-floor {
            position: absolute;
            bottom: -15px;
            width: 220px;
            height: 70px;
            background: var(--platform-glow);
            border-radius: 50%;
            filter: blur(12px);
            pointer-events: none;
            animation: floorPulse 4s ease-in-out infinite alternate;
        }

        @keyframes floorPulse {
            0% { transform: scale(0.9); opacity: 0.7; }
            100% { transform: scale(1.1); opacity: 1; }
        }

        /* Outer Orbit Ring with glowing satellite */
        .orbit-ring {
            position: absolute;
            inset: 10px;
            border-radius: 50%;
            border: 1.5px dashed var(--badge-border);
            animation: spin3D 20s linear infinite;
        }

        .orbit-satellite {
            position: absolute;
            top: -4px;
            left: 50%;
            margin-left: -4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--accent-cyan);
            box-shadow: 0 0 12px var(--accent-cyan);
        }

        .inner-aura {
            position: absolute;
            inset: 28px;
            border-radius: 50%;
            background: var(--accent-glow);
            border: 1px solid var(--badge-border);
            animation: auraPulse 3s ease-in-out infinite alternate;
        }

        /* Center 3D Floating Prism Box */
        .prism-box {
            position: relative;
            z-index: 2;
            width: 76px;
            height: 76px;
            border-radius: 1.25rem;
            background: var(--emblem-bg);
            border: 1px solid var(--emblem-border);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--accent-blue);
            box-shadow: 0 16px 36px -8px var(--accent-glow), 0 0 20px rgba(37, 99, 235, 0.12);
            animation: prismLevitate 4.5s ease-in-out infinite;
        }

        .prism-box svg {
            width: 36px;
            height: 36px;
            stroke-width: 1.8;
        }

        @keyframes spin3D {
            100% { transform: rotate(360deg); }
        }
        @keyframes auraPulse {
            0% { transform: scale(0.92); opacity: 0.6; }
            100% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes prismLevitate {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(2deg); }
        }

        /* 5. Giant Stylized 3D Numerals */
        .hero-numeral {
            font-family: 'JetBrains Mono', monospace;
            font-size: clamp(4.5rem, 12vw, 7.5rem);
            font-weight: 800;
            line-height: 0.9;
            letter-spacing: -0.06em;
            background: var(--num-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: var(--num-shadow);
            margin-bottom: 0.75rem;
            user-select: none;
            position: relative;
        }

        /* 6. Monospace Status LED Pill */
        .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.725rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 0.35rem 0.9rem;
            border-radius: 9999px;
            background: var(--badge-bg);
            border: 1px solid var(--badge-border);
            color: var(--badge-text);
            margin-bottom: 1.25rem;
            box-shadow: 0 2px 10px -2px var(--accent-glow);
        }

        .status-led {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--accent-blue);
            box-shadow: 0 0 8px var(--accent-blue);
            animation: ledBlink 2s ease-in-out infinite;
        }

        @keyframes ledBlink {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.35; transform: scale(0.85); }
        }

        /* 7. Typography */
        h1 {
            font-size: clamp(1.6rem, 4vw, 2.25rem);
            font-weight: 800;
            letter-spacing: -0.035em;
            color: var(--text-primary);
            margin-bottom: 0.75rem;
            line-height: 1.25;
        }

        p {
            font-size: clamp(0.9rem, 2.5vw, 1rem);
            color: var(--text-secondary);
            line-height: 1.65;
            max-width: 32rem;
            margin-bottom: 2.25rem;
        }

        /* 8. Action Buttons */
        .actions-group {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 0.85rem;
            margin-bottom: 2.25rem;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            height: 2.75rem;
            padding: 0 1.5rem;
            border-radius: 0.85rem;
            font-size: 0.825rem;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
        }

        .btn-primary {
            background: var(--btn-primary-bg);
            color: var(--btn-primary-text);
            box-shadow: var(--btn-primary-shadow);
            border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .btn-primary:hover {
            background: var(--btn-primary-hover);
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 16px 32px -6px rgba(15, 23, 42, 0.35);
        }
        .btn-primary:active {
            transform: translateY(0px) scale(0.98);
        }

        .btn-secondary {
            background: var(--btn-sec-bg);
            border: 1px solid var(--btn-sec-border);
            color: var(--btn-sec-text);
            backdrop-filter: blur(12px);
        }
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.95);
            border-color: rgba(148, 163, 184, 0.9);
            transform: translateY(-1px);
        }
        @media (prefers-color-scheme: dark) {
            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.12);
                border-color: rgba(255, 255, 255, 0.25);
            }
        }
        .btn-secondary:active {
            transform: translateY(0px) scale(0.98);
        }

        .btn svg {
            width: 15px;
            height: 15px;
            transition: transform 0.2s ease;
        }
        .btn-primary:hover svg {
            transform: translateX(-3px);
        }

        /* 9. Quick Navigation Pills */
        .quick-nav {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-bottom: 2.5rem;
        }
        .quick-nav-link {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--quick-link-text);
            background: var(--quick-link-bg);
            border: 1px solid var(--quick-link-border);
            padding: 0.35rem 0.85rem;
            border-radius: 9999px;
            text-decoration: none;
            backdrop-filter: blur(8px);
            transition: all 0.15s ease;
        }
        .quick-nav-link:hover {
            color: var(--text-primary);
            border-color: var(--accent-blue);
            transform: translateY(-1px);
        }

        /* 10. Minimalist Footer */
        .footer-brand {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.775rem;
            font-weight: 600;
            color: var(--text-muted);
            letter-spacing: 0.02em;
        }

        .status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background-color: #10b981;
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }
    </style>
</head>
<body>
    <!-- Background Ambient Grid -->
    <div class="bg-grid"></div>

    <!-- Floating Ambient Lights -->
    <div class="ambient-light light-1"></div>
    <div class="ambient-light light-2"></div>

    <!-- Open Hero Layout (Container-less) -->
    <main class="error-layout" id="errorLayout">
        <!-- 1. Law Firm Brand -->
        <a href="{{ route('home') }}" class="firm-brand" title="RPK Law App">
            <img src="/logo/raf-law-firm-transparent.png" alt="RPK Law Firm Logo" onerror="this.onerror=null; this.src='/logo/logo.png';" />
        </a>

        <!-- 2. 3D Kinetic Hologram Sculpture -->
        <div class="kinetic-sculpture" id="sculpture">
            <div class="stage-glow-floor"></div>
            <div class="orbit-ring">
                <div class="orbit-satellite"></div>
            </div>
            <div class="inner-aura"></div>
            <div class="prism-box">
                @yield('icon')
            </div>
        </div>

        <!-- 3. Giant Stylized 3D Numerals -->
        <div class="hero-numeral">@yield('code')</div>

        <!-- 4. Status Badge Pill -->
        <div class="status-pill">
            <span class="status-led"></span>
            <span>ERROR @yield('code') &middot; @yield('badge_label', 'SYSTEM EVENT')</span>
        </div>

        <!-- 5. Headline & Description -->
        <h1>@yield('title')</h1>
        <p>@yield('message')</p>

        <!-- 6. Action Button Group -->
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

        <!-- 7. Quick Jump Links -->
        <div class="quick-nav">
            <a href="{{ route('dashboard') }}" class="quick-nav-link">Dashboard</a>
            <a href="{{ url('/matters') }}" class="quick-nav-link">Perkara</a>
            <a href="{{ url('/clients') }}" class="quick-nav-link">Klien</a>
            <a href="{{ url('/documents') }}" class="quick-nav-link">Dokumen</a>
        </div>

        <!-- 8. Minimalist Footer -->
        <div class="footer-brand">
            <span class="status-dot"></span>
            <span>RPK Law App</span>
        </div>
    </main>

    <!-- Interactive 3D Parallax Script -->
    <script>
        (function() {
            const layout = document.getElementById('errorLayout');
            const sculpture = document.getElementById('sculpture');
            if (!layout || !sculpture) return;

            window.addEventListener('mousemove', (e) => {
                const xPct = (e.clientX / window.innerWidth - 0.5);
                const yPct = (e.clientY / window.innerHeight - 0.5);

                const rotX = yPct * -16;
                const rotY = xPct * 16;

                sculpture.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03)`;
            });

            window.addEventListener('mouseleave', () => {
                sculpture.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        })();
    </script>
</body>
</html>
