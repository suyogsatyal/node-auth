import { useNavigate } from 'react-router';
import { AuthContext } from '../components/Context';
import { useContext } from 'react';
import UserIcon from './assets/user.svg'
import LogoutIcon from './assets/logout.svg'
import AdminIcon from './assets/admin.svg'
import SettingsIcon from './assets/gear.svg'

export default function Navbar() {
  const userContext = useContext(AuthContext);
  const currentUser = (userContext.currentUser)
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }
  return (
    <div className=" absolute w-full max-h-24 overflow-visible bg-slate-800 border-b-[1px] border-gray-400 flex p-7">
      <div className="container">
        <nav className="flex w-full items-center flex-wrap justify-between relative">
          <div>{currentUser&& <div>Hello {currentUser.username}</div>}</div>
          <div className='absolute right-0 -top-4 grid grid-cols-1 items-center justify-center lato group cursor-pointer'>
            <div className='flex flex-row px-3 justify-center items-center py-2 border-[1px] border-gray-400 rounded-xl group-hover:rounded-br-none group-hover:rounded-bl-none'><img src={UserIcon} alt="" className=' w-10' /> {currentUser && <p>{currentUser.username}</p>}</div>
            {currentUser && currentUser.admin_access ===  1  && <a href='/dashboard' className=' bg-slate-800 hover:bg-slate-700 flex-row hidden group-hover:flex items-center justify-center w-full text-center py-3 border-[1px] border-gray-400'><img src={AdminIcon} className='w-6 fill-white stroke-white'/>&nbsp;Dashboard</a>  }
            <a href='/settings' className=' bg-slate-800 hover:bg-slate-700 flex-row hidden group-hover:flex items-center justify-center w-full text-center py-3 border-[1px] border-gray-400'><img src={SettingsIcon} className='w-6 fill-white stroke-white'/>&nbsp;Setting</a>  
            <div className=' bg-slate-800 hover:bg-slate-700 flex-row hidden group-hover:flex items-center justify-center w-full text-center py-3 rounded-br-xl rounded-bl-xl border-[1px] border-gray-400' onClick={handleLogout}><img src={LogoutIcon} className='w-6'/>&nbsp;Logout</div>
          </div>
        </nav>
      </div>
    </div>
  )
}
