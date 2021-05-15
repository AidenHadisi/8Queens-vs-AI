8 Queens vs. Artificial Intelligence
===

## Demo
A demo is available [here](https://ai8queens.herokuapp.com).

## Problem Statement
This application attempts to solve the 8-Queens problem using a genetic algorithm. 
Given one queen in each column, the A.I. will move the queens to different squares until no queens are attacking each other.

## Approach
A genetic algorithm is used to solve this problem. The algorithm begins with 100 random individuals as a population, if the solution is not found in the population the algorithm generates new children by performing crossover and mutations until a solution is found.

## How It Works
The genetic algorithms are evolutionary biology-inspired algorithms that are commonly used for Artificial Intelligence. In fact, a basic knowledge of biology is enough to understand how this algorithm works. There are 4,426,165,368 different ways to arrange 8 queens on a chessboard. With the power of the genetic algorithm, we can find a solution by generating only hundreds of solutions.

We begin with a population of 100 individuals where each individual is a solution to the problem (i.e. a state: [1,0,2,4,5,3,6,7]). We also define a fitness value for each individual in the population. In this case, fitness value is the number of queens that are attacking each other, so we are looking to minimize our fitness value.

If we find an ideal solution in our population, we return the solution. If not, we create new children by combing our solutions using the process of crossover and mutations. After generating a new set of solutions, we eliminate the solutions that are less fit for our environment (natural selection!). We continue this process until we find a solution with a fitness value of 0, which means this is the fittest individual.
