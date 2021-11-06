const fs = require('fs');

fs.writeFileSync('./index.html',`<!DOCTYPE html>
<!-- Doctype HTML5 -->
<html lang='en'>
	<head>
		<meta charset='utf-8'>
		<meta name='viewport' content='width=device-width, initial-scale=1'>

		<title>Test Page</title>
	</head>
	<body>
		Oh hello, this page was built at: ${(new Date()).toISOString()}
	</body>
</html>`,'utf8')