let ga: Genetic;
let countGen = 1;
let runningVar: NodeJS.Timeout;
class Solution {
  private _chromosome: number[];
  private _fitness: number;
  constructor(chromosome: number[]) {
    this._fitness = 8;
    this._chromosome = [];
    chromosome.forEach((element) => {
      this._chromosome.push(element);
    });
    this.evaluate();
  }

  evaluate() {
    this._fitness = evaluate(this._chromosome);
  }
  get fitness() {
    return this._fitness;
  }

  get chromosome() {
    return this._chromosome;
  }
}

class Genetic {
  public popSize: number;
  public mutations: number;
  public crossovers: number;
  public generations: number;
  public kt: number;
  public queens: number;
  public population: Solution[];
  public children: Solution[];
  constructor() {
    this.popSize = 100;
    this.mutations = 0.05;
    this.crossovers = 0.8;
    this.generations = 200;
    this.kt = 3;

    this.queens = 8;

    this.population = [];
    this.children = [];
  }

  initializePop() {
    for (let i = 0; i < this.popSize; i++) {
      this.population.push(randomSolution(this.queens));
    }
  }

  performCrossOver() {
    while (this.children.length < this.popSize) {
      let fatherA = this.tournamentK(this.kt);
      let fatherB = this.tournamentK(this.kt);

      if (Math.random() < this.crossovers) {
        let sons = this.PMX(fatherA.chromosome, fatherB.chromosome);
        this.children.push(new Solution(sons[0]));
        this.children.push(new Solution(sons[1]));
      } else {
        this.children.push(new Solution(fatherA.chromosome));
        this.children.push(new Solution(fatherB.chromosome));
      }
    }
  }

  PMX(ChromosomeA: number[], ChromosomeB: number[]) {
    let ind1 = ChromosomeA.slice();
    let ind2 = ChromosomeB.slice();
    let size = ind1.length;
    let p1 = Array.from({ length: size }, () => 0);
    let p2 = Array.from({ length: size }, () => 0);

    //Initialize the position of each indices in the individuals
    for (let i = 0; i < size; i++) {
      p1[ind1[i]] = i;
      p2[ind2[i]] = i;
    }

    // Choose crossover points
    let cxpoint1 = Math.floor(Math.random() * size);
    let cxpoint2 = Math.floor(Math.random() * (size - 1));

    if (cxpoint2 >= cxpoint1) cxpoint2 += 1;
    else {
      let aux = cxpoint1;
      cxpoint1 = cxpoint2;
      cxpoint2 = aux;
    }

    // Apply crossover between cx points
    for (let i = cxpoint1; i < cxpoint2; i++) {
      let temp1 = ind1[i];
      let temp2 = ind2[i];

      ind1[i] = temp2;
      ind1[p1[temp2]] = temp1;

      ind2[i] = temp1;
      ind2[p2[temp1]] = temp2;

      let aux = p1[temp1];
      p1[temp1] = p1[temp2];
      p1[temp2] = aux;

      let aux2 = p2[temp1];
      p2[temp1] = p2[temp2];
      p2[temp2] = aux2;
    }

    return [ind1, ind2];
  }

  // Simple swap mutation
  mutation() {
    for (let i = 0; i < this.children.length; i++) {
      if (Math.random() < this.mutations) {
        let x = Math.floor(Math.random() * this.queens);
        let y = Math.floor(Math.random() * this.queens);

        if (x != y) {
          let aux = this.children[i].chromosome[x];
          this.children[i].chromosome[x] = this.children[i].chromosome[y];
          this.children[i].chromosome[y] = aux;

          this.children[i].evaluate();
        }
      }
    }
  }

  tournamentK(k: number) {
    let listK = Array.from({ length: k }, () =>
      Math.floor(Math.random() * this.popSize)
    );
    listK.sort(function (a, b) {
      return b - a;
    });

    return this.population[listK[0]];
  }

  mergePop() {
    this.children.forEach((element) => {
      this.population.push(new Solution(element.chromosome));
    });
    this.children = [];
    this.population.sort(orderPop);
    this.population.splice(this.popSize);
  }
}

function orderPop(a: Solution, b: Solution) {
  if (a.fitness > b.fitness) {
    return 1;
  }
  if (a.fitness < b.fitness) {
    return -1;
  }
  return 0;
}

function randomSolution(nqueens: number) {
  var tempArray = Array.from({ length: nqueens }, (v, i) => i);
  shuffleArray(tempArray);
  return new Solution(tempArray);
}

function evaluate(chromosome: number[]) {
  let clashes = 0.0;

  for (let i = 0; i < chromosome.length; i++) {
    for (let j = 0; j < chromosome.length; j++) {
      if (i != j) {
        var dx = Math.abs(i - j);
        var dy = Math.abs(chromosome[i] - chromosome[j]);
        if (dx == dy) clashes += 1;
      }
    }
  }

  return clashes;
}

function shuffleArray(array: any[]): void {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function runOneGeneration(
  callback: (h: number, n: number, chromos: number[]) => void,
  onDone: () => void
) {
  ga.performCrossOver();
  ga.mutation();
  ga.mergePop();
  ga.population.sort(orderPop);

  countGen++;

  if (countGen == ga.generations || ga.population[0].fitness == 0) {
    onDone();
    stopFunction();
  }

  callback(ga.population[0].fitness, countGen, ga.population[0].chromosome);
}

function stopFunction() {
  clearInterval(runningVar);
}

export function start(
  callback: (h: number, n: number, chromos: number[]) => void,
  onDone: () => void
) {
  ga = new Genetic();
  countGen = 0;
  ga.initializePop();
  runningVar = setInterval(function () {
    runOneGeneration(callback, onDone);
  }, 2000);
}

export function stop() {
  clearInterval(runningVar);
}
