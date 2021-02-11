<?php

	$domains = is_array ($_GET ['domains']) ? $_GET ['domains'] : array ('ya.ru');
	$paths = is_array ($_GET ['paths']) ? $_GET ['paths'] : array ('foo');
	
	$useragents = array
	(
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:59.0) Gecko/20100101 Firefox/59.0',
		'Mozilla/5.0 (iPad; CPU OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.0 Mobile/14G60 Safari/602.1'
	);
	
	$useragent = $useragents [0];
	
	function check_domain ($domain, $path)
	{
		$templates = array
		(
			'http://%url%/%path%', 
			'http://%url%/%path%/', 
			'http://%url%//%path%', 
			'http://%url%///%path%', 
			'http://%url%////%path%', 
			'http://%url%/?%path%', 
			'http://%url%/%3F%path%', 
			'http://www.%url%/%path%', 
			'http://www.%url%/%path%/', 
			'http://www.%url%//%path%',
			'http://www.%url%///%path%',
			'http://www.%url%////%path%', 
			'http://www.%url%/?%path%', 
			'http://www.%url%/%3F%path%', 
			'https://%url%/%path%', 
			'https://%url%/%path%/', 
			'https://%url%//%path%', 
			'https://%url%///%path%', 
			'https://%url%////%path%', 
			'https://%url%/?%path%', 
			'https://%url%/%3F%path%', 
			'https://www.%url%/%path%', 
			'https://www.%url%/%path%/', 
			'https://www.%url%//%path%',
			'https://www.%url%///%path%',
			'https://www.%url%////%path%', 
			'https://www.%url%/?%path%', 
			'https://www.%url%/%3F%path%'
		);
		
	//	foreach ($useragents as $useragent)
	//	{
			foreach ($templates as $template)
			{
				$url = str_replace ('%url%', trim ($domain), $template);
				$url = str_replace ('%path%', urlencode ($path), $url);
				
				echo htmlspecialchars ($url)."\r\n";
				
				$ch = curl_init ();
				
				curl_setopt ($ch, CURLOPT_URL, $url);
				curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 5);
				curl_setopt ($ch, CURLOPT_USERAGENT, $useragent);
				// curl_setopt ($ch, CURLOPT_REFERER, 'https://www.google.com/');
				curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, false);
				curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, false);
				
				curl_setopt
				(
					$ch, 
					CURLOPT_HEADERFUNCTION, 
					function ($curl, $header)
					{
						$len = strlen ($header);
						
						if (stripos ($header, 'location') === 0 || stripos ($header, 'set-cookie') === 0 || stripos ($header, ':') === false || stripos ($header, 'foo') !== false || stripos ($header, 'bar') !== false)
							echo htmlspecialchars ($header);
						
						return $len;
					}
				);
				
				curl_exec ($ch);
				
				echo "\r\n";
				
		//		sleep (3);
			}
	//	}
	}	
	
	foreach ($domains as $domain)
	{
		foreach ($paths as $path)
		{
			check_domain ($domain, $path);
		}
	}
	
?>
