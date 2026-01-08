<?php
require 'db_config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

try {
    // Start a transaction so both things happen, or neither happens
    $pdo->beginTransaction();

    // 1. Insert into the claims table
    $sqlClaim = "INSERT INTO claims (item_id, student_name, student_id, student_course) 
                 VALUES (?, ?, ?, ?)";
    $stmtClaim = $pdo->prepare($sqlClaim);
    $stmtClaim->execute([
        $data['itemId'],
        $data['studentName'],
        $data['studentId'],
        $data['studentCourse']
    ]);

    // 2. Update the status in the items table
    $sqlUpdate = "UPDATE items SET status = 'archived' WHERE item_id = ?";
    $stmtUpdate = $pdo->prepare($sqlUpdate);
    $stmtUpdate->execute([$data['itemId']]);

    $pdo->commit();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>