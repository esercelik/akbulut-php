<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cities', function (Blueprint $table): void {
            $table->id();
            $table->unsignedSmallInteger('source_id')->unique();
            $table->string('name')->index();
        });

        Schema::create('districts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('city_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('source_id')->unique();
            $table->string('name')->index();
            $table->unique(['city_id', 'name']);
        });

        Schema::create('neighborhoods', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('district_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('source_id')->nullable()->index();
            $table->unsignedSmallInteger('source_semt_id')->nullable()->index();
            $table->string('name')->index();
            $table->unique(['district_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('neighborhoods');
        Schema::dropIfExists('districts');
        Schema::dropIfExists('cities');
    }
};
