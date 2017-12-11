import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import "rxjs/add/operator/map";


@Injectable()
export class GamesService {
    static GENRES_ENDPOINT: string = "/api/genres/:id";
    static GAMES_ENDPOINT: string = "/api/games/:id";
    static PLACEMENTS_ENDPOINT: string = "/api/games/:id/placements";
  
    constructor(@Inject(Http) private _http: Http) {}

    getGenres(): Observable<any> {
        return (
            this._http
                .get(GamesService.GENRES_ENDPOINT.replace(/:id/, ""))
                .map((r) => r.json())
        )
    }

    getGames(): Observable<any> {
        return (
            this._http
                .get(GamesService.GAMES_ENDPOINT.replace(/:id/, ""))
                .map((r) => r.json())
        )
    } 
}