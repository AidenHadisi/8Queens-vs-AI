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
    this.setState({ running: true, genCount: 0, mutations: 0 });
    var ga = new GeneticAlgorithm(this.setData, this.onDone, this.onMutation);
    ga.start();
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
            <p>
              The initial population is set to 100. The algorithm will generate
              up to 500 new solutions before giving up. The mutation porbability
              is set to 5%.
            </p>
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
          </Grid>
          <Grid item xs={12} md={6} className={classes.item}>
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
