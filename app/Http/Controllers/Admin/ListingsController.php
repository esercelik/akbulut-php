<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\BuildsAdminProps;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreListingRequest;
use App\Http\Requests\Admin\UpdateListingRequest;
use App\Models\City;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\User;
use App\Support\Listings\ListingTaxonomy;
use App\Support\Locations\LocationResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ListingsController extends Controller
{
    use BuildsAdminProps;

    /**
     * @return array<string, mixed>
     */
    private function listingPayload(array $validated, User $user, LocationResolver $locationResolver): array
    {
        $consultantId = $user->role === 'CONSULTANT'
            ? $user->id
            : $validated['consultant_id'] ?? null;

        if ($consultantId === null) {
            throw ValidationException::withMessages([
                'consultant_id' => 'Danisman secimi zorunludur.',
            ]);
        }

        $location = $locationResolver->resolveForProperty(
            $validated['city_id'] ?? null,
            $validated['district_id'] ?? null,
            $validated['neighborhood_id'] ?? null,
        );

        $payload = [
            ...Arr::only($validated, [
                'ilan_no',
                'ilan_tarihi',
                'title',
                'description',
                'price',
                'address',
                'property_type',
                'listing_type',
                'square_meters',
                'brut_m2',
                'net_m2',
                'room_count',
                'building_age',
                'floor',
                'total_floors',
                'heating',
                'bathroom_count',
                'mutfak',
                'usage_status',
                'site_adi',
                'aidat',
                'deed_status',
                'enerji_kimlik_belgesi',
                'kimden',
                'status',
            ]),
            ...$location,
            'balcony' => (bool) ($validated['balcony'] ?? false),
            'asansor' => (bool) ($validated['asansor'] ?? false),
            'otopark' => (bool) ($validated['otopark'] ?? false),
            'furnished' => (bool) ($validated['furnished'] ?? false),
            'site_icerisinde' => (bool) ($validated['site_icerisinde'] ?? false),
            'credit_eligible' => (bool) ($validated['credit_eligible'] ?? false),
            'takas' => (bool) ($validated['takas'] ?? false),
            'featured' => (bool) ($validated['featured'] ?? false),
            'consultant_id' => $consultantId,
        ];

        if (ListingTaxonomy::isLand($payload['property_type'])) {
            $payload = [
                ...$payload,
                'net_m2' => null,
                'room_count' => ListingTaxonomy::defaultRoomCountFor($payload['property_type']),
                'building_age' => null,
                'floor' => null,
                'total_floors' => null,
                'heating' => null,
                'bathroom_count' => null,
                'mutfak' => null,
                'balcony' => false,
                'asansor' => false,
                'otopark' => false,
                'furnished' => false,
                'usage_status' => null,
                'site_icerisinde' => false,
                'site_adi' => null,
                'aidat' => null,
                'enerji_kimlik_belgesi' => null,
            ];
        }

        return $payload;
    }

    private function uniqueSlug(string $title, ?Property $ignore = null): string
    {
        $baseSlug = Str::slug($title) ?: 'ilan';
        $slug = $baseSlug;
        $counter = 2;

        while (Property::query()
            ->where('slug', $slug)
            ->when($ignore, fn ($query) => $query->whereKeyNot($ignore->id))
            ->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    private function publicStoragePath(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH);

        if (! is_string($path) || ! Str::startsWith($path, '/storage/')) {
            return null;
        }

        return Str::after($path, '/storage/');
    }

    private function deleteStoredImage(PropertyImage $image): void
    {
        $path = $this->publicStoragePath($image->image_url);

        if ($path) {
            Storage::disk('public')->delete($path);
        }

        $image->delete();
    }

    /**
     * @param  array<int, mixed>  $uploadedImages
     */
    private function appendUploadedImages(Property $property, array $uploadedImages): void
    {
        $nextSortOrder = (int) $property->images()->max('sort_order') + 1;

        collect($uploadedImages)
            ->filter()
            ->values()
            ->each(function (mixed $image, int $index) use ($property, $nextSortOrder): void {
                $path = $image->store("property-images/{$property->id}", 'public');

                $property->images()->create([
                    'image_url' => Storage::disk('public')->url($path),
                    'alt' => $property->title,
                    'sort_order' => $nextSortOrder + $index,
                ]);
            });
    }

    /**
     * @param  array<int, int|string>  $imageIds
     */
    private function removeImages(Property $property, array $imageIds): void
    {
        $property->images()
            ->whereIn('id', $imageIds)
            ->get()
            ->each(fn (PropertyImage $image) => $this->deleteStoredImage($image));
    }

    private function syncImageAltText(Property $property): void
    {
        $property->images()
            ->orderBy('sort_order')
            ->get()
            ->values()
            ->each(fn (PropertyImage $image, int $index) => $image->update([
                'alt' => $property->title,
                'sort_order' => $index,
            ]));
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    private function consultantOptions(User $user): array
    {
        return User::query()
            ->select(['id', 'name', 'surname'])
            ->where('role', 'CONSULTANT')
            ->where('active', true)
            ->when($user->role === 'CONSULTANT', fn ($query) => $query->whereKey($user->id))
            ->oldest()
            ->get()
            ->map(fn (User $consultant): array => [
                'id' => $consultant->id,
                'name' => trim($consultant->name.' '.($consultant->surname ?? '')),
            ])
            ->all();
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    private function cityOptions(): array
    {
        return City::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get()
            ->map(fn (City $city): array => [
                'id' => $city->id,
                'name' => $city->name,
            ])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function listingFormData(Property $property, LocationResolver $locationResolver): array
    {
        $property->loadMissing(['images' => fn ($query) => $query->orderBy('sort_order')]);
        $matchedLocation = $locationResolver->matchExisting(
            $property->city,
            $property->district,
            $property->neighborhood,
        );

        return [
            'id' => $property->id,
            'ilan_no' => $property->ilan_no,
            'ilan_tarihi' => $property->ilan_tarihi?->format('Y-m-d'),
            'title' => $property->title,
            'description' => $property->description,
            'price' => $property->price,
            'city_id' => $property->city_id ?? $matchedLocation['city_id'],
            'district_id' => $property->district_id ?? $matchedLocation['district_id'],
            'neighborhood_id' => $property->neighborhood_id ?? $matchedLocation['neighborhood_id'],
            'city' => $property->city,
            'district' => $property->district,
            'neighborhood' => $property->neighborhood,
            'address' => $property->address,
            'property_type' => $property->property_type,
            'listing_type' => $property->listing_type,
            'square_meters' => $property->square_meters,
            'brut_m2' => $property->brut_m2,
            'net_m2' => $property->net_m2,
            'room_count' => $property->room_count,
            'building_age' => $property->building_age,
            'floor' => $property->floor,
            'total_floors' => $property->total_floors,
            'heating' => $property->heating,
            'bathroom_count' => $property->bathroom_count,
            'mutfak' => $property->mutfak,
            'balcony' => $property->balcony,
            'asansor' => $property->asansor,
            'otopark' => $property->otopark,
            'furnished' => $property->furnished,
            'usage_status' => $property->usage_status,
            'site_icerisinde' => $property->site_icerisinde,
            'site_adi' => $property->site_adi,
            'aidat' => $property->aidat,
            'deed_status' => $property->deed_status,
            'credit_eligible' => $property->credit_eligible,
            'enerji_kimlik_belgesi' => $property->enerji_kimlik_belgesi,
            'kimden' => $property->kimden,
            'takas' => $property->takas,
            'status' => $property->status,
            'featured' => $property->featured,
            'consultant_id' => $property->consultant_id,
            'images' => $property->images
                ->map(fn (PropertyImage $image): array => [
                    'id' => $image->id,
                    'image_url' => $image->image_url,
                    'alt' => $image->alt,
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'LISTINGS_VIEW');

        $properties = $this->applyPropertyScope(
            Property::query()
                ->select(['id', 'title', 'price', 'city', 'district', 'listing_type', 'status', 'consultant_id'])
                ->with([
                    'consultant:id,name,surname',
                    'images' => fn ($query) => $query->select(['id', 'property_id', 'image_url'])->orderBy('sort_order'),
                ]),
            $user,
        )
            ->latest()
            ->get()
            ->map(fn (Property $property): array => [
                'id' => $property->id,
                'title' => $property->title,
                'listingNo' => $property->ilan_no,
                'price' => $property->price,
                'city' => $property->city,
                'district' => $property->district,
                'listingType' => $property->listing_type,
                'status' => $property->status,
                'consultantName' => $property->consultant
                    ? trim($property->consultant->name.' '.($property->consultant->surname ?? ''))
                    : null,
                'imageUrl' => $property->images->first()?->image_url,
            ]);

        $consultants = User::query()
            ->select(['id', 'slug', 'name', 'surname'])
            ->where('role', 'CONSULTANT')
            ->where('active', true)
            ->when($user->role === 'CONSULTANT', fn ($query) => $query->whereKey($user->id))
            ->oldest()
            ->get()
            ->map(fn (User $consultant): array => [
                'id' => $consultant->id,
                'slug' => $consultant->slug,
                'name' => trim($consultant->name.' '.($consultant->surname ?? '')),
            ]);

        return Inertia::render('admin/listings', [
            'adminUser' => $this->adminUser($user),
            'properties' => $properties,
            'consultants' => $consultants,
            'canCreate' => $this->userCan($user, 'LISTINGS_CREATE'),
            'canEdit' => $this->userCan($user, 'LISTINGS_EDIT'),
            'canDelete' => $this->userCan($user, 'LISTINGS_DELETE'),
        ]);
    }

    public function create(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'LISTINGS_CREATE');

        return Inertia::render('admin/listing-form', [
            'adminUser' => $this->adminUser($user),
            'mode' => 'create',
            'listing' => null,
            'consultants' => $this->consultantOptions($user),
            'cities' => $this->cityOptions(),
            'canChooseConsultant' => $user->role !== 'CONSULTANT',
        ]);
    }

    public function store(StoreListingRequest $request, LocationResolver $locationResolver): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'LISTINGS_CREATE');

        $validated = $request->validated();
        $property = Property::query()->create([
            ...$this->listingPayload($validated, $user, $locationResolver),
            'slug' => $this->uniqueSlug($validated['title']),
        ]);

        $this->appendUploadedImages($property, $request->file('images', []));

        return redirect()
            ->route('admin.listings.index')
            ->with('status', 'listing-created');
    }

    public function edit(Request $request, Property $property, LocationResolver $locationResolver): Response
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'LISTINGS_EDIT');
        abort_if($user->role === 'CONSULTANT' && $property->consultant_id !== $user->id, 403);

        return Inertia::render('admin/listing-form', [
            'adminUser' => $this->adminUser($user),
            'mode' => 'edit',
            'listing' => $this->listingFormData($property, $locationResolver),
            'consultants' => $this->consultantOptions($user),
            'cities' => $this->cityOptions(),
            'canChooseConsultant' => $user->role !== 'CONSULTANT',
        ]);
    }

    public function update(UpdateListingRequest $request, Property $property, LocationResolver $locationResolver): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'LISTINGS_EDIT');
        abort_if($user->role === 'CONSULTANT' && $property->consultant_id !== $user->id, 403);

        $validated = $request->validated();
        $removeImageIds = $validated['remove_image_ids'] ?? [];

        $property->update([
            ...$this->listingPayload($validated, $user, $locationResolver),
            'slug' => $this->uniqueSlug($validated['title'], $property),
        ]);

        $this->removeImages($property, $removeImageIds);
        $this->appendUploadedImages($property, $request->file('images', []));
        $this->syncImageAltText($property);

        return redirect()
            ->route('admin.listings.index')
            ->with('status', 'listing-updated');
    }

    public function destroy(Request $request, Property $property): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'LISTINGS_DELETE');
        abort_if($user->role === 'CONSULTANT' && $property->consultant_id !== $user->id, 403);

        $property->images->each(fn (PropertyImage $image) => $this->deleteStoredImage($image));
        $property->delete();

        return redirect()
            ->route('admin.listings.index')
            ->with('status', 'listing-deleted');
    }
}
