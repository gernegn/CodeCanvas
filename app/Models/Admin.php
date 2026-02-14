<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $table = 'ccv_Admin';
    protected $primaryKey = 'Admin_ID';
    public $timestamps = false;

    protected $fillable = [
        'Email',
        'Password',
    ];

    protected $hidden = [
        'Password',
    ];

    // 🔥 ส่วนที่ต้องเพิ่ม: บอก Laravel ว่ารหัสผ่านอยู่ที่คอลัมน์ 'Password'
    public function getAuthPassword()
    {
        return $this->Password;
    }
}
