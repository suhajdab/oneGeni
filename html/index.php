<?php

	include_once ('inc/config.php');

	//if ( $_GET['test'] == 'true') {
		header('location: https://www.geni.com/oauth/authorize');
		die();
	//}
	// include_once "oauth-php/library/OAuthStore.php";
	// 	include_once "oauth-php/library/OAuthRequester.php";
	// 
	// 	// Test of the OAuthStore2Leg 

	// 	$url = "https://www.geni.com/oauth/authorize"; // fill with the url for the oauth service
	// 
	// 	$options = array('consumer_key' => $key, 'consumer_secret' => $secret);
	// 	OAuthStore::instance("2Leg", $options);
	// 
	// 	$method = "GET";
	// 	$params = null;
	// 
	// 	try
	// 	{
	// 		// Obtain a request object for the request we want to make
	// 		$request = new OAuthRequester($url, $method, $params);
	// 
	// 		// Sign the request, perform a curl request and return the results, 
	// 		// throws OAuthException2 exception on an error
	// 		// $result is an array of the form: array ('code'=>int, 'headers'=>array(), 'body'=>string)
	// 		$result = $request->doRequest();
	// 	
	// 		$response = $result['body'];
	// 		var_dump($result);
	// 	}
	// 	catch(OAuthException2 $e)
	// 	{
	// 		echo "Exception";
	// 	}
?>