///<reference path="../../typings/jquery/jquery.d.ts"/>

import {Component, Inject} from 'angular2/core';
import {Response} from 'angular2/http';
import {Yandex, Track} from '../yandex';

@Component({
    selector: 'my-app',
    templateUrl: './template/player.html'
})


export class PlayList {
    private visible: boolean = true; //Возможность скрыть плэйлист
    private tracks: Track[]; // Массив объектов с информацией о треках
    //private ya: Yandex = new Yandex(); // Объявляем класс Yandex
    private volumeVal: number = 100; // Уровень громкости в процентах
    private audio: HTMLAudioElement = null; //Аудио поток
    private stream: Track;   //Играющий в данный момент трек
    private timePlayed: number = 0; // Проигранное время
    private timeEnd: Date = new Date();    //Время проигрывания 
    private timePercent: number = 0;     //Время в проценты, для прогрессбара
    private displayMobile: boolean;
    private numberOfViz: number[] = new Array(64);

    private HideSideBar(): void {
        $("div.sidebar-menu.hidden-xs.hidden-sm").hide(400);
        $("a#showPlaylist").show(400);
        $("div#play-block").animate({
            width: "100%"
        });
    }
    private ShowSideBar(): void {
        $("a#showPlaylist").hide(400);
        if ($(window).width() < 1290) {
            $("div#play-block").animate({
                width: "70%"
            });
        }
        else {
            $("div#play-block").animate({
                width: "77%"
            });
        }
        $("div.sidebar-menu.hidden-xs.hidden-sm").show(400);
    }
    private HideSideBarMob(): void {
        $("div.responsive-header.visible-xs.visible-sm div.container").slideUp("slow", () => {
            $("div.responsive-header.visible-xs.visible-sm div.container").attr("style", "display: none !important");
            $("div.responsive-header.visible-xs.visible-sm a#hideP").show("faster");
        });
    }
    private ShowSideBarMob(): void {
        $("div.responsive-header.visible-xs.visible-sm a#hideP").hide("faster", () => {
            $("div.responsive-header.visible-xs.visible-sm div.container").slideDown("slow");
        });
    }

    /*Функция для воспроизведения или паузы*/
    private play(track?: Track): void {
        if (!track) {
            if (this.audio.paused) {
                this.audio.play();
            }
            else {
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
            }
            else {
                this.audio.volume = 1;
                $(".chart input").css("font-size", "24px");
            }
            this.audio.play();
        }
        else {
            if (this.audio.paused) {
                this.audio.play();
            }
            else {
                this.audio.pause();
            }
            return;
        }
        let analyse = new Analyse(this.audio);
        this.audio.ontimeupdate = () => {
            this.timePlayed = Math.round(this.audio.currentTime);
            $('.dial').val(this.timePlayed).trigger('change');
            if (!this.displayMobile) {
                this.audio.volume = $("input[type=range]").val() / 100 || 1;
            }
            else {
                this.audio.volume = 1;
            }
            console.log(analyse.test());
        };
        this.audio.addEventListener("ended", () => {
            this.next(this.stream, true);
        });
        this.audio.addEventListener("error", () => {
            let stream: Track = this.stream;
            let index: number = this.tracks.indexOf(stream);
            console.error("Track load error")
            // Yandex.GetTrackInfo(track.id, track.name, track.artist)
            //     .then((track: Track) => {
            //         this.audio.pause();
            //         this.audio.currentTime = 0;
            //         this.stream = null; //Разобраться
            //         this.tracks[index] = track;
            //         this.play(track);
            //     })
        });

    }

    private wtf(n: number): void {
        if (!$(".chart canvas").length) {
            $(".chart").css("pointer-events", "none");
            if (!this.displayMobile) {
                $(".dial").knob({
                    width: 200,
                    height: 200,
                    fgColor: "#FF0000",
                    'change': (e: number) => {
                        this.audio.currentTime = e;
                    }
                });
            }
            else {
                $(".dial").knob({
                    width: 120,
                    height: 120,
                    fgColor: "#FF0000",
                    'change': (e: number) => {
                        this.audio.currentTime = e;
                    }
                });
            }
        }
    }

    /*Mute on, mute off */
    private mute(): void {
        this.audio.muted = !this.audio.muted;
    }

    /*Скрыть/Раскрыть плейлист */
    private list(): void {
        this.visible = !this.visible;
    }

    /*Настройка громкости*/
    private volume = (): void => {
        this.audio.volume = $("input[type=range]").val() / 100;
    }

    /*Функция для смены трека (если next == true, то включит следующий трек, если false, то предыдущий)*/
    private next(track: Track, next: boolean): void {
        let tracks: Track[] = this.tracks.slice();
        let index: number = tracks.indexOf(track);
        let lastIndex: number = tracks.length - 1;
        if (next) {
            if (index < lastIndex) {
                let playNow = tracks[index + 1];
                this.play(playNow);
            }
            else {
                this.play(tracks[0]);
            }
        }
        else {
            if (index > 0) {
                let playNow = tracks[index - 1];
                this.play(playNow);
            }
            else {
                this.play(tracks[lastIndex]);
            }
        }
    }

    /*Функция для прокручивания музыки */
    private progressBar(e): void {
        this.audio.currentTime = e.clientX / document.documentElement.clientWidth * this.audio.duration;
    }
    /*Выбор музыки */
    private change(event: { target: { files: FileList } }) {
        let tracks: Track[] = new Array<Track>(),
            files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            let track: Track = {id: null, name: null, src: null, audio: null, artist: null};
            track.id = i;
            track.name = files[i].name.replace(/\.[^/.]+$/, "");
            track.src = URL.createObjectURL(files[i]);
            track.audio = new Audio(track.src);
            track.artist = "Mnwa Player";
            tracks.push(track);
        }
        this.tracks = tracks.slice();
    }

    constructor() {
        // let trackPromises: Promise<Track>[] = new Array<Promise<Track>>(); //Массив Промисов с для загрузки треков
        // Yandex.getR('/json/playlist.json', 'json')
        //     .then((tracksInfo: { [name: string]: { id: number, author: string } }) => { // Получение списка треков
        //         for (let trackName in tracksInfo) { // Получение информации о треках
        //             let id: number = tracksInfo[trackName].id;
        //             let author: string = tracksInfo[trackName].author;
        //             let trackPromise: Promise<Track> = Yandex.GetTrackInfo(id, trackName, author); //Получаем промис с информацией для трека
        //             trackPromises.push(trackPromise); // Добавляем этот промис в массив
        //         }
        //         Promise.all(trackPromises) // Исполняем массив промисов и результат записываем в tracks 
        //             .then((tracks: Track[]) => {
        //                 this.tracks = tracks.slice();
        //             })
        //             .catch(err => {
        //                 throw new Error(err)
        //             });
        //     })
        //     .catch(err => {
        //         console.error(`Error load tracks: ${err}`)
        //     });
        if ($(window).width() > 768) {
            this.displayMobile = false;
        }
        else {
            this.displayMobile = true;
        }
    }
}


class Analyse {
    public bands: Uint8Array;
    private source: MediaElementAudioSourceNode;
    private context: AudioContext = new AudioContext();
    private node: ScriptProcessorNode = this.context.createScriptProcessor(2048, 1, 1);
    private analyser: AnalyserNode = this.context.createAnalyser();
    public test = () => {
        this.analyser.getByteFrequencyData(this.bands);
        return this.bands;
    }
    constructor(audio: HTMLAudioElement) {
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.fftSize = 512;
        this.bands = new Uint8Array(this.analyser.frequencyBinCount);
        this.source = this.context.createMediaElementSource(audio);
        this.source.connect(this.analyser);
        this.analyser.connect(this.node);
        this.node.connect(this.context.destination);
        this.source.connect(this.context.destination);
    }
}

