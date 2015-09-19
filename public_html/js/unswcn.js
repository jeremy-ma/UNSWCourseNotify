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
					'<span class="fa fa-comment"></span>',
					'<span class="title">UNSW class notify</span>',
				'</div>',
				'<div class="scrollableView">',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
					'<p>UNSW COURSE NOTIFY</p>',
				'</div>',
			'</div>',
		].join('');
		$('body').append(htmlString);
	}
	this.init();
}