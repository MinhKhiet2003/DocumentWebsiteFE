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

import ExperimentVideoDetail from "./pages/NavigationMenu/videos/ExperimentVideoDetail/ExperimentVideoDetail";
import LessonPlanDetail from "./pages/NavigationMenu/lesson-plans/LessonPlanDetail/LessonPlanDetail";
import GameDetail from "./pages/NavigationMenu/games/GameDetail/GameDetail";
import MainContent from "./Admin/pages/MainContent/MainContent";
import Profile from "./pages/Profile/Profile";

import LessonPlansAdmin from "./Admin/pages/DocumentManagement/lesson-plans/lesson-plans";
import UserManagement from "./Admin/pages/UserManagement/UserManagement";
import GamesManagement from "./Admin/pages/DocumentManagement/GamesManagement/GamesManagement";
import VideosManagement from "./Admin/pages/DocumentManagement/VideosManagement/VideosManagement";
import CategoriesManagement from "./Admin/pages/CategoriesManagement/CategoriesManagement";
import LifeManagement from "./Admin/pages/ExerciseManagement/LifeManagement/LifeManagement";
import ComicManagement from "./Admin/pages/ExerciseManagement/ComicManagement/ComicManagement";
import { AuthProvider } from "./Auth/AuthContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <Routes>
      <Route path="/" element={<App />}>
        <Route path="home" element={<Home />} />
        <Route path="members" element={<Members />} />
        <Route path="news" element={<News />} />
        <Route path="resources" element={<Resource />} />
        <Route path="/lesson-plans" element={<LessonPlans/>} />
          <Route path="/lesson-plans/:id" element={<LessonPlanDetail/>} />
        <Route path="/games" element={<Games/>} />
          <Route path="/games/:id" element={<GameDetail/>} />
        <Route path="/experiment-videos" element={<Videos/>} />
          <Route path="experiment-videos/:id" element={<ExperimentVideoDetail />} />
        <Route path="*" element={<NotFound/>} />
      </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<MainAdmin/>}>
            <Route path="/admin/dashboard" element={<MainContent />} />
            {/* <Route path="/admin/exercise-management" element={<ExerciseManagement />} /> */}
        </Route>
            <Route path="/admin/games" element={<GamesManagement />} />
            <Route path="/admin/user-management" element={<UserManagement />} />
            <Route path="/admin/lesson-plans" element={<LessonPlansAdmin />} />
            <Route path="/admin/experiment-videos" element={<VideosManagement />} />
            <Route path="/admin/categories" element={<CategoriesManagement />} />
            <Route path="/admin/chemistry-of-life" element={<LifeManagement />} />
            <Route path="/admin/chemistry-comics" element={<ComicManagement />} />

      </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
