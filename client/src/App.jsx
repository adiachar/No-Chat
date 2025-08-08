import "./App.css";
import NoChatApp from "./components/NoChatApp.jsx";
import {Provider} from "react-redux";
import {store} from "./app/store.js";

function App() {
  return (
    <Provider store={store}>
      <div className="h-full w-full">
        <NoChatApp/>
        <a href=""></a>
      </div>
    </Provider>
  );
}

export default App;