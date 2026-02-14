<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // คำสั่งเปลี่ยนชื่อตาราง: Schema::rename('ชื่อเก่า', 'ชื่อใหม่');
        if (Schema::hasTable('GameGeneral')) {
            Schema::rename('GameGeneral', 'ccv_GameGeneral');
        }
    }

    public function down(): void
    {
        // สลับชื่อกลับกรณี Rollback
        if (Schema::hasTable('ccv_GameGeneral')) {
            Schema::rename('ccv_GameGeneral', 'GameGeneral');
        }
    }
};
