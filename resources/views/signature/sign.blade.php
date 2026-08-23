<!doctype html>
<html lang="id" class="h-full bg-[#f5f5f7] antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Penerimaan & Tanda Tangan Dokumen Internal | RPK Law Firm</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <style>
        body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="min-h-full bg-[#f5f5f7] text-[#1d1d1f] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-[620px] space-y-6">
        
        <!-- Corporate Letterhead Header -->
        <header class="flex items-center justify-between border-b border-black/[0.06] pb-5">
            <div class="flex items-center gap-3">
                <div class="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1d1d1f] to-[#2c2c2e] text-[#c5a880] shadow-md shadow-black/10 font-bold text-sm">
                    RPK
                </div>
                <div>
                    <h2 class="text-xs font-bold uppercase tracking-wider text-[#1d1d1f]">RPK Law Firm</h2>
                    <p class="text-[10px] text-[#86868b]">Advocates &amp; Legal Consultants</p>
                </div>
            </div>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#0071e3] ring-1 ring-blue-500/20">
                E-Sign Dokumen
            </span>
        </header>

        <!-- Main Card Container -->
        <main class="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] space-y-6">
            
            <div class="space-y-1.5 border-b border-black/[0.05] pb-5">
                <span class="font-mono text-[10px] font-semibold tracking-wider uppercase text-[#86868b]">
                    Permintaan Tanda Tangan &amp; Persetujuan
                </span>
                <h1 class="text-xl font-bold tracking-tight text-[#1d1d1f]">
                    {{ $signer->signatureRequest->document->title }}
                </h1>
                <p class="text-xs text-[#86868b]">
                    Ditujukan kepada: <strong class="text-[#1d1d1f]">{{ $signer->name }}</strong> ({{ $signer->email }})
                </p>
                @if ($signer->signatureRequest->expires_at)
                    <p class="text-[11px] text-amber-600 font-medium">
                        Tenggat Waktu: {{ $signer->signatureRequest->expires_at->translatedFormat('d F Y, H:i') }} WIB
                    </p>
                @endif
            </div>

            <!-- Signing Form -->
            <form method="post" action="{{ route('signature.sign.store', $signer->signing_token) }}" class="space-y-5">
                @csrf

                <div class="space-y-1.5">
                    <label for="accepted_name" class="text-xs font-semibold text-[#1d1d1f]">
                        Nama Lengkap Penanda Tangan *
                    </label>
                    <input 
                        id="accepted_name" 
                        name="accepted_name" 
                        type="text"
                        value="{{ old('accepted_name', $signer->name) }}" 
                        required
                        class="h-10 w-full rounded-xl border border-black/10 bg-[#fbfbfd] px-3.5 text-xs text-[#1d1d1f] outline-none transition-colors focus:border-[#0071e3] focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20"
                    >
                    @error('accepted_name')
                        <p class="text-xs text-rose-500 font-medium">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Terms & Confirmation Checkbox -->
                <div class="rounded-2xl border border-black/5 bg-[#fbfbfd] p-4">
                    <label class="flex items-start gap-3 cursor-pointer text-xs leading-relaxed text-[#1d1d1f]">
                        <input 
                            type="checkbox" 
                            name="accept_terms" 
                            value="1" 
                            required
                            class="mt-0.5 size-4 rounded border-zinc-300 text-[#0071e3] focus:ring-[#0071e3]"
                        >
                        <span>
                            Saya menyatakan bahwa saya telah membaca, memahami, dan menyetujui isi dokumen <strong>{{ $signer->signatureRequest->document->title }}</strong> ini sebagai bentuk penerimaan dan persetujuan internal resmi pada sistem RPK Law Firm Workspace.
                        </span>
                    </label>
                    @error('accept_terms')
                        <p class="mt-2 text-xs text-rose-500 font-medium">{{ $message }}</p>
                    @enderror
                </div>

                <button 
                    type="submit"
                    class="h-10 w-full rounded-full bg-[#0071e3] font-medium text-xs text-white shadow-md shadow-blue-500/25 transition-all hover:bg-[#0077ed] active:scale-95 cursor-pointer"
                >
                    Konfirmasi &amp; Catat Penerimaan Internal
                </button>
            </form>

            <div class="rounded-xl bg-zinc-50 p-3 text-[11px] text-[#86868b] leading-relaxed border border-black/[0.04]">
                <strong>Catatan Kepatuhan:</strong> Rekaman ini disimpan secara permanen bersama stempel waktu kriptografi dan checksum dokumen SHA-256 untuk audit trail internal kantor hukum.
            </div>

        </main>

        <!-- Footer -->
        <footer class="text-center space-y-1 text-[11px] text-[#86868b] pt-2">
            <p>&copy; {{ date('Y') }} RPK Law Firm · Advocates &amp; Legal Consultants.</p>
        </footer>

    </div>
</body>
</html>
