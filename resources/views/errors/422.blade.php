@extends('errors.layout')

@section('code', '422')
@section('badge_label', 'UNPROCESSABLE ENTITY')
@section('title', 'Permintaan Tidak Dapat Diproses')
@section('message', 'Periksa kembali data atau format dokumen yang dikirimkan. Tidak ada perubahan yang tersimpan dari tindakan ini.')

@section('icon')
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="18" x2="12" y2="12"></line>
    <line x1="12" y1="9" x2="12.01" y2="9"></line>
</svg>
@endsection
