import { Routes, Route } from "react-router-dom";
import Home from "./page/HomePage";
import Login from "./auth/Login";
import Register from "./auth/Register";
import About from "./page/About";
import NoteForm from "./page/NoteForm";
import NoteList from "./page/NoteList";
import NavBar from "./component/NavBar";
import Footer from "./component/Footer";
import ProtectedRoute from "./component/ProtectRoute";
import './App.css';

function App() {
  return (
    <>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          {/*
            <Route
              path="/create-note"
              element={
                <ProtectedRoute>
                  <NoteForm />
                </ProtectedRoute>
              }
            />
          */}
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NoteList />
              </ProtectedRoute>
            }
          />
        </Routes>
      <Footer />
    </>
  );
}

export default App;
