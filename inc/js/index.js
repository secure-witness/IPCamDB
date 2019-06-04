$(document).ready(function(){
  $('.navbar-collapse a').click(function(){
	    $(".navbar-collapse").collapse('hide');
	    window.location.hash='';
	    window.location.hash='#tab-content';
	});
});