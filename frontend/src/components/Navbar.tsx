import { useNavigate } from 'react-router';

export default function Navbar() {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }
  return (
    <div className=" absolute w-full bg-slate-800 border-b-[1px] border-gray-400 flex p-7">
      <div className="container">
        <nav className="flex-row content-between">
          <div>Navbar</div>
          <div onClick={handleLogout}>Logout</div>
        </nav>
      </div>
    </div>
  )
}
