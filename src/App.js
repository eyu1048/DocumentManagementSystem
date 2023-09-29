import "./App.css";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/Admin/AdminLogin";
import UserLogin from "./pages/User/userLogin";

import Home from "./pages/Home";
import AdminPage from "./pages/Admin/AdminPage";
import AddUser from "./pages/Admin/dashboard/addUser";
import ViewUser from "./pages/Admin/dashboard/viewUser";
import UserPage from "./pages/User/userPage";
import ViewSelf from "./pages/User/ViewSelf";
import AddProject from "./pages/Admin/dashboard/addProject";
import ViewProject from "./pages/Admin/dashboard/viewProject";
import AddLetter from "./pages/Admin/dashboard/addLetter";
import ViewLetter from "./pages/Admin/dashboard/viewLetter";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<userLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/adminPage" element={<AdminPage />} />
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/viewUser" element={<ViewUser />} />
        <Route path="/userPage" element={<UserPage />} />
        <Route path="/ViewSelf" element={<ViewSelf />} />
        <Route path="/addProject" element={<AddProject />} />
        <Route path="/viewProject" element={<ViewProject />} />
        <Route path="/addLetter" element={<AddLetter />} />
        <Route path="/viewLetter" element={<ViewLetter />} />
      </Routes>
    </div>
  );
}

export default App;
