$(window).load(function(){
	$('.grid').masonry({
		// options
		itemSelector: '.grid-item',
		columnWidth: '.grid-sizer',
		percentPosition: true
	});
	
	var $body = $('body');
	var $item = $('.grid-item');
	var $img = $('.img');
	var $info = $('.info');
	
	$item.click(function() {
		$(this).toggleClass('active');
		$(this).siblings().removeClass('active');
		$body.toggleClass('gallery-open');
	});
	
	// $overlay.click(function() {
	// 	$item.removeClass('active');
	// 	$(this).removeClass('active');
	// 	$body.removeClass('gallery-open');
	// 	console.log('overlay clicked');
	// });
});