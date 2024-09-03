<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Capture incoming POST data from Teams webhook
$data = json_decode(file_get_contents("php://input"));

if (isset($data->text)) {
    // Your logic to map the incoming message back to the specific user
    $incomingMessage = $data->text;

    // For example, if the message contains the user's name, route it accordingly
    // Further processing...

    echo json_encode(["status" => "success", "message" => "Received"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}
?>
