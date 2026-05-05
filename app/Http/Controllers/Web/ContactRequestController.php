<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreContactRequestRequest;
use App\Models\ContactRequest;
use Illuminate\Http\JsonResponse;

class ContactRequestController extends Controller
{
    public function store(StoreContactRequestRequest $request): JsonResponse
    {
        ContactRequest::query()->create($request->validated());

        return response()->json([
            'message' => 'Mesajiniz alindi. Danisman ekibimiz en kisa surede sizinle iletisime gececek.',
        ], 201);
    }
}
