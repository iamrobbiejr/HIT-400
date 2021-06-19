import React, {useEffect} from 'react';
import logo from '../../chainx.png';
import AuthService from "../../services/auth.service";

const Home = () => {


    useEffect(() => {
        AuthService.logout();
    }, []);


    return (
        <div id="home" className="container">
            <header className="jumbotron mt-5">
                <img src={logo} alt="Chainx-Logo" className="profile-img-card"/>
                <h3 className="card-title text-center">Welcome to Chainx - The Pharma Supply Chain DAPP</h3>
                <div className="card-body text-center">
                    Chainx is a Decentralized E2E Logistics Application that stores the whereabouts of product
                    at every freight hub on the Blockchain. At consumer end, customers can simply scan the batch id of products
                    and get complete information about the provenance of that product hence empowering consumers
                    to only purchase authentic and quality products.
                </div>
                <div className="text-center">
                    <div className="row container justify-content-center">

                            <a href="/login" className="btn btn-primary mr-4">
                                    Sign In
                            </a>

                            <a href="/register" className="btn btn-primary ml-4">
                                Register Account
                            </a>

                    </div>
                </div>
            </header>

        </div>
    )
};

export default Home;