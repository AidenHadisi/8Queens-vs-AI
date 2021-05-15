import React from "react";
import "./App.css";
import { withStyles, Theme, WithStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";
import { GeneticAlgorithm } from "./GeneticAlgorithm";
import Board from "./components/Board";

const styles = (theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    textAlign: "center" as "center",
    padding: theme.spacing(3),
  },

  info: {
    color: theme.palette.primary.main,
  },

  infoTable: {
    "& td": {
      padding: "5px",
    },
  },

  item: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    textAlign: "center" as "center",
    justifyContent: "center",
  },
});

interface Props extends WithStyles<typeof styles> {}

interface IState {
  fitness: number;
  genCount: number;
  chromosome: number[];
  running: boolean;
  mutations: number;
}

class App extends React.Component<Props, IState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fitness: 0,
      genCount: 0,
      chromosome: [6, 1, 3, 0, 7, 4, 2, 5],
      running: false,
      mutations: 0,
    };
  }

  setData = (fitness: number, chromosome: number[]) => {
    this.setState({
      chromosome: chromosome,
      fitness: fitness,
      genCount: this.state.genCount + 1,
    });
  };

  onMutation = () => {
    this.setState({ mutations: this.state.mutations + 1 });
  };

  onDone = () => {
    this.setState({ running: false });
  };

  start = () => {
    this.setState({ running: true, genCount: 0, mutations: 0 }, () => {
      var ga = new GeneticAlgorithm(this.setData, this.onDone, this.onMutation);
      ga.start();
    });
  };

  randomize = () => {
    var arr = this.state.chromosome;
    shuffleArray(arr);
    this.setState({ chromosome: arr });
  };
  public render(): JSX.Element {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={2} style={{ minHeight: "100vh" }}>
          <Grid item xs={12} md={6} className={classes.item}>
            <h1 style={{ padding: "5px 2rem" }}>8-Queens vs A.I.</h1>
            <h3>
              View on{" "}
              <a href="https://github.com/AidenHadisi/8Queens-vs-AI">GitHub</a>
            </h3>
            <p>
              This application solves the 8-Queens problem using a{" "}
              <b>genetic algorithm</b>.
            </p>
            <p>
              Given one queen in each column, the A.I. will move the queens to
              different squares until no queens are attacking each other.
            </p>
            <h2>How It Works</h2>
            <p>
              The genetic algorithms are evolutionary biology-inspired
              algorithms that are commonly used for Artificial Intelligence. In
              fact, a basic knowledge of biology is enough to understand how
              this algorithm works. There are 4,426,165,368 different ways to
              arrange 8 queens on a chessboard. With the power of the genetic
              algorithm, we can find a solution by generating only hundreds of
              solutions.
            </p>
            <p>
              We begin with a population of 100 individuals where each
              individual is a solution to the problem (i.e. a state:
              [1,0,2,4,5,3,6,7]). We also define a fitness value for each
              individual in the population. In this case, fitness value is the
              number of queens that are attacking each other, so we are looking
              to minimize our fitness value.
            </p>{" "}
            <p>
              {" "}
              If we find an ideal solution in our population, we return the
              solution. If not, we create new children by combing our solutions
              using the process of crossover and mutations. After generating a
              new set of solutions, we eliminate the solutions that are less fit
              for our environment (natural selection!). We continue this process
              until we find a solution with a fitness value of 0, which means
              this is the fittest individual.
            </p>
          </Grid>

          <Grid item xs={12} md={6} className={classes.item}>
            {!this.state.running && (
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: "1rem" }}
                  onClick={this.start}
                >
                  Start
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.randomize}
                >
                  Randomize
                </Button>
              </div>
            )}

            <table className={classes.infoTable}>
              <tr>
                <td>
                  <h3>
                    Fitness:{" "}
                    <span className={classes.info}>{this.state.fitness}</span>
                  </h3>
                </td>
                <td>
                  <h3>
                    New Solutions Generated:
                    <span className={classes.info}> {this.state.genCount}</span>
                  </h3>
                </td>
              </tr>
              <tr>
                <td>
                  <h3>
                    Mutations:
                    <span className={classes.info}>
                      {" "}
                      {this.state.mutations}
                    </span>
                  </h3>
                </td>
                <td>
                  <h3>
                    State:
                    <span className={classes.info}>
                      {" "}
                      [{this.state.chromosome.join(", ")}]
                    </span>
                  </h3>
                </td>
              </tr>
            </table>
            <Board chromosomes={this.state.chromosome} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

function shuffleArray(array: any[]): void {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
export default withStyles(styles, { withTheme: true })(App);
