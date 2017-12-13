declare let Genetic: any;

export class GeneticWrapper {
    
    public genetic: any;
    graph: any;
    userData: any;
    index: number;
    color: any;

    constructor(graph, userData, index: number, color: any) {
        let self = this;
        
        self.graph = graph;
        self.userData = userData;
        self.index = index;
        self.color = color;


        self.genetic = Genetic.create();
        self.genetic.optimize = Genetic.Optimize.Minimize;
        self.genetic.select1 = Genetic.Select1.Tournament2;
        self.genetic.select2 = Genetic.Select2.FittestRandom;
        self.genetic.userData = self.userData;

        self.genetic.seed = function () {
    
            let a = [];
            // create coefficients for polynomial with values between (-0.5, 0.5)
    
            let i;
            for (i = 0; i < self.genetic.userData["terms"]; ++i) {
                a.push(Math.random() - 0.01);
            }
    
            return a;
        };
    
        self.genetic.mutate = function (entity) {
    
            // allow chromosomal drift with this range (-0.05, 0.05)
            let drift = ((Math.random() - 0.5) * 2) * 0.05;
    
            let i = Math.floor(Math.random() * entity.length);
            entity[i] += drift;
    
            return entity;
        };
    
    
        self.genetic.crossover = function (mother, father) {
            // crossover via interpolation
            function lerp(a, b, p) {
                return a + (b - a) * p;
            }
    
            let len = mother.length;
            let i = Math.floor(Math.random() * len);
            let r = Math.random();
            let son = [].concat(father);
            let daughter = [].concat(mother);
    
            son[i] = lerp(father[i], mother[i], r);
            daughter[i] = lerp(mother[i], father[i], r);
    
            return [son, daughter];
        };
    
        // example 3 term polynomial: cx^0 + bx^1 + ax^2
        self.genetic.evaluatePoly = function (coefficients, x) {
            let s = 0;
            let p = 1;
            let i;
            for (i = 0; i < coefficients.length; ++i) {
                s += p * coefficients[i];
                p *= x;
            }
    
            return s;
        }
    
        self.genetic.fitness = function (entity) {
    
            let sumSqErr = 0;
            let vertices = self.genetic.userData["vertices"];
    
            let i;
            for (i = 0; i < vertices.length; ++i) {
                let err = self.genetic.evaluatePoly(entity, vertices[i][0]) - vertices[i][1];
                sumSqErr += err * err;
            }
    
            return Math.sqrt(sumSqErr);
        };
    
        self.genetic.generation = function (pop, generation, stats) { };
    
        self.genetic.notification = function (pop, generation, stats, isFinished) {
    
            function lerp(a, b, p) {
                return a + (b - a) * p;
            }
            if (generation == 0) {
                self.graph.solutionsGroups[self.index] = [];
            }
    
            let last = self.graph.last || "";
    
            let str = pop[0].entity.join(",");
            if (last != str || isFinished) {
    
                if (last != str) {
                    self.graph.solutionsGroups[self.index].push(pop[0].entity);
                    self.graph.last = str;
                }
    
    
                self.graph.draw();
    
                let i;
                let start = Math.max(0, self.graph.solutionsGroups[self.index].length - 10);
                if (isFinished) {
                    start = 0;
                }
                for (i = start; i < self.graph.solutionsGroups[self.index].length; ++i) {
                    let p = (i - start) / (self.graph.solutionsGroups[self.index].length - start);
    
                    let r = Math.round(lerp(90, 255, p));
                    let g = Math.round(lerp(0, 255, 0));
                    let b = Math.round(lerp(200, 50, p));
                    let alpha = lerp(0.5, 1, p);
                    let strokeStyle = "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
                    let lineWidth = Math.floor(lerp(10, 1, p));
    
                    // let strokeStyle = i == self.graph.solutionsGroups[self.index].length-1 ? "#00f" : "rgba(0,0,0,0.1)";
    
                    //self.graph.drawFunction(self.graph.solutionsGroups[self.index][self.graph.solutionsGroups[self.index].length-1], strokeStyle, lineWidth);
                    // console.log("Solution: ", self.graph.solutionsGroups[self.index][i]);
                }
    
                // Draws curves for every function
                // for (i=0; i < self.graph.solutionsGroups.length; i++) {
                //     // self.graph.drawFunction(self.graph.solutionsGroups[i][self.graph.solutionsGroups[i].length - 1], self.graph.colors[i], 2);
                // }

                // self.graph.drawFunction(self.graph.solutionsGroups[self.index][self.graph.solutionsGroups[self.index].length - 1], self.color, 2);
                // // self.graph.drawFunction(self.graph.solutionsGroups[self.index][self.graph.solutionsGroups[self.index].length - 1], "#00f", 2);
    
                self.graph.drawFunctions(3);
                self.graph.drawVertices();
            }
        };
    }

    public setColor(color) {
        this.color = color;
    }

    // self.drawGameGraph([], 10);
}