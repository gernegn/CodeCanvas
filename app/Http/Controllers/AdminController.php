<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // ✅ เพิ่มบรรทัดนี้สำคัญมาก! สำหรับคำสั่ง SQL
use App\Models\GameGeneral;
use App\Models\UserCode;
use App\Models\GameCode;
use App\Models\UserGeneral;
use App\Models\TotalPlay;

class AdminController extends Controller
{
    // ==========================================
    // 1. ฟังก์ชันสำหรับหน้า Dashboard (อัปเดตล่าสุด: เพิ่มกราฟ)
    // ==========================================
    public function index()
    {
        // --- ส่วนที่ 1: คำนวณ Ranking (เหมือนเดิม) ---
        $totalPlays = TotalPlay::sum('Total_Play');

        $topChallenges = TotalPlay::with('game')
            ->orderBy('Total_Play', 'desc')
            ->take(3)
            ->get();

        $rank1 = $topChallenges->get(0);
        $rank2 = $topChallenges->get(1);
        $rank3 = $topChallenges->get(2);

        $calcPercent = function ($item) use ($totalPlays) {
            return ($totalPlays > 0 && $item)
                ? number_format(($item->Total_Play / $totalPlays) * 100, 2)
                : 0;
        };

        // --- ส่วนที่ 2: Recent Activity (เหมือนเดิม) ---
        $recentActivities = UserGeneral::latest('created_at')->take(2)->get();

        // --- ✅ ส่วนที่ 3: กราฟแท่งรายชั่วโมง (เพิ่มใหม่) ---

        // 3.1 ดึงข้อมูลเฉพาะ "วันนี้" และนับแยกตามชั่วโมง (0-23)
        $hourlyStats = UserGeneral::select(DB::raw('HOUR(created_at) as hour'), DB::raw('count(*) as count'))
            ->whereDate('created_at', now()->today())
            ->groupBy('hour')
            ->pluck('count', 'hour')
            ->toArray();

        // 3.2 สร้าง Array เตรียมไว้ 24 ช่อง (ค่าเริ่มต้นเป็น 0)
        $chartData = array_fill(0, 24, 0);

        // 3.3 เอาข้อมูลจริงใส่ลงไป
        foreach ($hourlyStats as $hour => $count) {
            $chartData[$hour] = $count;
        }

        // 3.4 หาค่าสูงสุดเพื่อกำหนดสเกลแกน Y (ต่ำสุดคือ 10)
        $maxCount = max($chartData);
        $yAxisMax = $maxCount > 10 ? $maxCount : 10;

        // ส่งตัวแปรทั้งหมดไปที่หน้า View
        return view('admin.dashboard', compact(
            'totalPlays',
            'recentActivities',
            'rank1',
            'rank2',
            'rank3',
            'calcPercent',
            'chartData', // ✅ ส่งตัวแปรใหม่
            'yAxisMax'   // ✅ ส่งตัวแปรใหม่
        ));
    }

    // ==========================================
    // 2. ฟังก์ชันสำหรับหน้า Game General
    // ==========================================
    public function gameGeneral()
    {
        $games = GameGeneral::all();
        return view('admin.game-general', compact('games'));
    }

    public function updateGameStatus(Request $request)
    {
        $game = GameGeneral::find($request->id);

        if ($game) {
            $game->Status = $request->status;
            $game->save();
            return response()->json(['success' => true, 'message' => 'Status updated successfully']);
        }

        return response()->json(['success' => false, 'message' => 'Game not found']);
    }

    // ==========================================
    // 3. ฟังก์ชันหน้า User Code
    // ==========================================
    public function userCode(Request $request) // ✅ 1. รับ Request เข้ามา
    {
        // ✅ 2. รับค่า 'sort' จาก URL (ถ้าไม่มีให้เป็น 'desc' คือล่าสุดก่อน)
        $sort = $request->get('sort', 'desc');

        // ✅ 3. ดึงข้อมูลและสั่งเรียงลำดับ
        // (เรียงตาม created_at หรือ UserCode_ID ก็ได้)
        $userCodes = UserCode::orderBy('created_at', $sort)->get();

        // ✅ 4. ส่งตัวแปร $sort ไปที่หน้า View ด้วย (แก้ Error $sort is undefined)
        return view('admin.user-code', compact('userCodes', 'sort'));
    }

    public function deleteUserCode($id)
    {
        $code = UserCode::find($id);

        if ($code) {
            $code->delete();
            return redirect()->back()->with('success', 'User Code deleted successfully');
        }

        return redirect()->back()->with('error', 'User Code not found');
    }

    // ==========================================
    // 4. ฟังก์ชันหน้า Game Code
    // ==========================================
    public function gameCode()
    {
        $colors = GameCode::all();

        $sortedColors = $colors->sortBy(function ($color) {
            return $color->Color_Name === 'None' ? 0 : 1;
        });

        return view('admin.game-code', ['colors' => $sortedColors]);
    }

    // ==========================================
    // 5. ฟังก์ชันหน้า User General
    // ==========================================
    public function userGeneral(Request $request)
    {
        $sort = $request->get('sort', 'desc');

        $users = UserGeneral::with('game')
            ->orderBy('created_at', $sort)
            ->get();

        return view('admin.user-general', compact('users', 'sort'));
    }

    public function deleteUserGeneral($id)
    {
        $user = UserGeneral::find($id);

        if ($user) {
            $user->delete();
            return redirect()->back()->with('success', 'User deleted successfully');
        }

        return redirect()->back()->with('error', 'User not found');
    }
}
