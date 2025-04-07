import SigninPage from "./pages/Signin/SigninPage"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from "./pages/Signup/SignupPage"
import UploadAnnotationDialog from "./components/Dialog"
import NavigationBar from "./components/NavigationBar"
import HomePage from "./pages/Home/HomePage"
import UploadFileStepper from "./components/UploadFileFormStepper"
import ForgotPasswordPage from "./pages/Forgot/ForgotPasswordPage"
import Dashboard from './pages/User Dashboard/Dashboard'
import './App.css'

// App function
function App() {
  document.title = "Annotator tool"
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/upload" element={<UploadAnnotationDialog />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/stepper" element={<UploadFileStepper />} />
        <Route path="/recover" element={<ForgotPasswordPage/>}/>
        <Route path="/user/my/*" element={<Dashboard/>}/>
      </Routes>
    </Router>
  )
}

export default App