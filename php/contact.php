<?php
/**
 * ============================================
 * AGROCONSULTING - FORMULAIRE DE CONTACT
 * ============================================
 * Envoi vers: globalagroconsoltingsarl@gmail.com
 * Solution: FormSubmit.co (gratuit, sans SMTP)
 */

// Adresse email de destination
$to = "globalagroconsoltingsarl@gmail.com";

// Headers pour JSON
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Vérifier que c'est une requête POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Méthode non autorisée"]);
    exit;
}

// Récupérer et nettoyer les données
$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$subject_input = trim($_POST["subject"] ?? "");
$message = trim($_POST["message"] ?? "");

// Validation des champs obligatoires
$errors = [];
if (empty($name)) $errors[] = "Le nom est requis";
if (empty($email)) $errors[] = "L'email est requis";
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Email invalide";
if (empty($message)) $errors[] = "Le message est requis";

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(["success" => false, "errors" => $errors]);
    exit;
}

// Préparation des données pour FormSubmit.co
$formSubmitData = [
    "_to" => $to,
    "_subject" => "[AgroConsulting] Nouveau message de " . $name . " - " . $subject_input,
    "name" => $name,
    "email" => $email,
    "phone" => $phone,
    "subject" => $subject_input,
    "message" => $message,
    "_template" => "table",
    "_captcha" => "false",
    "_next" => "" // Pas de redirection
];

// Initialiser cURL
if (function_exists('curl_init')) {
    $ch = curl_init("https://formsubmit.co/ajax");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($formSubmitData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/x-www-form-urlencoded",
        "Accept: application/json"
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    if ($response && $httpCode === 200) {
        echo json_encode([
            "success" => true,
            "message" => "Merci ! Votre message a été envoyé avec succès à globalagroconsoltingsarl@gmail.com"
        ]);
    } else {
        // Log l'erreur pour débogage
        error_log("FormSubmit Error: " . $curlError . " HTTP: " . $httpCode);
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de l'envoi. Détails: " . ($curlError ?: "Erreur inconnue")
        ]);
    }
} else {
    // cURL non disponible - utiliser file_get_contents
    $options = [
        "http" => [
            "header" => "Content-Type: application/x-www-form-urlencoded\r\n",
            "method" => "POST",
            "content" => http_build_query($formSubmitData),
            "timeout" => 30
        ]
    ];
    
    $context = stream_context_create($options);
    $result = @file_get_contents("https://formsubmit.co/ajax", false, $context);
    
    if ($result !== false) {
        echo json_encode([
            "success" => true,
            "message" => "Merci ! Votre message a été envoyé avec succès."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Une erreur est survenue. Veuillez nous contacter directement à globalagroconsoltingsarl@gmail.com"
        ]);
    }
}
?>
