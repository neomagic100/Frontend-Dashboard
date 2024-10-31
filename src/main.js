import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/variables.scss";
import App from "./App.vue";
import { tooltip } from "./directives/tooltip";
import "./assets/styles/tooltip.scss";

const app = createApp(App);
// Add the tooltip directive
app.directive("tooltip", tooltip);

app.mount("#app");
