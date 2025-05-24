import axios from "axios";

class SessionController {

  static #URL = import.meta.env.VITE_API_URL

  static getAuthorization() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }
    return headers
  }

  static async refreshToken() {

    try {
      
      axios.defaults.withCredentials = true
      const headers = this.getAuthorization()
      const newToken = await axios.post(`${SessionController.#URL}/session/refresh`, {}, { headers })
      localStorage.setItem("ACCESS_TOKEN", newToken.data.token)

    } catch (error) {
      return error
    }
  }
}

export default SessionController
