import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../components/Context';
import { DashboardDataFormat, ApiResponse } from '../../../utils/interface';
import Navbar from '../components/Navbar'
import EditIcon from '../components/assets/edit.svg'
import ActiveEditIcon from '../components/assets/editActive.svg'
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

                <div className='dashboardDetails overflow-x-hidden no-scrollbar sm:overflow-x-scroll'>
                    <section className='stats mx-auto w-full lg:w-8/12'>
                        <ul className='flex w-full items-center justify-around py-5 no-scrollbar'>
                            <li className=' text-center lato text-gray-300 hover:text-gray-100 text-base md:text-xl font-bold bg-slate-800 border-4 border-slate-800 hover:bg-slate-900  cursor-pointer p-1 sm:p-2 md:p-5 lg:p-6 rounded-md'>Admins <br />{dashboardData && <div className=' text-2xl'>{dashboardData.admins.length}</div>}</li>
                            <li className=' text-center lato text-gray-300 hover:text-gray-100 text-base md:text-xl font-bold bg-slate-800 border-4 border-slate-800 hover:bg-slate-900  cursor-pointer p-1 sm:p-2 md:p-5 lg:p-6 rounded-md'>Contributors <br />{dashboardData && <div className=' text-2xl'>{dashboardData.contributors.length}</div>}</li>
                            <li className=' text-center lato text-gray-300 hover:text-gray-100 text-base md:text-xl font-bold bg-slate-800 border-4 border-slate-800 hover:bg-slate-900  cursor-pointer p-1 sm:p-2 md:p-5 lg:p-6 rounded-md'>Viewers <br />{dashboardData && <div className=' text-2xl'>{dashboardData.viewers.length}</div>}</li>
                            <li className=' text-center lato text-gray-300 hover:text-gray-100 text-base md:text-xl font-bold bg-slate-800 border-4 border-slate-800 hover:bg-slate-900  cursor-pointer p-1 sm:p-2 md:p-5 lg:p-6 rounded-md'>Entries <br />{dashboardData && <div className=' text-2xl'>{entryData.length}</div>}</li>
                        </ul>
                    </section>

                    <div className='adminSection py-4'>
                        <div className='text-left lato text-3xl'>{dashboardData?.admins.length} Admins</div>
                        <div className='flex flex-col items-center justify-center'>
                            <ul className='bg-gray-600 w-[768px] md:w-full text-center lato text-xl overflow-scroll divide-2 divide-solid divide-gray-500 no-scrollbar'>
                                <li className='grid grid-cols-8 md:grid-cols-10 py-2 divide-x-2 divide-solid divide-gray-500 border-y-2 bg-gray-700 border-gray-500'>
                                    <div className=''>No.</div>
                                    <div className=''>ID</div>
                                    <div className='col-span-3 md:col-span-4'>Username</div>
                                    <div className=''>Admin</div>
                                    <div className='col-span-1 md:col-span-2'>Contributor</div>
                                    <div className=''>Viewer</div>
                                </li>
                                {dashboardData && dashboardData.admins.map((admin, index) => {
                                    return (
                                        <li key={index} className='grid grid-cols-8 md:grid-cols-10  py-2 divide-x-2 group hover:bg-gray-700 divide-solid divide-gray-500 border-y-2 border-gray-500'>
                                            <div className=''>{index+1}</div>
                                            <div className=''>{admin.user_id}</div>
                                            <div className='col-span-3 md:col-span-4'>{admin.username}</div>
                                            <div className=''>{admin.admin_access}</div>
                                            <div className='col-span-1 md:col-span-2'>{admin.contributor_access}</div>
                                            <div className=''>{admin.viewer_access}</div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className='contributorSection py-4'>
                        <div className='text-left lato text-3xl'>{dashboardData?.contributors.length} Contributors</div>
                        <div className='flex flex-col items-center justify-center'>
                            <ul className='bg-gray-600 w-[768px] md:w-full text-center lato text-xl overflow-scroll divide-2 divide-solid divide-gray-500 no-scrollbar'>
                                {dashboardData && dashboardData.contributors.map((contributor, index) => {
                                    return (
                                        <li key={index} className='grid grid-cols-8 md:grid-cols-10  py-2 divide-x-2 group hover:bg-gray-700 divide-solid divide-gray-500 border-y-2 border-gray-500'>
                                            <div className='block group-hover:hidden'>{index+1}</div>
                                            <div className='hidden justify-center group-hover:flex'>
                                                <img src={EditIcon} alt="" className='w-[25px] cursor-pointer block hover:hidden absolute' onClick={()=>{navigate(`/editaccess/${contributor.user_id}`)}}/>
                                                <img src={ActiveEditIcon} alt="" className='w-[25px] cursor-pointer opacity-0 hover:opacity-100 absolute' onClick={()=>{navigate(`/editaccess/${contributor.username}`)}} />
                                            </div>
                                            <div className=''>{contributor.user_id}</div>
                                            <div className='col-span-3 md:col-span-4'>{contributor.username}</div>
                                            <div className=''>{contributor.admin_access}</div>
                                            <div className='col-span-1 md:col-span-2'>{contributor.contributor_access}</div>
                                            <div className=''>{contributor.viewer_access}</div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className='viewerSection py-4'>
                        <div className='text-left lato text-3xl'>{dashboardData?.viewers.length} Viewers</div>
                        <div className='flex flex-col items-center justify-center'>
                            <ul className='bg-gray-600 w-[768px] md:w-full text-center lato text-xl overflow-scroll divide-2 divide-solid divide-gray-500 no-scrollbar'>
                                {dashboardData && dashboardData.viewers.map((viewer, index) => {
                                    return (
                                        <li key={index} className='grid grid-cols-8 md:grid-cols-10  py-2 divide-x-2 group hover:bg-gray-700 divide-solid divide-gray-500 border-y-2 border-gray-500'>
                                            <div className='block group-hover:hidden'>{index+1}</div>
                                            <div className='hidden justify-center group-hover:flex relative'>
                                                <img src={EditIcon} alt="" className='w-[25px] cursor-pointer block hover:hidden absolute' />
                                                <img src={ActiveEditIcon} alt="" className='w-[25px] cursor-pointer opacity-0 hover:opacity-100 absolute' onClick={()=>{navigate(`/editaccess/${viewer.username}`)}} />
                                            </div>
                                            <div className=''>{viewer.user_id}</div>
                                            <div className='col-span-3 md:col-span-4'>{viewer.username}</div>
                                            <div className=''>{viewer.admin_access}</div>
                                            <div className='col-span-1 md:col-span-2'>{viewer.contributor_access}</div>
                                            <div className=''>{viewer.viewer_access}</div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>

                    
                </div>
            </div>
        </>
    )
}

export default Dashboard
