import axios from "axios"
import InnerLoader from "../../Loaders/InnerLoader"
import { useState, useEffect } from "react"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Alert, Button } from "@mui/material";
import SharedUsersList from "./SharedUsersList";
import InputText from "../../Inputs/InputText";
import { useNavigate } from "react-router-dom";

export default function ShareTaskForm({ taskName, nextState, taskId }) {

    const navigate = useNavigate()
    const [searchResult, setSearchResult] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [usersWithAccess, setUsersWithAccess] = useState([])

    const [alertMsg, setAlertMsg] = useState("")
    const [inviteMessage, setInviteMessage] = useState("")
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
                console.log(error)
                if (error.code == "ERR_NETWORK") {
                    setAlertMsg('Unable to connect to server')
                }
                else if (error.status === 401) {
                    navigate('/signin', { state: { message: "Access Denied" } })
                }
                else {
                    setAlertMsg('Oops! An error occurred while displaying shared users. Try again')
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
            const query = `query=${e.target.value}&&task_id=${taskId}`
            const url = `http://localhost:3000/tasks/search?${query}`
            const token = localStorage.getItem('ACCESS_TOKEN')
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const result = (await axios.get(url, { headers: headers })).data

            // Filter out users who are already selected
            const filteredResult = result.filter(
                (user) => !selectedUsers.some(selected => selected.email === user.email)
            )

            setSearchResult(filteredResult)

        } catch (error) {

            if (error.code == "ERR_NETWORK") {
                setAlertMsg('Unable to connect to server')
            }
            else if (error.response.status === 401) {
                navigate('/signin', { state: { message: "Access Denied" } })
            }
            else if (error.response.status === 400) return
            else {
                setAlertMsg('Oops, an error occured during the process, please try again')
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

            const getSelectedUsersEmails = () => {
                // in selectedUsers hook, users stored as array of objects {user_id, email, name}, this function make a array of just users email
                const emails = []
                for (let user of selectedUsers) {
                    emails.push(user.email)
                }
                return emails
            }

            const emails = getSelectedUsersEmails()
            const message = inviteMessage || "" // rename inviteMessage into message for front-back end implementaion variable names

            const result = (await axios.post(url, { selectedUsers: emails, message }, { headers })).data
            setAlertMsg(result.message)

        } catch (error) {

            if (error.code == "ERR_NETWORK") {
                setAlertMsg("Unable to connect to server")
            }
            else if (error.status === 401) {
                localStorage.removeItem('ACCESS_TOKEN')
                navigate('/signin', { state: { message: "Access Denied" } })
            }
            else if (error.status === 500) {
                setAlertMsg("Oops! An error occurred while submitting the sharing request. Try again")
            }
            console.log(error)
        }
        setInvitationLoading(false)
    }


    return (
        <div className="lg:w-[500px]">
            <h1 className='text-[28px]'> Share your {taskName}</h1>
            <p className='text-gray-500 text-[14px]'>You can give a access for other people to annotate your tasks</p>

            {alertMsg ? <Alert severity={alertMsg != "Invitations sent successfully" ? 'error' : 'success'}>{alertMsg}</Alert> : ""}

            <Autocomplete multiple id="user-search" fullWidth loading={searchLoading} options={searchResult}
                getOptionLabel={(option) => option.email}
                onChange={handleSelectedUsers}
                filterSelectedOptions
                sx={{
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--dark-bg)",
                    }, mt: 1, mb: 2
                }}
                renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth variant="outlined" placeholder="Search by email" onChange={search} />
                )}
            />
            <InputText fullWidth mutiline name='inviteMessage' variant='outlined' title="Message"
                placeholder='Write a invite message (Optional)'
                size="small"
                value={inviteMessage}
                validation_error={null}
                changeHandler={(e) => setInviteMessage(e.target.value)}
            />
            <Button fullWidth variant='contained' size='small'
                loading={invitationLoading}
                sx={{ textTransform: 'none', bgcolor: 'var(--dark-bg)', float: 'right', mt: 1 }}
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

            {
                usersWithAccess.length != 0 &&
                <div className="border border-gray-200 overflow-y-auto" style={{ maxHeight: window.innerWidth > 500 ? '300px' : 'none' }}>
                    <SharedUsersList taskId={taskId} sharedUsers={usersWithAccess} />
                </div>
            }

        </div>
    );
}

