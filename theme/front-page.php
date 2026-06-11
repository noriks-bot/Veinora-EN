<?php
$clone_uri = get_template_directory_uri() . "/assets/veinora-clone";
$source    = get_template_directory()     . "/assets/veinora-clone/site/products/kompressionsstrumpfe-mit-reissverschluss-align.html";
if ( ! file_exists($source) ) { status_header(500); echo "source missing"; exit; }
$html = file_get_contents($source);
$html = strtr($html, array(
    "../../cdn-assets/"=>$clone_uri."/cdn-assets/", "../cdn-assets/"=>$clone_uri."/cdn-assets/",
    "../../fonts-google/"=>$clone_uri."/fonts-google/", "../fonts-google/"=>$clone_uri."/fonts-google/",
    "../../fonts-static/"=>$clone_uri."/fonts-static/", "../fonts-static/"=>$clone_uri."/fonts-static/",
    "https://cdn-assets/"=>$clone_uri."/cdn-assets/", "//cdn-assets/"=>$clone_uri."/cdn-assets/",
    "../cdn/"=>$clone_uri."/site/cdn/", "../checkouts/"=>$clone_uri."/site/checkouts/",
    "//align-heath.com/cdn/"=>$clone_uri."/site/cdn/", "https://align-heath.com/cdn/"=>$clone_uri."/site/cdn/",
    "//veinora.com/cdn/"=>$clone_uri."/site/cdn/", ".css.css"=>".css", ".js.js"=>".js",
));
header("Content-Type: text/html; charset=UTF-8");
echo $html;
