var FH_fullpage_slideshow = (function(FH_fullpage_slideshow, $) {
	
	/* PRIVATE VARIABLES */
	var theSlidePhotos = $("div.slide_photos_container div.slide_photo"),
		theSlideInformations = $("div.slide_information_container div.slide_information"),
		theSlideAdvancers = $("img#right_arrow, div.slide_photo"),
		theSlideRegressors = $("img#left_arrow");
		
	/* PUBLIC VARIABLES */
	FH_fullpage_slideshow.currentSlide = 1;
	FH_fullpage_slideshow.totalSlides = theSlidePhotos.size();
	
	/* PRIVATE METHODS */
	
	/*
	 * updateSlideCounter changes the number that keeps track of which slide you are on visually for the user to number held in currentSlide
	 */
	 
	var updateSlideCounter = function() {
		
		/* This is the id attribute of the span that holds the number we want to update */
		var counterSpanID = "current_slide";
		
		$("span#" + counterSpanID).html(FH_fullpage_slideshow.currentSlide);
		
	}
	
	/* PUBLIC METHODS */
	
	/* 
	 * advanceSlideshow checks to see if there is a slide after the current slide and if there is, changes the current slide photo and slide information.
	 * It then updates the public variable that holds the current slide number. It also calls the function to update the slide counter.
	 */
	FH_fullpage_slideshow.advanceSlideshow = function(){
		
		console.log("Advancing Slideshow");
		
		if (FH_fullpage_slideshow.currentSlide === FH_fullpage_slideshow.totalSlides) {
			
			/* TODO: add a displayFinalSlide function? Or just place final slide in slideshow. */
			console.log("Attempted to advance beyond final slide");
			return;
			
		} else {
		
			FH_fullpage_slideshow.currentSlide++;
			theSlidePhotos.removeClass("active");
			theSlidePhotos.eq(FH_fullpage_slideshow.currentSlide - 1).addClass("active");
			
			theSlideInformations.removeClass("active");
			theSlideInformations.eq(FH_fullpage_slideshow.currentSlide - 1).addClass("active");
			
			updateSlideCounter();
			
		}
		
	}
	
	/*
	 * regressSlideshow acts identically to advanceSlideshow, only it check to see if there is a slide previous to the current slide
	 */
	FH_fullpage_slideshow.regressSlideshow = function(){
		
		console.log("Regressing Slideshow");
		
		if (FH_fullpage_slideshow.currentSlide === 1) {
			
			/* TODO: add a displayFinalSlide function? Or just place final slide in slideshow. */
			console.log("Attempted to regress before first slide");
			return;
			
		} else {
		
			FH_fullpage_slideshow.currentSlide--;
			theSlidePhotos.removeClass("active");
			theSlidePhotos.eq(FH_fullpage_slideshow.currentSlide - 1).addClass("active");
			
			theSlideInformations.removeClass("active");
			theSlideInformations.eq(FH_fullpage_slideshow.currentSlide - 1).addClass("active");
			
			updateSlideCounter();
			
		}
		
	}
	
	console.log("Total slides: " + FH_fullpage_slideshow.totalSlides);
	
	/* Initialize slide counter */
	
	$("span#total_slides").html(FH_fullpage_slideshow.totalSlides);
	
	/* Add click events */
	theSlideAdvancers.click(function(){ 
		FH_fullpage_slideshow.advanceSlideshow();
	});
	
	theSlideRegressors.click(function() {
		FH_fullpage_slideshow.regressSlideshow();
	});
	
	return FH_fullpage_slideshow;
	
})(FH_fullpage_slideshow || {}, jQuery);