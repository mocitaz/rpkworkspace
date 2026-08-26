@extends('errors.layout')

@section('code', '403')
@section('badge_label', 'ACCESS RESTRICTED')
@section('title', 'Akses Terbatas / Ditolak')
@section('message', 'Akun Anda tidak memiliki hak akses atau wewenang untuk membuka modul ini. Silakan hubungi Managing Partner atau Administrator firma jika akses ini diperlukan untuk tugas Anda.')

@section('icon')
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <rect x="9" y="11" width="6" height="4" rx="1"></rect>
    <path d="M10 11V9a2 2 0 1 1 4 0v2"></path>
</svg>
@endsection
