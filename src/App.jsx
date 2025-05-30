import SigninPage from "./pages/Signin/SigninPage"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from "./pages/Signup/SignupPage"
import HomePage from "./pages/Home/HomePage"
import ForgotPasswordPage from "./pages/Forgot/ForgotPasswordPage"
import VerifyCode from "./pages/Forgot/VerifyCode"
import ResetPassword from "./pages/Forgot/ResetPassword"
import Dashboard from "./pages/User Dashboard/Dashboard"
import AdminDashboard from "./components/Sidebar/AdminDashboard"
import './App.css'
import './index.css'
import './components/style_modules/styles.css'
import CreateTask from "./components/Sidebar/CreateTask"
import UserTasks from "./components/Sidebar/UserTasks"
import ViewTask from './components/Tasks/ViewTask'
import UserAccountSettings from "./components/Sidebar/UserAccountSettings"
import UserAccountSecurity from "./components/Sidebar/UserAccountSecurity"
import Overview from "./components/Sidebar/Overview"
import PageNotFound from "./pages/PageNotFound"
import DashboardLayout from "./components/Layout/DashboardLayout"

function App() {
  document.title = "Annotation Tool"
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/recover" element={<ForgotPasswordPage />} />
        <Route path="/recover/verify" element={<VerifyCode />} />
        <Route path="/recover/reset" element={<ResetPassword />} />

        <Route path="/dashboard" element={<DashboardLayout />} >
          <Route path="administration" element={<AdminDashboard />} />
          <Route path="overview" element={<Overview />} />
          <Route path="new" element={<CreateTask />} />
          <Route path="taskslist" element={<UserTasks />} />
          <Route path="account" element={<UserAccountSettings />} />
          <Route path="security" element={<UserAccountSecurity />} />
          <Route path="viewtask" element={<ViewTask />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router >
  )
}
/*  

<Route path="/user/my/*" element={<Dashboard />} />*/
export default App