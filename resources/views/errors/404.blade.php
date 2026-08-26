@extends('errors.layout')

@section('code', '404')
@section('badge_label', 'NOT FOUND')
@section('title', 'Halaman Tidak Ditemukan')
@section('message', 'Alamat atau tautan berkas yang Anda tuju tidak tersedia, telah dipindahkan, atau berada di luar jangkauan sistem RPK Law App.')

@section('icon')
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
</svg>
@endsection
