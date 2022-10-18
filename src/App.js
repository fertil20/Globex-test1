import './App.css';
import {PersonList} from "./components/PersonList";
import {Route, Routes} from "react-router-dom";
import NotFound from "./common/NotFound";

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path="/" element={<PersonList/>}/>
            {/*<Route path="/experiences" element={<Experiences />} />*/}
            <Route errorElement={<NotFound/>}/>
        </Routes>
    </div>
  );
}

export default App;
