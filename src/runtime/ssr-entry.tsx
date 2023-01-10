import { App } from "./app";
import { renderToString } from "react-dom/server";

export function render() {
	// https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertostring
	return renderToString(<App />);
}
