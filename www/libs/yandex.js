'use strict';

System.register(['./src/md5', './src/xml2json'], function (_export, _context) {
    "use strict";

    var Md5_ts, XMLParser, Yandex;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_srcMd) {
            Md5_ts = _srcMd.Md5_ts;
        }, function (_srcXml2json) {
            XMLParser = _srcXml2json.XMLParser;
        }],
        execute: function () {
            _export('Yandex', Yandex = function Yandex() {
                _classCallCheck(this, Yandex);
            });

            _export('Yandex', Yandex);

            Yandex.getR = function (url, type) {
                return new Promise(function (resolve, reject) {
                    return fetch(url, { method: "GET", headers: new Headers(), mode: "cors", cache: 'default' }).then(function (res) {
                        if (res.ok) {
                            if (type == "json") {
                                resolve(res.json());
                            }
                            if (type == "text") {
                                resolve(res.text());
                            }
                        } else {
                            throw new Error('Network response error: ' + res.statusText + '. Code Error: ' + res.status);
                        }
                    }).catch(function (err) {
                        return reject(err);
                    });
                });
            };
            Yandex.GetTrackInfo = function (trackId, name, author) {
                var getR = Yandex.getR;
                return getR('https://music.yandex.ru/api/v2.0/handlers/track/' + trackId + '/download/m?hq=1', "json").then(function (res) {
                    var data = res;
                    if (data.captcha) {
                        throw new Error('Captha');
                    }
                    if (data.src) {
                        return getR(data.src, "text");
                    }
                    throw new Error('URL is not found');
                }).then(function ($xml) {
                    var secret = 'XGRlBW9FXlekgbPrRHuSiA',
                        parsedXml = XMLParser.parse($xml)['@children'][0]['@children'];
                    var info = {
                        host: parsedXml[0]['@children'][0],
                        path: parsedXml[1]['@children'][0],
                        ts: parsedXml[2]['@children'][0],
                        s: parsedXml[4]['@children'][0]
                    };
                    var md5 = Md5_ts.md5(secret + info.path.substr(1) + info.s),
                        src = 'https://' + info.host + '/get-mp3/' + md5 + '/' + (info.ts + info.path) + '?track-id=' + trackId + '&play=false&';
                    var audio = new Audio(src);
                    audio.preload = "auto";
                    var result = { name: name, src: src, id: trackId, audio: audio, artist: author };
                    return result;
                }).catch(function (err) {
                    return console.error(err.message);
                });
            };
        }
    };
});