window.BASE_URL=location.protocol + '//' + location.host+'/';

$(document).on('ready',function(){
	console.log('jquery loaded!');
	window.APP=new app();
});

var app=function(){
	this.init=function(){
		console.log('app initialised');
		$.ajax({
			url:BASE_URL+'api/classes',
			//data:{},
			type:"POST",
			success:function(data){
				console.log('data sent successfully');
				if(typeof data.error=='undefined'){
					//good nothing broke perform actions
				}else{
					//display the error
					//warning(data.error);
				}
			},
			error:function(){
				console.log('there was an error with the request');
			}
		});
		var htmlString=[
			'<div id="app">',
				'<div class="header">',
					'<span class="fa fa-comment"></span>',
					'<span class="title">UNSW class notify</span>',
				'</div>',
				'<input class="search" placeholder="Search for classes"/>',
				'<div class="scrollableView">',
					'<div id="class_list">',
						'<h1>Loading classes</h1>',
					'</div>',
				'</div>',
			'</div>',
		].join('');
		$('body').append(htmlString);
	}
	this.init();
}