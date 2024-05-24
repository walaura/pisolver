import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const container = document.getElementById("app");
const root = createRoot(container);
// eslint-disable-next-line react/react-in-jsx-scope
root.render(<App />);
