import './App.css';
import {PersonList} from "./components/PersonList";
import {Route, Routes} from "react-router-dom";
import NotFound from "./common/NotFound";

function App() {
    return (
        <div className="App">
            <div className="container">
                <Routes>
                    <Route path="/" element={<PersonList/>}/>
                    <Route errorElement={<NotFound/>}/>
                </Routes>
            </div>
        </div>
    );
}

export default App;
