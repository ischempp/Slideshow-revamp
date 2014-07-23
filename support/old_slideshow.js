// JavaScript Document// Requires jQuery to function
/* As of now, a config object can be passed to the constructor, allowing the user to set the width of the large photo area
   and the height of the thumbnails. */
/* This function is namespaced enough that I did not place it inside the componentApp */
function FH_slideshowWidget(hc, config) {
	
	this.hashCode = hc;
	this.ancestorDiv = $('.slideshowSuperContainer[data-hash='+this.hashCode+']');
	this.totalSlides = $('.textimage', this.ancestorDiv).size();
	this.config = config || {}

	var defaultOptions = {
		largeWidth:597,
		thumbHeight:89
	};
	
	setOptions.call(this); // If a config object was passed in, this sets the variables passed in
	createSkeleton.call(this);
	this.theSlides = $('.theSlides', this.scope);
	this.theThumbs = $('.thumbnailContainer', this.scope);
	moveContent.call(this);
	slideshowInit.call(this);
	
/* "Private" methods */	
	function setOptions() {
		for(var i in defaultOptions){
			this[i] = this.config[i] || defaultOptions[i];
		}
	}
	
	function createSkeleton() {
		$('<div></div>',
		  {
			  "class": 'slideshowContainer',
			  id: 'FH_slideshowWidget_' + this.hashCode,
			  tabindex: "1"
		  }).insertBefore(this.ancestorDiv);
		this.scope = document.getElementById('FH_slideshowWidget_'+this.hashCode); // Lets us stay within just this slideshow, used as optional second variable in $() calls

/* 
Here is a variable to hold a jQuery object containing the DOM objects I want to append new objects to
I will modify it whenever we get to a new item to append to 
*/ 
		var appTo = $(this.scope);
		$('<div></div>',
		  {
			  "class": 'slideshowHeader'
		  }).appendTo(appTo);
		$('<div></div>',
		  {
			  "class": 'slideshowPhotoContainer'
		  }).appendTo(appTo);
		$('<div></div>',
		  {
			  "class": 'clear'
		  }).appendTo(appTo);
		$('<div></div>',
		  {
			  "class": 'textContainer'
		  }).appendTo(appTo);
/*Change up the appTo variable */		
		appTo = $('div.slideshowPhotoContainer', this.scope);
		$('<div></div>',
		  {
			  "class": 'largePhotoContainer'
		  }).appendTo(appTo);
		$('<div></div>',
		  {
			  "class": 'thumbnailBar'
		  }).appendTo(appTo);
/*Change up the appTo variable */		
		appTo = $('div.largePhotoContainer', this.scope);		
		$('<div></div>',
		  {
			  "class": 'control',
			  id: 'leftControl_'+this.hashCode
		  }).appendTo(appTo);
		$('<div></div>',
		  {
			  "class": 'theSlides'
		  }).appendTo(appTo);
		$('<div></div>',
		  {
			  "class": 'control',
			  id: 'rightControl_'+this.hashCode
		  }).appendTo(appTo);
/* Don't need the appTo variable for these next two because they contain the hashCode in their id */		
		$('<div></div>',
		  {
			  "class": 'controlImage',
			  id: 'leftControlImage_'+this.hashCode
		  }).text("Move left").appendTo('div#leftControl_'+this.hashCode);
		$('<div></div>',
		  {
			  "class": 'controlImage',
			  id: 'rightControlImage_'+this.hashCode
		  }).text("Move right").appendTo('div#rightControl_'+this.hashCode);
/*Change up the appTo variable */		
		appTo = $('div.thumbnailBar', this.scope);		
		$('<div></div>',
		  {
			  "class": 'thumbControl',
			  id: 'topThumbControl_'+this.hashCode
		  }).text("Move up").appendTo(appTo);
		$('<div></div>',
		  {
			  "class": 'overflowContainer'
		  }).appendTo(appTo);
		$('<div></div>',
		  {
			  "class": 'thumbControl',
			  id: 'bottomThumbControl_'+this.hashCode
		  }).text("Move down").appendTo(appTo);
/*Change up the appTo variable */		
		appTo = $('div.overflowContainer', this.scope);		
		$('<div></div>',
		  {
			  "class": 'thumbnailContainer'
		  }).appendTo(appTo);
	}
/* Takes all the content from this.ancestorDiv and moves it into the skeleton created by createSkeleton() */	
	function moveContent() {
		$('.slideTitle, .instructions', this.ancestorDiv).clone().prependTo('div.slideshowHeader', this.scope);
		$('div.textimage_image img', this.ancestorDiv).each( function(){
			var theHash = $(this).parents('.slideshowSuperContainer').attr('data-hash');
			$(this).data("hash",theHash);
			$('<div></div>',{"class":'largePhoto'}).append(this).appendTo('#FH_slideshowWidget_'+theHash+' div.theSlides');
		});
		$('.largePhoto img', this.theSlides).clone(true).attr({'title':''}).each( function(){
			$('<div></div>',{"class":'thumbnail'}).append(this).appendTo('#FH_slideshowWidget_'+$(this).data("hash")+' div.thumbnailContainer', this.scope);
		});
		$('div.text', this.ancestorDiv).each( function(){
		   var theHash = $(this).parents('.slideshowSuperContainer').attr('data-hash');
			$('<div></div>',{"class":'textSlide'}).append(this).appendTo('#FH_slideshowWidget_'+theHash+' div.textContainer', this.scope);
		});
		this.ancestorDiv.css({'display':'none'}); // Hide the old content, we are done with it.
	}
/* Catch-all function that sets object-specific variables, adds css to dynamically-created DOM objects, and binds events */	
	function slideshowInit() {
/* Set values for some object variables */	
		if(this.totalSlides > 4) {
			this.bottomThumb = 3;
		} else {
			this.bottomThumb = this.totalSlides - 1;
			$('#bottomThumbControl', this.scope).css({'display':'none'}); //Hide the bottom arrow, since there aren't enough thumbnails to warrant it
		}
/* Add css to the divs that have ids that contain hashCodes */
		$('#leftControl_'+this.hashCode).css({
			'position':'absolute',
			'left':'0',
			'top':'0'
		});
		$('#rightControl_'+this.hashCode).css({
			'position':'absolute',
			'right':'0',
			'top':'0'
		});
		$('#leftControlImage_'+this.hashCode).css({
			'background-image':'url(/etc/designs/public/img/nav/slideshow-left-arrow.png)',
			'left':'0',
			'top':'195px'
		});
		$('#rightControlImage_'+this.hashCode).css({
			'background-image':'url(/etc/designs/public/img/nav/slideshow-right-arrow.png)',
			'right':'0',
			'top':'195px'
		});
		$('#topThumbControl_'+this.hashCode).css({
			'background-image':'url(/etc/designs/public/img/nav/slideshow-top-arrow.gif)',
			'left':'0',
			'top':'0',
			'height':'48px'
		});
		$('#bottomThumbControl_'+this.hashCode).css({
			'background-image':'url(/etc/designs/public/img/nav/slideshow-bottom-arrow.gif)',
			'left':'0',
			'bottom':'0',
			'height':'47px'
		});
/* Resize all the appropriate container divs according to the number of slides*/
		this.theSlides.width(this.largeWidth * this.totalSlides);
		$('.thumbnailContainer', this.scope).height(this.thumbHeight * this.totalSlides);
/* Add active classes to the first thumbnail and text slide */	
		$('.thumbnail', this.scope).first().addClass('activeThumb');
		$('.textSlide', this.scope).first().addClass('activeText');
/* Make sure the correct arrows are being shown */
		this.addRemoveArrows();
/* Add mouseenter and mouseleave events to the large photo container to show/hide the arrows */
		var tmp = this; // Need a copy of this to send to $.proxy()
		$('.largePhotoContainer', this.scope).mouseenter($.proxy(tmp.revealArrows, tmp)).mouseleave($.proxy(tmp.hideArrows, tmp));
/* Add the status div (useless if user has no javaScript) */	
		$('.textContainer', this.scope).prepend('<div id="slideStatus_'+this.hashCode+'"><span class="currentSlide">1</span>/'+ this.totalSlides + '</div>');
		$('#slideStatus_'+this.hashCode).css({
			'color':'#666666',
			'font-family':'Arial,Helvetica,sans-serif',
			'font-size':'14px',
			'margin-bottom':'7px',
			'padding-right':'2px',
			'text-align':'right'
		});
/* Get rid of the frame class from all images */
		$('img', this.scope).removeClass("frame");
		this.bindEvents();
		
	}
}
/* Some necessary object properties we set to avoid undefined errors */ 
FH_slideshowWidget.prototype.currentSlide = 0;
FH_slideshowWidget.prototype.topThumb = 0;
FH_slideshowWidget.prototype.bottomThumb = 0;


/* PUBLIC OBJECT METHODS */
/* A method that advances the slideshow by 1 slide */
FH_slideshowWidget.prototype.advanceSlide = function() {
	var leftIndent; //The value of the left attribute of this.theSlides we want to animate to
	this.unbindEvents(); //Avoid additional animations until this one has completed
	if(this.currentSlide == this.totalSlides - 1) {
		leftIndent = 0; //We want to go back to the default, which is 0
		this.currentSlide = 0; //Reset the current slide to the first one
	} else {
		leftIndent = parseInt(this.theSlides.css('left')) - this.largeWidth;
		this.currentSlide++;
	}
	this.theSlides.animate({'left' : leftIndent}, 200, function(that){
		return function() {
			that.bindEvents();
		}
	}(this)); //rebind the click events after done animating
	$('.thumbnail', this.scope).removeClass('activeThumb').eq(this.currentSlide).addClass('activeThumb'); //change the active thumbnail
	$('.textContainer .textSlide', this.scope).removeClass('activeText').eq(this.currentSlide).addClass('activeText'); //change the active text
	this.checkThumbs();
	this.addRemoveArrows();
	this.updateCurrent();
}
/* A method that moves the slideshow backwards 1 slide */
FH_slideshowWidget.prototype.regressSlide = function() {
	if(this.currentSlide == 0) return; //Don't regress if we are at the beginning
	this.unbindEvents(); //Avoid additional animations until this one has completed
	var leftIndent = parseInt(this.theSlides.css('left')) + this.largeWidth;
	this.theSlides.animate({'left' : leftIndent}, 200, function(that){
		return function() {
			that.bindEvents();
		}
	}(this)); //rebind the click events after done animating
	this.currentSlide--; //Update which slide is the current one
	$('.thumbnailContainer .thumbnail', this.scope).removeClass('activeThumb').eq(this.currentSlide).addClass('activeThumb'); //change the active thumbnail
	$('.textContainer .textSlide', this.scope).removeClass('activeText').eq(this.currentSlide).addClass('activeText'); //change the active text
	this.checkThumbs();
	this.addRemoveArrows();
	this.updateCurrent();
}
/* A method that moves the slideshow to position s */
FH_slideshowWidget.prototype.changeSlide = function(s) {
	if(s == this.currentSlide || s >= this.totalSlides || s < 0) return; // No need to do anything if they click on the active slide, or if an illegal value is passed
	this.unbindEvents(); //Avoid additional animations until this one has completed
	var leftIndent = parseInt(this.theSlides.css('left')) - ((s - this.currentSlide) * this.largeWidth);	
	this.theSlides.animate({'left' : leftIndent}, 500, function(that){
		return function() {
			that.bindEvents();
		}
	}(this)); //rebind the click events after done animating
	this.currentSlide = s; //Update which slide is the current one
	$('.thumbnailContainer .thumbnail', this.scope).removeClass('activeThumb').eq(this.currentSlide).addClass('activeThumb'); //change the active thumbnail
	$('.textContainer .textSlide', this.scope).removeClass('activeText').eq(this.currentSlide).addClass('activeText'); //change the active text
	this.checkThumbs();
	this.addRemoveArrows();	
	this.updateCurrent();
}
/* A method that advances the thumbnail view by 3 thumbnails, or to the end of the thumbnails, whichever is smaller */
FH_slideshowWidget.prototype.thumbnailAdvance = function() {
	if(this.bottomThumb == this.totalSlides - 1) return; //No need to do anything if we are already at the bottom
	var toSlideTo, animationSpeed;
	toSlideTo = this.bottomThumb + 3;
	animationSpeed = 500;
	if(toSlideTo > this.totalSlides - 1) { //If advancing by 3 would put us past the bottom, just advance to the bottom
		toSlideTo = this.totalSlides - 1;
	}
	var slideDiff = toSlideTo - this.bottomThumb;
	var topIndent = parseInt(this.theThumbs.css('top')) - (slideDiff * this.thumbHeight);
	
	this.unbindEvents();
	this.theThumbs.animate({'top' : topIndent}, animationSpeed, function(that){
		return function() {
			that.bindEvents();
		}
	}(this)); //rebind the click events after done animating
	
	this.bottomThumb += slideDiff; //Update which thumb is at the bottom
	this.topThumb += slideDiff; //Same with the top
	this.addRemoveArrows();
}
/* Same as thumbnailAdvance, but backwards */
FH_slideshowWidget.prototype.thumbnailRegress = function() {
	if(this.topThumb == 0) return; //No need to do anything if we are already at the top
	var toSlideTo, animationSpeed;
	toSlideTo = this.topThumb - 3;
	animationSpeed = 500;
	if(toSlideTo < 0) { //If regressing by 3 would put us past the top, just advance to the top
		toSlideTo = 0;
	}
	var slideDiff = toSlideTo - this.topThumb;
	var topIndent = parseInt(this.theThumbs.css('top')) - (slideDiff * this.thumbHeight);
	
	this.unbindEvents();
	this.theThumbs.animate({'top' : topIndent}, animationSpeed, function(that){
		return function() {
			that.bindEvents();
		}
	}(this)); //rebind the click events after done animating
	
	this.bottomThumb += slideDiff; //Update which thumb is at the bottom
	this.topThumb += slideDiff; //Same with the top
	this.addRemoveArrows();
}
/* A method that checks whether the active thumb is visible in the thumbnail bar and if not, animates the bar until it is. 
   Also animates the bar when the active thumb is the top or bottom thumb visible in the thumbnail bar, unless it is the absolute top or bottom */
FH_slideshowWidget.prototype.checkThumbs = function() {
	var activeThumb = $('.activeThumb', this.scope).index();
	if(activeThumb == this.topThumb){
		if(activeThumb == 0) return; //Don't do anything if we are already at the top
		this.theThumbs.animate({'top' : parseInt(this.theThumbs.css('top')) + this.thumbHeight}, 200);
		this.topThumb--;
		this.bottomThumb--;
	} else if(activeThumb == this.bottomThumb) {
		if(activeThumb == this.totalSlides - 1) return;	 //Don't do anything if we are already at the bottom
		this.theThumbs.animate({'top' : parseInt(this.theThumbs.css('top')) - this.thumbHeight}, 200);
		this.bottomThumb++;
		this.topThumb++;
	} else if(activeThumb < this.topThumb) { //If the active thumb is above the topmost visible thumb
		var slideDiff = (this.topThumb+1) - activeThumb;
		if(activeThumb == 0) slideDiff = this.topThumb;	
		this.theThumbs.animate({'top' : parseInt(this.theThumbs.css('top')) + (this.thumbHeight * slideDiff)}, 200);
		this.bottomThumb -= slideDiff;
		this.topThumb -= slideDiff;
	} else if(activeThumb > this.bottomThumb) { //If the active thumb is below the bottommost visible thumb
		var slideDiff = activeThumb - (this.bottomThumb-1);
		if(activeThumb == this.totalSlides - 1) slideDiff = (this.totalSlides - 1) - this.bottomThumb;
		this.theThumbs.animate({'top' : parseInt(this.theThumbs.css('top')) - (this.thumbHeight * slideDiff)}, 200);
		this.bottomThumb += slideDiff;
		this.topThumb += slideDiff;
	}
}
/* This function removes the advance arrow if you are on the last slide, or the regress arrow if you are on the first.
It also removes the top and bottom thumbnail arrows if there are no further thumbnails above or below, respectively. */
FH_slideshowWidget.prototype.addRemoveArrows = function() {
	if(this.currentSlide == 0) {
		$('#leftControl_'+this.hashCode).css({'display' : "none"});
	} else {
		$('#leftControl_'+this.hashCode).css({'display' : "block"});
	}
/* If we are at the last slide, replace the right arrow with a rewind arrow */	
	if(this.currentSlide == this.totalSlides - 1){
		$('#rightControlImage_'+this.hashCode).css({
			'background-image':'url(/etc/designs/public/img/nav/slideshow-rewind-arrow.png)',
			'width':'86px',
			'height':'86px',
			'top':'177px'
		})
	} else {
		$('#rightControl_'+this.hashCode).css({'display' : 'block'});
		$('#rightControlImage_'+this.hashCode).css({
			'background-image':'url(/etc/designs/public/img/nav/slideshow-right-arrow.png)',
			'width':'48px',
			'height':'48px',
			'top':'195px'
		})
	}
	if(this.topThumb == 0) {
		$('#topThumbControl_'+this.hashCode).css({'display' : 'none'});
	} else {
		$('#topThumbControl_'+this.hashCode).css({'display' : 'block'});
	}
	if(this.bottomThumb == this.totalSlides - 1) {
		$('#bottomThumbControl_'+this.hashCode).css({'display' : 'none'});
	} else {
		$('#bottomThumbControl_'+this.hashCode).css({'display' : 'block'});
	}
}
/* A method to update the numbers that let you know which slide you are on */
FH_slideshowWidget.prototype.updateCurrent = function() {
	$('#slideStatus_'+this.hashCode+' .currentSlide').text(this.currentSlide + 1);	
}

/* A method to push the slideshow advance/regress arrows over the image when you are hovering over it */
FH_slideshowWidget.prototype.revealArrows = function() {
	$('#leftControlImage_'+this.hashCode).show();
	$('#rightControlImage_'+this.hashCode).show();
}
/* A method to push the slideshow advance/regress arrows off to the side when you are not hovering over the image */
FH_slideshowWidget.prototype.hideArrows = function() {
	$('#leftControlImage_'+this.hashCode).css({'display':'none'});
	if(this.currentSlide != this.totalSlides - 1) {
		$('#rightControlImage_'+this.hashCode).hide();
	}
}
/* A method that binds the appropriate methods to the click events of appropriate DOM objects */
FH_slideshowWidget.prototype.bindEvents = function() {
	var tmp = this;
/* Add events to the arrows */
	$('#rightControl_'+this.hashCode).click($.proxy(tmp.advanceSlide, tmp));
	$('#leftControl_'+this.hashCode).click($.proxy(tmp.regressSlide, tmp));
/* Add events to the thumbnail arrows */
	$('#bottomThumbControl_'+this.hashCode).click($.proxy(tmp.thumbnailAdvance, tmp));
	$('#topThumbControl_'+this.hashCode).click($.proxy(tmp.thumbnailRegress, tmp));
/* Add events to all the thumbnails */
	$('.thumbnail', this.scope).click(function(that){
		return function() {
			that.changeSlide($(this).index());
		}
	}(this));	
}
/* A method that unbinds any click events that cause animations, so you cannot have 2 animations active at once */
FH_slideshowWidget.prototype.unbindEvents = function() {
	$('#rightControl_'+this.hashCode).unbind("click");
	$('#leftControl_'+this.hashCode).unbind("click");
	$('#bottomThumbControl_'+this.hashCode).unbind("click");
	$('#topThumbControl_'+this.hashCode).unbind("click");
	$('.thumbnail', this.scope).unbind("click");
}

$(window).load(function() {
	$('.largePhoto img').each( function(){
		$(this).css({'margin-top' : Math.floor((428 - $(this).height()) / 2)});
	}); 
});