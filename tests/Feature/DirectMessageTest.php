<?php

use App\Models\DirectMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, LazilyRefreshDatabase::class);

test('guests are redirected to the login page when visiting chat', function () {
    $response = $this->get(route('chat.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated user can visit chat and see colleagues', function () {
    $user = User::factory()->create();
    $colleague = User::factory()->create(['name' => 'Budi Santoso']);

    $response = $this->actingAs($user)->get(route('chat.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('chat/index')
        ->has('contacts')
        ->has('messages')
    );
});

test('authenticated user can send a direct message to a colleague', function () {
    $user = User::factory()->create();
    $colleague = User::factory()->create();

    $response = $this->actingAs($user)->post(route('chat.store'), [
        'recipient_id' => $colleague->id,
        'message' => 'Halo rekan, tolong cek berkas perkara.',
    ]);

    $response->assertRedirect(route('chat.index', ['user' => $colleague->id]));

    $this->assertDatabaseHas('direct_messages', [
        'sender_id' => $user->id,
        'recipient_id' => $colleague->id,
        'message' => 'Halo rekan, tolong cek berkas perkara.',
    ]);
});

test('authenticated user can reply to a message', function () {
    $user = User::factory()->create();
    $colleague = User::factory()->create();

    $original = DirectMessage::create([
        'sender_id' => $colleague->id,
        'recipient_id' => $user->id,
        'message' => 'Apakah dokumen sudah siap?',
    ]);

    $response = $this->actingAs($user)->post(route('chat.store'), [
        'recipient_id' => $colleague->id,
        'message' => 'Sudah siap, Partner.',
        'reply_to_id' => $original->id,
    ]);

    $response->assertRedirect(route('chat.index', ['user' => $colleague->id]));

    $this->assertDatabaseHas('direct_messages', [
        'sender_id' => $user->id,
        'recipient_id' => $colleague->id,
        'reply_to_id' => $original->id,
        'message' => 'Sudah siap, Partner.',
    ]);
});

test('authenticated user can toggle reaction on a message', function () {
    $user = User::factory()->create();
    $colleague = User::factory()->create();

    $message = DirectMessage::create([
        'sender_id' => $colleague->id,
        'recipient_id' => $user->id,
        'message' => 'Sidang dijadwalkan besok pukul 09:00 WIB.',
    ]);

    // 1. Add reaction (ThumbsUp emoji)
    $response = $this->actingAs($user)->postJson(route('chat.reaction', $message), [
        'reaction' => '👍',
    ]);

    $response->assertOk();
    $response->assertJsonPath('success', true);
    $this->assertDatabaseHas('direct_message_reactions', [
        'direct_message_id' => $message->id,
        'user_id' => $user->id,
        'reaction' => '👍',
    ]);

    // 2. Toggle off reaction
    $response2 = $this->actingAs($user)->postJson(route('chat.reaction', $message), [
        'reaction' => '👍',
    ]);

    $response2->assertOk();
    $this->assertDatabaseMissing('direct_message_reactions', [
        'direct_message_id' => $message->id,
        'user_id' => $user->id,
        'reaction' => '👍',
    ]);
});

test('user cannot send direct message to themselves', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('chat.store'), [
        'recipient_id' => $user->id,
        'message' => 'Test pesan ke diri sendiri',
    ]);

    $response->assertSessionHasErrors('message');
    $this->assertDatabaseCount('direct_messages', 0);
});

test('opening conversation marks incoming unread messages as read', function () {
    $user = User::factory()->create();
    $colleague = User::factory()->create();

    $message = DirectMessage::create([
        'sender_id' => $colleague->id,
        'recipient_id' => $user->id,
        'message' => 'Pesan belum dibaca',
        'read_at' => null,
    ]);

    $this->actingAs($user)->get(route('chat.index', ['user' => $colleague->id]));

    expect($message->fresh()->read_at)->not->toBeNull();
});
