<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameGeneral extends Model
{
    use HasFactory;

    // 1. ระบุชื่อตารางให้ชัดเจน (สำคัญมาก เพราะชื่อตารางคุณไม่ใช่รูปพหูพจน์ game_generals)
    protected $table = 'ccv_GameGeneral';

    // 2. ระบุ Primary Key (เพราะ Laravel จะมองหา 'id' อัตโนมัติ แต่ของคุณคือ 'Challenge_ID')
    protected $primaryKey = 'Challenge_ID';

    // 3. ปิด Timestamp (ถ้าตารางคุณไม่มี created_at, updated_at ให้ใส่บรรทัดนี้)
    // จากรูป phpMyAdmin ดูเหมือนจะมีคอลัมน์นี้อยู่แล้ว ก็ไม่ต้องใส่ public $timestamps = false; ครับ

    // 4. (Optional) ระบุฟิลด์ที่อนุญาตให้แก้ไขได้
    protected $fillable = [
        'Challenge',
        'Original_Image',
        'Example_Image',
        'Status',
        'Result_Image'
    ];
}
