<?php

$lat = filter_input(1, 'lat', FILTER_VALIDATE_FLOAT);
$lon = filter_input(1, 'lon', FILTER_VALIDATE_FLOAT);

if (!is_float($lat) || !is_float($lon)) {
  exit(0);
}


// These code snippets use an open-source library. http://unirest.io/php
require_once './includes/unirest-php-master/src/Unirest.php';
Unirest\Request::verifypeer(false);
$response = Unirest\Request::get("https://webcamstravel.p.mashape.com/webcams/list/nearby=$lat,$lon,10?lang=en&show=webcams%3Aimage%2Clocation", array(
            "X-Mashape-Key" => "V5069b4sePmshmhyZnRxhhkdhmjjp1Pb0QKjsnnhOLi2GDkT6R"
                )
);

$webcams = $response->body->result->webcams;

$data = [];
for ($i = 0; $i < count($webcams); $i++) {
  $data[$i] = [
      'title' => $webcams[$i]->title,
      'image' => $webcams[$i]->image->current->preview,
       'update'=> $webcams[$i]->image->update
  ];
}

echo json_encode($data);
