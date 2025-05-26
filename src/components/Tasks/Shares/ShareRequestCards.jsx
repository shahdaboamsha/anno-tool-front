import { Divider, Button, Avatar, IconButton } from "@mui/material"
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MessageIcon from '@mui/icons-material/Message';
import React, { useEffect, useState } from "react";
import ShareIcon from '@mui/icons-material/Share';
import axios from "axios";
import InnerLoader from "../../Loaders/InnerLoader";
import { Badge, Tooltip } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ResponseMessage from "../../../utils/ResponsesMessage";
import SessionController from "../../../utils/SessionController";
axios.defaults.withCredentials = true;
function formatDateToLong(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
}


export default function ShareRequestCards({ shareRequests, loading, setShareRequests }) {

    const [processLoading, setLoading] = useState(false)
    const [selectedMsg, setSelectedMsg] = useState(null)

    const showMsg = (message) => {
        setSelectedMsg(message)
    }

    const handleRequest = async (request, action) => {

        try {
            setLoading(true)
            const url = `${import.meta.env.VITE_API_URL}/tasks/invitations/${request.invitation_id}/${action}`

            const headers = { 'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }
            await axios.post(url, {}, { headers: headers })
            setShareRequests(shareRequests.filter(req => req.invitation_id != request.invitation_id))

        } catch (error) {
            if (error.status == 401) {
                const refreshError = await SessionController.refreshToken()
                if (refreshError instanceof Error) {
                    localStorage.removeItem('ACCESS_TOKEN')
                    navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG, nextUrl: 'share' } })
                } else {
                    handleRequest(request, action)
                }
            }
        } finally {
            setLoading(false)
        }


    }

    return (
        <>
            {loading ? <InnerLoader /> :
                <div className="p-2 lg:w-[500px]">
                    <h1 className="text-[18px] mb-2"> <ShareIcon color="action" /> Sharing Requests</h1>
                    <Divider />

                    {shareRequests.length != 0 && !selectedMsg ? shareRequests.map((req, index) => (
                        <React.Fragment key={index}>
                            <div className="m-2 border-gray-600 flex" id={req.invitation_id}>

                                <div className="flex items-center">
                                    <Avatar sx={{ height: 40, width: 40 }} />
                                </div>

                                <div className="text-[14px] flex flex-col justify-start pl-2  flex-wrap">
                                    <h1>{req.sender.name}</h1>
                                    <h1 className="text-[12px] text-gray-500">{formatDateToLong(req.created_at)}</h1>
                                </div>

                                <div className="flex justify-end items-center gap-3  grow">
                                    <IconButton onClick={() => showMsg(req.message)}>
                                        <Tooltip title={req.message != "" ? req.message : 'No message'}>

                                            <Badge color={req.message != "" ? 'secondary' : ''} variant='dot'>
                                                <MessageIcon color="action" fontSize="small" />
                                            </Badge>
                                        </Tooltip>
                                    </IconButton>
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
                    )) : (
                        <>
                            <Tooltip title='Back to requests menu' hidden={shareRequests.length == 0}>
                                <IconButton onClick={() => setSelectedMsg(null)}>
                                    <ArrowBackIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <h1 className="p-3">
                                {selectedMsg ? selectedMsg : 'No sharing requests'}
                            </h1>

                        </>

                    )
                    }
                </div>
            }
        </>
    )
}