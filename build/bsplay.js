/** bsplay - Bootstrap audio playlist using jQuery and AudioJS
 * @license MIT
 */
// inject:bundle
(function ($, ajs){

var plugin   = 'bsplay';
var defaults = {
	volume: 50
, random: false
, repeat: 'off' // either "off", "one" or "all"
};
var settings = {
	css: '.bsp-widget{border-radius:4px}.bsp-widget .bsp-next,.bsp-widget .bsp-prev{margin-top:6px}.bsp-widget .bsp-play-pause{border-radius:6px!important}.bsp-widget .bsp-options{margin-top:8px}.bsp-widget .bsp-infos{margin:10px 0 0}.bsp-widget .bsp-volume{margin:0 0 0 12px;width:150px}.bsp-widget .bsp-volume .slider{width:100%}.bsp-widget .bsp-volume .slider-track{background:#fff}.bsp-widget .bsp-volume .slider-selection{background:#5bc0de}.bsp-widget .bsp-volume .slider-handle{color:#fff;background:#337ab7;border:1px solid #2e6da4;font-family:\'Glyphicons Halflings\'}.bsp-widget .bsp-volume-mute .slider-handle:before{content:"\\e036"}.bsp-widget .bsp-volume-half .slider-handle:before{content:"\\e037"}.bsp-widget .bsp-volume-full .slider-handle:before{content:"\\e038"}.bsp-widget .bsp-repeat-all .glyphicon:before{content:"\\e031"}.bsp-widget .panel-body{padding:0}.bsp-widget .panel-body .bsp-scrubber{margin:0;border-radius:0;position:relative}.bsp-widget .panel-body .bsp-scrubber .bsp-loaded,.bsp-widget .panel-body .bsp-scrubber .bsp-progress{position:absolute;top:0;left:0}.bsp-widget .panel-body .alert-danger{display:none;border-radius:0;margin:0}.bsp-widget .bsp-playlist{background:#f5f5f5}.bsp-widget .bsp-playlist .sortable-placeholder{height:41px}.bsp-playing .bsp-play-pause .glyphicon:before{content:"\\e073"}.bsp-error .panel-body .alert-danger{display:block}' // inject: ./build/bsplay.css
, createPlayer: {
		markup: '<div class="panel panel-default bsp-widget"><div class="panel-heading clearfix"><div class="pull-left bsp-cover"></div><div class="btn-group"><a class="btn btn-default bsp-prev"><span class="glyphicon glyphicon-step-backward"></span></a> <a class="btn btn-lg btn-default bsp-play-pause"><span class="glyphicon glyphicon-play"></span></a> <a class="btn btn-default bsp-next"><span class="glyphicon glyphicon-step-forward"></span></a></div><div class="btn bsp-volume bsp-volume-half"><input type="text"></div><div class="btn-group pull-right bsp-options"><a class="btn btn-sm btn-default bsp-random"><span class="glyphicon glyphicon-random"></span></a> <a class="btn btn-sm btn-default bsp-repeat"><span class="glyphicon glyphicon-repeat"></span></a></div><p class="bsp-infos"><span class="glyphicon glyphicon-music"></span> <span class="bsp-active-artist"></span> - <span class="bsp-active-title"></span></p></div><div class="panel-body"><div class="progress bsp-scrubber"><div class="progress-bar progress-bar-info bsp-loaded"></div><div class="progress-bar progress-bar-striped bsp-progress"><span><span class="bsp-played"></span> <span class="bsp-duration hide"></span></span></div></div><div class="alert alert-danger"><button type="button" class="close pull-right" data-dismiss="alert"><span>&times;</span></button><p class="bsp-error-message"></p></div></div><div class="list-group bsp-playlist"><a class="hide list-group-item bsp-track"><span class="glyphicon glyphicon-play-circle"></span> <span class="bsp-artist"></span> - <span class="bsp-title"></span> <span class="badge bsp-length"></span></a></div></div>' // inject: ./build/bsplay.html
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

	/** AudioJS play event
	 *  Synchronizes playlist UI with player state
	 */
, play: function (){
		var $track = bsplay.active = bsplay.tracks[this.mp3];
		var data   = $track.data(plugin);
		bsplay.artist.text(data.artist);
		bsplay.title.text(data.title);
		$.each(bsplay.tracks, function (path, $el){ $el.removeClass('active'); });
		$track.addClass('active');
		bsplay.progress.addClass('active');
		bsplay.wrapper.addClass(settings.createPlayer.playingClass);
		bsplay.toggler.addClass('btn-primary');
	}

	/** AudioJS pause event
	 * Synchronizes playlist UI with player state
	 */
, pause: function (){
		bsplay.progress.removeClass('active');
		bsplay.wrapper.removeClass(settings.createPlayer.playingClass);
		bsplay.toggler.removeClass('btn-primary');
	}

	/** AudioJS trackEnded event
	 *  Plays next track according to repeat option or pauses
	 */
, trackEnded: function (){
		switch (bsplay.options.repeat){
		case 'off': return bsplay.next();
		case 'one': return bsplay.play(bsplay.active);
		case 'all':
			var $next = bsplay.active.next('.bsp-track');
			bsplay.play($next.length ? $next
				: bsplay.playlist.children('.bsp-track:first-child')
			);
		}
	}
};

/** Converts a track duration into displayable string
 * @param {Number} duration - Timestamp to convert
 * @return {String} Track duration using format: "00:00"
 */
var chrono = function (duration){
	if (!duration){ return 'Error'; }
	var min = Math.floor(duration / 60);
	var sec = Math.floor(duration % 60);
	return ((min < 10 ? '0' : '')+min+':'+(sec < 10 ? '0' : '')+sec);
};

/** Singleton plugin object
 * @property {jQuery}   active - Wrapped current track element
 * @property {Object}   tracks - Hash of mp3 path => wrapped playlist track
 * @property {Array}  randlist - List of tracks path in random order
 * @property {Object}  options - User options merged with defaults
 * @property {audiojs}  player - AudioJS player instance
 * @property {jQuery}  wrapper - Wrapped player container element
 * @property {jQuery}  toggler - Wrapped play/pause button element
 * @property {jQuery}   slider - Wrapped volume slider element 
 * @property {jQuery}   artist - Wrapped current track artist text element
 * @property {jQuery}    title - Wrapped current track title text element
 * @property {jQuery} progress - Wrapped progress bar element
 * @property {jQuery} playlist - Wrapped playlist container element
 * @property {jQuery} template - Wrapped track template element
 */
var bsplay = {

	active:   null
, tracks:   {}
, randlist: []

	/** Initialize audiojs player and plugin state
	 * @param {jQuery} $audio  - Wrapped audio element
	 * @param {Object} options - Plugin options
	 */
, init: function ($audio, options){
		var self     = this;
		self.options = $.extend({}, defaults, options);
		self.player  = ajs.create($audio[0], settings);
		self.wrapper = $(this.player.wrapper);
		self.toggler = self.wrapper.find('.'+settings.createPlayer.playPauseClass);
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
		self.artist   = self.wrapper.find('.bsp-active-artist');
		self.title    = self.wrapper.find('.bsp-active-title');
		self.progress = self.wrapper.find('.bsp-progress');
		self.playlist = self.wrapper.find('.bsp-playlist');
		self.template = self.playlist.find('.bsp-track')
			.remove()
			.removeClass('hide')
			.click(function (){ self.play($(this)); })
		;
		self.wrapper.find('.bsp-prev').click(function (){ self.prev(); });
		self.wrapper.find('.bsp-next').click(function (){ self.next(); });
		self.wrapper.find('.bsp-random').click(function (){
			self.options.random = $(this).toggleClass('btn-primary').hasClass('btn-primary');
			self.options.random && self.randomize();
		});
		self.wrapper.find('.bsp-repeat').click(function (){
			var $el = $(this).removeClass('bsp-repeat-'+self.options.repeat);
			switch (self.options.repeat){
			case 'off':
				self.options.repeat = 'one';
				$el.addClass('btn-primary');
				break;
			case 'one':
				self.options.repeat = 'all';
				break;
			case 'all':
				self.options.repeat = 'off';
				$el.removeClass('btn-primary');
				break;
			}
			$el.addClass('bsp-repeat-'+self.options.repeat);
		});
		self.wrapper.find('.alert-danger')
			.alert().on('close.bs.alert', function (event){
				self.wrapper.removeClass(settings.createPlayer.errorClass);
				return false;
			})
		;
		self.player.setVolume(self.options.volume / 100);
		self.active = self.add($audio);
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
		, length: chrono($audio.prop('duration'))
		};
		var $track = self.template.clone(true).data(plugin, data).appendTo(self.playlist);
		$track.find('.bsp-artist').text(data.artist);
		$track.find('.bsp-title' ).text(data.title);
		$track.find('.bsp-length' ).text(data.length);
		self.tracks[path] = $track;
		return $track;
	}

	/** Plays an audio track
	 * @param {jQuery} $track - Wrapped track element
	 */
, play: function ($track){
		this.player.load($track.data(plugin).path);
		this.player.play();
	}

	/** Pause current track */
, pause: function (){ this.player.pause(); }

	/** Plays previous playlist track according to random and repeat options or pauses */
, prev: function (){
		var $prev;
		var self = this;
		if (self.options.random){ return self.next(); }
		$prev = self.active.prev('.bsp-track')
		$prev.length ? self.play($prev) : (self.options.repeat === 'all'
			? self.play(self.playlist.children('.bsp-track:last-child'))
			: self.pause()
		);
	}

	/** Plays next playlist track according to random and repeat options or pauses */
, next: function (){
		var $next;
		var self = this;
		var random = self.options.random;
		var repeat = self.options.repeat === 'all';
		if (random && !self.randlist.length){
			self.randomize();
			return repeat ? self.next() : self.pause();
		}
		var $next = random
			? self.tracks[self.randlist.pop()]
			: self.active.next('.bsp-track')
		;
		$next.length ? self.play($next) : (repeat
			? self.play(self.playlist.children('.bsp-track:first-child'))
			: self.pause()
		);
	}

	/** Populates randlist property with shuffled track keys */ 
, randomize: function (){
		var tmp, rng;
		var self = this;
		var keys = $.map(self.tracks, function ($track, path){
			if (!$track.is(self.active)/* || !self.player.playing*/){ return path; }
		});
    for (var idx=keys.length-1; idx>0; idx--){
			rng       = Math.floor(Math.random() * (idx + 1));
			tmp       = keys[idx];
			keys[idx] = keys[rng];
			keys[rng] = tmp;
    }
		self.randlist = keys;
	}
};

$.fn[plugin] = function (options){
	return this.each(function (){
		var $el = $(this);
		if ($el.prop('tagName') !== 'AUDIO'){ return; }
		bsplay.player ? bsplay.add($el) : bsplay.init($el, options);
		bsplay.playlist.sortable();
	});
};

})(jQuery, audiojs);
