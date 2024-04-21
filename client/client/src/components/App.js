import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import NavBar from "./Navbar";
import Home from "./Home";
import MovieDetails from "./MovieDetails";
import Admin from "./Admin";
import UserDashboard from "./UserDashboard";
import NowShowing from "./NowShowing";
import ComingSoon from "./ComingSoon";
import Theaters from "./Theaters";

function App() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
        try {
            const url = '/movies';
            const response = await fetch(url, {
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json",
                },
            });
            const data = await response.json();
            setMovies(data);
            console.log(data)
        } catch (error) {
            console.log('Error fetching movies:', error);
        }
    };
    fetchMovies();
}, []);

  useEffect(() => {
    // auto-login
    fetch("/check_session")
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error("Failed to fetch user session.");
        }
      })
      .then((user) => setUser(user))
      .catch((error) => {
        console.error(error);
        // Handle error or redirect to login page
      });
  }, []);

  return (
    <>
      <NavBar user={user} setUser={setUser} />
      <main>
        <Switch>
          <Route path="/signup">
            <SignUp setUser={setUser} />
          </Route>
          <Route path="/login">
            <Login setUser={setUser} />
          </Route>
          <Route path="/dashboard">
            <UserDashboard user={user} /> 
          </Route>
          <Route path="/movies/:movieId">
            <MovieDetails user={user}/>
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/now-showing">
             <NowShowing  movies={movies}/>
          </Route>
          <Route path="/coming-soon">
              <ComingSoon movies={movies} />
          </Route>
          <Route path="/theaters" >
            <Theaters />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </main>
    </>
  );
}

export default App;
