<?php
// ===========================
//  SAVE RESULT IMAGE — save.php
// ===========================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// เปิดแสดง Error ของ PHP ชั่วคราวเพื่อใช้แก้ปัญหา
ini_set('display_errors', 1);
error_reporting(E_ALL);

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['image']) || !isset($input['filename'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: No image or filename data received.']);
    exit;
}

$base64   = $input['image'];
$filename = $input['filename'];

// กรองอักขระ
$filename = basename($filename);
$filename = preg_replace('/[^a-zA-Z0-9_\-\.]/', '', $filename);
$filename = preg_replace('/\.(?!png$).*/', '', $filename) . '.png';

$saveDir = __DIR__ . '/img-results/';

// เช็คและสร้างโฟลเดอร์ พร้อมดัก Error
if (!is_dir($saveDir)) {
    if (!mkdir($saveDir, 0777, true)) {
        $error = error_get_last();
        echo json_encode(['success' => false, 'message' => 'Failed to create directory. Error: ' . ($error['message'] ?? 'Unknown')]);
        exit;
    }
}

$imageData = base64_decode($base64);

if ($imageData === false) {
    echo json_encode(['success' => false, 'message' => 'Invalid base64 data']);
    exit;
}

if (substr($imageData, 0, 8) !== "\x89PNG\r\n\x1a\n") {
    echo json_encode(['success' => false, 'message' => 'Not a valid PNG file. Magic bytes do not match.']);
    exit;
}

// -------------------------------------------------------
// บันทึกไฟล์ พร้อมดัก Error ที่แท้จริง
// -------------------------------------------------------
$filePath = $saveDir . $filename;
$result   = file_put_contents($filePath, $imageData);

if ($result === false) {
    // ดึงข้อความ Error สุดท้ายจากระบบออกมาดู
    $error = error_get_last();
    $errorMessage = $error ? $error['message'] : 'Permission denied or unknown error.';
    echo json_encode(['success' => false, 'message' => 'Failed to save file. Server Error: ' . $errorMessage]);
    exit;
}

echo json_encode([
    'success'  => true,
    'filename' => $filename,
    'path'     => 'img-results/' . $filename,
    'size'     => $result,
]);
