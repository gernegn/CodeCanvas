<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // สำหรับคำสั่ง SQL
use App\Models\GameGeneral;
use App\Models\UserCode;
use App\Models\GameCode;
use App\Models\UserGeneral;
use App\Models\TotalPlay;

class AdminController extends Controller
{
    // ==========================================
    // 1. ฟังก์ชันสำหรับหน้า Dashboard
    // ==========================================
    public function index()
    {
        // 1. นับจำนวน Total Plays จากตารางคนที่เล่นจริงๆ (UserGeneral)
        $totalPlays = UserGeneral::count();

        // 2. คำนวณ Most Played Challenge จากข้อมูลคนเล่นจริง
        $topChallenges = UserGeneral::select('Challenge_ID', DB::raw('count(*) as total_count'))
            ->with('game')
            ->groupBy('Challenge_ID')
            ->orderBy('total_count', 'desc')
            ->take(3)
            ->get();

        $rank1 = $topChallenges->get(0);
        $rank2 = $topChallenges->get(1);
        $rank3 = $topChallenges->get(2);

        // ปรับสูตรคำนวณเปอเซ็นต์ให้ดึงค่า total_count
        $calcPercent = function ($item) use ($totalPlays) {
            return ($totalPlays > 0 && $item)
                ? number_format(($item->total_count / $totalPlays) * 100, 2)
                : 0;
        };

        // Recent Activity
        $recentActivities = UserGeneral::latest('created_at')->take(2)->get();

        // กราฟแท่งรายชั่วโมง
        $hourlyStats = UserGeneral::select(DB::raw('HOUR(created_at) as hour'), DB::raw('count(*) as count'))
            ->whereDate('created_at', now()->today())
            ->groupBy('hour')
            ->pluck('count', 'hour')
            ->toArray();

        $chartData = array_fill(0, 24, 0);

        foreach ($hourlyStats as $hour => $count) {
            $chartData[$hour] = $count;
        }

        $maxCount = max($chartData);
        $yAxisMax = $maxCount > 10 ? $maxCount : 10;

        return view('admin.dashboard', compact(
            'totalPlays',
            'recentActivities',
            'rank1',
            'rank2',
            'rank3',
            'calcPercent',
            'chartData',
            'yAxisMax'
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
    public function userCode(Request $request)
    {
        $sort = $request->get('sort', 'desc');
        $search = $request->get('search');

        // โหลดข้อมูลทั้งหมดตาม sort
        $allData = UserCode::orderBy('created_at', $sort)->get();

        $userCodes = $allData;

        if ($search) {

            // ค้นหาตามลำดับ
            if (is_numeric($search)) {
                $index = (int)$search - 1;
                $userCodes = $allData->slice($index, 1);
            } else {
                $userCodes = $allData->filter(function ($item) use ($search) {
                    return str_contains($item->User_Code, $search)
                        || str_contains($item->Color_Name, $search)
                        || str_contains($item->Texture_Name, $search);
                });
            }
        }

        return view('admin.user-code', [
            'userCodes' => $userCodes,
            'allData' => $allData,   // ⭐ ส่งข้อมูลทั้งหมดไปด้วย
            'sort' => $sort
        ]);
    }

    public function deleteUserCode($id)
    {
        $code = UserCode::find($id);

        if ($code) {
            $userId = $code->User_ID;

            if ($userId) {
                // ✅ ไม่ต้องสั่ง decrement TotalPlay แล้ว ลบ UserGeneral ไปเลย สถิติจะอัปเดตเอง
                UserGeneral::where('User_ID', $userId)->delete();
            }

            UserCode::where('UserCode_ID', $id)->delete();

            if (UserCode::count() == 0) {
                DB::statement('ALTER TABLE ccv_UserCode AUTO_INCREMENT = 1');
            }
            if (UserGeneral::count() == 0) {
                DB::statement('ALTER TABLE ccv_UserGeneral AUTO_INCREMENT = 1');
            }

            return redirect()->back()->with('success', 'User Code and stats deleted successfully');
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
        $search = $request->get('search');

        // 1. โหลดข้อมูลทั้งหมดตามลำดับที่เลือก
        $allData = UserGeneral::with('game')
            ->orderBy('created_at', $sort)
            ->get();

        // ค่าเริ่มต้น = แสดงทั้งหมด
        $users = $allData;

        // 2. ถ้ามีการค้นหา
        if ($search) {

            // -------------------------
            // กรณีค้นหาเป็นตัวเลข = ค้นหาตาม "ลำดับ"
            // -------------------------
            if (is_numeric($search)) {
                $index = (int)$search - 1; // ลำดับเริ่มที่ 1
                $users = $allData->slice($index, 1);
            }

            // -------------------------
            // กรณีค้นหาเป็นข้อความ
            // -------------------------
            else {
                $users = $allData->filter(function ($item) use ($search) {

                    // ชื่อผู้ใช้
                    $matchName = $item->User_Name &&
                        stripos($item->User_Name, $search) !== false;

                    // ชื่อ Challenge
                    $matchChallenge = $item->game &&
                        stripos($item->game->Challenge, $search) !== false;

                    return $matchName || $matchChallenge;
                });
            }
        }

        // 3. ส่งข้อมูลไปที่ View
        return view('admin.user-general', [
            'users'   => $users,
            'allData' => $allData, // ใช้คำนวณลำดับเดิมใน Blade
            'sort'    => $sort
        ]);
    }

    public function deleteUserGeneral($id)
    {
        $user = UserGeneral::find($id);

        if ($user) {
            // ✅ ไม่ต้องสั่ง decrement TotalPlay แล้ว
            UserCode::where('User_ID', $id)->delete();
            $user->delete();

            if (UserGeneral::count() == 0) {
                DB::statement('ALTER TABLE ccv_UserGeneral AUTO_INCREMENT = 1');
            }
            if (UserCode::count() == 0) {
                DB::statement('ALTER TABLE ccv_UserCode AUTO_INCREMENT = 1');
            }

            return redirect()->back()->with('success', 'User and stats deleted successfully');
        }

        return redirect()->back()->with('error', 'User not found');
    }
}
