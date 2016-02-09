<?php

header("Content-type: image/gif");

$avatars[] = "http://i.imgur.com/luiuuJj.gif"; //Clinkz
$avatars[] = "http://i.imgur.com/OqlUpR2.gif"; //Bristleback
$avatars[] = "http://i.imgur.com/ZB5cgko.gif"; //Tusk
$avatars[] = "http://i.imgur.com/P6YwYCG.gif"; //Rikimaru
$avatars[] = "http://i.imgur.com/KfcLuIC.gif"; //Templar Assassin
$avatars[] = "http://i.imgur.com/ux1QIn5.gif"; //Slark
$avatars[] = "http://i.imgur.com/soMRb3C.gif"; //Bounty Hunter

$avatar = $avatars[mt_rand(0, count($avatars)-1)];

header('Location: ' . $avatar);
?>