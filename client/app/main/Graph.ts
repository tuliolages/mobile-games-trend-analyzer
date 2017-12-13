export class Graph {
	canvas;
	xmax;
	ymax;

	public genetic;
	public geneticWrapper;

	width;
	height;
	ctx;

	bound;

	vertices;
	solutions;

	verticesGroups;
	public colors;
	solutionsGroups;

	constructor(canvas, xmax, ymax) {
		this.canvas = document.getElementById("scratch");

		this.xmax = xmax;
		this.ymax = ymax;

		this.vertices = [];
		this.solutions = [];

		this.verticesGroups = [];
		this.colors = [];
		this.solutionsGroups = [];

		this.initCanvas();
	}

	public setXMax(xmax: number) {
		this.xmax = xmax;

		this.initCanvas();
	}

	public setYMax(ymax: number) {
		this.ymax = ymax;

		this.initCanvas();
	}

	public compareAndSetXMax(xmax: number) {
		if (this.xmax < xmax) {
			this.setXMax(xmax);
		}
	}

	public compareAndSetYMax(ymax: number) {
		if (this.ymax < ymax) {
			this.setYMax(ymax);
		}
	}

	public addVerticesGroup(vertices, color) {
		this.verticesGroups.push(vertices);
		this.colors.push(color);
		this.solutionsGroups.push([]);
	}

	initCanvas() {
		// canvas dimensions
		this.width = parseInt(this.canvas.style.width);
		this.height = parseInt(this.canvas.style.height);
		// retina
		let dpr = window.devicePixelRatio || 1;
		this.canvas.width = this.width * dpr;
		this.canvas.height = this.height * dpr;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.scale(dpr, dpr);


		this.bound = [0, this.width - 1, this.height - 1, 0];

		this.bound[0] += 25;
		this.bound[1] -= 25;
		this.bound[2] -= 25;
		this.bound[3] += 25;
	}

	drawFunctions(lineWidth) {
		let ctx = this.ctx;
		ctx.save();
		let bound = this.bound;

		let xmax = this.xmax;
		let ymax = this.ymax;
		let xstride = (bound[1] - bound[3]) / xmax;
		let ystride = (bound[2] - bound[0]) / ymax;
		let inc = 1 / xstride;

		ctx.lineWidth = lineWidth;

		for (let i = 0; i < this.solutionsGroups.length; i++) {
			let solution = this.solutionsGroups[i];
			let coefficients = solution[solution.length - 1];
			ctx.strokeStyle = this.colors[i];

			if (coefficients === null || coefficients === undefined) {
				continue;
			}
			
			ctx.beginPath();
			let x;
			for (x = 0; x < xmax; x += inc) {
				let cx = x * xstride + bound[3];
				let cy = bound[2] - this.geneticWrapper.genetic.evaluatePoly(coefficients, x) * ystride;
	
				if (x == 0) {
					ctx.moveTo(cx, cy);
				} else {
					ctx.lineTo(cx, cy);
				}
			}
			ctx.stroke();
	
		}
		
		ctx.restore();

	}

	drawFunction(coefficients, strokeStyle, lineWidth) {
		let ctx = this.ctx;
		ctx.save();
		let bound = this.bound;

		ctx.strokeStyle = strokeStyle;
		let xmax = this.xmax;
		let ymax = this.ymax;
		let xstride = (bound[1] - bound[3]) / xmax;
		let ystride = (bound[2] - bound[0]) / ymax;
		let inc = 1 / xstride;

		ctx.lineWidth = lineWidth;

		ctx.beginPath();
		let x;
		for (x = 0; x < xmax; x += inc) {
			let cx = x * xstride + bound[3];
			// TODO curva está invertida no eixo y
			// let cy = bound[2] - this.geneticWrapper.genetic.evaluatePoly(coefficients, x) * ystride;
			let cy = bound[3] + this.geneticWrapper.genetic.evaluatePoly(coefficients, x) * ystride;

			if (x == 0) {
				ctx.moveTo(cx, cy);
			} else {
				ctx.lineTo(cx, cy);
			}
		}

		ctx.stroke();

		ctx.restore();
	}

	draw() {
		let ctx = this.ctx;
		ctx.save();
		let bound = this.bound;

		ctx.strokeStyle = "#000";
		ctx.fillStyle = "#000";
		ctx.clearRect(0, 0, this.width, this.height);

		let xmax = this.xmax;
		let ymax = this.ymax;
		let xstride = (bound[1] - bound[3]) / xmax;
		let ystride = (bound[2] - bound[0]) / ymax;


		let i;
		// x-grid
		for (i = 0; i <= xmax; ++i) {
			let cx = i * xstride + bound[3];
			let y = bound[2];

			ctx.strokeStyle = "#eee";
			ctx.beginPath();
			ctx.moveTo(cx, bound[0]);
			ctx.lineTo(cx, y);
			ctx.stroke();
		}

		// y-grid
		for (i = 0; i <= ymax; ++i) {
			let cx = bound[3];
			let y: any = bound[2] - i * ystride;
			ctx.beginPath();
			ctx.moveTo(cx, y);
			ctx.lineTo(bound[1], y);
			ctx.stroke();
		}


		// x/y bars
		ctx.beginPath();
		ctx.strokeStyle = "#bbb";
		ctx.moveTo(bound[3], bound[0]);
		ctx.lineTo(bound[3], bound[2]);
		ctx.lineTo(bound[1], bound[2]);
		ctx.lineWidth = 3;
		ctx.stroke();

		ctx.lineWidth = 1;

		let xsteps = xmax < 5 ? 1 : 5;

		// x bars
		ctx.strokeStyle = "#000";
		for (i = 0; i <= xmax; i += xsteps) {
			let cx = i * xstride + bound[3];
			let y = bound[2];

			ctx.beginPath();
			ctx.moveTo(cx, y);
			ctx.lineTo(cx, y + 4);
			ctx.stroke();

			ctx.font = "12px sans-serif";
			ctx.textAlign = "center";
			ctx.fillText(i, cx, y + 16);

		}

		let ysteps = ymax < 5 ? 1 : 5;

		// y bars
		for (i = ymax; i >= 0; i -= ysteps) {
			let cx = bound[3];
			let y: any = bound[3] + i * ystride;
			ctx.beginPath();
			ctx.moveTo(cx, y);
			ctx.lineTo(cx - 4, y);
			ctx.stroke();

			ctx.font = "12px sans-serif";
			ctx.textAlign = "right";
			ctx.fillText(i, cx - 8, y + 4);

		}

		ctx.restore();
	};

	drawVertices() {

		let ctx = this.ctx;
		ctx.save();
		let bound = this.bound;

		let xmax = this.xmax;
		let ymax = this.ymax;
		let xstride = (bound[1] - bound[3]) / xmax;
		let ystride = (bound[2] - bound[0]) / ymax;

		let i;

		// ctx.fillStyle = "#000";
		ctx.strokeStyle = "#fff";
		ctx.lineWidth = 2;

		// verticesGroups
		for (i = 0; i < this.verticesGroups.length; i++) {
			
			let verticesGroup = this.verticesGroups[i];
			ctx.fillStyle = this.colors[i];

			for (let j = 0; j < verticesGroup.length; ++j) {
				let cx = verticesGroup[j][0] * xstride + bound[3];
				let cy = bound[3] + verticesGroup[j][1] * ystride;
				console.log(cy);
				console.log(bound[2]);
				console.log(bound[3] + verticesGroup[j][1] * ystride);
				// let cy = bound[2] - verticesGroup[j][1] * ystride;
	
				// console.log("Vertice: ", verticesGroup[i]);
				// console.log("cx cy: ", cx, cy);
	
				ctx.beginPath();
				ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
				ctx.fill();
				ctx.stroke();
	
			}

		}

		// // vertices
		// for (i = 0; i < this.vertices.length; ++i) {
		// 	let cx = this.vertices[i][0] * xstride + bound[3];
		// 	let cy = bound[2] - this.vertices[i][1] * ystride;

		// 	// console.log("Vertice: ", this.vertices[i]);
		// 	// console.log("cx cy: ", cx, cy);

		// 	ctx.beginPath();
		// 	ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
		// 	ctx.fill();
		// 	ctx.stroke();

		// }

		ctx.restore();
	};

};
