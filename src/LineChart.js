import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import {
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
  Card,
  Box,
  CardContent,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const LineChart = () => {
  const [series, setSeries] = useState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEndpoints, setSelectedEndpoints] = useState([]);
  const [timeRange, setTimeRange] = useState({ start: null, end: null });

  const data = [
    {
      endpoint: "/home",
      time: "2023-10-08T02:18:17.735Z",
      requests: 2364,
      special: true,
    },
    { endpoint: "/home", time: "2023-10-07T02:23:17.735Z", requests: 1132 },
    {
      endpoint: "/home",
      time: "2023-10-06T02:03:17.735Z",
      requests: 3433,
      special: true,
    },
    { endpoint: "/product", time: "2023-10-07T02:13:17.735Z", requests: 1563 },
    { endpoint: "/product", time: "2023-10-06T02:12:17.735Z", requests: 1563 },
    {
      endpoint: "/contact",
      time: "2023-10-07T02:13:17.735Z",
      requests: 2298,
      special: true,
    },
    {
      endpoint: "/product",
      time: "2023-10-08T02:17:17.735Z",
      requests: 3198,
      special: true,
    },
    {
      endpoint: "/contact",
      time: "2023-10-08T02:13:17.735Z",
      requests: 1950,
      special: true,
    },
    { endpoint: "/contact", time: "2023-10-06T02:01:17.735Z", requests: 2800 },
  ];

  useEffect(() => {
    const uniqueEndpoints = [...new Set(data.map((item) => item.endpoint))];
    setEndpoints(uniqueEndpoints);
    setSelectedEndpoints(uniqueEndpoints);
  }, []);

  useEffect(() => {
    const filteredData = data.filter((item) => {
      const inTimeRange =
        !timeRange.start ||
        !timeRange.end ||
        (dayjs(item.time).isAfter(dayjs(timeRange.start)) &&
          dayjs(item.time).isBefore(dayjs(timeRange.end)));
      return selectedEndpoints.includes(item.endpoint) && inTimeRange;
    });

    const groupedData = selectedEndpoints.map((endpoint) => ({
      name: endpoint,
      data: filteredData
        .filter((item) => item.endpoint === endpoint)
        .map((item) => ({ x: item.time, y: item.requests })),
    }));

    setSeries(groupedData);
  }, [selectedEndpoints, timeRange]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card variant="outlined" sx={{ maxWidth: 800 }}>
        <CardContent>
          <Grid pl={2}>
            <Typography variant="h4">Line Chart</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2} pt={4}>
                <Stack direction={"row"} gap={1}>
                  <Grid item xs={12} pl={1.5}>
                    <DateTimePicker
                      label="Start Date & Time"
                      value={timeRange.start}
                      onChange={(newValue) =>
                        setTimeRange({ ...timeRange, start: newValue })
                      }
                      renderInput={(props) => <TextField {...props} />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DateTimePicker
                      label="End Date & Time"
                      value={timeRange.end}
                      onChange={(newValue) =>
                        setTimeRange({ ...timeRange, end: newValue })
                      }
                      renderInput={(props) => <TextField {...props} />}
                    />
                  </Grid>
                </Stack>
                <Grid item xs={12}>
                  <Typography variant="h6">Filter by Endpoint:</Typography>
                  <Grid container>
                    <Stack direction={"row"} gap={1}>
                      {endpoints.map((endpoint) => (
                        <Grid item key={endpoint} xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedEndpoints.includes(endpoint)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedEndpoints([
                                      ...selectedEndpoints,
                                      endpoint,
                                    ]);
                                  } else {
                                    setSelectedEndpoints(
                                      selectedEndpoints.filter(
                                        (ep) => ep !== endpoint
                                      )
                                    );
                                  }
                                }}
                              />
                            }
                            label={endpoint}
                          />
                        </Grid>
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Grid>
          <Chart
            options={{
              chart: { id: "line-chart", type: "line" },
              xaxis: { type: "datetime" },
            }}
            series={series}
            type="line"
            height={350}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default LineChart;
