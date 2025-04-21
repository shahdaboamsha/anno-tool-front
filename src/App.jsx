import SigninPage from "./pages/Signin/SigninPage"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from "./pages/Signup/SignupPage"
import UploadAnnotationDialog from "./components/Dialog"
import HomePage from "./pages/Home/HomePage"
import UploadFileStepper from "./components/UploadFileFormStepper"
import ForgotPasswordPage from "./pages/Forgot/ForgotPasswordPage"
import Dashboard from "./pages/User Dashboard/Dashboard"
import './App.css'
import './index.css'
import AnnotationForm from "./components/AnnotationForm"
import InnerLoader from './components/InnerLoader'
import UserTasks from "./components/UserTasks"
import ViewTask from "./components/Tasks/ViewTask"
import ShareRequestCard from "./components/Tasks/ShareRequestCards"
import UserAccountSettings from "./components/UserAccountSettings"
import UserAccountSecurity from "./components/UserAccountSecurity"

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
          <Route path="/recover" element={<ForgotPasswordPage />} />
          <Route path="/card" element={<ShareRequestCard />} />

          <Route path="/dashboard" element={<Dashboard   />} >
            <Route path="overview" element={<h1>Over view</h1>} />
            <Route path="new" element={<AnnotationForm />} />
            <Route path="loader" element={<InnerLoader />} />
            <Route path="taskslist" element={<UserTasks />} />
            <Route path="account" element={<UserAccountSettings />}/>
            <Route path="security" element={<UserAccountSecurity />}/>
            <Route path="viewtask" element={<ViewTask />}>
              <Route path="details" element={<h1>HI hi hi</h1>} />
            </Route>

          </Route>

          <Route path="/loader" element={<InnerLoader />} />
        </Routes>
      </Router >
  )
}
/*  

<Route path="/user/my/*" element={<Dashboard />} />*/
export default App