<?php
require 'db_config.php';

$sql = "SELECT items.*, categories.category_name, 
               claims.student_name, claims.student_id, claims.student_course, claims.claimed_at
        FROM items 
        LEFT JOIN categories ON items.cat_id = categories.category_id
        LEFT JOIN claims ON items.item_id = claims.item_id
        WHERE items.status = 'archived' 
        ORDER BY claims.claimed_at DESC";

$stmt = $pdo->query($sql);
$items = $stmt->fetchAll();

echo json_encode($items);
?>