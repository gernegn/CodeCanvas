<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;

Route::get('/all-challenges', [GameController::class, 'getAllChallenges']);
Route::get('/challenge/{id}', [GameController::class, 'getChallenge']);
Route::get('/template/{id}', [GameController::class, 'getTemplate']);
Route::get('/colors', [GameController::class, 'getColors']);
Route::get('/get-texture-image', [GameController::class, 'getTextureImage']);

Route::post('/save-code', [GameController::class, 'saveCode']);
Route::post('/save-general', [GameController::class, 'saveGeneralData']);
Route::get('/gallery', [GameController::class, 'game.gallery']);
