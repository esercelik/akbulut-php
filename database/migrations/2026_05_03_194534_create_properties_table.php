<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->unsignedBigInteger('price');
            $table->string('city')->index();
            $table->string('district')->index();
            $table->string('neighborhood')->nullable();
            $table->string('address')->nullable();
            $table->string('property_type')->index();
            $table->string('listing_type')->index();
            $table->unsignedInteger('square_meters');
            $table->string('room_count');
            $table->string('building_age')->nullable();
            $table->string('floor')->nullable();
            $table->string('total_floors')->nullable();
            $table->string('heating')->nullable();
            $table->unsignedSmallInteger('bathroom_count')->nullable();
            $table->boolean('balcony')->default(false);
            $table->boolean('furnished')->default(false);
            $table->string('usage_status')->nullable();
            $table->string('deed_status')->nullable();
            $table->boolean('credit_eligible')->default(false);
            $table->string('status')->default('ACTIVE')->index();
            $table->boolean('featured')->default(false)->index();
            $table->foreignId('consultant_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
