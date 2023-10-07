import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import App from './App';
import './index.css';
import './styles.css';
import Layout from './layout/Layout';
import ErrorPage from './ErrorPage';
import Passwords from './pages/passwords/Passwords';
import Users from './pages/users/Users';
import Setting from './pages/setting/Setting';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Passwords />,
            },
            {
                path: '/users',
                element: <Users />,
            },
            {
                path: '/setting',
                element: <Setting />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        {/* <App /> */}
        <RouterProvider router={router} />
    </React.StrictMode>
);
