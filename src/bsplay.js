;(function ($, ajs){

var plugin   = 'bsplay';
var defaults = {};
var settings = {
	css: 'INJECT.css'
, createPlayer: {
		markup: 'INJECT.html'
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
	}
};
var bsplay = {
	init: function ($audio, options){
		this.options = $.extend({}, defaults, options);
		this.player  = ajs.create($audio[0], settings);
		console.log('init', this);
	}
, add: function ($audio){}
};

$.fn[plugin] = function (options){
	return this.each(function (){
		var $el = $(this);
		if ($el.prop('tagName') !== 'AUDIO'){ return; }
		bsplay.player ? bsplay.add($el) : bsplay.init($el, options);
	});
};

})(jQuery, audiojs);
