import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Graph } from './Graph';
import { GeneticWrapper } from "./GeneticWrapper";

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
    filteredGames = [];
    genres: any[] = [];
    graph = null;

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
                this.filteredGames = games;
            })
        this.getGenres()
            .subscribe(genres => {
                console.log("Genres: ", genres)
                this.genres = genres;
            })
        this.Http.get('/api/things')
            .map(res => res.json())
            // .catch(err => Observable.throw(err.json().error || 'Server error'))
            .subscribe(things => {
                this.awesomeThings = things;

            });

        // Draws an empty graph on init
        this.graph = new Graph(document.getElementById("scratch"), 10, 10);
        this.drawGameGraph([], 10, 10);
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

    onGenreSelectChange() {
        this.getGamesFilteredByGender()
    }

    onGameSelectChange() {

    }

    getGamesFilteredByGender() {
        if (this.selectedGenre === 'allGenres') return this.filteredGames = this.games

        return this.filteredGames = this.games.filter(game => {
            return game.genre_id === this.selectedGenre._id
        })
    }

    selectGenre() {
        const genre = {
            ...this.selectedGenre,
            placements: [],
            color: this.getRandomColor(),
            vertices: [],//gameComputedData.vertices,
            highestPlacement: -1,//gameComputedData.ymax,
            solutions: [],
            geneticWrapper: null
        }

        this.selectedGenres.push(genre)
        this.selectedGenre = null
    }

    unselectGenre(index) {
        this.selectedGenres.splice(index, 1);
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    drawGameGraph(positions, ymax, color) {
        this.graph.compareAndSetXMax(positions.length);
        this.graph.compareAndSetYMax(ymax);
        this.graph.addVerticesGroup(positions, color);   
        this.graph.draw();
        this.graph.drawVertices();
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
