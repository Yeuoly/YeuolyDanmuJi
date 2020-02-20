<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2020/2/20
 * Time: 10:28
 */

require_once './Http.php';

header('Content-Type: application/json; charset=utf-8');

$post = @$_POST['proxy'];
$post = json_decode($post,1);

$http = new Http();
$origin = 'space.bilibili.com';
$res = null;

switch (mb_strtolower($post['method'])) {
    case 'get':
        $res = $http->get($post['url'], $post['data'], ['Origin' => $origin]);
        break;
    case 'post':
        $res = $http->post($post['url'], $post['data'], ['Origin' => $origin]);
        break;
}

echo $res;