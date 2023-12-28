import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../components/Context';
import { ApiResponse } from '../../../utils/interface';
import Navbar from '../components/Navbar'
import axios from 'axios';

function Dashboard() {
    const apiURL = import.meta.env.VITE_APP_API_BASE_URL;
    const reloginApiURL = apiURL + '/relogin';
    const adminValidationURL = apiURL + '/isAdmin';
    const navigate = useNavigate();
    const userContext = useContext(AuthContext);
    const user = userContext.currentUser;
    let jwtToken: string | null;

    async function handleRelogin() {
        let token = { token: jwtToken }
        console.log(adminValidationURL)

        try {
            const response = await axios.post<ApiResponse>(reloginApiURL, token,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

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
        let token = { token: jwtToken }
        
        try {
            const adminResponse = await axios.post<ApiResponse>(adminValidationURL, token,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            console.log(adminResponse.data.data)
        }
        catch (error) {
            console.error(error)
            navigate('/settings');
        }
    }
    useEffect(() => {
        jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
            navigate('/login');
        }
        else if (user == null) {
            handleRelogin();
            AdminValidation();
        }
    }, [])

    return (
        <>
            <Navbar></Navbar>
            <div className="container pt-28">
                <div className='text-center lato text-5xl'>Dashboard</div>
            </div>
        </>
    )
}

export default Dashboard
