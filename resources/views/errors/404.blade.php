@extends('errors.layout')

@section('code', '404')
@section('badge_label', 'NOT FOUND')
@section('chip_label', 'CASE FILE #24097 · NOT FOUND')
@section('title', 'Halaman Tidak Ditemukan')
@section('message', 'Alamat atau berkas yang Anda cari tidak tersedia, telah dipindahkan, atau berada di luar jangkauan sistem RPK Workspace.')

@section('character_image')
<img 
    src="/images/anime-404-character.png" 
    alt="RPK Legal Tech Detective" 
    class="character-img"
/>
@endsection
