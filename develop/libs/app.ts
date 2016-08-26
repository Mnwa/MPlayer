///<reference path="../typings/tsd.d.ts"/>

import {bootstrap} from 'angular2/platform/browser';
import {PlayList} from './components/playlist.component';

bootstrap(PlayList).catch(err => console.error(err));
		
