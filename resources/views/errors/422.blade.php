@extends('errors.layout')

@section('code', '422')
@section('badge_label', 'UNPROCESSABLE ENTITY')
@section('chip_label', 'DATA INTEGRITY · CHECK PAYLOAD')
@section('title', 'Permintaan Tidak Dapat Diproses')
@section('message', 'Periksa kembali data atau format dokumen yang dikirimkan. Tidak ada perubahan yang tersimpan dari tindakan ini.')

@section('character_image')
<img 
    src="/images/anime-404-character.png" 
    alt="RPK Legal Tech Character" 
    class="character-img"
/>
@endsection
