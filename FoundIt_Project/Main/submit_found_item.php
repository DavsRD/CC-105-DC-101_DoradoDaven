<?php
require 'db_config.php';

$item_name = $_POST['item_title'] ?? '';
$cat_id = $_POST['category'] ?? null;
$location = $_POST['location'] ?? '';
$item_description = $_POST['description'] ?? '';
$photo_path_for_db = null;

if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = 'uploads/'; 

    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $file_name = time() . '_' . basename($_FILES['photo']['name']);
    $target_file = $upload_dir . $file_name;
    
    if (move_uploaded_file($_FILES['photo']['tmp_name'], $target_file)) {

        $photo_path_for_db = $target_file; 
    }
}

$sql = "INSERT INTO items (item_name, cat_id, location, item_description, photo_src) 
        VALUES (?, ?, ?, ?, ?)";
$stmt = $pdo->prepare($sql);

if ($stmt->execute([$item_name, $cat_id, $location, $item_description, $photo_path_for_db])) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->errorInfo()]);
}
?>