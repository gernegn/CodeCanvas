<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes; // ✅ ใช้ SoftDeletes เพราะคุณต้องการ deleted_at

class UserCode extends Model
{
    use HasFactory;

    protected $table = 'ccv_UserCode';
    protected $primaryKey = 'UserCode_ID'; // ชื่อ Primary Key ของคุณ

    // ถ้าตารางไม่มี created_at, updated_at ให้ใส่บรรทัดนี้
    // public $timestamps = false;

    // กำหนดฟิลด์ที่อนุญาตให้แก้ไข (Mass Assignment)
    protected $fillable = ['User_Code', 'Color_Name', 'Texture', 'deleted_at'];

    // สำคัญ: ต้องระบุว่าฟิลด์ deleted_at เป็นวันที่
    protected $dates = ['deleted_at'];
}
