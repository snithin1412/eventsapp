import "./App.css";
import { HashRouter } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from 'react-redux';
import Navigator from "./navigator"

function App() {
  return (
    <div className="App">
    <HashRouter>
      <Provider store={store}>
        <Navigator />
      </Provider>
    </HashRouter>
    </div>
  );
}

export default App;
