<?php

use App\Http\Controllers\ActivityController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [ActivityController::class, 'dashboard'])
        ->name('dashboard');

    Route::get('/activities', [ActivityController::class, 'index'])
        ->name('activities.index');

    Route::post('/activities', [ActivityController::class, 'store'])
        ->name('activities.store');

    Route::patch('/activities/{activity}', [ActivityController::class, 'update'])
        ->name('activities.update');

    Route::delete('/activities/{activity}', [ActivityController::class, 'destroy'])
        ->name('activities.destroy');

    Route::patch('/activities/{activity}/status', [
        ActivityController::class,
        'updateStatus',
    ])->name('activities.status');

    Route::get('/activity-history', [
        ActivityController::class,
        'history',
    ])->name('activities.history');
});

require __DIR__.'/settings.php';
