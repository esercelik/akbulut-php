<?php

use Illuminate\Support\Facades\Storage;

test('public storage files are served through the laravel fallback route', function () {
    Storage::fake('public');
    Storage::disk('public')->put('profile-photos/1/avatar.jpg', 'avatar-bytes');

    $this->get('/storage/profile-photos/1/avatar.jpg')
        ->assertOk()
        ->assertHeader('Cache-Control', 'max-age=31536000, public');
});

test('missing public storage files return not found', function () {
    Storage::fake('public');

    $this->get('/storage/profile-photos/missing.jpg')
        ->assertNotFound();
});
