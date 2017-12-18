import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {IMyDrpOptions} from 'mydaterangepicker';

import { Graph } from './Graph';
import { GeneticWrapper } from "./GeneticWrapper";

const API_HOST = 'http://localhost:8080'

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

    GENRES_ENDPOINT: string = `${API_HOST}/api/genres/:id`;
    GAMES_ENDPOINT: string = `${API_HOST}/api/games/:id`;
    GAME_PLACEMENTS_ENDPOINT: string = `${API_HOST}/api/games/:id/placements`;
    GENRE_PLACEMENTS_ENDPOINT: string = `${API_HOST}/api/genres/:id/placements`;

    _MS_PER_DAY = 1000 * 60 * 60 * 24;

    selectedGame: any = null;
    selectedGenre: any = null;
    games: any[] = [];
    filteredGames = [];
    genres: any[] = [];
    graph = null;

    selectedGames: any[] = [];
    selectedGenres: any[] = [];

    selectedCurveDegree: number = CurveDegrees.LINE;    

    presetDateRangesList: any = [];
    
    myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    // dateFormat: 'dd/mm/yyyy'
    };
    
    // For example initialize to specific date (09.10.2018 - 19.10.2018). It is also possible
    // to set initial date range value using the selDateRange attribute.
    selectedDateRange: any;
    selectedDateRangeIndex: number = 0;
    
    geneticWrapper: GeneticWrapper;
    genetic: any = undefined;
    userData: any[] = undefined;

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

        // Draws an empty graph on init
        this.graph = new Graph(document.getElementById("scratch"), 10, 10);
        this.drawGameGraph([], 10, 10);
        this.computeInitialPresetDateRanges()
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

    getGamePlacements(gameID, start_date, end_date): Observable<any> {
        return (
            this.http
                .get(
                    this.GAME_PLACEMENTS_ENDPOINT.replace(/:id/, gameID)
                    + `?start_date=${start_date}`
                    + `&end_date=${end_date}`
                )
                .map((r) => r.json())
        )
    }

    getGenrePlacements(genreID, start_date, end_date): Observable<any> {
        return (
            this.http
                .get(
                    this.GENRE_PLACEMENTS_ENDPOINT.replace(/:id/, genreID)
                    + `?start_date=${start_date}`
                    + `&end_date=${end_date}`
                )
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

    selectGame() {
        const color = this.getRandomColor();
        const textColor = invertColor(color);

        const game = {
            ...this.selectedGame,
            placements: [],
            color,
            textColor,
            vertices: [],//gameComputedData.vertices,
            highestPlacement: -1,//gameComputedData.ymax,
            solutions: [],
            geneticWrapper: null
        }

        this.selectedGames.push(game)
        this.selectedGame = null
    }

    unselectGame(index) {
        this.selectedGames.splice(index, 1);
    }

    selectGenre() {
        const color = this.getRandomColor();
        const textColor = invertColor(color);

        const genre = {
            ...this.selectedGenre,
            placements: [],
            color,
            textColor,
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

    mapDateToId(beginDate: Date, endDate: Date) {
        let utc1 = Date.UTC(beginDate.getFullYear(), beginDate.getMonth(), beginDate.getDate());
        let self = this;
    
        return function(date: Date) {
          // Discard the time and time-zone information.
          // var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
          // var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
          let utc2 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        
          // return Math.floor((utc2 - utc1) / this._MS_PER_DAY);
          return Math.floor((utc2 - utc1) / self._MS_PER_DAY);
        }
      }

    computeGameVertices(gameData) {
        let ymax = 0;
        let mapDate = this.mapDateToId(
          new Date(this.selectedDateRange.beginDate.year,
                   this.selectedDateRange.beginDate.month,
                   this.selectedDateRange.beginDate.day),
          new Date(this.selectedDateRange.endDate.year,
                   this.selectedDateRange.endDate.month,
                   this.selectedDateRange.endDate.day)
        );
    
        // Map placements to int list
        let vertices = gameData.placements.map((placement) => {
          if (placement.position > ymax) {
            ymax = placement.position;
          }
          let gameData = [mapDate(new Date(placement.date)), placement.position];
          // console.log(gameData[0] + " - " + gameData[1]);
          return gameData;
        });
    
        return {
          vertices: vertices,
          ymax: ymax
        };
      }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    computeInitialPresetDateRanges() {
        let labels = [
          {
            label: "Last 7 days",
            days: 6
          },
          {
            label: "Last 28 days",
            days: 27
          },
          {
            label: "Last 56 days",
            days: 55
          },
          {
            label: "Last 84 days",
            days: 83
          },
          {
            label: "Custom range",
            days: 6
          }
        ];
    
        labels.forEach(label => {
          let endDate = new Date();
          endDate.setHours(0, 0, 0, 0);
      
          let beginDate = new Date(endDate);
          beginDate.setDate(beginDate.getDate() - label.days);
          
          this.presetDateRangesList.push({
            label: label.label,
            beginDate: {
              year: beginDate.getFullYear(),
              month: beginDate.getMonth(),
              day: beginDate.getDate()
            },
            endDate: {
              year: endDate.getFullYear(),
              month: endDate.getMonth(),
              day: endDate.getDate()
            }
          })  
        });
    
        this.selectDateRange(0);
    }

    selectDateRange(dateRangeIndex: number): void {
        this.selectedDateRangeIndex = dateRangeIndex;
        this.selectedDateRange = {
            beginDate: this.presetDateRangesList[dateRangeIndex].beginDate,
            endDate: this.presetDateRangesList[dateRangeIndex].endDate
        }
    }

    drawGameGraph(positions, ymax, color) {
        this.graph.compareAndSetXMax(positions.length);
        this.graph.compareAndSetYMax(ymax);
        this.graph.addVerticesGroup(positions, color);   
        this.graph.draw();
        this.graph.drawVertices();
    }

    getDataAndComputeCurves() {
        this.graph = new Graph(document.getElementById("scratch"), 10, 10);
        this.getDataFromServer()
    }

    getDataFromServer() {
        var { day, month, year } = this.selectedDateRange.beginDate;
        let beginDate = `${year}-${month}-${day}`

        var { day, month, year } = this.selectedDateRange.endDate;
        let endDate = `${year}-${month}-${day}`
        
        for (let i = 0; i < this.selectedGames.length; i++) {
            const id = this.selectedGames[i]._id;
            
            this.getGamePlacements(id, beginDate, endDate)
                .subscribe(data => {
                    this.selectedGames[i].placements = data;
                    
                    let gameComputedData = this.computeGameVertices(this.selectedGames[i]);
                    
                    this.selectedGames[i].vertices = gameComputedData.vertices;
                    this.selectedGames[i].highestPlacement = gameComputedData.ymax;
                    console.log('build', this.selectedGames[i])
                    this.buildCurve(this.selectedGames[i], i);

                    console.log(data)
                })
        }

        for (let i = 0; i < this.selectedGenres.length; i++) {
            const id = this.selectedGenres[i]._id;
            
            this.getGamePlacements(id, beginDate, endDate)
                .subscribe(data => {
                    this.selectedGenres[i].placements = data;
                    
                    let gameComputedData = this.computeGameVertices(this.selectedGenres[i]);
                    
                    this.selectedGenres[i].vertices = gameComputedData.vertices;
                    this.selectedGenres[i].highestPlacement = gameComputedData.ymax;
                    console.log('build', this.selectedGenres[i])
                    this.buildCurve(this.selectedGenres[i], i);

                    console.log(data)
                })
        }
    }

    buildCurve(item, index) {
        this.drawGameGraph(item.vertices, item.highestPlacement, item.color);

        let config = {
            "iterations": 500, 
            "size": 250, 
            "crossover": 0.4, 
            "mutation": 1.0, 
            "skip": 10
        };
        
        var userData = {
            "terms": this.selectedCurveDegree,
            "vertices": item.vertices
        };

        this.geneticWrapper = new GeneticWrapper(this.graph, userData, index, item.color);
        this.graph.geneticWrapper = this.geneticWrapper;
        this.geneticWrapper.genetic.evolve(config, userData);
    }
}

function padZero(str, len = null) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

function invertColor(hex, bw = true) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    let r:any = parseInt(hex.slice(0, 2), 16),
        g:any = parseInt(hex.slice(2, 4), 16),
        b:any = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}