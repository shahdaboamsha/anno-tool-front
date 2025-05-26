import axios from "axios";

class SessionController {

  static getAuthorization() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }
    return headers
  }

  static async refreshToken() {

    try {
      const headers = this.getAuthorization()
      const newToken = await axios.get(`${import.meta.env.VITE_API_URL}/auth/refreshToken`, { headers })
      localStorage.setItem("ACCESS_TOKEN", newToken.data.token)
      
      return ""
    } catch (error) {
      console.error("Error refreshing token:", error)
      return error
    }
  }
}

export default SessionController
