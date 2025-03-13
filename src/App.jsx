import React, { use } from "react";
import { Routes, Route, Outlet ,useLocation,useNavigate} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/index";
import NotFound from "./pages/NotFound/NotFound";
import ScrollToTopButton from "./components/ScrollToTopButton/ScrollToTopButton";
import Members from "./pages/Member/Members";


const App = () => {
  const location = useLocation();

  return (

    <div>
      <Navbar />
      {/* <div className="d-flex">
        <Sidebar /> */}
        <div className="main-content">
          {/* <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="*" element={<NotFound />} />
          </Routes> */}
            {/* <Home /> */}
           {
            location.pathname == "/" ? <Home /> : <Outlet />
           } 
        </div>
          <ScrollToTopButton/>
      </div>
    // </div>
  );
};

export default App;