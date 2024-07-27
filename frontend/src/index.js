//index.js

import "antd/dist/reset.css"; // Import Ant Design reset CSS
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App"; // Import the main App component
import "./index.css"; // Import global CSS styles
import store from "./redux/store"; // Import the Redux store

// Create the root element for rendering the React app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the React app within the root element
root.render(
  <Provider store={store}> {/* Provide the Redux store to the app */}
    <React.StrictMode>
      <App /> {/* Render the main App component */}
    </React.StrictMode>
  </Provider>
);

