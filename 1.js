var FH_fullpage_slideshow = (function(FH_fullpage_slideshow, $) {
	
	/* CONFIGURATION VARIABLES */

	/* The selector of the DOM element that holds the number we want to update when slides change */
	var COUNTER_SELECTOR = "span#current_slide";
	/* The selector of the DOM element that holds the total number of slides */
	var COUNTER_TOTAL_SELECTOR = "span#total_slides";
	/* The selector of the thumbnail container */
	var THUMBNAIL_CONTAINER_SELECTOR = "div.thumbnail_navigation_container div.thumbnail_container";
	/* Everything that, when clicked, advances the slideshow */
	var SLIDE_ADVANCERS = $("img#right_arrow, div#right_slide_control");
	/* Everything that, when clicked, regresses the slideshow */
	var	SLIDE_REGRESSORS = $("img#left_arrow, div#left_slide_control");
	/* Everything that, when clicked, advances the thumbnails */
	var THUMBNAIL_ADVANCERS = $("img#thumbnail_right_arrow");
	/* Everything that, when clicked, regresses the thumbnails */
	var	THUMBNAIL_REGRESSORS = $("img#thumbnail_left_arrow");
	/* The arrows that appear over the slide on hover*/
	var SLIDE_ARROWS = $("div.primary_content_container div.slide_photos_container div.slide_control div.control_image");
	/* The name of the class attribute on the slide that should be shown */
	var ACTIVE_SLIDE_CLASSNAME = "active";
	/* The name of the class attribute on the thumbnail that should be highlighted */
	var ACTIVE_THUMBNAIL_CLASSNAME = "active_thumbnail";
	/* The number of pixels wide a thumbnail plus its right margin equals */
	var THUMBNAIL_ANIMATION_DISTANCE = 63;
	/* The height in pixels of the arrows that appear on hover over the main slide image */
	var SLIDE_ARROW_HEIGHT = 52;
	/* The location of the images being used as navigation arrows in the titlebar */
	var LEFT_ARROW_SRC = "img/SLIDESHOW_BACK_ARROW_LG.png";
	var LEFT_ARROW_DISABLED_SRC = "img/SLIDESHOW_BACK_ARROW_LG-GREY.png";
	var RIGHT_ARROW_SRC = "img/SLIDESHOW_FORWARD_ARROW_LG.png";
	var RIGHT_ARROW_DISABLED_SRC = "img/SLIDESHOW_FORWARD_ARROW_LG-GREY.png";
	
	/* PRIVATE VARIABLES */
	var theSlidePhotos = $("div.slide_photos_container div.slide_photo"),
		totalSlides = theSlidePhotos.size(),
		theSlideInformations = $("div.slide_information_container div.slide_information"),
		theThumbnails = $("div.thumbnail_container div.thumbnail_image"),
		totalThumbnails = theThumbnails.size(),
		theFinalSlide = $("div#final_slide"),
		theFinalSlideButtons = $("div#final_slide div.final_slide_button_container"),
		slideshowReplayButton = $("img#replay_slideshow_button");
		
	/* PUBLIC VARIABLES */
	FH_fullpage_slideshow.currentSlide = 1;
	FH_fullpage_slideshow.activeThumbnail = 1;
	FH_fullpage_slideshow.isFinalSlide = false;
	
	/* PRIVATE METHODS */
	
	/*
	 * updateSlideCounter changes the number that keeps track of which slide you are on visually for the user to number held in currentSlide
	 */
	 
	var updateSlideCounter = function() {
		
		$(COUNTER_SELECTOR).html(FH_fullpage_slideshow.currentSlide);
		
	};
	
	var changeActiveSlide = function(slideNumber) {
		
		theSlidePhotos.removeClass(ACTIVE_SLIDE_CLASSNAME);
		theSlidePhotos.eq(slideNumber).addClass(ACTIVE_SLIDE_CLASSNAME);
			
		theSlideInformations.removeClass(ACTIVE_SLIDE_CLASSNAME);
		theSlideInformations.eq(slideNumber).addClass(ACTIVE_SLIDE_CLASSNAME);
		
	};
	
	var changeActiveThumbnail = function(slideNumber) {
		
		if (slideNumber < 0 || slideNumber > totalSlides) {
			
			return;
			
		} else {
			
			var thumbnailDifference = (slideNumber + 1) - FH_fullpage_slideshow.activeThumbnail,
		    amountToAnimate = thumbnailDifference * THUMBNAIL_ANIMATION_DISTANCE;
				
			$(THUMBNAIL_CONTAINER_SELECTOR).animate({
				left: "-="+amountToAnimate
			}, 500, function(){
				//Callback function
				FH_fullpage_slideshow.activeThumbnail = slideNumber + 1;
				theThumbnails.removeClass(ACTIVE_THUMBNAIL_CLASSNAME);
				theThumbnails.eq(FH_fullpage_slideshow.activeThumbnail).addClass(ACTIVE_THUMBNAIL_CLASSNAME);
			});
			
		}
		
	};
	
	/* PUBLIC METHODS */
	
	/* 
	 * advanceSlideshow checks to see if there is a slide after the current slide and if there is, changes the current slide photo and slide information.
	 * It then updates the public variable that holds the current slide number. It also calls the function to update the slide counter.
	 */
	FH_fullpage_slideshow.advanceSlideshow = function(){
		
		/* Don't allow advancing if thumbnails are animating */
		if ($("div.thumbnail_container").filter(":animated").size() !== 0) {
			
			return;
			
		}
		
		if (FH_fullpage_slideshow.currentSlide === totalSlides) {
			
			FH_fullpage_slideshow.toggleFinalSlide();
			
		} else {
		
			FH_fullpage_slideshow.currentSlide++;
			
			changeActiveSlide(FH_fullpage_slideshow.currentSlide - 1);
			FH_fullpage_slideshow.centerSlideArrows();
			updateSlideCounter();
			
			changeActiveThumbnail(FH_fullpage_slideshow.currentSlide - 1);
			
			if ($("img#left_arrow").attr("src") === LEFT_ARROW_DISABLED_SRC) {
				
				$("img#left_arrow").attr("src", LEFT_ARROW_SRC).toggleClass("disabled");
				
			}
			
		}
		
	};
	
	/*
	 * regressSlideshow acts identically to advanceSlideshow, only it check to see if there is a slide previous to the current slide
	 */
	FH_fullpage_slideshow.regressSlideshow = function(){
		
		/* Don't allow regressing if thumbnails are animating or we are at the beginning of the slideshow */
		if ($("div.thumbnail_container").filter(":animated").size() !== 0 || FH_fullpage_slideshow.currentSlide === 1) {
			
			return;
			
		} else if (theFinalSlide.css("display") !== "none") {
			
			FH_fullpage_slideshow.toggleFinalSlide();
			
		} else {
		
			FH_fullpage_slideshow.currentSlide--;
			changeActiveSlide(FH_fullpage_slideshow.currentSlide - 1);	
			FH_fullpage_slideshow.centerSlideArrows();		
			updateSlideCounter();
			changeActiveThumbnail(FH_fullpage_slideshow.currentSlide - 1);
			
			if (FH_fullpage_slideshow.currentSlide === 1) {
				
				$("img#left_arrow").attr("src", LEFT_ARROW_DISABLED_SRC).toggleClass("disabled");
				
			} 
			
		}
		
	};
	
	/* 
	 * advanceThumbnails checks to see if there is a thumbnail after the current thumbnail and if there is, animates the thumbnail container
	 * to the left, effectively advancing the thumbnails by one. It also changes which thumbnail has the active thumbnail class attribute.
	 */
	FH_fullpage_slideshow.advanceThumbnails = function() {
		
		/* Don't allow advancing if we are already animating or at the end of the thumbnails */
		if ($("div.thumbnail_container").filter(":animated").size() !== 0 || FH_fullpage_slideshow.activeThumbnail === totalSlides) {
			
			return;
			
		} else {
			
			$(THUMBNAIL_CONTAINER_SELECTOR).animate({
				left: "-="+THUMBNAIL_ANIMATION_DISTANCE
			}, 500, function(){
				//Callback function
				FH_fullpage_slideshow.activeThumbnail++;
				theThumbnails.removeClass(ACTIVE_THUMBNAIL_CLASSNAME);
				theThumbnails.eq(FH_fullpage_slideshow.activeThumbnail).addClass(ACTIVE_THUMBNAIL_CLASSNAME);
			});
			
		}
		
	};
	
	/*
	 * regressThumbnails acts identically to advanceThumbnails, only it checks to see if there is a thumbnail previous to the current thumbnail.
	 * It also animates the thumbnail container to the right instead of to the left.
	 */
	FH_fullpage_slideshow.regressThumbnails = function() {
		
		/* Don't allow advancing if we are already animating or at the beginning of the thumbnails */
		if ($("div.thumbnail_container").filter(":animated").size() !== 0 || FH_fullpage_slideshow.activeThumbnail === 1) {
			
			return;
			
		} else {
			
			$(THUMBNAIL_CONTAINER_SELECTOR).animate({
				left: "+="+THUMBNAIL_ANIMATION_DISTANCE
			}, 500, function(){
				//Callback function
				FH_fullpage_slideshow.activeThumbnail--;
				theThumbnails.removeClass(ACTIVE_THUMBNAIL_CLASSNAME);
				theThumbnails.eq(FH_fullpage_slideshow.activeThumbnail).addClass(ACTIVE_THUMBNAIL_CLASSNAME);
			});
			
		}
		
	};
	
	FH_fullpage_slideshow.displaySlideByNumber = function(slideNumber){
		
		if (slideNumber < 0 || slideNumber > totalSlides) {
			
			return;
			
		} else {
			
			changeActiveSlide(slideNumber);
			/* Update the currentSlide variable and display the correct number on the page */
			FH_fullpage_slideshow.currentSlide = slideNumber + 1;
			FH_fullpage_slideshow.centerSlideArrows();		
			updateSlideCounter();
			
			if ($("img#right_arrow").attr("src") === RIGHT_ARROW_DISABLED_SRC) {
				
				$("img#right_arrow").attr("src", RIGHT_ARROW_SRC).toggleClass("disabled");
			
			}
			
			if ($("img#left_arrow").attr("src") === LEFT_ARROW_DISABLED_SRC) {
			
				$("img#left_arrow").attr("src", LEFT_ARROW_SRC).toggleClass("disabled");
							
			}
			
			if (FH_fullpage_slideshow.currentSlide === 1) {
				
				$("img#left_arrow").attr("src", LEFT_ARROW_DISABLED_SRC).toggleClass("disabled");
				
			} else if (FH_fullpage_slideshow.currentSlide === totalSlides) {
				
				$("img#right_arrow").attr("src", RIGHT_ARROW_DISABLED_SRC).toggleClass("disabled");
			
			} 
			
		}
		
	};
	
	FH_fullpage_slideshow.toggleSlideArrows = function() {
		
		if (!FH_fullpage_slideshow.isFinalSlide) {
		
			SLIDE_ARROWS.toggleClass("visible");
			
		}
		
	};
	
	FH_fullpage_slideshow.centerSlideArrows = function() {
		
		SLIDE_ARROWS.css({
			"top" : (theSlidePhotos.eq(FH_fullpage_slideshow.currentSlide - 1).innerHeight() / 2) - (SLIDE_ARROW_HEIGHT / 2) + "px"
		});
		
	};
	
	FH_fullpage_slideshow.activateThumbnail = function(i) {
		
		if (theFinalSlide.css("display") !== "none") {
			
			FH_fullpage_slideshow.toggleFinalSlide();
			
		}
		
		var animationDistance = (i - FH_fullpage_slideshow.activeThumbnail + 1) * THUMBNAIL_ANIMATION_DISTANCE;
		
		$(THUMBNAIL_CONTAINER_SELECTOR).animate({
				left: "-="+animationDistance
			}, 500, function(){
				//Callback function
				FH_fullpage_slideshow.activeThumbnail = i+1;
				theThumbnails.removeClass(ACTIVE_THUMBNAIL_CLASSNAME);
				theThumbnails.eq(FH_fullpage_slideshow.activeThumbnail).addClass(ACTIVE_THUMBNAIL_CLASSNAME);
				FH_fullpage_slideshow.displaySlideByNumber(i);
			});
		
	};
	
	FH_fullpage_slideshow.toggleFinalSlide = function() {
		
		var lastSlide = theSlidePhotos.eq(FH_fullpage_slideshow.currentSlide - 1).find("img");
		var photoHeight = lastSlide.outerHeight();
		var photoWidth = lastSlide.outerWidth();		
		var finalSlideDivs = $("div#final_slide, div#final_slide div.final_slide_shader");
		
		if (FH_fullpage_slideshow.isFinalSlide === false) {
			
			FH_fullpage_slideshow.isFinalSlide = true;
			$("img#right_arrow").attr("src", RIGHT_ARROW_DISABLED_SRC).toggleClass("disabled");
			
		} else {
			
			FH_fullpage_slideshow.isFinalSlide = false;
			$("img#right_arrow").attr("src", RIGHT_ARROW_SRC).toggleClass("disabled");
			
		}

		/* Make the final_slide and final_slide_shader divs the same size as the photo behind them */
		finalSlideDivs.css({
			"width" : photoWidth,
			"height" : photoHeight
		});
		
		/* Fade in the final slide div */
		theFinalSlide.fadeToggle();
		
		/*
		 * Center the buttons vertically on the slide 
		 * Have to do this after the fadeToggle so that buttonsHeight != 0 
		 */
		var buttonsHeight = theFinalSlideButtons.height();
		theFinalSlideButtons.css({
			"top" : (photoHeight - buttonsHeight) / 2 + "px"
		});
		
	};
	
	/* Initialize slide counter */
	
	$(COUNTER_TOTAL_SELECTOR).html(totalSlides);
	
	/* Initialize thumbnail container width: (number of thumbnails * 62) + (number of thumbnails) px */
	
	$(THUMBNAIL_CONTAINER_SELECTOR).width( (totalThumbnails * 62 + totalThumbnails) + "px" );
	
	/* Add click events */
	SLIDE_ADVANCERS.click(function(){ 
		FH_fullpage_slideshow.advanceSlideshow();
	});
	
	SLIDE_REGRESSORS.click(function() {
		FH_fullpage_slideshow.regressSlideshow();
	});
	
	THUMBNAIL_ADVANCERS.click(function(){
		FH_fullpage_slideshow.advanceThumbnails();
	});
	
	THUMBNAIL_REGRESSORS.click(function(){
		FH_fullpage_slideshow.regressThumbnails();
	});
	
	theThumbnails.not(".thumbnail_placeholder").each(function(index) {
		var that = this;
		$(this).click(function() {
			FH_fullpage_slideshow.activateThumbnail(index);
		});
	});
	
	/* Reset the slideshow if the replay button is clicked */
	slideshowReplayButton.click(function() {
		
		FH_fullpage_slideshow.toggleFinalSlide();
		if (document.getElementById("slideshow_thumbnail_navigation_container")) {
			FH_fullpage_slideshow.activateThumbnail(0);
		} else {
			FH_fullpage_slideshow.displaySlideByNumber(0);
		}
		
	});
	
	/* Add hover event to main slide image container to display forward/backward arrows */
	$("div.primary_content_container div.slide_photos_container").hover(FH_fullpage_slideshow.toggleSlideArrows, FH_fullpage_slideshow.toggleSlideArrows);
	/* Center the slide arrows after the window loads */
	$(window).load(function() {
		FH_fullpage_slideshow.centerSlideArrows();
	});
	
	return FH_fullpage_slideshow;
	
})(FH_fullpage_slideshow || {}, jQuery);