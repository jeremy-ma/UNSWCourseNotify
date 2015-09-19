window.BASE_URL=location.protocol + '//' + location.host+'/';

$(document).on('ready',function(){
	console.log('jquery loaded!');
	window.APP=new app();
});

var app=function(){
	var that=this;
	this.data={};
	this.class_hash={};
	this.resultList=[];
	this.savedResults=[];
	this.init=function(){
		var htmlString=[
			'<div id="app">',
				'<div class="header">',
					'<span class="fa fa-comment"></span>',
					'<span class="title">UNSW course notify</span>',
				'</div>',
				'<input class="text" id="email" placeholder="Your email address"/>',
				'<input class="search text" placeholder="Search for classes"/>',
				'<div class="scrollableView">',
					'<div id="class_list">',
						'<ul></ul>',
					'</div>',
				'</div>',
				'<div class="course_basket">',
					'<span class="fa fa-shopping-cart"></span>',
					'<span>Class cart</span>',
				'</div>',
				'<div class="submit">Notify me!</div>',
			'</div>',
		].join('');
		$('body').append(htmlString);

		$('#app').on('input','input.search',function(){
			var q=$(this).val();
			that.searchClasses(q);
		}).on('click','#class_list>ul>li',function(){
			var index=$(this).index();
			var c=that.data.classes[that.resultList[index]];
			that.clicked_result(c,$(this));
		}).on('click','div.submit.active',function(){
			that.checkout();
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

					//hash classes for quick access
					var class_hash={};
					for(var i=0;i<that.data.classes.length;i++){
						var c=that.data.classes[i];
						class_hash[c.id]=c;
					}
					that.class_hash=class_hash;
					//that.renderClasses();
				}else{
					//display the error
					warning(data.error);
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
				'<li data-id="'+c.id+'" class="'+classString+'">',
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
			if(results.length>50){
				break;
			}
		}
		var htmlString='';
		if(query.length==0||results.length==0){
			results=[];
			htmlString+='<h1>No results!</h1>';
		}
		for(var i=0;i<results.length;i++){
			var c=this.data.classes[results[i]];
			var searchClasses='';
			if(this.savedResults.indexOf(c.id)!=-1){
				searchClasses='active';
			}
			htmlString+=[
				'<li class="'+searchClasses+'">',
					'<span class="title">'+c.course_code+' '+c.section_code+'</span>',
					'<span class="clear">'+c.course_name+'</span>',
					'<span class="clear">'+c.enr_count+'/'+c.enr_max+'</span>',
				'</li>'
			].join('');
		}

		this.resultList=results;
		$('#class_list ul').html(htmlString);
	}
	this.clicked_result=function(c,obj){
		console.log('adding to basket:'+c.id);
		//add only if not already in results
		if(this.savedResults.indexOf(c.id)==-1){
			if(this.savedResults.length>=4){
				warning('Maximum of 4 subjects');
				return;
			}
			this.savedResults.push(c.id);
			obj.addClass('active');
		}else{

			//remove from saved results
			this.savedResults.splice(this.savedResults.indexOf(c.id),1);
			obj.removeClass('active');
		}
		this.updateBasket();
		console.log(this.savedResults);
	}
	this.updateBasket=function(){
		var htmlString='<ul>';
		for(var i=0;i<this.savedResults.length;i++){
			var c=this.class_hash[this.savedResults[i]];
			htmlString+=[
				'<li>'+c.course_code+'</li>',
			].join('');
		}
		htmlString+='</ul>';
		$('div.course_basket').html(htmlString);
		if(this.savedResults.length>0){
			$('div.submit').addClass('active');
		}else{
			$('div.submit').removeClass('active');
		}
	}
	this.checkout=function(){
		//get email
		var email=$('#email').val();
		//send the basket
		$.ajax({
			url:BASE_URL+'api/classes/checkout',
			data:{
				'email':email,
				'results':that.savedResults
			},
			type:"POST",
			success:function(data){
				console.log('data sent successfully');
				if(typeof data.error=='undefined'){
					//good nothing broke perform actions
					success('Congrats!','Your preferences have been saved!');
				}else{
					//display the error
					warning(data.error);
				}
			},
			error:function(){
				console.log('there was an error with the request');
			}
		});
	}
	this.init();
}
function success(title,text){
	swal(title, text, "success");
}
function warning(message){
	sweetAlert("Error", message, "error");
}

function regexEscape(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}