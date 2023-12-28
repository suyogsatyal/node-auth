import '../index.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { SignupFormData, LoginFormData, ApiResponse } from '../../../utils/interface';
import { signupSchema } from '../../../utils/schema';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

export default function Signup() {
    const apiURL = import.meta.env.VITE_APP_API_BASE_URL;
    const userSignupURL  = apiURL+'/signup';
    const [message, setMessage] = useState<string >('');
    const navigate = useNavigate();

    useEffect(()=>{
      const jwtToken = localStorage.getItem('token');
      console.log(jwtToken);

      if(jwtToken){
          navigate('/');
      }
  }, [])

    const initialValues: SignupFormData = { username: '', password: '', confirmPassword: '' };

    async function handleSignup(data: SignupFormData) {
        const Credentials: LoginFormData = { username: data.username, password: data.password };
        try {
          const response = await axios.post<ApiResponse>(
            userSignupURL,
            Credentials,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
      
          if (response.data.success) {
            setMessage(response.data.message || 'Signup successful');
          } else {
            setMessage(`Signup Failed: ${response.status} - ${response.data.message}`);
          }
        } catch (error:any) {
          const errorResponse: ApiResponse = {
            success: false,
            status: error.response ? error.response.status : 500,
            message: error.response ? error.response.data.message : 'Internal Server Error',
          };
      
          setMessage(`Signup Failed: ${errorResponse.status} - ${errorResponse.message}`);
        }
      }
      

    return (
        <>
            <div className="flex flex-col justify-center items-center w-lvw overflow-hidden">
                <Formik initialValues={initialValues} validationSchema={signupSchema} onSubmit={values => handleSignup(values)}>
                    <Form action="" className=' border-2 py-12 px-8 flex flex-col text-center items-center self-center justify-center' noValidate>
                        <h1 className=' text-3xl py-6 lato capitalize'>Signup Form</h1>
                        <div className="inputGroup mx-0 my-4 w-64 relative">
                            <Field name="username" type="text" onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => e.keyCode !== 13 && setMessage('')} className=' p-3 outline-none border-2 border-gray-400 bg-transparent rounded-lg w-full' required autoComplete='off' />
                            <label htmlFor="name" className='absolute left-0 p-3 ml-2 pointer-events-none duration-200 ease-in-out text-slate-300'>Username</label>
                            <ErrorMessage name='username' component="div" className=' text-red-600'></ErrorMessage>
                        </div>
                        <div className="inputGroup mx-0 my-4 w-64 relative">
                            <Field name="password" type="password" onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => e.keyCode !== 13 && setMessage('')}
 className=' p-3 outline-none border-2 border-gray-400 bg-transparent rounded-lg w-full' required autoComplete='off' />
                            <label htmlFor="password" className='absolute left-0 p-3 ml-2 pointer-events-none duration-200 ease-in-out text-slate-300'>Password</label>
                            <ErrorMessage name='password' component="div" className=' text-red-600'></ErrorMessage>
                        </div>
                        <div className="inputGroup mx-0 my-4 w-64 relative">
                            <Field name="confirmPassword" type="password" onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => e.keyCode !== 13 && setMessage('')} className='p-3 outline-none border-2 border-gray-400 bg-transparent rounded-lg w-full' required autoComplete='off' />
                            <label htmlFor="password" className='absolute left-0 p-3 ml-2 pointer-events-none duration-200 ease-in-out text-slate-300'>
                                Confirm Password
                            </label>
                            <ErrorMessage name='confirmPassword' component="div" className=' text-red-600'></ErrorMessage>
                        </div>

                        {message && (message.toLowerCase().includes("error")||message.toLowerCase().includes("failed"))?(<div className='p-2 text-center text-red-600'>{message}</div>): (<div className='p-2 text-center text-green-600'>{message}</div>)}
                        <button type="submit" className="relative group cursor-pointer text-sky-50  overflow-hidden h-12 w-64 rounded-md bg-sky-900 p-2 flex justify-center items-center font-extrabold">
                            <div className="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-40 h-40 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-sky-950"></div>
                            <div className="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-32 h-32 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-sky-900"></div>
                            <div className="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-24 h-24 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-sky-800"></div>
                            <div className="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-14 h-14 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-sky-700"></div>
                            <p className="z-10 uppercase">Signup</p>
                        </button>
                        <p className='py-4'>Already registered? <a href="/login" className='text-blue-400 hover:underline'>Login</a></p>
                    </Form>
                </Formik>
            </div>
        </>
    )
}
