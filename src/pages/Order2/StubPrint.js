import template from 'art-template';

var tpl = `
<!doctype html>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<title>打印测试</title>
	<style>
		*{
			margin:0px;
			padding: 0px;
		}
		@page { 
			size:140mm 241mm;
			margin-left:10mm;
			margin-right:10mm;
			margin-top:15mm;
			margin-bottom:15mm;
		}
		.page{
			width:120mm;
			margin:0 auto;
		}
	</style>
	<style media="print">
		.page{
			margin:0;
		}
		#printButton{
			display:none;
		}
	</style>
</head>
<body>
	<div id="body">
		<div class="page">
			Hello Fish
		</div>
	</div>
</body>
</html>
`

var render = template.compile(tpl)

export default function StubPrint(data){
	return render(data);
}