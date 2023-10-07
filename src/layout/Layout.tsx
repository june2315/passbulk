import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
export default function Layout() {
    return (
        <div className="dark:text-white w-screen h-screen">
            <Header />
            <Outlet />
        </div>
    );
}
