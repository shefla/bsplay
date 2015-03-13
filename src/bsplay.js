;(function ($, ajs){

var plugin   = 'bsplay';
var defaults = {
	volume: 50
};
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

/** Singleton plugin object
 * @property {jQuery}  active  - Wrapped current track element
 * @property {Object}  tracks  - Hash of mp3 path => wrapped playlist track
 * @property {Object}  options - User options merged with defaults
 * @property {audiojs} player  - AudioJS player instance
 * @property {jQuery}  wrapper - Wrapped player container element
 * @property {jQuery}  slider  - Wrapped volume slider element 
 * @property {jQuery} playlist - Wrapped playlist container element
 * @property {jQuery} template - Wrapped track template element
 */
var bsplay = {

	active: null
, tracks: {}

	/** Initialize audiojs player and plugin state
	 * @param {jQuery} $audio  - Wrapped audio element
	 * @param {Object} options - Plugin options
	 */
, init: function ($audio, options){
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
				self.slider.addClass('bsp-volume-mute').removeClass('bsp-volume-half bsp-volume-full');	
			}
			else if (val > 50){
				self.slider.addClass('bsp-volume-full').removeClass('bsp-volume-mute bsp-volume-half');
			}
			else {
				self.slider.addClass('bsp-volume-half').removeClass('bsp-volume-mute bsp-volume-full');
			}
		});
		self.playlist = this.wrapper.find('.bsp-playlist');
		self.template = self.playlist.find('.bsp-track')
			.remove()
			.removeClass('hide')
			.click(function (){ self.play($(this)); })
		;
		this.player.setVolume(this.options.volume / 100);
		this.add($audio);
	}

	/** Adds an audio element to the playlist
	 * @param {jQuery} $audio - Wrapped audio element
	 */
, add: function ($audio){
		var self = this;
		var path = $audio.attr('src');
		if (self.tracks[path]){ return this; }
		var tokens = path.split('/').pop()
			.replace(/^[\s\._]*\d*[\s\._]*/, '')
			.split(/[\s\._]+-[\s\._]+/)
		;
		var data = {
			path:   path
		, artist: tokens.length > 1 ? tokens.shift() : '?'
		, title:  tokens.join(' - ').replace(/\.mp3$/i, '')
		};
		var $track = self.template.clone(true).data(plugin, data).appendTo(self.playlist);
		$track.find('.bsp-artist').text(data.artist);
		$track.find('.bsp-title' ).text(data.title);
		self.active || (self.active = $track);
		self.tracks[path] = $track;
	}

	/** Plays an audio element
	 * @param {jQuery} $audio - Wrapped audio element
	 */
, play: function ($audio){

	}

};

$.fn[plugin] = function (options){
	return this.each(function (){
		var $el = $(this);
		if ($el.prop('tagName') !== 'AUDIO'){ return; }
		bsplay.player ? bsplay.add($el) : bsplay.init($el, options);
	});
};

})(jQuery, audiojs);
