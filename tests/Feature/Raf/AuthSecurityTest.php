<?php

use App\Models\User;

it('redirects guests away from internal routes', function () {
    $this->get(route('matters.index'))->assertRedirect(route('login'));
});

it('does not expose public registration routes', function () {
    $this->get('/register')->assertNotFound();
    $this->post('/register', [])->assertNotFound();
});

it('denies a disabled account at login and during an existing session', function () {
    $user = User::factory()->disabled()->create(['email' => 'disabled@example.test']);

    $this->post('/login', ['email' => $user->email, 'password' => 'password'])
        ->assertSessionHasErrors('email');
    $this->assertGuest();

    $this->actingAs($user)->get(route('dashboard'))->assertRedirect(route('login'));
    $this->assertGuest();
});
