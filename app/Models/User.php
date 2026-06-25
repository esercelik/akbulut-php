<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable([
    'username',
    'slug',
    'name',
    'surname',
    'email',
    'password',
    'role',
    'title',
    'phone',
    'region',
    'bio',
    'image_url',
    'profile_photo',
    'active',
])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['avatar'];

    /**
     * The model's default values for attributes.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'role' => 'CONSULTANT',
        'title' => 'Gayrimenkul Danışmanı',
        'active' => true,
    ];

    public function permissions(): HasMany
    {
        return $this->hasMany(UserPermission::class);
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'consultant_id');
    }

    protected static function booted(): void
    {
        static::saved(fn (): bool => Cache::forget('seo.sitemap.xml'));
        static::deleted(fn (): bool => Cache::forget('seo.sitemap.xml'));
    }

    /**
     * Get the public profile photo URL used by the frontend avatar components.
     *
     * @return Attribute<null, string|null>
     */
    protected function avatar(): Attribute
    {
        return Attribute::get(
            fn (): ?string => $this->profile_photo
                ? Storage::disk('public')->url($this->profile_photo)
                : $this->image_url,
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'active' => 'boolean',
        ];
    }
}
