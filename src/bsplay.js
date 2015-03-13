;(function ($, ajs){

var plugin   = 'bsplay';
var defaults = {};
var settings = {
	css: 'INJECT.css'
, createPlayer: { markup: 'INJECT.html' }
, playPauseClass:    'bsp-play-pause'
, scrubberClass:     'bsp-scrubber'
, progressClass:     'bsp-progress'
, loaderClass:       'bsp-loaded'
, timeClass:         'bsp-infos'
, durationClass:     'bsp-duration'
, playedClass:       'bsp-played'
, errorMessageClass: 'bsp-error-message'
, playingClass:      'bsp-playing'
, loadingClass:      'bsp-loading'
, errorClass:        'bsp-error'
};

$.fn[plugin] = function (options){
	return this.each(function (){

	});
};

})(jQuery, audiojs);
