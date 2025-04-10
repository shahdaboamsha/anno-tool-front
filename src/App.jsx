import SigninPage from "./pages/Signin/SigninPage"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from "./pages/Signup/SignupPage"
import UploadAnnotationDialog from "./components/Dialog"
import HomePage from "./pages/Home/HomePage"
import UploadFileStepper from "./components/UploadFileFormStepper"
import ForgotPasswordPage from "./pages/Forgot/ForgotPasswordPage"
import Dashboard from "./pages/User Dashboard/Dashboard"
import Loader from "./components/Loader"
import './App.css'
import './index.css'
import FormHeader from "./components/style_modules/FormHeader"
import AnnotationForm from "./components/AnnotationForm"
import { Button } from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from "react"
import InnerLoader from "./components/style_modules/InnerLoader"

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ffffff',
    },
    text: {
      primary: '#000000',
    },
    background: {
      default: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#000000', // Set the text color of the buttons to black or any other color
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#000000', // Set the text color of the buttons to black or any other color
        },
      },
    }
  },
});


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0b132b'
    },
    text: {
      primary: '#0000000',
    },
    background: {
      default: '#0b132b',
      paper: '#1f1f1f',
    }
  },

})

// App function
function App() {

  const [mode, setMode] = useState('light')

  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }

  document.title = "Annotator tool"
  return (
    <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
      <Router>
        <Routes>
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/upload" element={<UploadAnnotationDialog />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/stepper" element={<UploadFileStepper />} />
          <Route path="/recover" element={<ForgotPasswordPage />} />

          <Route path="/dashboard" element={<Dashboard mode={mode} toggleMode={toggleMode} />} >

            <Route path="overview" element={<h1>Over view</h1>} />
            <Route path="new" element={<AnnotationForm mode={mode} toggleMode={toggleMode} />} />
            <Route path="loader" element={<InnerLoader />} />
          </Route>

          <Route path="/loader" element={<InnerLoader />} />
        </Routes>
      </Router >
    </ThemeProvider>
  )
}
/*  

<Route path="/user/my/*" element={<Dashboard />} />*/
export default App