import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Navbar from './components/Navbar'

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    console.log(jwtToken);

    if (!jwtToken) {
      navigate('/login');
    }
  }, [])
  
  return (
    <>
      <Navbar></Navbar>
      <div className="container">
        Hello
      </div>
    </>
  )
}

export default App
