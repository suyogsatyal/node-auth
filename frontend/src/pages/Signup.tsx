import '../index.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { SignupFormData } from '../../../utils/interface';
import { signupSchema } from '../../../utils/schema';
import { useEffect } from 'react';

export default function Signup() {
    const apiURL = import.meta.env.VITE_APP_API_BASE_URL;

    const initialValues: SignupFormData = { username: '', password: '', confirmPassword: '' };
    function handleSignup(data: SignupFormData) {
        console.log(data);
    }

    useEffect(()=>{
        console.log(apiURL)
    }, [])
    return (
        <>
            <div className="flex flex-col justify-center items-center w-lvw overflow-hidden">
                <Formik initialValues={initialValues} validationSchema={signupSchema} onSubmit={values => handleSignup(values)}>
                    <Form action="" className=' border-2 py-12 px-8 text-center'>
                        <h1 className=' text-3xl py-6 capitalize'>Signup Form</h1>
                        <div className="inputGroup mx-0 my-4 w-64 relative">
                            <Field name="username" type="text" className=' p-3 outline-none border-2 border-gray-400 bg-transparent rounded-lg w-full' required autoComplete='off' />
                            <label htmlFor="name" className='absolute left-0 p-3 ml-2 pointer-events-none duration-200 ease-in-out text-slate-300'>Username</label>
                            <ErrorMessage name='username' component="div" className=' text-red-600'></ErrorMessage>
                        </div>
                        <div className="inputGroup mx-0 my-4 w-64 relative">
                            <Field name="password" type="password" className=' p-3 outline-none border-2 border-gray-400 bg-transparent rounded-lg w-full' required autoComplete='off' />
                            <label htmlFor="password" className='absolute left-0 p-3 ml-2 pointer-events-none duration-200 ease-in-out text-slate-300'>Password</label>
                            <ErrorMessage name='password' component="div" className=' text-red-600'></ErrorMessage>
                        </div>
                        <div className="inputGroup mx-0 my-4 w-64 relative">
                            <Field name="confirmPassword" type="password" className='p-3 outline-none border-2 border-gray-400 bg-transparent rounded-lg w-full' required autoComplete='off' />
                            <label htmlFor="password" className='absolute left-0 p-3 ml-2 pointer-events-none duration-200 ease-in-out text-slate-300'>
                                Confirm Password
                            </label>
                            <ErrorMessage name='confirmPassword' component="div" className=' text-red-600'></ErrorMessage>
                        </div>

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
