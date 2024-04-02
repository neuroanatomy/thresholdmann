import { MRIViewer } from "exports-loader?exports=MRIViewer!./vendor/mriviewer.js";
import { MUI } from  "exports-loader?exports=MUI!./vendor/mui.js";
import "./vendor/mui.css";

import "./thresholdmann.css";
import  "./thresholdmann.js";
import "./thresholdmann-worker.js";

window.MRIViewer = MRIViewer;
window.MUI = MUI;
console.log(MUI)
