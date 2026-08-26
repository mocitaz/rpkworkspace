@extends('errors.layout')

@section('code', '500')
@section('badge_label', 'SERVER EXCEPTION')
@section('chip_label', 'CORE ENGINE · EXCEPTION OCCURRED')
@section('title', 'Terjadi Kendala Sistem')
@section('message', 'RPK Workspace mengalami kendala saat memproses permintaan ini. Tim teknis telah mencatat log insiden ini. Silakan coba kembali beberapa saat lagi.')

@section('character_image')
<img 
    src="/images/anime-404-character.png" 
    alt="RPK Legal Tech Character" 
    class="character-img"
/>
@endsection
