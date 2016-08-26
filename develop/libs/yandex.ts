import {Md5_ts} from './src/md5';
import {XMLParser} from './src/xml2json';

/* 
    Track - Основа трека 
*/

export interface Track {
    name: string;
    src: string;
    id: number;
    audio: HTMLAudioElement;
    artist: string;
}

/* 
    Yandex - библиотека для работы с Яндексом
    GetTrackUrl(trackId: number, name: string) - функция для получения URL с треком с сервера Яндекс, возвращает Объект описанный в Track
*/
export class Yandex {
    public static getR = (url: string, type?: string): Promise<any> => new Promise((resolve, reject) => {
        return fetch(url, {method: "GET", headers: new Headers(), mode: "cors", cache: 'default'})
            .then((res: Response) => {
                if(res.ok){
                    if(type == "json"){
                        resolve(res.json());
                    }
                    if(type == "text"){
                        resolve(res.text());
                    }
                }
                else{
                    throw new Error(`Network response error: ${res.statusText}. Code Error: ${res.status}`);
                }
            })
            .catch((err) => reject(err))
    });
    public static GetTrackInfo = (trackId: number, name: string, author: string): Promise<Track> => {
        let getR = Yandex.getR;
        return getR(`https://music.yandex.ru/api/v2.0/handlers/track/${trackId}/download/m?hq=1`, "json")
            .then((res: { captcha?: string, src: string }) => {
                let data: { captcha?: string, src: string } = res;
                
                if (data.captcha) { // Если есть капча, то возвращаем ошибку
                    throw new Error('Captha')
                }
                if (data.src) {
                    return getR(data.src, "text");
                }
                throw new Error('URL is not found')
            })
            .then(($xml: string) => {
                const secret: string = 'XGRlBW9FXlekgbPrRHuSiA',    // Secret key
                    parsedXml: Object[] = XMLParser.parse($xml)['@children'][0]['@children']; // Получаем массив объекта с информацией из XML 
                let info: { host: string, path: string, ts: string, s: string } = { // Записываем все данные в JSON формат
                    host: parsedXml[0]['@children'][0],
                    path: parsedXml[1]['@children'][0],
                    ts: parsedXml[2]['@children'][0],
                    s: parsedXml[4]['@children'][0]
                };
                const md5: string = Md5_ts.md5(secret + info.path.substr(1) + info.s), // Получаем md5 ключ
                    src: string = `https://${info.host}/get-mp3/${md5}/${info.ts + info.path}?track-id=${trackId}&play=false&`; // Получаем ссылку на трек
                let audio: HTMLAudioElement = new Audio(src);
                audio.preload = "auto";
                let result: Track = {name: name, src: src, id: trackId, audio: audio, artist: author};
                return result; //s
            })
            .catch(err => console.error(err.message));
    }
}

