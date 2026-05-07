<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PublicStorageController extends Controller
{
    public function __invoke(string $path): StreamedResponse|Response
    {
        if (str_contains($path, '..') || ! Storage::disk('public')->exists($path)) {
            return response('', 404);
        }

        return Storage::disk('public')->response($path, headers: [
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
}
