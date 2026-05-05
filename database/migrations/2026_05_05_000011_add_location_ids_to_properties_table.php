<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table): void {
            $table->foreignId('city_id')->nullable()->after('price')->constrained('cities')->nullOnDelete();
            $table->foreignId('district_id')->nullable()->after('city_id')->constrained('districts')->nullOnDelete();
            $table->foreignId('neighborhood_id')->nullable()->after('district_id')->constrained('neighborhoods')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('neighborhood_id');
            $table->dropConstrainedForeignId('district_id');
            $table->dropConstrainedForeignId('city_id');
        });
    }
};
