import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter,Routes, Route  } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import App from "./App";
import "./assets/styles.css";
import Members from "./pages/Member/Members";
import NotFound from "./pages/NotFound/NotFound";
import Home from "./pages/Home/index";
import News from "./pages/News/News";
import Resource from "./pages/Resource/Resource";
import MainAdmin from "./Admin/MainAdmin";
import LessonPlans from "./pages/NavigationMenu/lesson-plans/lesson-plans";
import Games from "./pages/NavigationMenu/games/games";
import Videos from "./pages/NavigationMenu/videos/videos";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<App />}>
        <Route path="home" element={<Home />} />
        <Route path="members" element={<Members />} />
        <Route path="news" element={<News />} />
        <Route path="resources" element={<Resource />} />
        <Route path="/lesson-plans" element={<LessonPlans/>} />
        <Route path="/games" element={<Games/>} />
        <Route path="/experiment-videos" element={<Videos/>} />
        <Route path="*" element={<NotFound/>} />
      </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<MainAdmin/>}>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
