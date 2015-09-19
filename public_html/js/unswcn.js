$(document).on('ready',function(){
	console.log('jquery loaded!');
	window.APP=new app();
});

var app=function(){
	this.init=function(){
		console.log('app initialised');
		var htmlString=[
			'<div id="app">',
				'<div class="header">',
					'<span>UNSW class notify</span>',
				'</div>',
				'<div class="scrollableView">',
				'</div>',
			'</div>',
		].join('');
		$('body').append(htmlString);
	}
	this.init();
}