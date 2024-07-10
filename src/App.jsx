import { useState, createContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import SignupForm from "./components/SignupForm/SignupForm";
import SigninForm from "./components/SigninForm/SigninForm";
import * as authService from "../src/services/authService"; // import the authservice
import HootList from "./components/HootList/HootList";
import * as hootService from "./services/hootService";
import HootDetails from "./components/HootDetails/HootDetails";
import HootForm from "./components/HootForm/HootForm";

export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser()); // using the method from authservice

  const [hoots, setHoots] = useState([]);

  // create a new instance of the useNavigate() hook within the component function:
  const navigate = useNavigate();

  const handleAddHoot = async (hootFormData) => {
    // console.log("hootFormData", hootFormData);
    const newHoot = await hootService.create(hootFormData);
    setHoots([newHoot, ...hoots]);
    navigate("/hoots");
  };

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  const handleDeleteHoot = async (hootId) => {
    // console.log("hootId", hootId);
    // Call upon the service function:
    const deletedHoot = await hootService.deleteHoot(hootId);

    // Remember, the Array.prototype.filter() method returns a shallow copy of the array, excluding all elements that do not pass the test implemented by the provided callback function.

    // In the code block above, our filter() method returns only the hoot objects whose _id values do not match the hootId.

    // Try deleting a hoot. After clicking the delete button, you should be directed to the list page, where the hoot is no longer present. If you refresh your browser, you’ll notice that the hoot appears once more. This is occurs because at the moment, we are only managing our local state. No change has been made to the database. When the browser is refreshed, our hootService.index() runs once again, loading hoots from our database.
    // Filter state using deletedHoot._id:
    setHoots(hoots.filter((hoot) => hoot._id !== hootId));
    // Redirect the user:
    navigate("/hoots");
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
              <Route
                path="/hoots/:hootId"
                element={<HootDetails handleDeleteHoot={handleDeleteHoot} />}
              />
              <Route
                path="/hoots/new"
                element={<HootForm handleAddHoot={handleAddHoot} />}
              />
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
