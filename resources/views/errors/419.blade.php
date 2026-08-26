@extends('errors.layout')

@section('code', '419')
@section('badge_label', 'SESSION EXPIRED')
@section('chip_label', 'SESSION TIME-OUT · RE-AUTH NEEDED')
@section('title', 'Sesi Telah Berakhir')
@section('message', 'Untuk melindungi kerahasiaan data firma, sesi aktif Anda telah berakhir. Silakan muat ulang halaman atau login kembali.')

@section('character_image')
<img 
    src="/images/anime-403-character.png" 
    alt="RPK Security Officer" 
    class="character-img"
/>
@endsection
