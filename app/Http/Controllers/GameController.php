<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    // =========================================================================
    // 1. ส่วนดึงข้อมูล (GET)
    // =========================================================================

    public function getAllChallenges()
    {
        $challenges = DB::table('ccv_GameGeneral')
            ->where('Status', 1)
            ->get();

        return response()->json($challenges);
    }

    public function getChallenge($id)
    {
        $challenge = DB::table('ccv_GameGeneral')->where('Challenge_ID', $id)->first();
        if (!$challenge) {
            return response()->json(['message' => 'Not Found'], 404);
        }
        return response()->json($challenge);
    }

    public function getTemplate($id)
    {
        $template = DB::table('ccv_CodeTemplate')->where('Challenge_ID', $id)->get();
        return response()->json($template);
    }

    public function getColors()
    {
        $colors = DB::table('ccv_GameCodeColor')->get();
        return response()->json($colors);
    }

    public function getTextureImage(Request $request)
    {
        $challengeId = $request->query('challenge_id');
        $colorId = $request->query('color_id');
        $textureName = $request->query('texture_name');

        $challenge = DB::table('ccv_GameGeneral')->where('Challenge_ID', $challengeId)->first();
        if (!$challenge) return response()->json(['error' => 'Challenge not found'], 404);

        $cleanName = str_replace(' ', '', ucwords($challenge->Challenge));
        $tableName = "ccv_Texture" . $cleanName;

        try {
            $textureData = DB::table($tableName)
                ->where('Color_ID', $colorId)
                ->where('Texture_Name', $textureName)
                ->first();

            if ($textureData) {
                $dataAsArray = (array)$textureData;
                $imageFileName = end($dataAsArray);
                return response()->json(['image' => $imageFileName]);
            }

            return response()->json(['error' => 'Image not found in DB'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Database Error', 'message' => $e->getMessage()], 500);
        }
    }

    // =========================================================================
    // 2. ส่วนบันทึกข้อมูล (POST) - แก้ไขให้เชื่อม ID และสี
    // =========================================================================

    public function saveCode(Request $request)
    {
        date_default_timezone_set('Asia/Bangkok');

        // รับ ID มาจาก JS (ตัวแปรชื่อ ccv_UserCode_ID)
        $id = $request->input('ccv_UserCode_ID');

        if ($id) {
            // [กรณีที่ 2] UPDATE: ทำงานตอนกดปุ่ม "ยืนยัน" (หน้าตกแต่ง)

            // แต่ตัวแปรที่รับมาเราตั้งชื่อว่า $id (ซึ่งรับมาจาก input ccv_UserCode_ID)
            DB::table('ccv_UserCode')
                ->where('UserCode_ID', $id) // <-- ต้องใช้ชื่อคอลัมน์จริงใน DB
                ->update([
                    'User_ID'      => $request->input('User_ID'),
                    'Color_Name'   => $request->input('Color_Name'),
                    'Texture_Name' => $request->input('Texture_Name'),
                    'updated_at'   => now()
                ]);

            return response()->json(['message' => 'Updated & Linked Success', 'id' => $id]);
        } else {
            // [กรณีที่ 1] INSERT: ทำงานตอนกดปุ่ม RUN
            $newId = DB::table('ccv_UserCode')->insertGetId([
                'User_ID'      => 1,
                'User_Code'    => $request->input('User_Code'),
                'User_Point'   => $request->input('User_Point'),
                'Color_Name'   => $request->input('Color_Name', 'Default'),
                'Texture_Name' => $request->input('Texture_Name', 'None'),
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);

            return response()->json(['message' => 'Created Temp Success', 'id' => $newId]);
        }
    }

    public function saveGeneralData(Request $request)
    {
        date_default_timezone_set('Asia/Bangkok');

        try {
            $formattedTime = date('Y-m-d H:i:s');

            // ตรวจสอบค่า Image ถ้าเป็น null ให้ใส่ค่า Default ป้องกัน Error 500
            $imageName = $request->input('Image');
            if (empty($imageName)) {
                $imageName = 'default.png';
            }

            $newUserID = DB::table('ccv_UserGeneral')->insertGetId([
                'User_Name'     => $request->input('User_Name'),
                'Challenge_ID'  => $request->input('Challenge_ID'),
                'Image'         => $imageName,
                'Timestamp_Min' => (string)$request->input('Timestamp_Min'),
                'Time'          => $formattedTime,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);

            return response()->json([
                'message' => 'Save General Success',
                'new_user_id' => $newUserID
            ]);
        } catch (\Exception $e) {
            // ส่ง Error ออกไปดูว่าพังตรงไหน
            return response()->json(['error' => 'Save Failed: ' . $e->getMessage()], 500);
        }
    }

    // =========================================================================
    // 3. ส่วนหน้าจอ (View)
    // =========================================================================

    public function showGallery()
    {
        $images = DB::table('ccv_UserGeneral')
            ->join('ccv_GameGeneral', 'ccv_UserGeneral.Challenge_ID', '=', 'ccv_GameGeneral.Challenge_ID')
            ->select('ccv_UserGeneral.*', 'ccv_GameGeneral.Challenge')
            ->whereNotNull('ccv_UserGeneral.Image')
            // เรียงจาก ID มากไปน้อย (ล่าสุดขึ้นก่อน)
            ->orderBy('ccv_UserGeneral.User_ID', 'desc')
            ->paginate(8);

        return view('gallery', compact('images'));
    }

    public function showDetail($id)
    {
        $data = DB::table('ccv_UserGeneral')
            ->join('ccv_GameGeneral', 'ccv_UserGeneral.Challenge_ID', '=', 'ccv_GameGeneral.Challenge_ID')
            ->select('ccv_UserGeneral.*', 'ccv_GameGeneral.Challenge')
            ->where('ccv_UserGeneral.User_ID', $id)
            ->first();

        $ccv_UserCode = null;
        if ($data) {
            $ccv_UserCode = DB::table('ccv_UserCode')
                ->where('User_ID', $data->User_ID)
                // ดึงอันล่าสุดที่ User นี้เล่น (เผื่อมีหลายอัน)
                ->orderBy('created_at', 'desc')
                ->first();
        }

        return view('detail-result', compact('data', 'ccv_UserCode'));
    }
}
