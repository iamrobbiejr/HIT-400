import React, {useState, useRef, useEffect} from "react";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import isEmail from 'validator/lib/isEmail';
import avatar from '../../avatar_2x.png';
import { css } from "@emotion/react";
import FadeLoader from "react-spinners/FadeLoader";

import AuthService from '../../services/auth.service';

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

function Login(props) {
    const form = useRef();
    const checkBtn = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const override = css`
  display: block;
      margin: 0 auto;
`;

    useEffect(() => {
        AuthService.logout();
    }, []);

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        setMessage('');


        form.current.validateAll();
        setLoading(true);

        if (checkBtn.current.context._errors.length === 0){
            //call auth service login
            AuthService.login(email,password).then(response =>{
                if(response.success === true){

                    props.history.push("/check-products");
                    window.location.reload();
                }
                else{
                    setMessage(response.message);
                    setLoading(false);
                }

            }).catch(error => {
                console.log(error);
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);
                setLoading(false);
            })
        }else {
            setLoading(false);
        }
    };

    return (
        <div className="col-md-12">
            {!loading && (
            <div className="card card-container rounded-right">
                <h3 className="card-subtitle text-center text-dark mb-4">Welcome!</h3>
                <h4 className="card-subtitle text-center text-black-50 mb-4">Please Sign In To Continue</h4>

                {/*<img src={avatar}*/}
                {/*     alt="profile-img"*/}
                {/*     className="profile-img-card mt-3"*/}
                {/*/>*/}

            <Form onSubmit={handleLogin} ref={form}>
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
                    <label htmlFor="password">Password</label>
                    <Input
                        type="password"
                        className="form-control rounded-pill mb-4"
                        name="password"
                        value={password}
                        onChange={onChangePassword}
                        validations={[required]}
                    />
                </div>
                <div className="form-group">
                    <button className="btn btn-primary btn-block rounded-pill" disabled={loading}>
                        {loading && (
                            <span className="spinner-border spinner-border-sm"></span>
                        )}
                        <span>Sign In</span>
                    </button>
                </div>
                <div className="form-group text-center">
                    <a href="/register" className="text-primary text-center">
                        Don't have an Account? Click to Register
                    </a>
                </div>

                {message && (
                    <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                    </div>
                )}

                <CheckButton style={{display: "none"}} ref={checkBtn} />
            </Form>


            </div>
            )}
            <FadeLoader color="blue" loading={loading} css={override} size={350} />
        </div>
    );
}

export default Login;