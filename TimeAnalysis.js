import { log, parseResponse } from "./utils.js";

export class TimeAnalysis {
  constructor(serialComm, chart, vg, delay) {
    this.serialComm = serialComm;
    this.chart = chart;
    this.isRunning = false;

    this.vg = vg;
    this.delay = delay;
    this.summary = [];
  }

  updateChart(timestamp, res_left, res_right) {
    this.chart.data.labels.push(timestamp);
    this.chart.data.datasets[0].data.push(res_left);
    this.chart.data.datasets[1].data.push(res_right);
    this.chart.update();
  }

  async start() {
    if (this.isRunning) {
      log("Time analysis is already running!", "error");
      return;
    }

    // Get initial reading at t=0
    const initialCommand = await this.serialComm.sendCommand(
      `ACgn, ${this.vg.toFixed(2)}`
    );
    log(initialCommand, "sent");
    const initialRes = await this.serialComm.read();
    log(initialRes, "Received");
    const {
      resistance_left,
      resistance_right,
      x_gain,
      y_gain,
      current_AC,
      frequency,
    } = parseResponse(initialRes);

    // Plot the initial point at t=0
    this.updateChart("0.00", resistance_left, resistance_right);
    this.summary.push({
      t: 0,
      X: x_gain,
      Y: y_gain,
      I: current_AC,
      F: frequency,
    });

    this.isRunning = true;
    this.timestamp = Date.now();

    try {
      const command = await this.serialComm.sendCommand(
        `Vg, ${this.vg.toFixed(2)}`
      );
      log(command, "Sent");
      const res = await this.serialComm.read();
      log(res, "Received");
      const command2 = await this.serialComm.sendCommand(`dt, ${this.delay}`);
      log(command2, "Sent");
      const res2 = await this.serialComm.read();
      log(res2, "Received");

      while (this.isRunning) {
        const command = await this.serialComm.sendCommand(
          `ACgn, ${this.vg.toFixed(2)}`
        );
        log(command, "sent");
        const res = await this.serialComm.read();
        const elapsedTime = (Date.now() - this.timestamp) / 1000;
        log(res, "Received");
        const {
          resistance_left,
          resistance_right,
          x_gain,
          y_gain,
          current_AC,
          frequency,
        } = parseResponse(res);
        this.summary.push({
          t: elapsedTime,
          X: x_gain,
          Y: y_gain,
          I: current_AC,
          F: frequency,
        });
        this.updateChart(
          elapsedTime.toFixed(2),
          resistance_left,
          resistance_right
        );
      }
    } catch (error) {
      log(`Time Analysis error: ${error}`, "error");
    }
  }

  stop() {
    if (this.isRunning) {
      this.isRunning = false;
      log("Time Analysis Stopped", "info");
    }
  }

  get_summary() {
    return this.summary;
  }
}
