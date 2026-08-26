@extends('errors.layout')

@section('code', '500')
@section('badge_label', 'SERVER EXCEPTION')
@section('title', 'Terjadi Kendala Sistem')
@section('message', 'RPK Workspace mengalami kendala saat memproses permintaan ini. Tim teknis telah mencatat log insiden ini. Silakan coba kembali beberapa saat lagi.')

@section('icon')
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
    <line x1="6" y1="6" x2="6.01" y2="6"></line>
    <line x1="6" y1="18" x2="6.01" y2="18"></line>
    <path d="M14 6h4"></path>
    <path d="M14 18h4"></path>
</svg>
@endsection
