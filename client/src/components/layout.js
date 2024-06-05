/* This page defines the wrapper for all the pages */

import { Navbar } from './navbar';

const Layout = ( {children} ) => {
    return (
        <div>
            <Navbar />
            <div className='container'>{ children }</div>
        </div>
    )
};

export default Layout;