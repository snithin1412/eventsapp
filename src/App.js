import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";
import Navigator from "./navigator";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Provider store={store}>
          <Navigator />
        </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
