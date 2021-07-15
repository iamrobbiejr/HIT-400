import React, {useEffect, useRef, useState} from 'react';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import NavBar from "../includes/NavBar";
import { useParams } from "react-router-dom";


import SupplyChainService from '../../services/supply_chain.service';
import AuthService from '../../services/auth.service';

const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
    maximumAge: 1000 * 3600 * 24, // 24 hour
};

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};


const Scan_Shipment = (props) =>{

    const [batch_Id, setBatchId] = useState('');

    const id = JSON.parse(localStorage.getItem('batchId'));
    console.log("batch: " + id);

    const checkBtn = useRef();
    const form = useRef();



    const [location, setLocation] = useState();
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState('');
    const [reject, setReject] = useState(false);
    const [option, setOption] = useState('accept');
    const [note, setNote] = useState('');
    // store error message in state
    const [error, setError] = useState();
    const [currentUser, setCurrentUser] = useState(undefined);



    // Success handler for geolocation's `getCurrentPosition` method
    const handleSuccess = (pos) => {
        const { latitude, longitude } = pos.coords;

        setLocation({
            latitude,
            longitude,
        });
    };

    // Error handler for geolocation's `getCurrentPosition` method
    const handleError = (error) => {
        setError(error.message);
    };

    useEffect(() => {
        setBatchId(id);
        const u = AuthService.getCurrentUser();
        setCurrentUser(u)
        console.log(batch_Id);
        const { geolocation } = navigator;

        // If the geolocation is not defined in the used browser we handle it as an error
        if (!geolocation) {
            setError("Geolocation is not supported.");
            return;
        }

        // Call Geolocation API
        geolocation.getCurrentPosition(handleSuccess, handleError, geolocationOptions);
    }, [geolocationOptions]);


    const onChangeValue = (e) => {
        console.log(e.target.value);
        let opt = e.target.value;
        if(opt === 'reject')
        {
            setReject(true);
            setOption(opt);
        }
        else if(opt === 'accept')
        {
            setReject(false);
            setOption(opt);
        }
    }

    const onChangeNote = (e) =>
    {
        console.log(e.target.value);
        setNote(e.target.value);
    }

    const handleScan = (e) => {
        e.preventDefault();

        setMessage('');
        setSuccessful(false);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {

            //call accept method / reject method
            if(option === 'accept')
            {
                SupplyChainService.accept_shipment(batch_Id,location,currentUser.address)
                    .then(res => {
                        console.log("response: ",res);
                        setMessage("Batch Has Been Accepted");
                        setSuccessful(true);
                        if(currentUser.role !== 'Manufacturer'){
                            props.history.push('/WD_ShipProduct');
                        }
                    }).catch(err => {
                    console.log("error: ",err);
                    setSuccessful(false);
                    setMessage(err);

                });
            }
            else if(option === 'reject')
            {
                SupplyChainService.reject_shipment(batch_Id,note,currentUser.address)
                    .then(res => {
                        console.log("response: ",res);
                        setMessage("Batch Has Been Rejected And Shipped Back To Shipper");
                        setSuccessful(true);

                    })
                    .catch(err => {
                        console.log("error: ",err);
                        setSuccessful(false);
                        setMessage("error occured");
                    });
            }
        }
    }


    return (
        <div>
            <NavBar />
            <div className="card container col-md-10">
                <h3 className="card-subtitle text-center text-black-50 mb-4">Scan Shipment</h3>
                <div className="card-body text-center">
                    <Form onSubmit={handleScan} ref={form}>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="batchId">Input BatchId</label>
                                    <Input
                                        type="text"
                                        className="form-control rounded-pill"
                                        name="batchId"
                                        value={id}
                                        readOnly={true}
                                        validations={[required]}
                                    />
                                </div>

                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="location" className="form-label">
                                        Location Coordinates[Latitude,Longitude]
                                    </label>
                                    {location ? (

                                        <Input
                                            type="text"
                                            className="form-control rounded-pill"
                                            name="location"
                                            readOnly={true}
                                            value={location.latitude + ", " +location.longitude}

                                        />

                                    ) : (
                                        <div className="form-group">
                                            <p className="text-primary">Loading...</p>
                                        </div>
                                    )}
                                    {error && (
                                        <div className="form-group">
                                            <div
                                                className="alert alert-danger"
                                                role="alert">
                                                Location Error: {error}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group ml-auto">
                                    <br/><br/>
                                    <button className="btn btn-primary rounded-pill">
                                        Update Shipment
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-4" >
                                <label htmlFor="">Accept/Reject Batch</label>
                                <div className="form-check">
                                    <Input id="accept"
                                           name="paymentMethod"
                                           onChange={onChangeValue}
                                           value="accept"
                                           type="radio"
                                           className="form-check-input"
                                           checked={!reject} required={true} />
                                    <label className="form-check-label ml-5" htmlFor="accept">Accept</label>
                                </div>
                                <div className="form-check">
                                    <Input id="reject"
                                           name="paymentMethod"
                                           type="radio"
                                           onChange={onChangeValue}
                                           value="reject"
                                           className="form-check-input"
                                           checked={reject} required={true} />
                                    <label className="form-check-label ml-5" htmlFor="reject">Reject</label>
                                </div>

                            </div>
                            {reject && (
                                <div className="form-group col-md-4">
                                    <label htmlFor="note">Why did you reject the batch?</label>
                                    <textarea
                                        name="note"
                                        id="note"
                                        className="form-control"
                                        cols="120" rows="4"
                                        onChange={onChangeNote}
                                        placeholder="Write a few notes....">
                                    </textarea>
                                </div>
                            )}
                        </div>

                        {message && (
                            <div className="form-group">
                                <div
                                    className={successful ? "alert alert-success" : "alert alert-danger"}
                                    role="alert">
                                    {message}
                                </div>
                            </div>
                        )}
                        <CheckButton style={{display: "none"}} ref={checkBtn}/>
                    </Form>
                </div>

            </div>
        </div>

    )


}

export default Scan_Shipment;