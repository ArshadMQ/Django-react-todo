import React, { useContext, useEffect } from 'react'
import todoContext from "../context/todoContext"
import { Link } from 'react-router-dom';

const Header = () => {
    const { getCookie, eraseCookie} = useContext(todoContext)
    const handleLogout = async () => await eraseCookie("access_token")
    return (
        <>
            <nav className="navbar navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand">Navbar</a>

                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="https://picsum.photos/200/300" alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                        </button>
                        {getCookie("access_token") ?
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                <li><Link className="dropdown-item" to="/signin" onClick={handleLogout}>Logout</Link></li>
                            </ul>
                            :
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                <li><Link className="dropdown-item" to="/signin">Login</Link></li>
                                <li><Link className="dropdown-item" to="/signup">Register</Link></li>
                            </ul>}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header
