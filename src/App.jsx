import { useState, createContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import SignupForm from "./components/SignupForm/SignupForm";
import SigninForm from "./components/SigninForm/SigninForm";
import * as authService from "../src/services/authService"; // import the authservice
import HootList from "./components/HootList/HootList";
import * as hootService from "./services/hootService";
import HootDetails from "./components/HootDetails/HootDetails";

export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser()); // using the method from authservice

  const [hoots, setHoots] = useState([]);

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  // Notice the inclusion of user in our dependency array and the if condition placed around the invocation of fetchAllHoots().
  // Placing user in the dependency array causes the effect to fire off when the page loads or user state changes. Within our useEffect, we invoke fetchAllHoots, which in turn calls upon the index service. On the backend, our hoots index route is protected, which means the request won’t go through until a user is logged in. Including this if condition prevents the request from being made if a user is not logged in.
  useEffect(() => {
    const fetchAllHoots = async () => {
      const hootsData = await hootService.index();
      // console.log("hootsData:", hootsData); this was to test that we were getting the hoots
      // set state:
      setHoots(hootsData);
    };
    // below checks if the user exist before we fetchAll
    if (user) fetchAllHoots();
  }, [user]);

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />
        <Routes>
          {user ? (
            // Protected Routes:
            <>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/hoots" element={<HootList hoots={hoots} />} />
              <Route path="/hoots/:hootId" element={<HootDetails />} />
            </>
          ) : (
            // Public Route:
            <Route path="/" element={<Landing />} />
          )}
          <Route path="/signup" element={<SignupForm setUser={setUser} />} />
          <Route path="/signin" element={<SigninForm setUser={setUser} />} />
        </Routes>
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;
