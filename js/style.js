  /* Images */
  $(".hover").mouseleave(
    function () {
      $(this).removeClass("hover");
    }
  );


  /* Project Content */
jQuery('.menuleft a').on('click', function() {

    var scrollAnchor = jQuery(this).attr('data-scroll'),
        scrollPoint = jQuery('section[data-anchor="' + scrollAnchor + '"]').offset().top - 0;

    jQuery('body,html').animate({
        scrollTop: scrollPoint
    }, 500);

    return false;

})


////////////left menu coloring///////////


jQuery(window).scroll(function() {
    var windscroll = jQuery(window).scrollTop();
    if (windscroll >= 0) {
        jQuery('.wrapper section').each(function(i) {
            if (jQuery(this).position().top <= windscroll - 0) {
                jQuery('.menuleft a.active').removeClass('active');
                jQuery('.menuleft a').eq(i).addClass('active');
            }
        });

    } else {
        jQuery('.menuleft a.active').removeClass('active');
        jQuery('.menuleft a:first').addClass('active');
    }

}).scroll();



/////////////////////
/*
jQuery(window).scroll(function(){
    var scroll_top = jQuery(this).scrollTop(); // get scroll position top
    var height_element_parent =  jQuery(".wrapper").height(); //get high parent element
    var height_element = jQuery(".menuleft").height(); //get high of elemeneto
    var position_fixed_max = height_element_parent - height_element; // get the maximum position of the elemen
    var position_fixed = scroll_top < 100 ? 140 - scroll_top : position_fixed_max > scroll_top ? 40 : position_fixed_max - scroll_top ;
    jQuery(".menuleft").css("top",position_fixed);
});*/


//////////////pics

    var vid = document.getElementById("video");
    vid.autoplay = false;
vid.autostart = false;
    vid.load();

