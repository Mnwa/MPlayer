'use strict';

System.register(['angular2/platform/browser', './components/playlist.component'], function (_export, _context) {
  "use strict";

  var bootstrap, PlayList;
  return {
    setters: [function (_angular2PlatformBrowser) {
      bootstrap = _angular2PlatformBrowser.bootstrap;
    }, function (_componentsPlaylistComponent) {
      PlayList = _componentsPlaylistComponent.PlayList;
    }],
    execute: function () {
      bootstrap(PlayList).catch(function (err) {
        return console.error(err);
      });
    }
  };
});