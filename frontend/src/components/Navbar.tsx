import { useNavigate } from 'react-router';
import { AuthContext } from '../components/Context';
import { useContext } from 'react';

export default function Navbar() {
  const userContext = useContext(AuthContext);
  console.log(userContext);
  const currentUser = (userContext.currentUser)
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }
  return (
    <div className=" absolute w-full bg-slate-800 border-b-[1px] border-gray-400 flex p-7">
      <div className="container">
        <nav className="flex w-full flex-wrap item-center justify-between">
          <div>{currentUser&& <div>Hello {currentUser.username}</div>}</div>
          <div className=' cursor-pointer'><div onClick={handleLogout}>Logout</div></div>
        </nav>
      </div>
    </div>
  )
}
