<?php

use App\Http\Controllers\Admin\ConsultantsController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ListingPdfImportController;
use App\Http\Controllers\Admin\ListingsController;
use App\Http\Controllers\Admin\MessagesController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PublicStorageController;
use App\Http\Controllers\Web\ConsultantPortfolioController;
use App\Http\Controllers\Web\ConsultantsController as WebConsultantsController;
use App\Http\Controllers\Web\ContactRequestController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ListingController as WebListingController;
use App\Http\Controllers\Web\SeoController;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('seo.sitemap');
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('seo.robots');
Route::get('/storage/{path}', PublicStorageController::class)
    ->where('path', '.*')
    ->withoutMiddleware([HandleAppearance::class, HandleInertiaRequests::class])
    ->name('public-storage.show');
Route::get('/locations/cities', [LocationController::class, 'cities'])->name('locations.cities');
Route::get('/locations/districts', [LocationController::class, 'districts'])->name('locations.districts');
Route::get('/locations/neighborhoods', [LocationController::class, 'neighborhoods'])->name('locations.neighborhoods');
Route::get('/listings', [WebListingController::class, 'show'])->name('listings.index');
Route::get('/listings/{reference}', [WebListingController::class, 'legacyDetails'])->name('listings.show');
Route::get('/ilan/{reference}', [WebListingController::class, 'details'])->name('properties.show');
Route::get('/consultants', WebConsultantsController::class)->name('consultants.index');
Route::get('/danisman/{consultant:slug}', ConsultantPortfolioController::class)->name('consultants.show');
Route::post('/contact-requests', [ContactRequestController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('contact-requests.store');

Route::inertia('/about', 'site/about')->name('about');
Route::inertia('/contact', 'site/contact')->name('contact');
Route::get('/admin/login', fn () => auth()->check()
    ? redirect()->route('dashboard')
    : Inertia::render('site/admin-login', [
        'status' => session('status'),
    ]))->name('admin.login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', DashboardController::class)->name('dashboard');
        Route::get('listings', ListingsController::class)->name('listings.index');
        Route::get('listings/create', [ListingsController::class, 'create'])->name('listings.create');
        Route::post('listings/import-pdf', ListingPdfImportController::class)
            ->middleware('throttle:6,1')
            ->name('listings.import-pdf');
        Route::post('listings', [ListingsController::class, 'store'])->name('listings.store');
        Route::get('listings/{property}/edit', [ListingsController::class, 'edit'])->whereNumber('property')->name('listings.edit');
        Route::put('listings/{property}', [ListingsController::class, 'update'])->whereNumber('property')->name('listings.update');
        Route::delete('listings/{property}', [ListingsController::class, 'destroy'])->whereNumber('property')->name('listings.destroy');
        Route::get('consultants', ConsultantsController::class)->name('consultants.index');
        Route::post('consultants', [ConsultantsController::class, 'store'])->name('consultants.store');
        Route::get('consultants/{consultant}/edit', [ConsultantsController::class, 'edit'])->name('consultants.edit');
        Route::post('consultants/{consultant}/profile-photo', [ConsultantsController::class, 'updateProfilePhoto'])->name('consultants.profile-photo.update');
        Route::put('consultants/{consultant}', [ConsultantsController::class, 'update'])->name('consultants.update');
        Route::delete('consultants/{consultant}', [ConsultantsController::class, 'destroy'])->name('consultants.destroy');
        Route::get('messages', MessagesController::class)->name('messages.index');
        Route::put('messages/{message}', [MessagesController::class, 'update'])->name('messages.update');
        Route::delete('messages/{message}', [MessagesController::class, 'destroy'])->name('messages.destroy');
        Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::put('settings', [SettingsController::class, 'update'])->name('settings.update');
    });
});

require __DIR__.'/settings.php';
