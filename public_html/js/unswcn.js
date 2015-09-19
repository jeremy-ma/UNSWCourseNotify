$(document).on('ready',function(){
	console.log('jquery loaded!');
	window.APP=new app();
});

var app=function(){
	this.init=function(){
		console.log('app initialised');
	}
	this.init();
}