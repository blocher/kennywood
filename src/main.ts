import "./style.css";
import { renderBoard } from "./board";
import { MOCK_FEED } from "./mockFeed";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");
app.innerHTML = renderBoard(MOCK_FEED);
