import React from 'react';
import AuthService from '../../services/auth.service';
import NavBar from "../includes/NavBar";

const Profile = () => {
    const currentUser = AuthService.getCurrentUser();

    return (
        <div>
            <NavBar />
            <div className="container mt-2">
                <header className="jumbotron">
                    <h3>
                        <strong>User Profile</strong>
                    </h3>
                    <h4>
                        <strong>Address: </strong> {currentUser.address}
                    </h4>
                    <hr/>
                    <hr/>
                    <p>
                        <strong>Name:</strong> {currentUser.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {currentUser.email}
                    </p>
                    <p>
                        <strong>User Role:</strong> {currentUser.role}
                    </p>
                </header>
            </div>
        </div>

    );
};

export default Profile;