<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // รายชื่อตารางที่ต้องการเปลี่ยน (จากรูปภาพ)
        $tables = [
            'ccv_CodeTemplate'          => 'ccv_CodeTemplate',
            'ccv_GameCodeColor'         => 'ccv_GameCodeColor',
            'ccv_TextureBread'          => 'ccv_TextureBread',
            'ccv_TextureChristmasTree'  => 'ccv_TextureChristmasTree',
            'ccv_TextureFish'           => 'ccv_TextureFish',
            'ccv_TextureGiraffe'        => 'ccv_TextureGiraffe',
            'ccv_TextureHairBlush'      => 'ccv_TextureHairBlush',
            'ccv_TextureHeart'          => 'ccv_TextureHeart',
            'ccv_TextureHouse'          => 'ccv_TextureHouse',
            'ccv_TextureSock'           => 'ccv_TextureSock',
            'ccv_TextureWhale'          => 'ccv_TextureWhale',
            'ccv_TextureWorm'           => 'ccv_TextureWorm',
            'ccv_TotalPlay'             => 'ccv_TotalPlay',
            'ccv_UserCode'              => 'ccv_UserCode',
            'ccv_UserGeneral'           => 'ccv_UserGeneral',
            // หมายเหตุ: GameGeneral ไม่เห็นในรูป ถ้าต้องการเปลี่ยนด้วยให้เพิ่มบรรทัดนี้:
            // 'GameGeneral'        => 'ccv_GameGeneral',
        ];

        Schema::disableForeignKeyConstraints();

        foreach ($tables as $oldName => $newName) {
            if (Schema::hasTable($oldName)) {
                Schema::rename($oldName, $newName);
            }
        }

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        // รายชื่อเดิมสำหรับ Rollback
        $tables = [
            'ccv_CodeTemplate'          => 'ccv_CodeTemplate',
            'ccv_GameCodeColor'         => 'ccv_GameCodeColor',
            'ccv_TextureBread'          => 'ccv_TextureBread',
            'ccv_TextureChristmasTree'  => 'ccv_TextureChristmasTree',
            'ccv_TextureFish'           => 'ccv_TextureFish',
            'ccv_TextureGiraffe'        => 'ccv_TextureGiraffe',
            'ccv_TextureHairBlush'      => 'ccv_TextureHairBlush',
            'ccv_TextureHeart'          => 'ccv_TextureHeart',
            'ccv_TextureHouse'          => 'ccv_TextureHouse',
            'ccv_TextureSock'           => 'ccv_TextureSock',
            'ccv_TextureWhale'          => 'ccv_TextureWhale',
            'ccv_TextureWorm'           => 'ccv_TextureWorm',
            'ccv_TotalPlay'             => 'ccv_TotalPlay',
            'ccv_UserCode'              => 'ccv_UserCode',
            'ccv_UserGeneral'           => 'ccv_UserGeneral',
            // 'GameGeneral'       => 'ccv_GameGeneral',
        ];

        Schema::disableForeignKeyConstraints();

        // เปลี่ยนชื่อกลับ (จาก New -> Old)
        foreach ($tables as $oldName => $newName) {
            if (Schema::hasTable($newName)) {
                Schema::rename($newName, $oldName);
            }
        }

        Schema::enableForeignKeyConstraints();
    }
};
