window.BASE_URL=location.protocol + '//' + location.host+'/';

$(document).on('ready',function(){
	console.log('jquery loaded!');
	window.APP=new app();
});

var app=function(){
	var that=this;
	this.data={};
	this.init=function(){
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

		$('#app').on('input','input.search',function(){
			var q=$(this).val();
		});


		$.ajax({
			url:BASE_URL+'api/classes',
			//data:{},
			type:"POST",
			success:function(data){
				console.log('data sent successfully');
				if(typeof data.error=='undefined'){
					//good nothing broke perform actions
					//save data
					that.data=data;
					that.renderClasses();
				}else{
					//display the error
					//warning(data.error);
				}
			},
			error:function(){
				console.log('there was an error with the request');
			}
		});
	}
	this.renderClasses=function(){
		var classes=this.data.classes;
		var htmlString='<ul>';
		for(var i=0;i<classes.length;i++){
			var c=classes[i];
			htmlString+=[
				'<li>',
					'<h4>'+c.course_code+' '+c.type+'</h4>',
					'<span>'+c.course_name+'</span>',
					'<span class="clear">'+c.enr_count+'/'+c.enr_max+'</span>',
				'</li>'
			].join('');
		}
		htmlString+='</ul>';
		$('#class_list').html(htmlString);
	}
	this.init();
}