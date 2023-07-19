import "./style.scss";
import Home from "./Pages/Home"
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const {currentUser} = useContext(AuthContext);
  // console.log(currentUser);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element = {currentUser ? <Home/> : <Navigate to="/login"/>} />
            <Route path="login" element={<Login/>} />
            <Route path="signup" element={<Signup/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
