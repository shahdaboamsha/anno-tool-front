import { Divider, Button, Avatar, IconButton } from "@mui/material"
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MessageIcon from '@mui/icons-material/Message';
import React, { useEffect, useState } from "react";
import ShareIcon from '@mui/icons-material/Share';
import axios from "axios";
import InnerLoader from "../InnerLoader";
import { useRef } from "react";

function formatDateToLong(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
}


export default function ShareRequestCards({ shareRequests, loading, setShareRequests }) {

    const [processLoading, setLoading] = useState(false)

    const boxRef = useRef(null)

    const handleRequest = async (request, action) => {

        try {
            setLoading(true)
            const url = `http://localhost:3000/tasks/invitations/${request.invitation_id}/${action}`
            const headers = {
                'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
            }
            await axios.post(url, {}, { headers: headers })
            setShareRequests(shareRequests.filter(req => req.invitation_id != request.invitation_id))

        } catch (error) {
            if (error.status == 401) {
                localStorage.removeItem('ACCESS_TOKEN')
                navigate('/signin', { state: { message: "Session expired, Sign in to continue" } })
            }
            console.log(error)
        }
        setLoading(false)

    }

    return (
        <>
            {loading ? <InnerLoader /> :
                <div className="p-2 lg:w-[500px]">
                    <h1 className="text-[18px] mb-2"> <ShareIcon color="action" /> Sharing Requests</h1>
                    <Divider />

                    {shareRequests.length != 0 ? shareRequests.map((req, index) => (
                        <React.Fragment key={index}>
                            <div className="m-2 border-gray-600 flex" id={req.invitation_id} ref={boxRef}>

                                <div className="flex items-center">
                                    <Avatar sx={{ height: 40, width: 40 }} />
                                </div>

                                <div className="text-[14px] flex flex-col justify-start pl-2  flex-wrap">
                                    <h1>{req.sender.name}</h1>
                                    <h1 className="text-[12px] text-gray-500">{formatDateToLong(req.created_at)}</h1>
                                </div>

                                <div className="flex justify-end items-center gap-3  grow">
                                    <IconButton><MessageIcon color="action" fontSize="small" /></IconButton>
                                    <Button
                                        endIcon={<CheckIcon />}
                                        color="success"
                                        size="small"
                                        variant="contained"
                                        sx={{ textTransform: 'none', height: '35px' }}
                                        onClick={() => handleRequest(req, 'accept')}
                                        loading={processLoading}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        endIcon={<CloseIcon />}
                                        color="error"
                                        size="small"
                                        variant="outlined"
                                        sx={{ textTransform: 'none', height: '35px' }}
                                        onClick={() => handleRequest(req, 'reject')}
                                        loading={processLoading}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                            <Divider />
                        </React.Fragment>
                    )) : <h1 className="p-3">No sharing requests</h1>
                    }
                </div>
            }
        </>
    )
}