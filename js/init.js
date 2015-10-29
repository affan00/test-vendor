/*
 * Made by WebDesignCrowd
 * http://webdesigncrowd.com
 *
 */



(function($){
	$(function(){
	  
	  // Home
	  $('.carousel').carousel({
        pause: "false",
        interval: 10000
    });
    
    var textTop = parseInt($("h1.welcome").css("marginTop"));
    $(window).scroll(function() {
      if ($(window).height() > $(window).scrollTop()) {   
        var parallax = ($(window).scrollTop() * -1) / 4;
        var opacity = ($(window).scrollTop() / ($(window).height() *2) * -1) + .8;
        var parallaxText = (parallax * -1) + textTop;
        $("#home").css('backgroundPosition', '0 ' + parallax + "px");
        $("h1.welcome").css('marginTop', parallaxText + "px");
        $("#home .dark-overlay").css('backgroundColor', 'rgba(66,139,202,' + opacity + ')');
      }
    });
    
    // Navbar
      
      // Contact Form Modal bugfix
      $(".navbar #contact").click(function() {
        $('#contact-form').modal('show');   
      });
      
      // Contact Form Icon
      $("form .form-control").focus(function() {
        $(this).siblings("label").first().children("i").first().css({"color": "#aaa", "left": 0});
      });
      $("form .form-control").blur(function() {
        $(this).siblings("label").first().children("i").first().css({"color": "#eee", "left": "-20px"});
      });
      
 
    /*// Search affix
    if ($("#home").hasClass("half-home")) {
      $("#navbar").affix({
        offset: {
          top: ($(window).height() - 1) / 2 // Service bugfix
        }
      })      
    }
    else {
      $("#navbar").affix({
        offset: {
          top: $(window).height() - 1 // Service bugfix
        }
      })
    }*/



	  
	  // Work 

  	  // MixItUp Grid
      $(function(){
        $('.gallery').mixitup({
          easing: 'snap',
          resizeContainer: true
        });
  		});
	  
	  // Blog Masonry
    var $container = $('.masonry-grid');
  
    $container.imagesLoaded(function(){
      /* IMAGES LOADED */
      
      
      $container.masonry({
        itemSelector : '.item',
        gutter : 0
      });
      $(".item").css("opacity", "1");
      
      //H1 Affixes to top	    
	    $('body').scrollspy({ target: '#navbar' });
	    
    });
	
    // collapse active class on icons
    $(".collapse").collapse({ toggle: false })
    $(".navbar-header a.icon").click(function() { 
      $(this).toggleClass("active");
      $(this).siblings("a.icon").each(function() {
        $(this).removeClass("active");
        var target = $(this).data("target");
        $(target).collapse("hide");
      })
    });
        
    // Tooltip init
    $(".icon-wrapper").tooltip({placement: "bottom"})

    // Smooth Scrolling
    $("a.scroll").click(function(e) {
      e.preventDefault();
      var offset = $(this.hash).offset().top;
      $('html, body').animate({ scrollTop: offset }, 600);
    });
    
    // Collapsible Active Toggling 
    $("a[data-toggle='collapse']").click(function() {
      $(this).parent().parent(".panel-heading").toggleClass("active");
    });
    

// jQuery
$(document).ready(function() {
   // prettyPrint();
});

    

	}); // end of document ready
})(jQuery); // end of jQuery name space