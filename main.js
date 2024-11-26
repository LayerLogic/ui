import { log, saveDataToTxt, sleep } from "./utils.js";
import { gateChartConfig, timeChartConfig } from "./chartsConfig.js";
import { SerialCommunication } from "./SerialCommunication.js";
import { GateAnalysis } from "./GateAnalysis.js";
import { TimeAnalysis } from "./TimeAnalysis.js";

document.addEventListener("DOMContentLoaded", () => {
  // const vg = parseFloat(document.getElementById("gateV").value) || 0.03;
  // const delay = parseFloat(document.getElementById("delay").value) || 0;
  // const vgStep = parseFloat(document.getElementById("stepSize").value) || 0.03;
  // const vgMin = parseFloat(document.getElementById("vgMin").value) || -1;
  // const vgMax = parseFloat(document.getElementById("vgMax").value) || 1;

  // const ctx = document.getElementById("myChart").getContext("2d");
  // const ctx2 = document.getElementById("myChart2").getContext("2d");

  // const gateChart = new Chart(ctx, gateChartConfig());
  // const timeChart = new Chart(ctx2, timeChartConfig());

  //
  const serialComm = new SerialCommunication();
  document
    .getElementById("connectButton")
    .addEventListener("click", async () => {
      const isConnected = await serialComm.connect();
      if (isConnected) {
        document.querySelector(".status-circle").style.backgroundColor =
          "#16a34a";
        document.querySelector(".status").textContent = "Connected";
      }
    });
  window.addEventListener("beforeunload", () => serialComm.disconnect());

  // const gateAnalysis = new GateAnalysis(
  //   serialComm,
  //   gateChart,
  //   vgStep,
  //   vgMin,
  //   vgMax
  // );
  // const timeAnalysis = new TimeAnalysis(serialComm, timeChart, vg, delay);

  // Event Listeners

  // document.getElementById("resetZoomButton").addEventListener("click", () => {
  //   if (gateAnalysis.isRunning) {
  //     gateChart.resetZoom();
  //   } else if (timeAnalysis.isRunning) {
  //     timeChart.resetZoom();
  //   }
  // });

  // document.getElementById("clearChartButton").addEventListener("click", () => {
  //   if (gateAnalysis.isRunning) {
  //     gateAnalysis.reset();
  //   } else if (timeAnalysis.isRunning) {
  //     timeAnalysis.reset();
  //   }
  // });

  // document.getElementById("stopButton").addEventListener("click", () => {
  //   if (gateAnalysis.isRunning) {
  //     gateAnalysis.stop();
  //     document.getElementById("startTimeAnalysisButton").disabled = false;
  //   } else if (timeAnalysis.isRunning) {
  //     timeAnalysis.stop();
  //     document.getElementById("startGateAnalysisButton").disabled = false;
  //   }
  // });

  // document
  //   .getElementById("startGateAnalysisButton")
  //   .addEventListener("click", () => {
  //     gateAnalysis.start();
  //     document.getElementById("startTimeAnalysisButton").disabled = true;
  //   });

  // document
  //   .getElementById("startTimeAnalysisButton")
  //   .addEventListener("click", () => {
  //     timeAnalysis.start();
  //     document.getElementById("startGateAnalysisButton").disabled = true;
  //   });

  // document
  //   .getElementById("sendCommandsButton")
  //   .addEventListener("click", async () => {
  //     const commands = document
  //       .getElementById("commandsTextArea")
  //       .value.trim()
  //       .split("\n");
  //     for (const command of commands) {
  //       const req = await serialComm.sendCommand(command);
  //       log(req, "info");
  //       const res = await serialComm.read();
  //       log(res, "info");
  //       await new Promise((resolve) => setTimeout(resolve, 500));
  //     }
  //   });

  // // Input handlers
  // document.getElementById("stepSize").addEventListener("input", async (e) => {
  //   const vgStep = Math.abs(parseFloat(e.target.value)) || 0.03;
  //   await sleep(500);
  //   gateAnalysis.vg_step = vgStep;
  // });

  // document.getElementById("vgMin").addEventListener("input", async (e) => {
  //   const vgMin = parseFloat(e.target.value) || -1;
  //   await sleep(500);
  //   gateAnalysis.vg_min = vgMin;
  // });

  // document.getElementById("vgMax").addEventListener("input", async (e) => {
  //   const vgMax = parseFloat(e.target.value) || 1;
  //   await sleep(500);
  //   gateAnalysis.vg_max = vgMax;
  // });

  // document.getElementById("gateV").addEventListener("input", async (e) => {
  //   const vg = parseFloat(e.target.value) || 1;
  //   await sleep(500);
  //   timeAnalysis.vg = vg;
  // });

  // document.getElementById("delay").addEventListener("input", async (e) => {
  //   const delay = parseFloat(e.target.value);
  //   await sleep(500);
  //   timeAnalysis.delay = delay;
  // });

  // function save() {
  //   saveDataToTxt(gateAnalysis.get_summary(), "Gate_analysis");
  // }

  // document.getElementById("saveDataButton").addEventListener("click", save);
});
