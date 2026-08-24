<?php

use App\Models\Client;
use App\Models\Comment;
use App\Models\CommentReaction;
use App\Models\Document;
use App\Models\Matter;
use App\Models\Task;

test('advocate can post root comment on a matter', function () {
    $user = rafUser(['matter.view', 'matter.view.all']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create(['client_id' => $client->id, 'responsible_partner_id' => $user->id]);

    $response = $this->actingAs($user)->post(route('comments.store'), [
        'commentable_type' => 'matter',
        'commentable_id' => $matter->id,
        'body' => 'Rekan-rekan, mohon periksa kelengkapan bukti surat P-1 s/d P-10 sebelum sidang @Farhan Putra, S.H.',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('comments', [
        'commentable_type' => Matter::class,
        'commentable_id' => $matter->id,
        'user_id' => $user->id,
        'parent_id' => null,
    ]);
});

test('advocate can post threaded reply to existing comment', function () {
    $user1 = rafUser(['matter.view', 'matter.view.all']);
    $user2 = rafUser(['matter.view', 'matter.view.all']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create(['client_id' => $client->id, 'responsible_partner_id' => $user1->id]);

    $rootComment = Comment::create([
        'commentable_type' => Matter::class,
        'commentable_id' => $matter->id,
        'user_id' => $user1->id,
        'body' => 'Mohon update draf eksepsi kompetensi absolut.',
    ]);

    $response = $this->actingAs($user2)->post(route('comments.store'), [
        'commentable_type' => 'matter',
        'commentable_id' => $matter->id,
        'parent_id' => $rootComment->id,
        'body' => 'Siap Pak, draf sudah saya unggah di tab Dokumen versi 2.0.',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('comments', [
        'commentable_type' => Matter::class,
        'commentable_id' => $matter->id,
        'parent_id' => $rootComment->id,
        'user_id' => $user2->id,
    ]);
});

test('staff can toggle emoji reaction on a comment', function () {
    $user = rafUser(['matter.view', 'matter.view.all']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create(['client_id' => $client->id, 'responsible_partner_id' => $user->id]);

    $comment = Comment::create([
        'commentable_type' => Matter::class,
        'commentable_id' => $matter->id,
        'user_id' => $user->id,
        'body' => 'Klausul arbitrase SIAC sudah disepakati.',
    ]);

    // 1. Add reaction 👍
    $response = $this->actingAs($user)->post(route('comments.reaction', $comment), [
        'emoji' => 'thumbs_up',
    ]);
    $response->assertRedirect();
    expect(CommentReaction::where('comment_id', $comment->id)->where('emoji', 'thumbs_up')->exists())->toBeTrue();

    // 2. Toggle reaction again (remove)
    $response2 = $this->actingAs($user)->post(route('comments.reaction', $comment), [
        'emoji' => 'thumbs_up',
    ]);
    $response2->assertRedirect();
    expect(CommentReaction::where('comment_id', $comment->id)->where('emoji', 'thumbs_up')->exists())->toBeFalse();
});

test('partner or author can pin and unpin a comment', function () {
    $user = rafUser(['matter.view', 'matter.view.all']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create(['client_id' => $client->id, 'responsible_partner_id' => $user->id]);

    $comment = Comment::create([
        'commentable_type' => Matter::class,
        'commentable_id' => $matter->id,
        'user_id' => $user->id,
        'body' => 'INSTRUKSI: Jangan menyerahkan bukti P-15 sebelum pemeriksaan saksi ahli selesai.',
    ]);

    // Pin
    $this->actingAs($user)->post(route('comments.pin', $comment))->assertRedirect();
    $comment->refresh();
    expect($comment->is_pinned)->toBeTrue()
        ->and($comment->pinned_by)->toBe($user->id);

    // Unpin
    $this->actingAs($user)->post(route('comments.pin', $comment))->assertRedirect();
    $comment->refresh();
    expect($comment->is_pinned)->toBeFalse();
});

test('staff can post comments on documents and tasks', function () {
    $user = rafUser(['document.view', 'task.view', 'matter.view', 'matter.view.all']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create(['client_id' => $client->id, 'responsible_partner_id' => $user->id]);

    $document = Document::factory()->create(['matter_id' => $matter->id, 'created_by' => $user->id]);
    $task = Task::create([
        'matter_id' => $matter->id,
        'title' => 'Riset Yurisprudensi Wanprestasi',
        'assignee_id' => $user->id,
        'reporter_id' => $user->id,
    ]);

    // Comment on Document
    $this->actingAs($user)->post(route('comments.store'), [
        'commentable_type' => 'document',
        'commentable_id' => $document->id,
        'body' => 'Catatan review: Pasal 8 ayat 2 mohon disesuaikan dengan UU Cipta Kerja.',
    ])->assertRedirect();
    $this->assertDatabaseHas('comments', ['commentable_type' => Document::class, 'commentable_id' => $document->id]);

    // Comment on Task
    $this->actingAs($user)->post(route('comments.store'), [
        'commentable_type' => 'task',
        'commentable_id' => $task->id,
        'body' => 'Referensi putusan MA: https://putusan3.mahkamahagung.go.id/direktori/putusan/sample.html',
    ])->assertRedirect();
    $this->assertDatabaseHas('comments', ['commentable_type' => Task::class, 'commentable_id' => $task->id]);
});
