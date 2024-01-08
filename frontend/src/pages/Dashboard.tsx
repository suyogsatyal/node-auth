import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../components/Context';
import { DashboardDataFormat, ApiResponse } from '../../../utils/interface';
import Navbar from '../components/Navbar'
import axiosInstance from '../components/AxiosInstance';

function Dashboard() {
    const apiURL = import.meta.env.VITE_APP_API_BASE_URL;
    const reloginApiURL = apiURL + '/relogin';
    const dashboardDataURL = apiURL + '/dashboard';
    const [dashboardData, setDashboardData] = useState<DashboardDataFormat[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userContext = useContext(AuthContext);
    // const user = userContext.currentUser;

    async function handleRelogin() {
        // const token = { token: jwtToken }

        try {
            const response = await axiosInstance.post<ApiResponse>(reloginApiURL)

            if (response.data.success) {
                userContext.setCurrentUser(response.data.data)
            } else {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
        catch (error) {
            console.error(error)
            localStorage.removeItem('token');
            navigate('/login');
        }
    }

    async function AdminValidation() {
        try {
            const adminResponse = await axiosInstance.post<ApiResponse>(dashboardDataURL)
            console.log(adminResponse);
            setDashboardData(adminResponse.data.data)
        }
        catch (error) {
            navigate('/settings');
            setLoading(false)
            console.error(error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        AdminValidation();
        handleRelogin();
        console.log(dashboardData)
    }, [])

    if (loading) {
        return (
            <>
                {/* <Navbar></Navbar> */}
                Loading
            </>
        )
    }

    return (
        <>
            <Navbar></Navbar>
            <div className="container pt-28">
                <div className='text-center lato text-5xl'>Dashboard</div>
                <div>{<div>{dashboardData[1].username}</div>}</div>
            </div>
        </>
    )
}

export default Dashboard
