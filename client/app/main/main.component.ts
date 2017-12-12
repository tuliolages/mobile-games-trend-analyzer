import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

enum CurveDegrees {
    LINE = 2,
    PARABOLA = 3,
    POLYNOMIAL = 4
};

declare var document: any;
declare var Genetic: any;
declare var Plotly: any;

@Component({
    selector: 'main',
    template: require('./main.html'),
    styles: [require('./main.scss')]
})
export class MainComponent implements OnInit {
    Http;

    awesomeThings = [];
    newThing = '';

    GENRES_ENDPOINT: string = "/api/genres/:id";
    GAMES_ENDPOINT: string = "/api/games/:id";
    PLACEMENTS_ENDPOINT: string = "/api/games/:id/placements";

    selectedGame: any = null;
    selectedGenre: any = null;
    games: any[] = [];
    genres: any[] = [];

    selectedGames: any[] = [];
    selectedGenres: any[] = [];

    selectedCurveDegree: number = CurveDegrees.LINE;    

    static parameters = [Http];
    constructor(
        private http: Http
    ) {
        this.Http = http;
    }

    ngOnInit() {
        this.getGames()
            .subscribe(games => {
                console.log("Games: ", games)
                this.games = games;
            })
        this.getGenres()
            .subscribe(genres => {
                console.log("Genres: ", genres)
                this.genres = genres;
            })
        return this.Http.get('/api/things')
            .map(res => res.json())
            // .catch(err => Observable.throw(err.json().error || 'Server error'))
            .subscribe(things => {
                this.awesomeThings = things;

            });
    }

    getGenres(): Observable<any> {
        return (
            this.http
                .get(this.GENRES_ENDPOINT.replace(/:id/, ""))
                .map((r) => r.json())
        )
    }

    getGames(): Observable<any> {
        return (
            this.http
                .get(this.GAMES_ENDPOINT.replace(/:id/, ""))
                .map((r) => r.json())
        )
    }

    onGameGenreSelectChange() {

    }

    addThing() {
        if (this.newThing) {
            let text = this.newThing;
            this.newThing = '';

            return this.Http.post('/api/things', { name: text })
                .map(res => res.json())
                .catch(err => Observable.throw(err.json().error || 'Server error'))
                .subscribe(thing => {
                    console.log('Added Thing:', thing);
                });
        }
    }

    deleteThing(thing) {
        return this.Http.delete(`/api/things/${thing._id}`)
            .map(res => res.json())
            .catch(err => Observable.throw(err.json().error || 'Server error'))
            .subscribe(() => {
                console.log('Deleted Thing');
            });
    }
}
