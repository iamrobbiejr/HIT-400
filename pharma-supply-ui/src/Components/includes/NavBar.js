import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import chainx from "../../chainx.png";
import AuthService from "../../services/auth.service";


function NavBar(props) {

    const [showWD, setShowWD] = useState(false);
    const [showM, setShowM] = useState(false);
    const [showAdmin, setShowAdmin] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();


        if (user) {
            setCurrentUser(user);
            if (user.role === 'admin'){
                setShowAdmin(true);
            }
            else if(user.role === 'Manufacturer')
            {
                setShowM(true);
            }
            else if(user.role === 'Wholesaler' || user.role === 'Distributor'){
                setShowWD(true);
            }

        }
    }, []);

    const logOut = () => {
        AuthService.logout();
    };

    return (
        <div>
            <nav className="navbar rounded-pill navbar-expand navbar-dark sticky-top mb-4">
                <Link to={'#'} className="navbar-brand">
                    <img src={chainx} alt="Chainx" style={{width: 30}}/>
                </Link>

                <div className="navbar-nav mr-auto">
                    {currentUser && (
                        <li className="nav-item">
                            <Link to={'/check-products'} className="nav-link">
                                Check Products
                            </Link>
                        </li>
                    )}
                    {showAdmin && (
                        <li className="nav-item">
                            <Link to={'/dashboard'} className="nav-link">
                                Dashboard
                            </Link>
                        </li>
                    )}


                    {showM && (
                        <li className="nav-item">
                            <Link to={'/ship-product'} className="nav-link">
                                Ship Product
                            </Link>
                        </li>
                    )}
                    {showWD && (
                        <li className="nav-item">
                            <Link to={'/WD_ShipProduct'} className="nav-link">
                                Ship Product
                            </Link>
                        </li>
                    )}



                </div>


                {currentUser && (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={'/profile'} className="nav-link">
                                {currentUser.email}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <a href='/' className="nav-link" onClick={logOut}>
                                Logout
                            </a>
                        </li>
                    </div>
                ) }

            </nav>
        </div>
    );
}

export default NavBar;