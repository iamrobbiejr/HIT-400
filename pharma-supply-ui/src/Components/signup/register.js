import React, {useState, useRef} from "react";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import isEmail from 'validator/lib/isEmail';
import avatar from '../../avatar_2x.png';
import chainx from '../../chainx.png';
import {Link} from "react-router-dom";

import AuthService from '../../services/auth.service';
// import RingLoader from "react-spinners/RingLoader";
// import {css} from "@emotion/react";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const validEmail = (value) => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email!
            </div>
        );
    }
};

const validName = (value) => {
    if (value.length < 3 || value.length > 50) {
        return (
            <div className="alert alert-danger" role="alert">
                The name must be between 3 and 50 characters!
            </div>
        );
    }
};

const validPassword = (value) => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 and 40 characters!
            </div>
        );
    }
};

function Register(props){
    const form = useRef();
    const checkBtn = useRef();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

//     const override = css`
//   display: block;
//   margin: 0 auto;
// `;

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangeName = (e) => {
        const name = e.target.value;
        setName(name);
    };

    const onChangeRole = (e) => {
        const selectedRole = e.target.value;
        console.log(selectedRole);
        setRole(selectedRole);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleRegister = (e) => {
        e.preventDefault();

        setMessage('');
        setSuccessful(false);
        setLoading(true);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0){
            console.log(name,email,password,role);
            //call auth service register
            AuthService.register(name,email,password,role).then(response =>{
                console.log("response: ",response);
                setMessage("Registration Successful!! You may proceed to login");
                setSuccessful(true);
                setLoading(false);
            }).catch(error => {
                console.log(error);
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                setMessage(resMessage);
                setSuccessful(false);
            })
        }
    };

    return (
        <div className="col-md-12">

            <div className="card card-container">
                <h4 className="card-subtitle text-center  mb-4">
                    Sign Up For Account
                </h4>
                <h6 className="card-subtitle text-black-50 text-center mb-2">
                    Fill In Your Details
                </h6>

                {/*<img src={avatar}*/}
                {/*     alt="profile-img"*/}
                {/*     className="profile-img-card mt-3"*/}
                {/*/>*/}
                {!loading && (
                <Form onSubmit={handleRegister} ref={form}>
                    {!successful && (
                        <div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Input
                                    type="email"
                                    className="form-control rounded-pill"
                                    name="email"
                                    value={email}
                                    onChange={onChangeEmail}
                                    validations={[required,validEmail]}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <Input
                                    type="text"
                                    className="form-control rounded-pill"
                                    name="name"
                                    value={name}
                                    onChange={onChangeName}
                                    validations={[required,validName]}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Select Your Role</label>
                                <select className="form-control rounded-pill"
                                        name="role" id="role"
                                        onChange={onChangeRole}
                                        validations={[required]}
                                >
                                    <option value="" selected disabled>Please Choose</option>
                                    <option value="Manufacturer">Manufacturer</option>
                                    <option value="Wholesaler">Wholesaler</option>
                                    <option value="Distributor">Distributor</option>
                                    <option value="Retailer">Retailer/Pharma</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Input
                                    type="password"
                                    className="form-control rounded-pill mb-4"
                                    name="password"
                                    value={password}
                                    onChange={onChangePassword}
                                    validations={[required,validPassword]}
                                />
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary btn-block rounded-pill">
                                    Register
                                </button>
                            </div>

                            <div className="form-group text-center">
                                <span className="text-black-50 mb-4">Already an account holder?</span>
                                <br/>
                                <a href="/login" className="text-center">
                                    <span className="text-primary">Proceed to Login</span>
                                </a>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="form-group">
                            <div
                                className={successful ? "alert alert-success" : "alert alert-danger"}
                                 role="alert">
                                {message}
                                {successful && (
                                    <div className="form-group mt-2">
                                        <Link to={'/login'} className="btn btn-primary">
                                            Proceed to Login
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <CheckButton style={{display: "none"}} ref={checkBtn}/>
                </Form>
                )}
                {/*<RingLoader color="blue" loading={loading} css={override} size={75} />*/}
                {loading && (
                    <div className="alert alert-info" role="alert">
                        <span className="spinner-border spinner-border-md"></span>: Please confirm transaction on Metamask
                    </div>
                )}
            </div>
        </div>
    );

};

export default Register;

