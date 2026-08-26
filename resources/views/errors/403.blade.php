@extends('errors.layout')

@section('code', '403')
@section('badge_label', 'ACCESS RESTRICTED')
@section('chip_label', 'SECURITY SHIELD · ACCESS DENIED')
@section('title', 'Akses Terbatas / Ditolak')
@section('message', 'Akun Anda tidak memiliki hak akses atau wewenang untuk membuka modul ini. Silakan hubungi Managing Partner atau Administrator firma jika akses ini diperlukan untuk tugas Anda.')

@section('character_image')
<img 
    src="/images/anime-403-character.png" 
    alt="RPK Security Officer" 
    class="character-img"
/>
@endsection
