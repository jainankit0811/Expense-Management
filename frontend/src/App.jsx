import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import ResetPassword from "./pages/ResetPassword";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyOTP from "./pages/VerifyOTP";
export const serverURL = "http://localhost:8000";

function App() {
  useGetCurrentUser();
  const { userData } = useSelector(state => state.user)

  return (
    <div>
      <Routes>
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={'/'} />} />
        <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={'/'} />} />
        <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to={'/'} />} />
        <Route path='/' element={userData ? <Home /> : <Navigate to={'/signin'} />} />
        <Route path='/verify-otp' element={!userData ? <VerifyOTP /> : <Navigate to={'/'} />} />
        <Route path='/reset-password' element={!userData ? <ResetPassword /> : <Navigate to={'/'} />} />
      </Routes>
    </div>
  );
}

export default App;