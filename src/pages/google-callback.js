import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectProfile } from '../features/profile/profileSlice';
import Loader from '../components/loader'
import { googleCodeExchangeToAccessTokenUrl, GOOGLE_REDIRECT_URI } from '../config';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const GoogleCallback = () => {
    const router = useRouter();
    const user = useSelector(selectProfile);

    useEffect(async () => {
        if (router.query.code && user.token) {
            const resp = await axios.post(googleCodeExchangeToAccessTokenUrl, {
                code: `${router.query.code}`,
                redirect_uri: `${GOOGLE_REDIRECT_URI}`,
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })

            if (resp.data.connected) {
                router.push("/");
            }
        }

    }, [router, user.token])

    return <Loader />
};

export default GoogleCallback;
