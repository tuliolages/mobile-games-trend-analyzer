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
    PLACEMENTS_ENDPOINT: string = `${API_HOST}/api/games/:id/placements`;

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
        this.getDataFromServer()
        this.buildCurves()
    }

    getDataFromServer() {
        let selectedBeginDate = this.selectedDateRange.beginDate;
        let beginDate = new Date(selectedBeginDate.year, 
                                selectedBeginDate.month, 
                                selectedBeginDate.day,
                                0, 0, 0, 0);
    
        let selectedEndDate = this.selectedDateRange.endDate;
        let endDate = new Date(selectedEndDate.year, 
                                selectedEndDate.month, 
                                selectedEndDate.day,
                                0, 0, 0, 0);
    }

    buildCurves() {

    }
}

function padZero(str, len = null) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

function invertColor(hex, bw) {
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
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
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