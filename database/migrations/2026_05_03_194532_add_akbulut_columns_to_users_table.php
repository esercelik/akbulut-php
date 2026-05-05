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
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('id');
            $table->string('slug')->nullable()->unique()->after('username');
            $table->string('surname')->nullable()->after('name');
            $table->string('role')->default('CONSULTANT')->after('password');
            $table->string('title')->default('Gayrimenkul Danışmanı')->after('role');
            $table->string('phone')->nullable()->after('title');
            $table->string('region')->nullable()->after('phone');
            $table->text('bio')->nullable()->after('region');
            $table->string('image_url')->nullable()->after('bio');
            $table->boolean('active')->default(true)->after('image_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['username']);
            $table->dropUnique(['slug']);
            $table->dropColumn([
                'username',
                'slug',
                'surname',
                'role',
                'title',
                'phone',
                'region',
                'bio',
                'image_url',
                'active',
            ]);
        });
    }
};
