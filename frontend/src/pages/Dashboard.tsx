import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../components/Context';
import { DashboardDataFormat, ApiResponse } from '../../../utils/interface';
import Navbar from '../components/Navbar'
import axiosInstance from '../components/AxiosInstance';
import axios from 'axios';

function Dashboard() {
    const apiURL = import.meta.env.VITE_APP_API_BASE_URL;
    const reloginApiURL = apiURL + '/relogin';
    const dashboardDataURL = apiURL + '/dashboard';
    const dashboardAllEntryURL = apiURL + '/allEntryData';
    const [dashboardData, setDashboardData] = useState<DashboardDataFormat>();
    const [entryData, setEntryData] = useState();
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
                // localStorage.removeItem('token');
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
            const adminResponse = await axiosInstance.post<ApiResponse>(dashboardDataURL);
            const allEntryResponse = await axios.get<ApiResponse>(dashboardAllEntryURL);
            console.log(adminResponse);
            setDashboardData(adminResponse.data.data)
            setEntryData(allEntryResponse.data.data)
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
        document.title = 'Admin Dashboard';
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

                <div className='dashboardDetails'>
                    <section className='stats mx-auto w-full lg:w-8/12'>
                        <ul className='flex w-full items-center justify-around py-5'>
                            <li className=' text-center lato text-gray-300 hover:text-gray-100 text-base md:text-xl font-bold bg-slate-800 border-4 border-slate-800 hover:bg-slate-900  cursor-pointer p-2 md:p-5 lg:p-6 rounded-md'>Admins <br />{dashboardData && <div className=' text-2xl'>{dashboardData.admins.length}</div>}</li>
                            <li className=' text-center lato text-gray-300 hover:text-gray-100 text-base md:text-xl font-bold bg-slate-800 border-4 border-slate-800 hover:bg-slate-900  cursor-pointer p-2 md:p-5 lg:p-6 rounded-md'>Contributors <br />{dashboardData && <div className=' text-2xl'>{dashboardData.contributors.length}</div>}</li>
                            <li className=' text-center lato text-gray-300 hover:text-gray-100 text-base md:text-xl font-bold bg-slate-800 border-4 border-slate-800 hover:bg-slate-900  cursor-pointer p-2 md:p-5 lg:p-6 rounded-md'>Viewers <br />{dashboardData && <div className=' text-2xl'>{dashboardData.viewers.length}</div>}</li>
                            <li className=' text-center lato text-gray-300 hover:text-gray-100 text-base md:text-xl font-bold bg-slate-800 border-4 border-slate-800 hover:bg-slate-900  cursor-pointer p-2 md:p-5 lg:p-6 rounded-md'>Entries <br />{dashboardData && <div className=' text-2xl'>{entryData.length}</div>}</li>
                        </ul>
                    </section>
                    <div>{dashboardData && <div>{dashboardData.viewers[0].username}</div>}</div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
