import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from './components/Context';
import { ApiResponse } from '../../utils/interface';
import Navbar from './components/Navbar'
import axiosInstance from './components/AxiosInstance';

function App() {
  const apiURL = import.meta.env.VITE_APP_API_BASE_URL;
  const reloginApiURL = apiURL + '/relogin';
  const navigate = useNavigate();
  const userContext = useContext(AuthContext);

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
      <div className="container pt-16">
        <div className='pt-64'>hello</div>
      </div>
    </>
  )
}

export default App
