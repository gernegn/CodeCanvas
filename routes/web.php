<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;

// --- Frontend Part ---

Route::get('/', function () {
    return view('home');
})->name('game.home');

Route::get('/random', function () {
    return view('random');
})->name('game.random'); // ตั้งชื่อ Route ไว้เพื่อให้เรียกใช้ง่ายๆ

Route::get('/tutorial', function () {
    return view('tutorial');
})->name('game.tutorial');

Route::get('/gallery', [GameController::class, 'showGallery'])->name('game.gallery');

Route::get('/play', function () {
    return view('main-game'); // หรือชื่อไฟล์ blade ของหน้าเล่นเกม
})->name('game.main-game');

Route::get('/result', function () {
    return view('result'); // หรือชื่อไฟล์ blade ของหน้าเล่นเกม
})->name('game.result');

Route::get('/custom', function () {
    return view('custom'); // หรือชื่อไฟล์ blade ของหน้าเล่นเกม
})->name('game.custom');

Route::get('/gallery/detail/{id}', [GameController::class, 'showDetail'])->name('game.detail');


// ---- Back Office Part ---

// Admin Login
Route::get('/admin/login', [AdminAuthController::class, 'showLogin'])
    ->name('login');

Route::post('/admin/login', [AdminAuthController::class, 'login'])
    ->name('admin.login.submit');

// BackEnd (ต้อง login ก่อน)
Route::middleware('auth:admin')->prefix('admin')->group(function () {

    Route::get('/dashboard', [AdminController::class, 'index'])
        ->name('admin.dashboard');

    Route::get('/game-general', [AdminController::class, 'gameGeneral'])
        ->name('admin.game-general');

    Route::get('/game-code', [AdminController::class, 'gameCode'])
        ->name('admin.game-code');

    Route::get('/users', [AdminController::class, 'userGeneral'])
        ->name('admin.users');

    Route::delete('/users/delete/{id}', [AdminController::class, 'deleteUserGeneral'])
        ->name('admin.users.delete');

    Route::get('/user-code', [AdminController::class, 'userCode'])
        ->name('admin.user-code');

    Route::post('/logout', [AdminAuthController::class, 'logout'])
        ->name('admin.logout');

    Route::post('/game-general/update-status', [AdminController::class, 'updateGameStatus'])
        ->name('admin.game.update-status');

    // Route สำหรับลบ
    Route::delete('/user-code/delete/{id}', [AdminController::class, 'deleteUserCode'])
        ->name('admin.user-code.delete');
});
