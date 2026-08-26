@extends('errors.layout')

@section('code', '419')
@section('badge_label', 'SESSION EXPIRED')
@section('title', 'Sesi Telah Berakhir')
@section('message', 'Untuk melindungi kerahasiaan data firma, sesi aktif Anda telah berakhir. Silakan muat ulang halaman atau login kembali.')

@section('icon')
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
</svg>
@endsection
