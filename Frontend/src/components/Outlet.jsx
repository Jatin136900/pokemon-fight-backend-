import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'    

import { Outlet } from 'react-router-dom';

export default function Jatin() {
    return (
        <>
            <Header />
            <Outlet />
            {/* <Footer /> */}
        </>
    );
}
