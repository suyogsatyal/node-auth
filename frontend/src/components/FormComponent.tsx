import { useLocation } from 'react-router-dom';

export default function LogSignForm() {
    const location = useLocation().pathname.slice(1);
    console.log(location);
    return (
        <div className="flex flex-col justify-center items-center w-lvw overflow-hidden">
            <form action="" className=' border-2 py-12 px-8 text-center'>
                <h1 className=' text-3xl py-6 capitalize'>{location} Form</h1>
                <div className="inputGroup mx-0 my-4 w-64 relative">
                    <input type="text" className=' p-3 outline-none border-2 border-gray-400 bg-transparent rounded-lg w-full' required autoComplete='off' />
                    <label htmlFor="name" className='absolute left-0 p-3 ml-2 pointer-events-none duration-200 ease-in-out text-slate-300'>Username</label>
                </div>
                <div className="inputGroup mx-0 my-4 w-64 relative">
                    <input type="password" className=' p-3 outline-none border-2 border-gray-400 bg-transparent rounded-lg w-full' required autoComplete='off' />
                    <label htmlFor="password" className='absolute left-0 p-3 ml-2 pointer-events-none duration-200 ease-in-out text-slate-300'>Password</label>
                </div>
                {location === 'signup' && (
                    <div className="inputGroup mx-0 my-4 w-64 relative">
                        <input type="password" className='p-3 outline-none border-2 border-gray-400 bg-transparent rounded-lg w-full' required autoComplete='off'/>
                        <label htmlFor="password" className='absolute left-0 p-3 ml-2 pointer-events-none duration-200 ease-in-out text-slate-300'>
                            Confirm Password
                        </label>
                    </div>
                )}

                <button className="relative group cursor-pointer text-sky-50  overflow-hidden h-12 w-64 rounded-md bg-sky-900 p-2 flex justify-center items-center font-extrabold">
                    <div className="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-40 h-40 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-sky-950"></div>
                    <div className="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-32 h-32 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-sky-900"></div>
                    <div className="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-24 h-24 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-sky-800"></div>
                    <div className="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-14 h-14 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-sky-700"></div>
                    <p className="z-10 uppercase">{location}</p>
                </button>
                {location === 'login' && (<p className='py-4'>Not registered yet? <a href="/signup" className='text-blue-400'>Signup</a></p>)}
            </form>
        </div>
    )
}
