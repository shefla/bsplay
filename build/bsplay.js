;(function ($, ajs){

var plugin   = 'bsplay';
var defaults = {};
var settings = {
	css: '.bsp-widget{border-radius:4px}.bsp-widget .bsp-volume{width:150px!important;margin:0 0 0 12px}.bsp-widget .bsp-volume .slider-track{background:#fff}.bsp-widget .bsp-volume .slider-selection{background:#5bc0de}.bsp-widget .bsp-volume .slider-handle{color:#fff;background:#337ab7;border:1px solid #2e6da4;font-family:\'Glyphicons Halflings\'}.bsp-widget .bsp-volume-mute .slider-handle:before{content:"\\e036"}.bsp-widget .bsp-volume-half .slider-handle:before{content:"\\e037"}.bsp-widget .bsp-volume-full .slider-handle:before{content:"\\e038"}'
, createPlayer: {
		markup: '<div class="panel panel-default bsp-widget"><div class="panel-heading clearfix"><div class="pull-left bsp-cover"></div><div class="btn-group"><a class="btn btn-default bsp-prev"><span class="glyphicon glyphicon-step-backward"></span></a> <a class="btn btn-lg btn-default bsp-play-pause"><span class="glyphicon glyphicon-play"></span></a> <a class="btn btn-default bsp-next"><span class="glyphicon glyphicon-step-forward"></span></a></div><div class="btn bsp-volume bsp-volume-half"><input type="text"></div><div class="btn-group pull-right bsp-options"><a class="btn btn-sm btn-default bsp-random"><span class="glyphicon glyphicon-random"></span></a> <a class="btn btn-sm btn-default bsp-repeat"><span class="glyphicon glyphicon-repeat"></span></a></div><p class="bsp-infos"><span class="glyphicon glyphicon-music"></span> <span class="bsp-active-artist"></span> - <span class="bsp-active-title"></span></p></div><div class="panel-body"><div class="progress bsp-scrubber"><div class="progress-bar progress-bar-info bsp-loaded"></div><div class="progress-bar progress-bar-striped bsp-progress"><span><span class="bsp-played"></span> <span class="bsp-duration hide"></span></span></div></div><p class="alert alert-danger bsp-error-message"></p></div><div class="list-group bsp-playlist"><a class="hide list-group-item bsp-track"><span class="glyphicon glyphicon-play-circle"></span> <span class="bsp-artist"></span> - <span class="bsp-title"></span> <span class="badge bsp-length"></span></a></div></div>'
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
		var self     = this;
		self.options = $.extend({}, defaults, options);
		self.player  = ajs.create($audio[0], settings);
		self.wrapper = $(this.player.wrapper);
		self.slider  = this.wrapper.find('.bsp-volume');
		self.slider.find('input').slider({
			min: 0, max: 100, value: 50
		, formatter: function (val){ return 'Volume: '+val+'%'; }
		}).on('change', function (event){
			var val = event.value.newValue;
			self.player.setVolume(val / 100);
			if (val === 0){
				self.slider.addClass('bsp-volume-mute')
					.removeClass('bsp-volume-half bsp-volume-full');	
			}
			else if (val > 50){
				self.slider.addClass('bsp-volume-full')
					.removeClass('bsp-volume-mute bsp-volume-half');
			}
			else {
				self.slider.addClass('bsp-volume-half')
					.removeClass('bsp-volume-mute bsp-volume-full');
			}
		});
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
