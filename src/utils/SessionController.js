import axios from "axios";
import path from 'path'
import fs from 'fs'

class SessionController {

  static getAuthorization() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }
    return headers
  }

  static async refreshToken() {

    try {

      axios.defaults.withCredentials = true
      const headers = this.getAuthorization()
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refreshToken`, { headers })
      
      localStorage.clear()
      localStorage.setItem("ACCESS_TOKEN", data.token)
      
      return ""
      
    } catch (error) {
      return new Error()
    }
  }
}

export default SessionController
