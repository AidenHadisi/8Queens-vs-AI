import { makeStyles, Theme } from "@material-ui/core/styles";

const styles = makeStyles((theme: Theme) => ({
  board: {
    borderSpacing: "0",
    borderCollapse: "collapse",
    color: theme.palette.primary.main,

    "& th": {
      padding: "0.5em",
    },

    "& th + th": {
      borderBottom: "1px solid #000",
    },

    "& th:first-child, & td:last-child": {
      borderRight: "1px solid #000",
    },

    "& tr:last-child td": {
      borderBottom: "1px solid",
    },
    "& th:empty": {
      border: "none",
    },
    "& td": {
      width: "1.5em",
      height: "1.5em",
      textAlign: "center",
      fontSize: "35px",
      lineHeight: "0",
    },

    "& .light": {
      background: "#eee",
    },
    "& .dark": {
      background: "#434664",
    },
  },
}));

interface IProps {
  chromosomes: number[];
}

function Board({ chromosomes }: IProps) {
  const classes = styles();

  return (
    <table className={classes.board}>
      <tbody>
        <tr>
          <th></th>
          <th>a</th>
          <th>b</th>
          <th>c</th>
          <th>d</th>
          <th>e</th>
          <th>f</th>
          <th>g</th>
          <th>h</th>
        </tr>

        {chromosomes.map((value, index) => {
          var classA = index % 2 === 0 ? "light" : "dark";
          var classB = index % 2 === 1 ? "light" : "dark";
          return (
            <tr>
              <th>{index + 1}</th>
              <td className={classA}>
                {chromosomes[0] === index && <span>♛</span>}
              </td>
              <td className={classB}>
                {chromosomes[1] === index && <span>♛</span>}
              </td>
              <td className={classA}>
                {chromosomes[2] === index && <span>♛</span>}
              </td>
              <td className={classB}>
                {chromosomes[3] === index && <span>♛</span>}
              </td>
              <td className={classA}>
                {chromosomes[4] === index && <span>♛</span>}
              </td>
              <td className={classB}>
                {chromosomes[5] === index && <span>♛</span>}
              </td>
              <td className={classA}>
                {chromosomes[6] === index && <span>♛</span>}
              </td>
              <td className={classB}>
                {chromosomes[7] === index && <span>♛</span>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Board;
