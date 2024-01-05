import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../components/Context';
import { ApiResponse } from '../../../utils/interface';
import Navbar from '../components/Navbar'
import axiosInstance from '../components/AxiosInstance';

function Settings() {
  const apiURL = import.meta.env.VITE_APP_API_BASE_URL;
  const reloginApiURL = apiURL + '/relogin';
  const navigate = useNavigate();
  const userContext = useContext(AuthContext);
  const user = userContext.currentUser;

  async function handleRelogin() {
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
  useEffect(() => {
    handleRelogin();
  },)

  return (
    <>
      <Navbar></Navbar>
      <div className="container pt-28">
        <div className='text-center lato text-5xl'>Settings</div>
        <ul>
          <li>Username:{user && user.username} <a href="/changeUsername">Change Username</a></li>
          <li>Password:<a href="/changePassword">Change Username</a></li>
          <li>Bio: <a href="/changeBio">Change Username</a></li>
        </ul>
      </div>
    </>
  )
}

export default Settings
