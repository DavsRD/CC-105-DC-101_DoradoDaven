<?php
require 'db_config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['item_id'])) {
    echo json_encode(['success' => false, 'message' => 'No item ID provided']);
    exit;
}

$item_id = $data['item_id']; // Ensure this matches what JS sends

// 1. Get photo path to delete the physical file
$stmt = $pdo->prepare("SELECT photo_src FROM items WHERE item_id = ?");
$stmt->execute([$item_id]);
$item = $stmt->fetch();

if ($item && $item['photo_src'] && file_exists($item['photo_src'])) {
    unlink($item['photo_src']);
}

// 2. Delete the item. Because of ON DELETE CASCADE, the claim record 
// in the other table will be deleted automatically by the database.
$stmt = $pdo->prepare("DELETE FROM items WHERE item_id = ?");
$success = $stmt->execute([$item_id]);

echo json_encode(['success' => $success]);
?>