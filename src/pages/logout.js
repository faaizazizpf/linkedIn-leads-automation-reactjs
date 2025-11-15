import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loader from '../components/loader'
import { useDispatch } from 'react-redux';
import { setProfile } from '../features/profile/profileSlice';

export default function Logout() {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        sessionStorage.removeItem('jwtToken')
        dispatch(setProfile({ token: null, details: null }));
        router.push("/login")
    }, [])

    return <Loader />
} 