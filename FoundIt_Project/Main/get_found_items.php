<?php
require 'db_config.php';

// We join 'items' with 'categories' to get the 'category_name'
$sql = "SELECT items.*, categories.category_name 
        FROM items 
        LEFT JOIN categories ON items.cat_id = categories.category_id 
        WHERE items.status = 'active' 
        ORDER BY items.created_at DESC";

$stmt = $pdo->query($sql);
$items = $stmt->fetchAll();

echo json_encode($items);
?>