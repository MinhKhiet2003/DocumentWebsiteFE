import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import App from "./App";
import "./assets/styles.css";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/index";
import Members from "./pages/Member/Members";
import News from "./pages/News/News";
import Resource from "./pages/Resource/Resource";
import NotFound from "./pages/NotFound/NotFound";
import Profile from "./pages/Profile/Profile";

import LessonPlans from "./pages/NavigationMenu/lesson-plans/lesson-plans";
import LessonPlanDetail from "./pages/NavigationMenu/lesson-plans/LessonPlanDetail/LessonPlanDetail";
import Games from "./pages/NavigationMenu/games/games";
import GameDetail from "./pages/NavigationMenu/games/GameDetail/GameDetail";
import Videos from "./pages/NavigationMenu/videos/videos";
import ExperimentVideoDetail from "./pages/NavigationMenu/videos/ExperimentVideoDetail/ExperimentVideoDetail";
import ChemistryOfLife from "./pages/NavigationMenu/ChemistryOfLife/ChemistryOfLife";
import ChemistryComics from "./pages/NavigationMenu/ChemistryComics/ChemistryComics";
import ChemistryComicsDetail from "./pages/NavigationMenu/ChemistryComics/ChemistryComicsDetail/ChemistryComicsDetail";

import MainAdmin from "./Admin/MainAdmin";
import MainContent from "./Admin/pages/MainContent/MainContent";

import UserManagement from "./Admin/pages/UserManagement/UserManagement";
import CategoriesManagement from "./Admin/pages/CategoriesManagement/CategoriesManagement";

import LessonPlansAdmin from "./Admin/pages/DocumentManagement/lesson-plans/lesson-plans";
import GamesManagement from "./Admin/pages/DocumentManagement/GamesManagement/GamesManagement";
import VideosManagement from "./Admin/pages/DocumentManagement/VideosManagement/VideosManagement";

import LifeManagement from "./Admin/pages/ExerciseManagement/LifeManagement/LifeManagement";
import ComicManagement from "./Admin/pages/ExerciseManagement/chemistry-comics/ComicManagement";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="members" element={<Members />} />
            <Route path="news" element={<News />} />
            <Route path="resources" element={<Resource />} />
            
            <Route path="/resources/lesson-plans" element={<LessonPlans />} />
            <Route path="/resources/lesson-plans/:id" element={<LessonPlanDetail />} />
            <Route path="/resources/games" element={<Games />} />
            <Route path="/resources/games/:id" element={<GameDetail />} />
            <Route path="/resources/experiment-videos" element={<Videos />} />
            <Route path="/resources/experiment-videos/:id" element={<ExperimentVideoDetail />} />
            <Route path="/resources/chemistry-of-life" element={<ChemistryOfLife />} />
            <Route path="/resources/chemistry-comics" element={<ChemistryComics />} />
            <Route path="/resources/chemistry-comics/:id" element={<ChemistryComicsDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <MainAdmin />
              </ProtectedRoute>
            }
          >
            <Route index element={<MainContent />} />
            <Route path="dashboard" element={<MainContent />} />
            
            <Route path="user-management" element={<UserManagement />} />
            <Route path="categories" element={<CategoriesManagement />} />
            
            <Route path="lesson-plans" element={<LessonPlansAdmin />} />
            <Route path="games" element={<GamesManagement />} />
            <Route path="experiment-videos" element={<VideosManagement />} />
            
            <Route path="chemistry-of-life" element={<LifeManagement />} />
            <Route path="chemistry-comics" element={<ComicManagement />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);