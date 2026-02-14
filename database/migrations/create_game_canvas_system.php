<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. ตาราง Admin
        Schema::create('Admin', function (Blueprint $table) {
            $table->id('Admin_ID');
            $table->string('Email');
            $table->string('Password');
            $table->timestamps();
        });

        // 2. ตาราง GameGeneral
        Schema::create('GameGeneral', function (Blueprint $table) {
            $table->id('Challenge_ID');
            $table->string('Challenge')->nullable();
            $table->binary('Original_Image')->nullable();
            $table->binary('Example_Image')->nullable();
            $table->integer('Status')->default(1);
            $table->binary('Result_Image')->nullable();
            $table->timestamps();
        });

        // 3. ตาราง ccv_CodeTemplate
        Schema::create('ccv_CodeTemplate', function (Blueprint $table) {
            $table->id('Code_Template_ID');
            $table->text('Code_Start')->nullable();
            $table->text('Code_Point')->nullable();
            $table->foreignId('Challenge_ID')->constrained('ccv_GameGeneral', 'Challenge_ID')->onDelete('cascade');
            $table->timestamps();
        });

        // 4. ตาราง ccv_GameCodeColor
        Schema::create('ccv_GameCodeColor', function (Blueprint $table) {
            $table->id('Color_ID');
            $table->string('Color_Name')->nullable();
            $table->string('Color_Code')->nullable();
            $table->timestamps();
        });

        // 5. ตาราง GameCodeTexture
        Schema::create('GameCodeTexture', function (Blueprint $table) {
            $table->id('Texture_ID');
            $table->foreignId('Color_ID')->constrained('ccv_GameCodeColor', 'Color_ID')->onDelete('cascade');
            $table->string('Texture_Name')->nullable();
            $table->string('Texture_Bread')->nullable();
            $table->string('Texture_ChristmasTree')->nullable();
            $table->string('Texture_Fish')->nullable();
            $table->string('Texture_Giraffe')->nullable();
            $table->string('Texture_HairBlush')->nullable();
            $table->string('Texture_Heart')->nullable();
            $table->string('Texture_House')->nullable();
            $table->string('Texture_Sock')->nullable();
            $table->string('Texture_Whale')->nullable();
            $table->string('Texture_Worm')->nullable();
            $table->timestamps();
        });

        // 6. ตาราง ccv_TotalPlay
        Schema::create('ccv_TotalPlay', function (Blueprint $table) {
            $table->id('ccv_TotalPlay_ID');
            $table->foreignId('Challenge_ID')->constrained('ccv_GameGeneral', 'Challenge_ID')->onDelete('cascade');
            $table->integer('Total_Play')->default(0);
            $table->timestamps();
        });

        // 7. ตาราง ccv_UserGeneral
        Schema::create('ccv_UserGeneral', function (Blueprint $table) {
            $table->id('User_ID');
            $table->string('Challenge')->nullable();
            $table->string('Image')->nullable();
            $table->integer('Timestamp_Min')->nullable();
            $table->binary('Animation')->nullable();
            $table->integer('Time')->nullable();
            $table->integer('Delete')->default(0);
            $table->timestamps();
        });

        // 8. ตาราง ccv_UserCode
        Schema::create('ccv_UserCode', function (Blueprint $table) {
            $table->id('ccv_UserCode_ID');
            $table->integer('User_ID'); // หรือโยง FK ไป ccv_UserGeneral
            $table->text('User_Code')->nullable();
            $table->string('Color_Name')->nullable();
            $table->string('Texture_Name')->nullable();
            $table->text('User_Point')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ccv_UserCode');
        Schema::dropIfExists('ccv_UserGeneral');
    }
};
