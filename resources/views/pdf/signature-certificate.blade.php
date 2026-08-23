<!doctype html>
<html lang="id">
<head><meta charset="utf-8"><title>Certificate {{ $signatureRequest->verification_code }}</title></head>
<body>
    <h1>Sertifikat tanda tangan elektronik</h1>
    <p>{{ config('raf.firm.name') }}</p>
    <hr>
    <p>Dokumen <strong>{{ $signatureRequest->document->title }}</strong> versi {{ $signatureRequest->documentVersion->version_number }} telah diselesaikan melalui RPK Law Firm Workspace.</p>
    <p><strong>Kode verifikasi:</strong> {{ $signatureRequest->verification_code }}</p>
    <p><strong>Checksum SHA-256:</strong> {{ $signatureRequest->document_checksum }}</p>
    <p><strong>Waktu selesai:</strong> {{ $signatureRequest->completed_at?->translatedFormat('d M Y H:i') }} WIB</p>
    <h2>Jejak penandatangan</h2>
    <table width="100%" cellspacing="0" cellpadding="6" border="1">
        <thead><tr><th align="left">Nama</th><th align="left">Email</th><th align="left">Waktu</th></tr></thead>
        <tbody>
            @foreach ($signatureRequest->signers as $signer)
                <tr><td>{{ $signer->accepted_name ?? $signer->name }}</td><td>{{ $signer->email }}</td><td>{{ $signer->signed_at?->translatedFormat('d M Y H:i') }} WIB</td></tr>
            @endforeach
        </tbody>
    </table>
    <p>Verifikasi independen tersedia pada {{ route('signature.verify', $signatureRequest->verification_code) }}</p>
</body>
</html>
