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
            --accent-glow: rgba(37, 99, 235, 0.15);
            --holo-border: rgba(37, 99, 235, 0.25);
            --holo-bg: rgba(255, 255, 255, 0.85);
            --badge-bg: rgba(239, 246, 255, 0.95);
            --badge-border: rgba(191, 219, 254, 0.9);
            --badge-text: #1d4ed8;
            --btn-primary-bg: #0f172a;
            --btn-primary-hover: #1e293b;
            --btn-primary-text: #ffffff;
            --btn-primary-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.25);
            --btn-sec-bg: rgba(255, 255, 255, 0.9);
            --btn-sec-border: rgba(203, 213, 225, 0.8);
            --btn-sec-text: #334155;
            --grid-color: rgba(148, 163, 184, 0.08);
            --code-text: rgba(15, 23, 42, 0.06);
            --stage-glow: radial-gradient(ellipse at center, rgba(37, 99, 235, 0.14) 0%, rgba(6, 182, 212, 0.06) 45%, transparent 70%);
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
                --holo-border: rgba(96, 165, 250, 0.3);
                --holo-bg: rgba(18, 22, 34, 0.8);
                --badge-bg: rgba(30, 58, 138, 0.35);
                --badge-border: rgba(96, 165, 250, 0.3);
                --badge-text: #93c5fd;
                --btn-primary-bg: #ffffff;
                --btn-primary-hover: #f1f5f9;
                --btn-primary-text: #090a0f;
                --btn-primary-shadow: 0 12px 30px -6px rgba(255, 255, 255, 0.2);
                --btn-sec-bg: rgba(255, 255, 255, 0.06);
                --btn-sec-border: rgba(255, 255, 255, 0.12);
                --btn-sec-text: #f1f5f9;
                --grid-color: rgba(255, 255, 255, 0.03);
                --code-text: rgba(255, 255, 255, 0.04);
                --stage-glow: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.22) 0%, rgba(56, 189, 248, 0.1) 45%, transparent 70%);
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
            opacity: 0.8;
            animation: lightFloat 16s ease-in-out infinite alternate;
        }
        .light-1 {
            width: 480px;
            height: 480px;
            background: rgba(37, 99, 235, 0.12);
            top: -15%;
            left: 10%;
        }
        .light-2 {
            width: 450px;
            height: 450px;
            background: rgba(6, 182, 212, 0.10);
            bottom: -15%;
            right: 10%;
            animation-delay: -6s;
        }
        @keyframes lightFloat {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(30px, -20px) scale(1.08); }
            100% { transform: translate(-20px, 30px) scale(0.95); }
        }

        /* 2. Open Canvas Layout (No White Container Box) */
        .error-canvas {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 68rem;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1.15fr;
            align-items: center;
            gap: 3.5rem;
            animation: canvasFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes canvasFadeIn {
            0% { opacity: 0; transform: translateY(24px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        /* 3. Left: Character Stage with 3D Holographic Elements */
        .character-stage {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 420px;
            transform-style: preserve-3d;
        }

        /* Radial Glow Stage Platform under character */
        .stage-platform {
            position: absolute;
            bottom: 5px;
            width: 320px;
            height: 90px;
            background: var(--stage-glow);
            border-radius: 50%;
            pointer-events: none;
            filter: blur(10px);
            animation: stagePulse 4s ease-in-out infinite alternate;
        }

        @keyframes stagePulse {
            0% { transform: scale(0.92); opacity: 0.7; }
            100% { transform: scale(1.08); opacity: 1; }
        }

        /* Anime Character Image with Floating Animation */
        .character-img-wrapper {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 340px;
            aspect-ratio: 1 / 1;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: characterFloat 5s ease-in-out infinite;
            filter: drop-shadow(0 20px 35px rgba(15, 23, 42, 0.15));
        }

        @keyframes characterFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(1deg); }
        }

        .character-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            user-select: none;
            pointer-events: none;
            border-radius: 1.5rem;
        }

        /* Floating Holographic Chips */
        .holo-chip {
            position: absolute;
            z-index: 3;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.4rem 0.85rem;
            border-radius: 0.75rem;
            background: var(--holo-bg);
            border: 1px solid var(--holo-border);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 0 12px var(--accent-glow);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.675rem;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: 0.04em;
            text-transform: uppercase;
            animation: chipFloat 6s ease-in-out infinite;
            white-space: nowrap;
        }

        .holo-chip-top {
            top: 20px;
            right: 0px;
            animation-delay: -1.5s;
        }
        .holo-chip-bottom {
            bottom: 30px;
            left: -10px;
            animation-delay: -3s;
        }

        .holo-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--accent-cyan);
            box-shadow: 0 0 8px var(--accent-cyan);
            animation: dotBlink 1.8s ease-in-out infinite;
        }

        @keyframes chipFloat {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes dotBlink {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(0.8); }
        }

        /* 4. Right: Content Column */
        .content-col {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
        }

        /* Giant Background Code Watermark */
        .bg-code-watermark {
            position: absolute;
            top: -2.5rem;
            left: -1.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14rem;
            font-weight: 800;
            line-height: 0.8;
            letter-spacing: -0.06em;
            color: var(--code-text);
            user-select: none;
            pointer-events: none;
            z-index: 0;
        }

        .content-inner {
            position: relative;
            z-index: 1;
            width: 100%;
        }

        /* Firm Logo Header */
        .firm-logo-link {
            display: inline-flex;
            align-items: center;
            margin-bottom: 1.5rem;
            transition: transform 0.2s ease;
        }
        .firm-logo-link:hover {
            transform: translateY(-2px);
        }
        .firm-logo-link img {
            height: 2.25rem;
            width: auto;
            object-fit: contain;
        }
        @media (prefers-color-scheme: dark) {
            .firm-logo-link img {
                filter: brightness(0) invert(1) drop-shadow(0 2px 8px rgba(255,255,255,0.1));
            }
        }

        /* Status Badge Pill */
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.725rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 0.35rem 0.85rem;
            border-radius: 9999px;
            background: var(--badge-bg);
            border: 1px solid var(--badge-border);
            color: var(--badge-text);
            margin-bottom: 1rem;
            box-shadow: 0 2px 10px -2px var(--accent-glow);
        }

        .status-badge-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--accent-blue);
            box-shadow: 0 0 8px var(--accent-blue);
            animation: dotBlink 2s ease-in-out infinite;
        }

        /* Headline & Paragraph */
        h1 {
            font-size: 2.25rem;
            font-weight: 800;
            letter-spacing: -0.035em;
            color: var(--text-primary);
            margin-bottom: 0.85rem;
            line-height: 1.2;
        }

        p {
            font-size: 0.975rem;
            color: var(--text-secondary);
            line-height: 1.65;
            max-width: 28rem;
            margin-bottom: 2.25rem;
        }

        /* Action Buttons */
        .actions-group {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.85rem;
            margin-bottom: 2.5rem;
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

        /* Minimalist Footer */
        .footer-brand-note {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.775rem;
            font-weight: 600;
            color: var(--text-muted);
            letter-spacing: 0.02em;
        }

        .footer-status-indicator {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background-color: #10b981;
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }

        /* Mobile Responsiveness */
        @media (max-width: 860px) {
            .error-canvas {
                grid-template-columns: 1fr;
                gap: 2rem;
                text-align: center;
            }
            .content-col {
                align-items: center;
                text-align: center;
            }
            .bg-code-watermark {
                left: 50%;
                transform: translateX(-50%);
                font-size: 10rem;
                top: -1.5rem;
            }
            .character-stage {
                min-height: 280px;
            }
            .character-img-wrapper {
                max-width: 260px;
            }
            .actions-group {
                justify-content: center;
            }
            h1 {
                font-size: 1.75rem;
            }
            p {
                font-size: 0.9rem;
            }
        }
    </style>
</head>
<body>
    <!-- Background Ambient Grid -->
    <div class="bg-grid"></div>

    <!-- Floating Ambient Lights -->
    <div class="ambient-light light-1"></div>
    <div class="ambient-light light-2"></div>

    <!-- Main Container-less Open Canvas -->
    <main class="error-canvas" id="errorCanvas">
        <!-- 1. Left: 3D Holographic Anime Stage -->
        <div class="character-stage" id="characterStage">
            <div class="stage-platform"></div>

            <!-- Floating Holographic Badge 1 -->
            <div class="holo-chip holo-chip-top">
                <span class="holo-dot"></span>
                <span>@yield('chip_label', 'CASE FILE #24097')</span>
            </div>

            <!-- Anime Character -->
            <div class="character-img-wrapper" id="characterWrapper">
                @sectionMissing('character_image')
                    <img 
                        src="/images/anime-404-character.png" 
                        alt="RPK Legal Tech Character" 
                        class="character-img"
                    />
                @else
                    @yield('character_image')
                @endif
            </div>

            <!-- Floating Holographic Badge 2 -->
            <div class="holo-chip holo-chip-bottom">
                <span class="holo-dot" style="background: var(--accent-blue); box-shadow: 0 0 8px var(--accent-blue);"></span>
                <span>RPK LAW APP &middot; SYSTEM ONLINE</span>
            </div>
        </div>

        <!-- 2. Right: Content & Action Controls -->
        <div class="content-col">
            <!-- Background Giant Number Watermark -->
            <div class="bg-code-watermark">@yield('code')</div>

            <div class="content-inner">
                <!-- Law Firm Logo -->
                <a href="{{ route('home') }}" class="firm-logo-link" title="Kembali ke Dashboard">
                    <img src="/logo/raf-law-firm-transparent.png" alt="RPK Law Firm Logo" onerror="this.onerror=null; this.src='/logo/logo.png';" />
                </a>

                <!-- Status Badge -->
                <div>
                    <div class="status-badge">
                        <span class="status-badge-dot"></span>
                        <span>ERROR @yield('code') &middot; @yield('badge_label', 'STATUS EVENT')</span>
                    </div>
                </div>

                <!-- Error Headline & Subtitle -->
                <h1>@yield('title')</h1>
                <p>@yield('message')</p>

                <!-- Action Button Group -->
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

                <!-- Minimalist Footer -->
                <div class="footer-brand-note">
                    <span class="footer-status-indicator"></span>
                    <span>RPK Law App</span>
                </div>
            </div>
        </div>
    </main>

    <!-- Parallax 3D Mouse Movement Script -->
    <script>
        (function() {
            const stage = document.getElementById('characterStage');
            const wrapper = document.getElementById('characterWrapper');
            if (!stage || !wrapper) return;

            window.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;

                wrapper.style.transform = `translate3d(${x * 0.8}px, ${y * 0.8}px, 0px) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
            });

            window.addEventListener('mouseleave', () => {
                wrapper.style.transform = 'translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)';
            });
        })();
    </script>
</body>
</html>
