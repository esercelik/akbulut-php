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
        Schema::table('properties', function (Blueprint $table) {
            $table->string('ilan_no')->nullable()->unique()->after('slug');
            $table->date('ilan_tarihi')->nullable()->after('ilan_no');
            $table->unsignedInteger('brut_m2')->nullable()->after('square_meters');
            $table->unsignedInteger('net_m2')->nullable()->after('brut_m2');
            $table->string('mutfak')->nullable()->after('bathroom_count');
            $table->boolean('asansor')->default(false)->after('balcony');
            $table->boolean('otopark')->default(false)->after('asansor');
            $table->boolean('site_icerisinde')->default(false)->after('usage_status');
            $table->string('site_adi')->nullable()->after('site_icerisinde');
            $table->unsignedInteger('aidat')->nullable()->after('site_adi');
            $table->string('enerji_kimlik_belgesi')->nullable()->after('credit_eligible');
            $table->string('kimden')->nullable()->after('deed_status');
            $table->boolean('takas')->default(false)->after('kimden');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropUnique(['ilan_no']);
            $table->dropColumn([
                'ilan_no',
                'ilan_tarihi',
                'brut_m2',
                'net_m2',
                'mutfak',
                'asansor',
                'otopark',
                'site_icerisinde',
                'site_adi',
                'aidat',
                'enerji_kimlik_belgesi',
                'kimden',
                'takas',
            ]);
        });
    }
};
