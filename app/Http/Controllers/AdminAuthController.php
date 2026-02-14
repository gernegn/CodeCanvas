<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
    public function showLogin()
    {
        return view('admin.login');
    }

    public function login(Request $request)
    {
        // ✅ แก้ไขตรงนี้: เปลี่ยน Key ของรหัสผ่านเป็น 'password' (ตัวเล็ก)
        $credentials = [
            'Email' => $request->email,    // ตรงกับชื่อ Column ใน DB (ใช้ตัวใหญ่ได้)
            'password' => $request->password, // 🔥 ต้องเป็น 'password' ตัวเล็กเสมอ!
        ];

        // เพิ่ม $request->filled('remember') ถ้าอยากให้มีระบบ "จำฉันไว้"
        if (Auth::guard('admin')->attempt($credentials)) {
            $request->session()->regenerate(); // แนะนำให้ใส่เพื่อความปลอดภัย (ป้องกัน Session Fixation)
            return redirect()->route('admin.dashboard');
        }

        return back()->withErrors(['email' => 'Email หรือ Password ไม่ถูกต้อง']);
    }

    public function logout()
    {
        Auth::guard('admin')->logout();

        // ควร Invalidate session ด้วยเพื่อความปลอดภัยสูงสุด
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect()->route('login');
    }
}
