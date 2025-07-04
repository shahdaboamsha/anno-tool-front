import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import UsersManagement from '../Admin/UsersManagement';
import TasksManagement from '../Admin/TasksManagement';
import axios from 'axios';
axios.defaults.withCredentials = true;
import InnerLoader from '../../components/Loaders/InnerLoader'
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import SessionController from '../../utils/SessionController';

function CustomTabPanel(props) {

    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function AdminDashboard() {

    const navigate = useNavigate()

    const [data, setData] = useState({ tasks: [], users: [] })

    const [isDataChanged, setIsDataChanged] = useState(false)
    const notifyChanges = () => setIsDataChanged(prev => !prev)

    const [loading, setLoading] = useState(true)

    const { userData } = useOutletContext();

    useEffect(() => {

        if (!userData || userData.role !== 'admin') {
            alert("You are not authorized to access this page.")
            navigate('/dashboard/overview')
            return
        }

        const fetchAllData = async () => {

            
            const url = `${import.meta.env.VITE_API_URL}/admin/data`
            const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }
            try {

                const fetchedData = await axios.get(url, { headers: headers })
                setData(fetchedData.data)

            } catch (error) {
                
                if (error.response && error.response.status === 401) {
                    const refreshError = await SessionController.refreshToken()
                    if (refreshError instanceof Error) {
                        localStorage.removeItem('ACCESS_TOKEN')
                        navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG } })
                    } else {
                        await fetchAllData()
                    }
                }
                else {
                    alert("An error occurred while fetching data. Please try again later.")
                }
            } finally {
                setLoading(false)
            }

        }
        fetchAllData()
    }, [isDataChanged])

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            {loading ? <InnerLoader /> : <Box sx={{ pt: 1, pl: 1 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Users Management" {...a11yProps(0)} sx={{ textTransform: 'none' }} />
                        <Tab label="Tasks Management" {...a11yProps(1)} sx={{ textTransform: 'none' }} />
                    </Tabs>
                </Box>

                <CustomTabPanel value={value} index={0}>
                    <UsersManagement users={data.users} notifyChanges={notifyChanges} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <TasksManagement tasks={data.tasks} notifyChanges={notifyChanges} />
                </CustomTabPanel>
            </Box>
            }
        </>
    );
}