/**
 * Class Solution describes an individual in our population
 * Every individual must have a fitness value which determines quality of solution
 */
class Solution {
  private _chromosome: number[];
  private _fitness: number;

  constructor(chromosome: number[]) {
    this._fitness = Number.MAX_SAFE_INTEGER;
    this._chromosome = [];

    chromosome.forEach((elem) => {
      this.chromosome.push(elem);
    });

    this.calcFitness();
  }

  get chromosome() {
    return this._chromosome;
  }

  get fitness() {
    return this._fitness;
  }

  public calcFitness() {
    let attacks = 0.0;

    //Follwing distance formula can be used to find the fitness.
    //Each elem(e) in postion (i) represents a queen in column i and row e (e,i)
    for (var i = 0; i < this.chromosome.length; i++) {
      for (var j = 0; j < this.chromosome.length; j++) {
        if (i === j) continue;

        var distanceX = Math.abs(i - j);
        var distanceY = Math.abs(this.chromosome[i] - this.chromosome[j]);
        if (distanceX == distanceY) attacks++;
      }
    }
    this._fitness = attacks;
  }
}

export class GeneticAlgorithm {
  private _populationSize: number;
  private _mutationProbability: number;
  private _crossoverRate: number;
  private _maxGenerations: number;
  private _queens: number;
  private _ktournament: number;
  private _population: Solution[];
  private callback: (fitness: number, chromosome: number[]) => void;
  private done: () => void;
  private onMutation: () => void;
  private _regenCount: number;

  constructor(
    callback: (fitness: number, chromosome: number[]) => void,
    done: () => void,
    onMutation: () => void,
    queens: number = 8,
    populationSize: number = 100,
    mutationProbabiltiy: number = 0.05,
    crossOverRate: number = 0.8,
    maxGenerations: number = 500,
    ktournament: number = 3
  ) {
    this.callback = callback;
    this.done = done;
    this.onMutation = onMutation;
    this._populationSize = populationSize;
    this._queens = queens;
    this._mutationProbability = mutationProbabiltiy;
    this._crossoverRate = crossOverRate;
    this._maxGenerations = maxGenerations;
    this._ktournament = ktournament;
    this._population = [];
    this._regenCount = 0;
  }

  /**
   * Creates a population of random Solutions
   */
  private init() {
    for (let i = 0; i < this.populationSize; i++) {
      this._population.push(this.randomSolution());
    }
  }

  /**
   * Creates new children by performing crossover if necessary
   */
  private async regenPopulation() {
    var newPop = [];

    while (newPop.length < this.populationSize) {
      let mom = this.tk();
      let dad = this.tk();
      var children;

      if (Math.random() < this.crossoverRate) {
        //Do crossover and create children from mom and dad if needed
        children = this.pmx(mom.chromosome, dad.chromosome);
      } else {
        //Otherwise just push the mom and dad to children
        children = [mom.chromosome, dad.chromosome];
      }

      newPop.push(new Solution(children[0]));
      newPop.push(new Solution(children[1]));
    }

    for (var child of newPop) {
      this.mutate(child);

      this.callback(child.fitness, child.chromosome);

      await new Promise((r) => setTimeout(r, 100));

      this._population.push(child);
      if (child.fitness === 0) return;
    }

    this._population.sort(this.sortByFitness);
    this._population.splice(this.populationSize);
    this._regenCount++;
  }

  /**
   * Performs partially mapped crossover
   * @param SolutionA Solutions of parent A
   * @param SolutionB Solution of parent B
   * @returns Solutions of 2 children
   */
  private pmx(SolutionA: number[], SolutionB: number[]): number[][] {
    // Parents
    var mom = SolutionA.slice();
    var dad = SolutionB.slice();

    var size = mom.length;

    //Used as a map in partial mapping
    var momMap = Array.from({ length: size }, () => 0);
    var dadMap = Array.from({ length: size }, () => 0);

    //Find our crossover points
    var cxp1 = Math.floor((Math.random() * size) / 2);
    var cxp2 = Math.floor(Math.random() * (size - 2 - (cxp1 + 1))) + (cxp1 + 1);

    //Init our maps
    for (let i = 0; i < size; i++) {
      momMap[mom[i]] = i;
      dadMap[dad[i]] = i;
    }

    //We cross between two points

    for (let i = cxp1; i < cxp2; i++) {
      let temp1 = mom[i];
      let temp2 = dad[i];

      mom[i] = temp2;
      mom[momMap[temp2]] = temp1;

      dad[i] = temp1;
      dad[dadMap[temp1]] = temp2;

      let temp3 = momMap[temp1];
      momMap[temp1] = momMap[temp2];
      momMap[temp2] = temp3;

      let temp4 = dadMap[temp1];
      dadMap[temp1] = dadMap[temp2];
      dadMap[temp2] = temp4;
    }

    //We return crossed over mom and dad as new kids

    return [mom, dad];
  }

  private mutate(solution: Solution) {
    if (Math.random() < this.mutationProbability) {
      let x = Math.floor(Math.random() * this.queens);
      let y = Math.floor(Math.random() * this.queens);

      //Switch genes at postion x and y
      if (x != y) {
        this.onMutation();
        let temp = solution.chromosome[x];
        solution.chromosome[x] = solution.chromosome[y];
        solution.chromosome[y] = temp;

        //Must recalculate fitness value after mutation
        solution.calcFitness();
      }
    }
  }

  /**
   * Selects a random individual from our population
   * @returns a random individual
   */
  private tk() {
    let listK = Array.from({ length: this._ktournament }, () =>
      Math.floor(Math.random() * this.populationSize)
    );
    listK.sort(function (a, b) {
      return b - a;
    });

    return this._population[listK[0]];
  }

  /**
   * Creates a random Solution from values 0 to n-queens
   * @returns new random Solution
   */
  private randomSolution(): Solution {
    //[0,1,2,3,4,5,6,7]
    var seq = Array.from({ length: this.queens }, (value, index) => index);
    this.shuffleArray(seq);
    return new Solution(seq);
  }

  /**
   * Shuffles elemenets of an array in place
   * @param array array to shuffle
   */
  private shuffleArray(array: number[]): void {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  private sortByFitness(a: Solution, b: Solution) {
    if (a.fitness > b.fitness) return 1;
    if (a.fitness < b.fitness) return -1;
    return 0;
  }

  private finalSolution(): boolean {
    this._population.sort(this.sortByFitness);

    //Best match is the one with best fitness value
    let bestMatch = this._population[0];

    //We have found a soltion or can't try anymore
    if (bestMatch.fitness === 0 || this._regenCount === this._maxGenerations) {
      return true;
    }

    return false;
  }

  public async start() {
    //Initialize our pop
    this.init();

    while (!this.finalSolution()) {
      await this.regenPopulation();
    }

    this.callback(this._population[0].fitness, this._population[0].chromosome);
    this.done();
  }

  get queens() {
    return this._queens;
  }

  get populationSize() {
    return this._populationSize;
  }

  get mutationProbability() {
    return this._mutationProbability;
  }

  get crossoverRate() {
    return this._crossoverRate;
  }
}
