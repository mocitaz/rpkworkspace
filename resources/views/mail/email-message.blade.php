@extends('mail.layouts.rpk')
@section('content')
<div style="font-size:14px;line-height:23px;color:#334155;white-space:pre-wrap;">{!! nl2br(e($body)) !!}</div>
@if($email->matter)<p style="margin:24px 0 0;padding:12px 14px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc;font-size:12px;color:#64748b;">Perkara terkait: <strong>{{ $email->matter->matter_number }} · {{ $email->matter->title }}</strong></p>@endif
@endsection
