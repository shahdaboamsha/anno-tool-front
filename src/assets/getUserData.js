import axios from "axios"
import SERVER_HOST from "./serverInfo"

// get user data using axios 
const getUserData = async () => {
    axios.defaults.withCredentials = true
    try {
        const response = await axios.post(`${SERVER_HOST}/user/get_user_data`, {}, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`
            }
        })

        return response
    } catch (error) {
        if (error.code == "ERR_BAD_REQUEST" && error.status === 401) {
            // user unathorized? 
            try {
                // try to refresh the session
                const refreshSessionResponse = await refreshSession()
                return refreshSessionResponse
            } catch (error) {
                // session refreshing failed? throw the error to the function which called getUserData()
                throw error
            }
        }

        throw error

    }

}

// refresh the session which user unauthorized,by request the api 192.168.1.X:3000/user/session/refresh_session
const refreshSession = async () => {
    axios.defaults.withCredentials = true
    try {
        const response = await axios.post(`${SERVER_HOST}/user/session/refresh_session`)
        return response
    } catch (error) {
        // error while refreshing the session , cookie session either expired or invalid.
        throw error
    }
}

export { getUserData, refreshSession }
