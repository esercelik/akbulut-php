<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'source_id',
    'name',
])]
class City extends Model
{
    public $timestamps = false;

    public function districts(): HasMany
    {
        return $this->hasMany(District::class);
    }
}
