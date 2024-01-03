import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../components/Context';
import { ApiResponse } from '../../../utils/interface';
import Navbar from '../components/Navbar'
import axiosInstance from '../components/AxiosInstance';

function Dashboard() {
    const apiURL = import.meta.env.VITE_APP_API_BASE_URL;
    const reloginApiURL = apiURL + '/relogin';
    const dashboardDataURL = apiURL + '/dashboard';
    const [dashboardData, setDashboardData] = useState<any>([{}])
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
            // const ;
            setDashboardData(adminResponse.data.data)
        }
        catch (error) {
            console.error(error)
            navigate('/settings');
        }
    }
    useEffect(() => {
            handleRelogin();
            AdminValidation();
    },[])

    return (
        <>
            <Navbar></Navbar>
            <div className="container pt-28">
                <div className='text-center lato text-5xl'>Dashboard</div>
                <div>{dashboardData && <div>{dashboardData[1].username}</div>}</div>
            </div>
        </>
    )
}

export default Dashboard
