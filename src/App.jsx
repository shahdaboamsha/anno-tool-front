import SigninPage from "./pages/Signin/SigninPage"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from "./pages/Signup/SignupPage"
import HomePage from "./pages/Home/HomePage"
import ForgotPasswordPage from "./pages/Forgot/ForgotPasswordPage"
import Dashboard from "./pages/User Dashboard/Dashboard"
import './App.css'
import './index.css'
import './components/style_modules/styles.css'
import AnnotationForm from "./components/Sidebar/CreateTask"
import InnerLoader from './components/Loaders/InnerLoader'
import UserTasks from "./components/Sidebar/UserTasks"
import ViewTask from './components/Tasks/ViewTask'
import UserAccountSettings from "./components/Sidebar/UserAccountSettings"
import UserAccountSecurity from "./components/Sidebar/UserAccountSecurity"
import Overview from "./components/Sidebar/Overview"

function App() {
  document.title = "Annotation Tool"
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/recover" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<Dashboard />} >
          <Route path="overview" element={<Overview />} />
          <Route path="new" element={<AnnotationForm />} />
          <Route path="loader" element={<InnerLoader />} />
          <Route path="taskslist" element={<UserTasks />} />
          <Route path="account" element={<UserAccountSettings />} />
          <Route path="security" element={<UserAccountSecurity />} />
          <Route path="viewtask" element={<ViewTask />}>
            <Route path="details" element={<h1>HI hi hi</h1>} />
          </Route>
        </Route>
      </Routes>
    </Router >
  )
}
/*  

<Route path="/user/my/*" element={<Dashboard />} />*/
export default App