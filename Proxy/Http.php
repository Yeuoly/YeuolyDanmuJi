<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2020/2/20
 * Time: 10:07
 */

class Http{
    public function post($url,$parameters,$headers = []){
        $ch = curl_init();

        $headers = array_merge([
            'Content-type' => 'application/x-www-form-urlencoded'
        ],$headers);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        //设置头部
        curl_setopt($ch,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
        // POST数据
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22");
        // 把post的变量加上
        curl_setopt($ch, CURLOPT_POSTFIELDS, $parameters);
        $res=mb_convert_encoding($res, 'UTF-8', 'UTF-8,GBK,GB2312,BIG5');//使用该函数对结果进行转码
        $res = curl_exec($ch);
        curl_close($ch);
        return $res;
    }

    public function get($url,$parameters,$headers = []){

        $curl = curl_init();

        $headers = array_merge([
            'Content-type' => 'application/x-www-form-urlencoded'
        ],$headers);

        //设置抓取的url
        $url .= '?';
        foreach ($parameters as $i => $v){
            $url .= $i.'='.$v.'&';
        }
        curl_setopt($curl, CURLOPT_ENCODING ,'gzip');
        //加入gzip解析
        curl_setopt($curl, CURLOPT_URL, $url);
        //设置头文件的信息作为数据流输出
        curl_setopt($curl, CURLOPT_HEADER, 0);
        // 超时设置,以秒为单位
        curl_setopt($curl, CURLOPT_TIMEOUT, 1);

        // 超时设置，以毫秒为单位
        // curl_setopt($curl, CURLOPT_TIMEOUT_MS, 500);

        curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22");

        // 设置请求头
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        //设置获取的信息以文件流的形式返回，而不是直接输出。
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        $res = curl_exec($curl);
        $res=mb_convert_encoding($res, 'UTF-8', 'UTF-8,GBK,GB2312,BIG5');//使用该函数对结果进行转码
        curl_close($curl);
        return $res;
    }
}