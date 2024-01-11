import { useEffect, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AuthContext } from '../components/Context';
import { DashboardDataFormat, ApiResponse } from '../../../utils/interface';
import Navbar from '../components/Navbar'
import axiosInstance from '../components/AxiosInstance';
import axios from 'axios';


function EditAccess() {
    const apiURL = import.meta.env.VITE_APP_API_BASE_URL;
    const reloginApiURL = apiURL + '/relogin';
    const username = useParams().username;
    const currentUserDataURL = apiURL +'/user/'+ `${username}`;
    const editAccessURL = apiURL + '/editAccess';
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardDataFormat>();
    const navigate = useNavigate();
    const userContext = useContext(AuthContext);

    async function handleRelogin() {
        try {
            const response = await axiosInstance.post<ApiResponse>(reloginApiURL)

            if (response.data.success) {
                const isAdmin = response.data.data.admin_access;
                if (isAdmin!==1) {
                    navigate('/settings');
                }
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



    async function FetchCurrentData() {
        try {
            const response = await axios.get<ApiResponse>(currentUserDataURL);
            console.log(response.data.data);
        }
        catch (error) {
            setLoading(false)
            console.error(error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // document.title = 'Admin Dashboard';
        
        FetchCurrentData();
        handleRelogin();
        setLoading(false);
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
                        <h1 className='lato text-center text-3xl sm:text-5xl'>Edit Access for {username}</h1>
                <div className="row">
                    <div className="col-md-12">
                    </div>
                </div>
                </div>
            </>
            )
}

            export default EditAccess;