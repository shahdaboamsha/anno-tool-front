import { useState, useEffect, useMemo } from "react"
import BriefCard from "./BriefCard"
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InnerLoader from "../Loaders/InnerLoader";

export default function Overview() {

    const navigate = useNavigate()
    const [overviewDetails, setOverviewDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [alertMsg, setAlertMsg] = useState({ isError: false, message: null })

    useEffect(() => {
        const url = 'http://localhost:3000/users/task-status'
        const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }

        const getOverviewDetails = async () => {
            try {
                setOverviewDetails((await axios.get(url, { headers: headers })).data.information)
            } catch (error) {
                if (error.code == "ERR_NETWORK") {
                    setAlertMsg({ isError: true, message: "Unable to connect to server" })
                }
                else if (error.response.status == 401) {
                    navigate('/signin', { state: { message: "Session Expired. Sign in to continue" } })
                }
                else {
                    setAlertMsg({ isError: true, message: "Oops! An error occured while connection with server. Try to refresh the page" })
                }
            }
            setLoading(false)
        }
        getOverviewDetails()
    }, [])
    // ownedCompletedTasks
    return (
        <> {loading ? <InnerLoader /> :
            <div className="p-5 flex justify-start gap-5 flex-wrap">
                <BriefCard
                    icon={<AssignmentIcon sx={{ fontSize: '4rem' }} />}
                    title="Owned Tasks"
                    description={`There is ${overviewDetails.ownedTasks} tasks assigned to you`}
                />
                <BriefCard
                    icon={<AssignmentTurnedInIcon sx={{ fontSize: '4rem' }} />}
                    title="Completed tasks"
                    description={`There is a ${overviewDetails.ownedCompletedTasks} tasks completed of your ${overviewDetails.ownedTasks} owned tasks`}
                />
                <BriefCard
                    icon={<GroupsIcon sx={{ fontSize: '4rem' }} />}
                    title="Shared Tasks"
                    description={`There is ${overviewDetails.sharedTasks} tasks shared to you, ${overviewDetails.sharedCompletedTasks} of them are completed`}
                />
            </div>
        }
        </>

    )
}