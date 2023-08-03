import { Box, Divider, MenuItem, Select, Typography } from "@mui/material";
import { Datum } from "plotly.js";
import Plot from "react-plotly.js";
import BarGraphCode from "./ColumnCode/BarGraphCode";
import { useState } from "react";
import PieChartCode from "./ColumnCode/PieChartCode";

interface Props {
  fileName: string;
  data: { [key: string]: any }[];
  column: string;
}

const generate_XY = (data: { [key: string]: any }[], column: string) => {
  const info: any = {};
  for (let i = 0; i < data.length; i++) {
    let row = data[i];
    if (row[column] in info) {
      info[row[column]] = info[row[column]] + 1;
    } else {
      info[row[column]] = 1;
    }
  }
  delete info[""];
  let x: String[] = [];
  let y: Number[] = [];

  Object.keys(info).forEach((value) => {
    x.push(value);
    y.push(info[value]);
  });
  return [x, y];
};

const CategoricalColumn = ({ data, column, fileName }: Props) => {
  const [graphType, setGraphType] = useState("Bar Graph");
  const info = generate_XY(data, column);
  const x_values = info[0] as Datum[];
  const y_values = info[1] as Datum[];
  return (
    <>
      <Box sx={{ margin: 5 }}>
        <Typography
          sx={{ my: 5, fontWeight: "bold", color: "primary.main" }}
          variant="h2"
        >
          {column} Column
        </Typography>
        <Divider
          variant="middle"
          sx={{ my: 5, bgcolor: "text.primary" }}
        ></Divider>
        <Typography sx={{ my: 5, color: "primary.light" }} variant="h3">
          Graph
        </Typography>

        <Select
          sx={{
            marginBottom: 3,
            overflow: "hidden",
            borderRadius: "15px",
            height: "40px",
            width: "200px",
            bgcolor: "primary.light",
          }}
          value={graphType}
        >
          <MenuItem value="Bar Graph" onClick={() => setGraphType("Bar Graph")}>
            Bar Graph
          </MenuItem>
          <MenuItem value="Pie Chart" onClick={() => setGraphType("Pie Chart")}>
            Pie Chart
          </MenuItem>
        </Select>

        {graphType === "Bar Graph" ? (
          <>
            <BarGraphCode fileName={fileName} column={column} />
            <Box
              sx={{
                display: "inline-block",
                bgcolor: "primary.light",
                borderRadius: 2,
                padding: 2,
                marginTop: 3,
              }}
            >
              <Plot
                data={[
                  {
                    x: [...x_values],
                    y: [...y_values],
                    type: "bar",
                    mode: "lines+markers",
                    marker: { color: "  #2a5a33" },
                  },
                ]}
                layout={{
                  yaxis: {
                    title: { text: "<b>Frequency<b>", standoff: 50 },
                  },
                  xaxis: { title: { text: `<b>${column}<b>`, standoff: 50 } },
                  title: "<b>Frequency Graph<b>",
                }}
              />
            </Box>
          </>
        ) : (
          <>
            <PieChartCode fileName={fileName} column={column} />
            <Box
              sx={{
                display: "inline-block",
                bgcolor: "primary.light",
                borderRadius: 2,
                padding: 2,
                marginTop: 3,
              }}
            >
              <Plot
                data={[
                  {
                    labels: [...x_values],
                    values: [...y_values],
                    type: "pie",
                  },
                ]}
                layout={{
                  // yaxis: {
                  //   title: { text: "<b>Frequency<b>", standoff: 50 },
                  // },
                  // xaxis: { title: { text: `<b>${column}<b>`, standoff: 50 } },
                  title: "<b>Pie Chart<b>",
                }}
              />
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default CategoricalColumn;