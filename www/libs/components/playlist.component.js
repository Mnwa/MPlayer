"use strict";

System.register(["angular2/core"], function (_export, _context) {
    "use strict";

    var Component, _createClass, _typeof, __decorate, PlayList, Analyse;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_angular2Core) {
            Component = _angular2Core.Component;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                return typeof obj;
            } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
            };

            __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
                var c = arguments.length,
                    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
                    d;
                if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
                    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
                }return c > 3 && r && Object.defineProperty(target, key, r), r;
            };

            _export("PlayList", PlayList = function () {
                function PlayList() {
                    var _this = this;

                    _classCallCheck(this, PlayList);

                    this.visible = true;
                    this.volumeVal = 100;
                    this.audio = null;
                    this.timePlayed = 0;
                    this.timeEnd = new Date();
                    this.timePercent = 0;
                    this.numberOfViz = new Array(64);
                    this.volume = function () {
                        _this.audio.volume = $("input[type=range]").val() / 100;
                    };
                    if ($(window).width() > 768) {
                        this.displayMobile = false;
                    } else {
                        this.displayMobile = true;
                    }
                }

                _createClass(PlayList, [{
                    key: "HideSideBar",
                    value: function HideSideBar() {
                        $("div.sidebar-menu.hidden-xs.hidden-sm").hide(400);
                        $("a#showPlaylist").show(400);
                        $("div#play-block").animate({
                            width: "100%"
                        });
                    }
                }, {
                    key: "ShowSideBar",
                    value: function ShowSideBar() {
                        $("a#showPlaylist").hide(400);
                        if ($(window).width() < 1290) {
                            $("div#play-block").animate({
                                width: "70%"
                            });
                        } else {
                            $("div#play-block").animate({
                                width: "77%"
                            });
                        }
                        $("div.sidebar-menu.hidden-xs.hidden-sm").show(400);
                    }
                }, {
                    key: "HideSideBarMob",
                    value: function HideSideBarMob() {
                        $("div.responsive-header.visible-xs.visible-sm div.container").slideUp("slow", function () {
                            $("div.responsive-header.visible-xs.visible-sm div.container").attr("style", "display: none !important");
                            $("div.responsive-header.visible-xs.visible-sm a#hideP").show("faster");
                        });
                    }
                }, {
                    key: "ShowSideBarMob",
                    value: function ShowSideBarMob() {
                        $("div.responsive-header.visible-xs.visible-sm a#hideP").hide("faster", function () {
                            $("div.responsive-header.visible-xs.visible-sm div.container").slideDown("slow");
                        });
                    }
                }, {
                    key: "play",
                    value: function play(track) {
                        var _this2 = this;

                        if (!track) {
                            if (this.audio.paused) {
                                this.audio.play();
                            } else {
                                this.audio.pause();
                            }
                            return;
                        }
                        if (this.stream != track) {
                            if (this.audio) {
                                this.audio.pause();
                                this.audio.currentTime = 0;
                            }
                            this.stream = track;
                            this.audio = this.stream.audio;
                            $(".chart").css("pointer-events", "auto");
                            $('.dial').trigger('configure', {
                                'max': this.audio.duration
                            });
                            $('.dial').val(0).trigger('change');
                            if (!this.displayMobile) {
                                this.audio.volume = $("input[type=range]").val() / 100 || 1;
                                $(".chart input").css("font-size", "40px");
                            } else {
                                this.audio.volume = 1;
                                $(".chart input").css("font-size", "24px");
                            }
                            this.audio.play();
                        } else {
                            if (this.audio.paused) {
                                this.audio.play();
                            } else {
                                this.audio.pause();
                            }
                            return;
                        }
                        var analyse = new Analyse(this.audio);
                        this.audio.ontimeupdate = function () {
                            _this2.timePlayed = Math.round(_this2.audio.currentTime);
                            $('.dial').val(_this2.timePlayed).trigger('change');
                            if (!_this2.displayMobile) {
                                _this2.audio.volume = $("input[type=range]").val() / 100 || 1;
                            } else {
                                _this2.audio.volume = 1;
                            }
                            console.log(analyse.test());
                        };
                        this.audio.addEventListener("ended", function () {
                            _this2.next(_this2.stream, true);
                        });
                        this.audio.addEventListener("error", function () {
                            var stream = _this2.stream;
                            var index = _this2.tracks.indexOf(stream);
                            console.error("Track load error");
                        });
                    }
                }, {
                    key: "wtf",
                    value: function wtf(n) {
                        var _this3 = this;

                        if (!$(".chart canvas").length) {
                            $(".chart").css("pointer-events", "none");
                            if (!this.displayMobile) {
                                $(".dial").knob({
                                    width: 200,
                                    height: 200,
                                    fgColor: "#FF0000",
                                    'change': function change(e) {
                                        _this3.audio.currentTime = e;
                                    }
                                });
                            } else {
                                $(".dial").knob({
                                    width: 120,
                                    height: 120,
                                    fgColor: "#FF0000",
                                    'change': function change(e) {
                                        _this3.audio.currentTime = e;
                                    }
                                });
                            }
                        }
                    }
                }, {
                    key: "mute",
                    value: function mute() {
                        this.audio.muted = !this.audio.muted;
                    }
                }, {
                    key: "list",
                    value: function list() {
                        this.visible = !this.visible;
                    }
                }, {
                    key: "next",
                    value: function next(track, _next) {
                        var tracks = this.tracks.slice();
                        var index = tracks.indexOf(track);
                        var lastIndex = tracks.length - 1;
                        if (_next) {
                            if (index < lastIndex) {
                                var playNow = tracks[index + 1];
                                this.play(playNow);
                            } else {
                                this.play(tracks[0]);
                            }
                        } else {
                            if (index > 0) {
                                var _playNow = tracks[index - 1];
                                this.play(_playNow);
                            } else {
                                this.play(tracks[lastIndex]);
                            }
                        }
                    }
                }, {
                    key: "progressBar",
                    value: function progressBar(e) {
                        this.audio.currentTime = e.clientX / document.documentElement.clientWidth * this.audio.duration;
                    }
                }, {
                    key: "change",
                    value: function change(event) {
                        var tracks = new Array(),
                            files = event.target.files;
                        for (var i = 0; i < files.length; i++) {
                            var track = { id: null, name: null, src: null, audio: null, artist: null };
                            track.id = i;
                            track.name = files[i].name.replace(/\.[^/.]+$/, "");
                            track.src = URL.createObjectURL(files[i]);
                            track.audio = new Audio(track.src);
                            track.artist = "Mnwa Player";
                            tracks.push(track);
                        }
                        this.tracks = tracks.slice();
                    }
                }]);

                return PlayList;
            }());

            _export("PlayList", PlayList);

            _export("PlayList", PlayList = __decorate([Component({
                selector: 'my-app',
                templateUrl: './template/player.html'
            })], PlayList));

            Analyse = function Analyse(audio) {
                var _this4 = this;

                _classCallCheck(this, Analyse);

                this.context = new AudioContext();
                this.node = this.context.createScriptProcessor(2048, 1, 1);
                this.analyser = this.context.createAnalyser();
                this.test = function () {
                    _this4.analyser.getByteFrequencyData(_this4.bands);
                    return _this4.bands;
                };
                this.analyser.smoothingTimeConstant = 0.3;
                this.analyser.fftSize = 512;
                this.bands = new Uint8Array(this.analyser.frequencyBinCount);
                this.source = this.context.createMediaElementSource(audio);
                this.source.connect(this.analyser);
                this.analyser.connect(this.node);
                this.node.connect(this.context.destination);
                this.source.connect(this.context.destination);
            };
        }
    };
});