<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class UserGeneral extends Model
{
    use HasFactory; // ✅ 2. ใช้งาน SoftDeletes

    protected $table = 'ccv_UserGeneral';
    protected $primaryKey = 'User_ID';

    // ✅ 3. สร้างความสัมพันธ์เพื่อไปดึงชื่อ Challenge จากตาราง GameGeneral
    public function game()
    {
        // belongsTo(Model ปลายทาง, FK ของเรา, PK ของเขา)
        return $this->belongsTo(GameGeneral::class, 'Challenge_ID', 'Challenge_ID');
    }

    // กำหนดให้ deleted_at เป็น date
    protected $dates = ['deleted_at'];
}
