import axios from "axios"
import InnerLoader from "../style_modules/InnerLoader"
import { useState, useEffect } from "react"
import FormHeader from "../style_modules/FormHeader"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import SharedUsersList from "./SharedUsersList";
import InputText from "../InputText";
import { Input } from "postcss";

export default function ShareTaskForm({ taskName, nextState, taskId }) {

    const [searchResult, setSearchResult] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [usersWithAccess, setUsersWithAccess] = useState([
        {
            userName: "Shahd Mohammad",
            email: "shahd2025@gmail.com"
        },
        {
            userName: "Ghassan Amous",
            email: "gasanamous@gmail.com"
        },
        {
            userName: "Another User",
            email: "another@example.com"
        },
        {
            userName: "Shahd Mohammad",
            email: "shahd2025@gmail.com"
        },
        {
            userName: "Ghassan Amous",
            email: "gasanamous@gmail.com"
        },
        {
            userName: "Another User",
            email: "another@example.com"
        }
    ])
    const [message, setMessage] = useState({ value: "" })

    useEffect(() => {
        const getUsersWithAccess = async () => {
            try {
                const url = `http://localhost:3000/tasks/getshared/${taskId}`

                const result = (await axios.get(url)).data

                setUsersWithAccess(result)

            } catch (error) {
                console.error(error)
            }
        };
        getUsersWithAccess()
    }, [nextState]);

    const handleSelectedUsers = (e, value) => {
        setSelectedUsers(value)
    }

    const search = async (e) => {
        axios.defaults.withCredentials = true
        try {
            //   const query = `query=${e.target.value}`

            const query = `email=${e.target.value}`

            const url = `http://localhost:3000/tasks/search?${query}`

            const result = (await axios.get(url)).data

            // Filter out users who are already selected
            const filteredResult = result.filter(
                (user) => !selectedUsers.some(selected => selected.email === user.email)
            )

            setSearchResult(filteredResult)

        } catch (error) {
            console.log(error.message)
        }
    }

    const sendShareRequest = () => {
        console.log(selectedUsers, message.value)
    }

    const messageBlurHandler = (e) => {
        const { value } = e.target.value

        if (value.trim() === "") {
            setMessage({ ...message, errorMsg: "Please " })
        }
    }

    return (
        <div className="lg:w-[500px]">
            <FormHeader title={`Share "${taskName}"`} start text="Invite users to collaborate on your task by sending them access requests. Simply select the individuals you wish to share the task with and start working together seamlessly" />

            <Autocomplete
                multiple
                id="user-search"
                fullWidth
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
                value={message.value}
                validation_error={null}
                blurHandler={(event, target, value) => { }}
                changeHandler={(e) => setMessage({ value: e.target.value })}
            />
            <Button
                variant='contained'
                size='small'
                sx={{
                    textTransform: 'none',
                    width: { lg: '50%', sm: '100%', xs: '100%', xl: '40%' },
                    bgcolor: 'var(--dark-bg)',
                    color: 'white',
                    float: 'right'
                }}
                onClick={sendShareRequest}
            >
                Send invite
            </Button>

            <h1 className="text-[18px] mb-0 mt-15">{usersWithAccess.length != 0 && "This task is shared with"}</h1>
            {usersWithAccess.length == 0 && <h1 className="text-[18px] mb-0 mt-15">"This task is not shared to any user yet"</h1>}
            {usersWithAccess.length != 0 &&
                <div
                    className="border border-gray-200 overflow-y-auto"
                    style={{ maxHeight: window.innerWidth > 500 ? '300px' : 'none' }}
                >
                    <SharedUsersList taskId={taskId} sharedUsers={usersWithAccess} />
                </div>
            }
            {usersWithAccess.length == 0 &&
                <div className='font-4px mt-2 flex shadow flex-col justify-start items-start text-center'>
                    <button className="text-[14px] text-blue-500" onClick={(e) => document.getElementById('user-search').focus()}>share</button>
                </div>
            }

        </div>
    );
}

