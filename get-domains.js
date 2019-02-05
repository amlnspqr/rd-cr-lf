// ==UserScript==
// @name        Get Domains
// @namespace   *
// @description Get Domains
// @include     *
// @version     1.3
// @grant       none
// ==/UserScript==

window.addEventListener
(
	'keydown', 
	function (e)
	{
		if (e.altKey || e.modifiers)
		{
			if (e.keyCode == 68)
				getDomains ()
			
			if (e.keyCode == 70)
			{
				var sDomain = prompt ('Enter domain', location.hostname)
				
				sDomain && openScanners (sDomain)
			}
		}
	},
	false
)

window.addEventListener
(
	'DOMContentLoaded', 
	function (e)
	{
		if (location.host == 'dnsdumpster.com' && location.hash && document.getElementById ('regularInput'))
		{
			var input = document.getElementById ('regularInput')
			
			input.value = location.hash.slice (1)
			input.form.submit ()
		}
	}, 
	false
)

function openScanners (sDomain)
{
	window.open ('https://crt.sh/?q=%.' + sDomain)
	window.open ('https://www.virustotal.com/en/domain/' + sDomain + '/information/')
	window.open ('https://dnsdumpster.com/#' + sDomain)
	window.open ('https://www.google.com/search?q=site:*.' + sDomain + ' -www')
}

function getDomain ()
{
	try
	{
		var domain = location.search.match (/%2?5?\.(.+)/) [1]		//	crt
	}
	catch (e)
	{
		try
		{
			var domain = location.pathname.match (/domain\/(.+)\/information/) [1]		//	virustotal
		}
		catch (e)
		{
			try
			{
				var domain = document.body.innerHTML.match (/Showing results for (.+)/) [1].replace (/<.+?>/g, '')		//	dnsdumpster
			}
			catch (e)
			{
				try
				{
					var domain = document.getElementsByName ('q') [0].value.match (/site:(.+?)(\s|$)/) [1].replace ('*.', '')		//	google
				}
				catch (e)
				{
					var domain = prompt ('Enter domain', location.hostname)
				}
			}
		}
	}
	
	return domain
}

function getDomains ()
{
	var sDomain = getDomain ()
	
	if (!sDomain)
	{
		alert ('Domain not found')
		
		return 0
	}
	
	var rDomains = new RegExp ('([\\w-]+\\.)+' + sDomain.replace (/\./g, '\\.'), 'g')
	
	var aDomains = uniqueDomains (document.getElementsByTagName ('html') [0].innerHTML.match (rDomains)).join ('\n').split (/([\s\S]{10000})/)
	
	aDomains.forEach (function (i) {i && alert (i)})
}

function uniqueDomains (arr)
{
	var obj = {}
	
	for (var i = 0; i < arr.length; i++)
	{
		var parts = arr [i].toLowerCase ().replace (/^www\./, '').split ('.')
		
		for (var j = 0; j <= parts.length - 2; j++)
			obj [parts.slice (j).join ('.')] = true
	}
	
	return Object.keys (obj)
}
