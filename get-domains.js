// ==UserScript==
// @name        Get Domains
// @namespace   *
// @description Get Domains
// @include     *
// @version     2.3
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
				var sDomain = prompt ('Enter domain', currentDomain ())
				
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
	window.open ('https://www.virustotal.com/gui/domain/' + sDomain + '/relations')
	window.open ('https://dnsdumpster.com/#' + sDomain)
	window.open ('https://www.google.com/search?q=site:*.' + sDomain + ' -www')
}

function checkIPs ()
{
	var rIPs = /\d+\.\d+\.\d+\.\d+/g
	
	var aIPs = document.getElementsByTagName ('html') [0].innerHTML.match (rIPs)
	
	aIPs = privateIPs (aIPs).join ('\n').split (/([\s\S]{10000})/)
	
	aIPs.forEach (function (i) {i && alert (i)})
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
			var domain = location.pathname.match (/domain\/(.+)\/relations/) [1]		//	virustotal
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
					var domain = prompt ('Enter domain', currentDomain ())
				}
			}
		}
	}
	
	return domain
}

function getDomains ()
{
	if (location.host == 'dnsdumpster.com')
		checkIPs ()
	
	var sDomain = getDomain ()
	
	if (!sDomain)
		return 0
	
	var rDomains = new RegExp ('[%\\\\]?([\\w-]+\\.)+' + sDomain.replace (/\./g, '\\.'), 'g')
	var aCSPDomains
	
	if (sDomain == currentDomain ())
	{
		try
		{
			var req = new XMLHttpRequest ()
			req.open ('GET', location.href, false)
			req.send ()
			
			aCSPDomains = req.getResponseHeader ('Content-Security-Policy').match (rDomains)
			
			alert (aCSPDomains.join ('\n'))
		}
		catch (e)
		{
			alert (e.message)
		}
	}
	
	var aDomains = document.getElementsByTagName ('html') [0].innerHTML.match (rDomains)
	
	aCSPDomains && (aDomains = aDomains.concat (aCSPDomains))
	
	aDomains = uniqueDomains (aDomains).join ('\n').split (/([\s\S]{10000})/)
	
	aDomains.forEach (function (i) {i && alert (i)})
}

function currentDomain ()
{
	return location.hostname.match (/[^\.]*\.[^\.]*$/) [0]
}

function uniqueDomains (arr)
{
	var obj = {}
	
	for (var i = 0; i < arr.length; i++)
	{
		var parts = arr [i].toLowerCase ().replace ('%2f', '').replace ('\\u002f', '').replace (/^www\./, '').split ('.')
		
		for (var j = 0; j <= parts.length - 2; j++)
			obj [parts.slice (j).join ('.')] = true
	}
	
	return Object.keys (obj)
}

function privateIPs (arr)
{
	var obj = {}
	
	for (var i = 0; i < arr.length; i++)
	{
		var aIP = arr [i].split ('.').map (function (i) {return +i})
		
		if (aIP [0] == 10 || aIP [0] == 100 && (aIP [1] >= 64 && aIP [1] <= 127) || aIP [0] == 172 && (aIP [1] >= 16 && aIP [1] <= 31) || aIP [0] == 192 && aIP [1] == 168)
			obj [arr [i]] = true
	}
	
	return Object.keys (obj)
}
