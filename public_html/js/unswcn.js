window.BASE_URL=location.protocol + '//' + location.host+'/';

$(document).on('ready',function(){
	console.log('jquery loaded!');
	window.APP=new app();
});

var app=function(){
	var that=this;
	this.data={};
	this.resultList=[];
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
						'<ul></ul>',
					'</div>',
				'</div>',
			'</div>',
		].join('');
		$('body').append(htmlString);

		$('#app').on('input','input.search',function(){
			var q=$(this).val();
			that.searchClasses(q);
		}).on('click','#class_list>ul>li',function(){
			var index=$(this).index();
			var c=that.data.classes[that.resultList[index]];
			console.log(c);
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
					//that.renderClasses();
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
				'<li data-id="'+c.id+'">',
					'<h4>'+c.course_code+' ['+c.type+'] '+c.section_time+'</h4>',
					'<span class="clear">'+c.course_name+'</span>',
					'<span class="clear">'+c.enr_count+'/'+c.enr_max+'</span>',
				'</li>'
			].join('');
		}
		htmlString+='</ul>';
		$('#class_list').html(htmlString);
	}
	this.searchClasses=function(query){
		var results=[];
		var pattern=new RegExp('^'+regexEscape(query),'i');
		for(var i=0;i<this.data.classes.length;i++){
			var c=this.data.classes[i];
			if(pattern.test(c.course_code)){
				results.push(i);
			}
		}
		if(query.length==0){
			results=[];
		}
		//update visiblity
		htmlString='';
		for(var i=0;i<results.length;i++){
			var c=this.data.classes[results[i]];
			htmlString+=[
				'<li>',
					'<h4>'+c.course_code+' ['+c.type+'] '+c.section_time+'</h4>',
					'<span class="clear">'+c.course_name+'</span>',
					'<span class="clear">'+c.enr_count+'/'+c.enr_max+'</span>',
				'</li>'
			].join('');
		}

		this.resultList=results;
		$('#class_list ul').html(htmlString);
	}
	this.init();
}


function regexEscape(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}