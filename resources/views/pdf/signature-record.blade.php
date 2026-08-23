<!doctype html>
<html lang="id">
<head><meta charset="utf-8"><title>Signed record {{ $signatureRequest->verification_code }}</title></head>
<body>
    <h1>Signed document record</h1>
    <p>{{ config('raf.firm.name') }}</p>
    <hr>
    <p><strong>Dokumen:</strong> {{ $signatureRequest->document->title }}</p>
    <p><strong>Versi:</strong> {{ $signatureRequest->documentVersion->version_number }}</p>
    <p><strong>Checksum SHA-256:</strong> {{ $signatureRequest->document_checksum }}</p>
    <p><strong>Kode verifikasi:</strong> {{ $signatureRequest->verification_code }}</p>
    <p><strong>Diselesaikan:</strong> {{ $signatureRequest->completed_at?->translatedFormat('d M Y H:i') }} WIB</p>
    <h2>Penanda tangan</h2>
    <table width="100%" cellspacing="0" cellpadding="6" border="1">
        <thead><tr><th align="left">Nama</th><th align="left">Email</th><th align="left">Waktu tanda tangan</th></tr></thead>
        <tbody>
            @foreach ($signatureRequest->signers as $signer)
                <tr><td>{{ $signer->accepted_name ?? $signer->name }}</td><td>{{ $signer->email }}</td><td>{{ $signer->signed_at?->translatedFormat('d M Y H:i') }} WIB</td></tr>
            @endforeach
        </tbody>
    </table>
    <p>Rekaman ini mengikat status tanda tangan dengan checksum versi dokumen pada saat permintaan dikirim.</p>
</body>
</html>
