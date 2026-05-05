<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\District;
use App\Models\Neighborhood;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function cities(): JsonResponse
    {
        return response()->json([
            'data' => City::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function districts(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'city_id' => ['required', 'integer', 'exists:cities,id'],
        ]);

        return response()->json([
            'data' => District::query()
                ->select(['id', 'name'])
                ->where('city_id', $validated['city_id'])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function neighborhoods(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'district_id' => ['required', 'integer', 'exists:districts,id'],
        ]);

        return response()->json([
            'data' => Neighborhood::query()
                ->select(['id', 'name'])
                ->where('district_id', $validated['district_id'])
                ->orderBy('name')
                ->get(),
        ]);
    }
}
