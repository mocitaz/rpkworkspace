<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>@yield('code') — RAF Workspace</title>
    <style>
        :root { color-scheme: light dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
        body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #f8f7f4; color: #1c1c1c; }
        main { width: min(34rem, calc(100% - 3rem)); }
        .mark { display: inline-grid; place-items: center; width: 2.5rem; height: 2.5rem; border: 1px solid #b18b43; border-radius: .6rem; font-weight: 700; }
        .code { margin-top: 3rem; color: #8a6b32; font-size: .8rem; font-weight: 700; letter-spacing: .12em; }
        h1 { margin: .65rem 0; font-size: clamp(1.8rem, 5vw, 2.6rem); letter-spacing: -.035em; }
        p { max-width: 30rem; color: #68645d; line-height: 1.65; }
        a { display: inline-block; margin-top: 1rem; color: inherit; font-weight: 650; text-underline-offset: .25rem; }
        @media (prefers-color-scheme: dark) { body { background: #171717; color: #f5f5f4; } p { color: #a8a29e; } }
    </style>
</head>
<body>
    <main>
        <div class="mark" aria-label="RPK Law Firm">RPK</div>
        <div class="code">ERROR @yield('code')</div>
        <h1>@yield('title')</h1>
        <p>@yield('message')</p>
        <a href="{{ route('home') }}">Kembali ke RPK Law Firm Workspace</a>
    </main>
</body>
</html>
