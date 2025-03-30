import React, { use } from "react";
import { Routes, Route, Outlet ,useLocation,useNavigate} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/index";
import ScrollToTopButton from "./components/ScrollToTopButton/ScrollToTopButton";


const App = () => {
  const location = useLocation();

  return (

    <div>
      <Navbar />
        <div className="main-content">
           {
            location.pathname == "/" ? <Home /> : <Outlet />
           } 
        </div>
          <ScrollToTopButton/>
    </div>
  );
};

export default App;