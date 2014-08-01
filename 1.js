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
	
	/* PRIVATE VARIABLES */
	var theSlidePhotos = $("div.slide_photos_container div.slide_photo"),
		totalSlides = theSlidePhotos.size(),
		theSlideInformations = $("div.slide_information_container div.slide_information"),
		theThumbnails = $("div.thumbnail_container div.thumbnail_image"),
		totalThumbnails = theThumbnails.size();
		
	/* PUBLIC VARIABLES */
	FH_fullpage_slideshow.currentSlide = 1;
	FH_fullpage_slideshow.activeThumbnail = 1;
	
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
			
			console.log("Attempted to display an illegal thumbnail: " + slideNumber);
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
	FH_fullpage_slideshow.advanceSlideshow = function(el){
		
//		console.log("Advancing Slideshow");
		
		if (FH_fullpage_slideshow.currentSlide === totalSlides) {
			
			/* TODO: add a displayFinalSlide function? Or just place final slide in slideshow. */
//			console.log("Attempted to advance beyond final slide");
			return;
			
		} else {
		
			FH_fullpage_slideshow.currentSlide++;
			changeActiveSlide(FH_fullpage_slideshow.currentSlide - 1);
			console.log("new top measurement: " + (theSlidePhotos.eq(FH_fullpage_slideshow.currentSlide - 1).innerHeight() / 2) - (SLIDE_ARROW_HEIGHT / 2) + "px");
			SLIDE_ARROWS.css({
				"top" : (theSlidePhotos.eq(FH_fullpage_slideshow.currentSlide - 1).innerHeight() / 2) - (SLIDE_ARROW_HEIGHT / 2) + "px"
			});
			updateSlideCounter();
			changeActiveThumbnail(FH_fullpage_slideshow.currentSlide - 1);
			
		}
		
	};
	
	/*
	 * regressSlideshow acts identically to advanceSlideshow, only it check to see if there is a slide previous to the current slide
	 */
	FH_fullpage_slideshow.regressSlideshow = function(el){
		
//		console.log("Regressing Slideshow");
		
		if (FH_fullpage_slideshow.currentSlide === 1) {
			
//			console.log("Attempted to regress before first slide");
			return;
			
		} else {
		
			FH_fullpage_slideshow.currentSlide--;
			changeActiveSlide(FH_fullpage_slideshow.currentSlide - 1);	
			SLIDE_ARROWS.css({
				"top" : (theSlidePhotos.eq(FH_fullpage_slideshow.currentSlide - 1).innerHeight() / 2) - (SLIDE_ARROW_HEIGHT / 2) + "px"
			});		
			updateSlideCounter();
			changeActiveThumbnail(FH_fullpage_slideshow.currentSlide - 1);
			
		}
		
	};
	
	/* 
	 * advanceThumbnails checks to see if there is a thumbnail after the current thumbnail and if there is, animates the thumbnail container
	 * to the left, effectively advancing the thumbnails by one. It also changes which thumbnail has the active thumbnail class attribute.
	 */
	FH_fullpage_slideshow.advanceThumbnails = function() {
		
		if (FH_fullpage_slideshow.activeThumbnail === totalSlides) {
			
//			console.log("Attempted to advance thumbnails past final thumbnail");
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
		
		if (FH_fullpage_slideshow.activeThumbnail === 1) {
			
//			console.log("Attempted to regress thumbnails before first thumbnail");
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
			
//			console.log("Attempted to display an illegal slide: " + slideNumber);
			return;
			
		} else {
			
			changeActiveSlide(slideNumber);
			/* Update the currentSlide variable and display the correct number on the page */
			FH_fullpage_slideshow.currentSlide = slideNumber + 1;
			updateSlideCounter();
			
		}
		
	};
	
	FH_fullpage_slideshow.toggleSlideArrows = function() {
		
		SLIDE_ARROWS.toggleClass("visible");
		
	}
	
//	console.log("Total slides: " + totalSlides);
	
	/* Initialize slide counter */
	
	$(COUNTER_TOTAL_SELECTOR).html(totalSlides);
	
	/* Initialize thumbnail container width: (number of thumbnails * 62) + (number of thumbnails) px */
	
	$(THUMBNAIL_CONTAINER_SELECTOR).width( (totalThumbnails * 62 + totalThumbnails) + "px" );
	
	/* Add click events */
	SLIDE_ADVANCERS.click(function(){ 
		FH_fullpage_slideshow.advanceSlideshow(this);
	});
	
	SLIDE_REGRESSORS.click(function() {
		FH_fullpage_slideshow.regressSlideshow(this);
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
			if ($(that).hasClass(ACTIVE_THUMBNAIL_CLASSNAME)) {
				FH_fullpage_slideshow.displaySlideByNumber(index);
			} else {
//				console.log("Thumbnail not active");
			}
		});
	});
	
	/* Add hover event to main slide image container to display forward/backward arrows */
	$("div.primary_content_container div.slide_photos_container").hover(FH_fullpage_slideshow.toggleSlideArrows, FH_fullpage_slideshow.toggleSlideArrows);
	
	return FH_fullpage_slideshow;
	
})(FH_fullpage_slideshow || {}, jQuery);