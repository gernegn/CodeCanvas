<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TotalPlay extends Model
{
    use HasFactory;

    protected $table = 'ccv_TotalPlay';
    protected $primaryKey = 'TotalPlay_ID';

    // ✅ เพิ่มฟังก์ชันนี้เพื่อดึงชื่อเกมจากตาราง GameGeneral
    public function game()
    {
        // เชื่อมด้วย Challenge_ID ที่เป็น Foreign Key
        return $this->belongsTo(GameGeneral::class, 'Challenge_ID', 'Challenge_ID');
    }
}
