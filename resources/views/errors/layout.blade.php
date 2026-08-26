<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>@yield('code') - @yield('title') · RPK Law Firm Workspace</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700|jetbrains-mono:500,600" rel="stylesheet" />
    <style>
        :root {
            --bg-base: #f8fafc;
            --card-bg: rgba(255, 255, 255, 0.82);
            --card-border: rgba(226, 232, 240, 0.8);
            --card-inner-border: rgba(255, 255, 255, 0.9);
            --text-primary: #0f172a;
            --text-secondary: #64748b;
            --text-tertiary: #94a3b8;
            --accent-blue: #2563eb;
            --accent-glow: rgba(37, 99, 235, 0.15);
            --badge-bg: rgba(239, 246, 255, 0.9);
            --badge-border: rgba(191, 219, 254, 0.8);
            --badge-text: #1d4ed8;
            --btn-primary-bg: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            --btn-primary-text: #ffffff;
            --btn-primary-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.25);
            --btn-sec-bg: rgba(255, 255, 255, 0.8);
            --btn-sec-border: rgba(203, 213, 225, 0.7);
            --btn-sec-text: #334155;
            --grid-line: rgba(148, 163, 184, 0.08);
            --orb-1: rgba(59, 130, 246, 0.12);
            --orb-2: rgba(99, 102, 241, 0.10);
            --orb-3: rgba(16, 185, 129, 0.08);
            --watermark: rgba(15, 23, 42, 0.03);
            --card-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.6) inset;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --bg-base: #090a0d;
                --card-bg: rgba(18, 20, 26, 0.78);
                --card-border: rgba(255, 255, 255, 0.08);
                --card-inner-border: rgba(255, 255, 255, 0.04);
                --text-primary: #f8fafc;
                --text-secondary: #94a3b8;
                --text-tertiary: #64748b;
                --accent-blue: #60a5fa;
                --accent-glow: rgba(96, 165, 250, 0.18);
                --badge-bg: rgba(30, 58, 138, 0.35);
                --badge-border: rgba(96, 165, 250, 0.25);
                --badge-text: #93c5fd;
                --btn-primary-bg: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
                --btn-primary-text: #0f172a;
                --btn-primary-shadow: 0 10px 25px -5px rgba(255, 255, 255, 0.18);
                --btn-sec-bg: rgba(255, 255, 255, 0.05);
                --btn-sec-border: rgba(255, 255, 255, 0.1);
                --btn-sec-text: #e2e8f0;
                --grid-line: rgba(255, 255, 255, 0.03);
                --orb-1: rgba(59, 130, 246, 0.18);
                --orb-2: rgba(139, 92, 246, 0.14);
                --orb-3: rgba(16, 185, 129, 0.10);
                --watermark: rgba(255, 255, 255, 0.02);
                --card-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
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
            padding: 1.5rem;
            position: relative;
            overflow-x: hidden;
            perspective: 1200px;
        }

        /* 1. Animated Ambient Grid Background */
        .bg-grid {
            position: fixed;
            inset: 0;
            background-image: 
                linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
                linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
            background-size: 32px 32px;
            mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 80%);
            -webkit-mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 80%);
            pointer-events: none;
            z-index: 0;
        }

        /* 2. Floating 3D Ambient Orbs */
        .orb {
            position: fixed;
            border-radius: 50%;
            filter: blur(80px);
            pointer-events: none;
            z-index: 0;
            opacity: 0.85;
            animation: orbFloat 18s ease-in-out infinite alternate;
        }
        .orb-1 {
            width: 420px;
            height: 420px;
            background: var(--orb-1);
            top: -10%;
            left: 15%;
            animation-duration: 16s;
        }
        .orb-2 {
            width: 380px;
            height: 380px;
            background: var(--orb-2);
            bottom: -5%;
            right: 15%;
            animation-duration: 20s;
            animation-delay: -5s;
        }
        .orb-3 {
            width: 300px;
            height: 300px;
            background: var(--orb-3);
            top: 40%;
            right: 5%;
            animation-duration: 14s;
            animation-delay: -8s;
        }

        @keyframes orbFloat {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(40px, -30px) scale(1.1); }
            100% { transform: translate(-30px, 40px) scale(0.95); }
        }

        /* 3. Main 3D Interactive Card */
        .card-wrapper {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 32rem;
            transform-style: preserve-3d;
            transition: transform 0.2s cubic-bezier(0.2, 0, 0.2, 1);
            animation: cardEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardEntrance {
            0% {
                opacity: 0;
                transform: translateY(30px) scale(0.96) rotateX(6deg);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1) rotateX(0deg);
            }
        }

        .card {
            position: relative;
            background: var(--card-bg);
            backdrop-filter: blur(28px) saturate(190%);
            -webkit-backdrop-filter: blur(28px) saturate(190%);
            border: 1px solid var(--card-border);
            border-radius: 1.5rem;
            padding: 2.75rem 2.25rem 2.25rem;
            text-align: center;
            box-shadow: var(--card-shadow);
            overflow: hidden;
        }

        /* Glare effect on mouse hover */
        .card-glare {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.12) 0%, transparent 60%);
            pointer-events: none;
            z-index: 1;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .card-wrapper:hover .card-glare {
            opacity: 1;
        }

        /* Big Watermark Number */
        .watermark-number {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -55%);
            font-family: 'JetBrains Mono', monospace;
            font-size: 15rem;
            font-weight: 800;
            line-height: 1;
            color: var(--watermark);
            user-select: none;
            pointer-events: none;
            z-index: 0;
            letter-spacing: -0.05em;
        }

        .card-content {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* Firm Logo Header */
        .firm-brand {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;
            transition: transform 0.3s ease;
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

        /* 4. Hero 3D Holographic Emblem */
        .emblem-container {
            position: relative;
            width: 88px;
            height: 88px;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Concentric animated pulse rings */
        .ring-outer {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: 1.5px dashed var(--badge-border);
            animation: spinClockwise 24s linear infinite;
        }
        .ring-inner {
            position: absolute;
            inset: 8px;
            border-radius: 50%;
            background: var(--accent-glow);
            border: 1px solid var(--badge-border);
            animation: pulseGlow 3s ease-in-out infinite alternate;
        }

        .emblem-icon-box {
            position: relative;
            z-index: 2;
            width: 52px;
            height: 52px;
            border-radius: 1rem;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.8));
            border: 1px solid rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--accent-blue);
            box-shadow: 0 10px 25px -5px var(--accent-glow), 0 2px 6px rgba(0,0,0,0.05);
            animation: iconFloat 4s ease-in-out infinite;
        }
        @media (prefers-color-scheme: dark) {
            .emblem-icon-box {
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.8));
                border-color: rgba(255, 255, 255, 0.12);
                box-shadow: 0 10px 25px -5px var(--accent-glow), 0 0 15px rgba(96, 165, 250, 0.2);
            }
        }

        .emblem-icon-box svg {
            width: 26px;
            height: 26px;
            stroke-width: 2;
        }

        /* Orbiting Satellite Dot */
        .satellite {
            position: absolute;
            top: 2px;
            left: 50%;
            width: 7px;
            height: 7px;
            margin-left: -3.5px;
            border-radius: 50%;
            background: var(--accent-blue);
            box-shadow: 0 0 10px var(--accent-blue);
        }

        @keyframes spinClockwise {
            100% { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
            0% { transform: scale(0.95); opacity: 0.6; }
            100% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes iconFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-5px) rotate(2deg); }
        }

        /* 5. Monospace Status Badge */
        .badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.725rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 0.325rem 0.85rem;
            border-radius: 9999px;
            background: var(--badge-bg);
            border: 1px solid var(--badge-border);
            color: var(--badge-text);
            margin-bottom: 1.25rem;
            box-shadow: 0 2px 8px -2px var(--accent-glow);
        }

        .badge-led {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--accent-blue);
            box-shadow: 0 0 8px var(--accent-blue);
            animation: ledBlink 2s ease-in-out infinite;
        }

        @keyframes ledBlink {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.85); }
        }

        /* 6. Typography */
        h1 {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.03em;
            color: var(--text-primary);
            margin-bottom: 0.625rem;
            line-height: 1.3;
        }

        p {
            font-size: 0.875rem;
            color: var(--text-secondary);
            line-height: 1.65;
            max-width: 24rem;
            margin-bottom: 2rem;
        }

        /* 7. Action Button Group */
        .actions-group {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            width: 100%;
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
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 15px 30px -8px rgba(15, 23, 42, 0.35);
        }
        .btn-primary:active {
            transform: translateY(0px) scale(0.98);
        }

        .btn-secondary {
            background: var(--btn-sec-bg);
            border: 1px solid var(--btn-sec-border);
            color: var(--btn-sec-text);
            backdrop-filter: blur(10px);
        }
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.95);
            border-color: rgba(148, 163, 184, 0.8);
            transform: translateY(-1px);
        }
        @media (prefers-color-scheme: dark) {
            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.2);
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

        /* 8. Footer Legal Note */
        .card-footer-note {
            margin-top: 2.25rem;
            padding-top: 1.25rem;
            border-top: 1px solid var(--card-inner-border);
            width: 100%;
            font-size: 0.6875rem;
            font-weight: 500;
            color: var(--text-tertiary);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
        }
        .card-footer-note svg {
            width: 12px;
            height: 12px;
            opacity: 0.7;
        }

        @media (max-width: 480px) {
            .card {
                padding: 2.25rem 1.5rem 1.75rem;
                border-radius: 1.25rem;
            }
            .watermark-number {
                font-size: 11rem;
            }
            .actions-group {
                flex-direction: column;
            }
            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <!-- Background Ambient Grid -->
    <div class="bg-grid"></div>

    <!-- 3D Floating Mesh Orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <!-- 3D Interactive Card Wrapper -->
    <div class="card-wrapper" id="cardWrapper">
        <div class="card" id="card">
            <div class="card-glare"></div>

            <!-- Giant Watermark Error Code -->
            <div class="watermark-number">@yield('code')</div>

            <div class="card-content">
                <!-- Law Firm Logo -->
                <a href="{{ route('home') }}" class="firm-brand" title="RPK Law Firm Workspace">
                    <img src="/logo/raf-law-firm-transparent.png" alt="RPK Law Firm Logo" onerror="this.onerror=null; this.src='/logo/logo.png';" />
                </a>

                <!-- 3D Hologram Emblem -->
                <div class="emblem-container">
                    <div class="ring-outer">
                        <div class="satellite"></div>
                    </div>
                    <div class="ring-inner"></div>
                    <div class="emblem-icon-box">
                        @yield('icon')
                    </div>
                </div>

                <!-- Monospace Status Pill -->
                <div class="badge-pill">
                    <span class="badge-led"></span>
                    <span>ERROR @yield('code') · @yield('badge_label', 'SYSTEM EVENT')</span>
                </div>

                <!-- Error Title & Descriptive Message -->
                <h1>@yield('title')</h1>
                <p>@yield('message')</p>

                <!-- Action Button Group -->
                <div class="actions-group">
                    <a href="{{ route('home') }}" class="btn btn-primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <span>Kembali ke Workspace</span>
                    </a>

                    <button type="button" onclick="window.location.reload()" class="btn btn-secondary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <polyline points="1 20 1 14 7 14"></polyline>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                        </svg>
                        <span>Muat Ulang</span>
                    </button>
                </div>

                <!-- Footer Legal Security Assurance -->
                <div class="card-footer-note">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span>RPK Law Firm Internal Workspace &middot; Kerahasiaan Terjamin</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Interactive 3D Card Tilt Script -->
    <script>
        (function() {
            const cardWrapper = document.getElementById('cardWrapper');
            const card = document.getElementById('card');
            if (!cardWrapper || !card) return;

            let bounds;
            function updateBounds() {
                bounds = cardWrapper.getBoundingClientRect();
            }
            updateBounds();
            window.addEventListener('resize', updateBounds);
            window.addEventListener('scroll', updateBounds);

            cardWrapper.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX - bounds.left;
                const mouseY = e.clientY - bounds.top;
                const xPct = mouseX / bounds.width;
                const yPct = mouseY / bounds.height;

                const tiltX = (yPct - 0.5) * -14;
                const tiltY = (xPct - 0.5) * 14;

                card.style.setProperty('--mouse-x', `${xPct * 100}%`);
                card.style.setProperty('--mouse-y', `${yPct * 100}%`);
                cardWrapper.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.015, 1.015, 1.015)`;
            });

            cardWrapper.addEventListener('mouseleave', () => {
                cardWrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        })();
    </script>
</body>
</html>
