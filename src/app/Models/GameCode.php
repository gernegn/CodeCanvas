<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameCode extends Model  // ✅ แก้ชื่อ Class เป็น GameCode
{
    use HasFactory;

    protected $table = 'ccv_GameCodeColor';
    protected $primaryKey = 'Color_ID'; // Primary Key (เช็คว่าตรงกับใน DB ไหม)
}
