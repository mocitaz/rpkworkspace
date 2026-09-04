@extends('mail.layouts.rpk', ['hideFooter' => true, 'recipientName' => null])

@section('content')
<div style="font-size:14px;line-height:24px;color:#1e293b;white-space:pre-wrap;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">{!! nl2br(e($cleanBody ?? $body)) !!}</div>

@if($email->matter)
<div style="margin:24px 0 0;padding:12px 16px;border-left:3px solid #0f172a;background:#f8fafc;border-radius:0 8px 8px 0;">
    <p style="margin:0;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">Perkara Terkait</p>
    <p style="margin:2px 0 0;font-size:12.5px;font-weight:600;color:#0f172a;">{{ $email->matter->matter_number }} &bull; {{ $email->matter->title }}</p>
</div>
@endif

@if($hasSignature ?? false)
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:28px;border-top:1px solid #e2e8f0;padding-top:20px;">
    <tr>
        <td style="border-left:3px solid #0f172a;padding-left:14px;">
            <p style="margin:0;font-size:13.5px;font-weight:700;color:#0f172a;line-height:20px;">
                {{ $signerName ?? $email->sender?->name ?? 'Tim Advokat & Konsultan Hukum' }}
            </p>
            <p style="margin:2px 0 0;font-size:12px;font-weight:600;color:#475569;line-height:18px;">
                {{ $signerTitle ?? $email->sender?->position_title ?? 'Advokat & Konsultan Hukum' }} &bull; RPK Law Office &amp; Partners
            </p>
            <p style="margin:4px 0 0;font-size:11px;color:#64748b;line-height:16px;">
                Jl. Bukit Nirwana VII, Blok CC.04, Sariwangi, Bandung Barat &bull; Tel: 0852 9560 1417 &bull; {{ $email->from_address }}
            </p>
        </td>
    </tr>
    <tr>
        <td style="padding-top:14px;">
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:10px 14px;">
                <p style="margin:0;font-size:9.5px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.04em;">
                    Pernyataan Kerahasiaan (Attorney-Client Privilege):
                </p>
                <p style="margin:3px 0 0;font-size:9.5px;line-height:15px;color:#64748b;text-align:justify;">
                    Surat elektronik ini dan seluruh lampirannya bersifat rahasia dan dilindungi oleh hak istimewa hukum kerahasiaan profesi advokat (Pasal 19 UU No. 18 Tahun 2003 tentang Advokat). Apabila Anda bukan penerima yang sah, dilarang menyalin, mendistribusikan, atau memanfaatkan isi pesan ini. Mohon segera beritahukan pengirim dan hapus pesan ini dari sistem Anda.
                </p>
            </div>
        </td>
    </tr>
</table>
@else
<div style="margin-top:24px;border-top:1px solid #f1f5f9;padding-top:14px;font-size:11px;color:#94a3b8;text-align:center;">
    RPK Law Office &amp; Partners &bull; {{ $email->from_address }}
</div>
@endif
@endsection
