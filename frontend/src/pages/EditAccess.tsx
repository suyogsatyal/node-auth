import '../index.css'
import { useEffect, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Formik, Form, Field } from 'formik';
import { AuthContext } from '../components/Context';
import { DashboardDataFormat, ApiResponse } from '../../../utils/interface';
import Navbar from '../components/Navbar'
import axiosInstance from '../components/AxiosInstance';
import axios from 'axios';


function EditAccess() {
    const apiURL = import.meta.env.VITE_APP_API_BASE_URL;
    const reloginApiURL = apiURL + '/relogin';
    const username = useParams().username;
    const currentUserDataURL = apiURL + '/user/' + `${username}`;
    const editAccessURL = apiURL + '/editAccess';
    const [access, setAccess] = useState('');
    const [message, setMessage] = useState<string>('');
    const [newAccess, setNewAccess] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userContext = useContext(AuthContext);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    let timeout = 1000;

    async function handleRelogin() {
        try {
            const response = await axiosInstance.post<ApiResponse>(reloginApiURL)

            if (response.data.success) {
                const isAdmin = response.data.data.admin_access;
                if (isAdmin !== 1) {
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
            // localStorage.removeItem('token');
            // navigate('/login');
        }
    }

    async function handleNewAcccessRequest() {
        try {
            const response = await axiosInstance.post<ApiResponse>(editAccessURL, {
                username: username,
                newAccess: newAccess
            })
            if (response.data.success) {
                if((username == userContext.currentUser.username) &&(newAccess != "admin")){
                    setMessage(`Changed your access to ${newAccess} successfully.` );
                    setTimeout(() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }, timeout);
                }
                else{
                    setMessage(`Changed ${username} to ${newAccess} successfully.` );
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, timeout);
                }
            }
        }
        catch (error) {
            console.error(error)
        }
    }


    async function FetchCurrentData() {
        try {
            const response = await axios.get<ApiResponse>(currentUserDataURL);
            const data = response.data.data;
            if (data.admin_access === 1) {
                setAccess('admin');
            }
            else if (data.contributor_access === 1) {
                setAccess('contributor');
            }
            else if (data.viewer_access === 1) {
                setAccess('viewer');
            }
            else {
                setAccess('Inactive');
            }
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
        console.log(username == userContext.currentUser.username)
        setLoading(true);
        FetchCurrentData();
        handleRelogin();
        setLoading(false);
    }, [])

    useEffect(() => {
        console.log(message)
    }, [message])

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
            <div className={`w-full h-full absolute top-0 left-0 justify-center items-center z-50 ${openConfirmation ? 'flex' : 'hidden'}`}>
                <div className='confirmation-container flex justify-center items-center text-center p-8 z-50 bg-gray-600 rounded-md'>
                    <div className='confirmation-content'>
                        <div className='confirmation-header py-3'>
                            <h1 className='lato text-3xl sm:text-5xl'>Confirm</h1>
                        </div>
                        <div className='confirmation-body py-2'>
                            <p className='lato text-xl sm:text-2xl'>Are you sure you want to change the access <br /> for <span className='capitalize font-extrabold'>{username}</span> from <span className='capitalize'>{access}</span> to <span className='capitalize'>{newAccess}</span>?</p>
                        </div>
                        <div className='finalMessage'>
                            {message && message}
                        </div>
                        <div className='confirmation-footer flex flex-row gap-5 justify-center py-2'>
                            <button className='inline-flex cursor-pointer items-center gap-1 rounded border border-slate-300 bg-gradient-to-b from-slate-400 to-slate-500 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-2 active:opacity-100' onClick={() => { setOpenConfirmation(false) }}>Cancel</button>
                            <button className='inline-flex cursor-pointer items-center gap-1 rounded border border-slate-300 bg-gradient-to-b from-green-800 to-green-700 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-2 active:opacity-100' onClick={() => { handleNewAcccessRequest() ;console.log({ access: true }) }}>Confirm</button>
                        </div>
                    </div>
                </div>
                <div className='confirmation-overlay absolute w-full h-full bg-gray-800 opacity-90 z-10' onClick={() => { setOpenConfirmation(false) }}>
                </div>
            </div>

            <div className="container pt-28">
                <h1 className='lato text-center text-3xl sm:text-5xl'>Edit Access for {username}</h1>
                <h2 className='lato text-center text-2xl sm:text-xl'>Current Access: <span className=' capitalize'>{access && access}</span></h2>
                <div className="flex justify-center py-8">
                    <Formik initialValues={{ access: { access } }} onSubmit={values => { setNewAccess(values.picked); console.log({ access: (values.picked) }); setOpenConfirmation(true) }}>
                        <Form>
                            <label className='label'>
                                <Field type="radio" name="picked" value="admin" className='radio-input' onClick={() => { setMessage('');setNewAccess('admin') }} />
                                <div className="radio-design"></div>
                                <div className='label-text lato capitalize'>Admin</div>
                            </label>

                            <label className='label'>
                                <Field type="radio" name="picked" value="contributor" className='radio-input' onClick={() => { setMessage('');setNewAccess('contributor') }} />
                                <div className="radio-design"></div>
                                <div className='label-text lato capitalize'>Contributor</div>
                            </label>

                            <label className='label'>
                                <Field type="radio" name="picked" value="viewer" className='radio-input' onClick={() => { setMessage('');setNewAccess('viewer') }} />
                                <div className="radio-design"></div>
                                <div className='label-text lato capitalize' >Viewer</div>
                            </label>

                            <label className='label'>
                                <Field type="radio" name="picked" value="inactive" className='radio-input' onClick={() => { setMessage('');setNewAccess('inactive') }} />
                                <div className="radio-design"></div>
                                <div className='label-text lato capitalize'>Inactive</div>
                            </label>
                            <div className='flex flex-row gap-4 py-4'>
                                <button type="button" className='inline-flex cursor-pointer items-center gap-1 rounded border border-slate-300 bg-gradient-to-b from-slate-400 to-slate-500 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-2 active:opacity-100' onClick={() => { navigate('/dashboard') }}>Cancel</button>
                                <button type="submit" className={`inline-flex items-center gap-1 rounded border border-slate-300 bg-gradient-to-b from-green-800 to-green-700 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-2 active:opacity-100` + ((access === newAccess)? ` cursor-not-allowed`: ` cursor-pointer`)} disabled={access === newAccess}>Confirm</button>
                            </div>
                        </Form>
                    </Formik>
                </div>
                <div className='finalMessage text-center'></div>
            </div>
        </>
    )
}

export default EditAccess;