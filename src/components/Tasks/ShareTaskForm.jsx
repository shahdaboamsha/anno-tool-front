import axios from "axios"
import InnerLoader from "../style_modules/InnerLoader"
import { useState, useEffect } from "react"
import FormHeader from "../style_modules/FormHeader"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Alert, Button } from "@mui/material";
import SharedUsersList from "./SharedUsersList";
import InputText from "../InputText";
import { useNavigate } from "react-router-dom";

export default function ShareTaskForm({ taskName, nextState, taskId }) {

    const navigate = useNavigate()
    const [searchResult, setSearchResult] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [usersWithAccess, setUsersWithAccess] = useState([])
    const [message, setMessage] = useState("")
    const [invitationResult, setInvitationResult] = useState(null)

    const [invitationLoading, setInvitationLoading] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [sharedUsersLoading, setSharedUsersLoading] = useState(true)

    useEffect(() => {
        const getUsersWithAccess = async () => {
            try {
                setSharedUsersLoading(true)
                const url = `http://localhost:3000/tasks/${taskId}/collaborators`
                const token = localStorage.getItem('ACCESS_TOKEN')
                const headers = {
                    'Authorization': `Bearer ${token}`
                }

                const result = (await axios.get(url, { headers: headers })).data
                setUsersWithAccess(result.people_with_access)
            } catch (error) {
                if (error.code == "ERR_NETWORK") {
                    setMessage({ message: 'Unable to connect to server' })
                }
                else if (error.status === 401) {
                    navigate('/signin', { state: { message: "Access Denied" } })
                }
                else {
                    setMessage({ message: 'Oops, an error occured during the process, please try again' })
                }
            }
            setSharedUsersLoading(false)
        }
        getUsersWithAccess()

    }, [nextState]);

    const handleSelectedUsers = (e, value) => {
        setSelectedUsers(value)
    }

    const search = async (e) => {
        axios.defaults.withCredentials = true
        try {
            setSearchLoading(true)
            const query = `query=${e.target.value}`
            const url = `http://localhost:3000/tasks/search?${query}`

            const result = (await axios.get(url)).data

            // Filter out users who are already selected
            const filteredResult = result.filter(
                (user) => !selectedUsers.some(selected => selected.email === user.email)
            )
            setSearchResult(filteredResult)

        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                setMessage({ message: 'Unable to connect to server' })
            }
            else if (error.status === 401) {
                navigate('/signin', { state: { message: "Access Denied" } })
            }
            else {
                setMessage({ message: 'Oops, an error occured during the process, please try again' })
            }
        }
        setSearchLoading(false)
    }

    const sendShareRequest = async () => {

        if (selectedUsers.length === 0) {
            document.getElementById("user-search").focus()
            return
        }
        try {
            setInvitationLoading(true)
            const url = `http://localhost:3000/tasks/${taskId}/invite`
            const token = localStorage.getItem('ACCESS_TOKEN')
            const headers = {
                'Authorization': `Bearer ${token}`
            }


            const result = (await axios.post(url, { selectedUsers, message }, { headers })).data
            setInvitationResult(result.message)

        } catch (error) {

            if (error.code == "ERR_NETWORK") {
                setInvitationResult("Unable to connect to server")
            }
            else if (error.status === 401) {
                localStorage.removeItem('ACCESS_TOKEN')
                navigate('/signin', { state: { message: "Access Denied" } })
            }
            else if (error.status === 500) {
                setInvitationResult("Oops, an error occured during the process, try again")
            }
        }
        setInvitationLoading(false)
    }


    return (
        <div className="lg:w-[500px]">
            <FormHeader title={`Share ${taskName}`} start text="Invite users to collaborate on your task by sending them access requests" />
            {invitationResult ? <Alert severity='error'>{invitationResult}</Alert> : ""}

            <Autocomplete
                multiple
                id="user-search"
                fullWidth
                loading={searchLoading}
                options={searchResult}
                getOptionLabel={(option) => option.email}
                onChange={handleSelectedUsers}
                filterSelectedOptions
                sx={{
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--dark-bg)",
                    },
                    mt: 1,
                    mb: 2
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        placeholder="Search by email"
                        variant="outlined"
                        onChange={search}
                    />
                )}
            />
            <InputText
                name='shareRequest'
                variant='outlined'
                title="Message"
                placeholder='Write a invite message (Optional)'
                mutiline
                fullWidth
                size="large"
                value={message}
                validation_error={null}
                blurHandler={(event, target, value) => { }}
                changeHandler={(e) => setMessage(e.target.value)}
            />
            <Button
                variant='contained'
                size='small'
                loading={invitationLoading}
                sx={{
                    textTransform: 'none',
                    width: { lg: '50%', sm: '50%', xs: '100%', xl: '40%' },
                    bgcolor: 'var(--dark-bg)',
                    color: 'white',
                    float: 'right'
                }}
                onClick={sendShareRequest}
            >
                Send invite
            </Button>
            {
                sharedUsersLoading ? <InnerLoader /> :
                    <h1 className="text-[16px] mb-0 mt-15">
                        {usersWithAccess.length != 0 ? "This task is shared with" : "This task is not shared to any user yet"}
                    </h1>
            }

            {usersWithAccess.length != 0 &&
                <div className="border border-gray-200 overflow-y-auto" style={{ maxHeight: window.innerWidth > 500 ? '300px' : 'none' }}>
                    <SharedUsersList taskId={taskId} sharedUsers={usersWithAccess} />
                </div>
            }

        </div>
    );
}

