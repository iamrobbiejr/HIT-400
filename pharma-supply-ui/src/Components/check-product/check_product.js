import React, {useEffect, useRef, useState} from 'react';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import RingLoader from "react-spinners/RingLoader";
import { css } from "@emotion/react";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import QrReader from 'react-qr-reader';
import NavBar from "../includes/NavBar";
import {Link} from "react-router-dom";

import SupplyChainService from '../../services/supply_chain.service';
import AuthService from "../../services/auth.service";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: 50
    },
}));

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};


const Check_Product = (props) => {
    const form = useRef();
    const checkBtn = useRef();
    const qrRef = useRef(null);

    const [batchId, setBatchId] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [batch, setBatch] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showScanButton, setShow] = useState(false);



    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
    }, []);

    /*****
     * Qr Functions
     */
    const handleFileError = (error) => {
        console.log(error);
    }

    const handleScanFile = (result) => {
        console.log(result);
        console.log(qrRef);
        if(result){
            setBatchId(result);

        }
    }

    const onScanFile = () => {
        setBatchId(' ');

        qrRef.current.openImageDialog();
    }

    /*******
     *End functions
     ******/

    /*****
     * Modal Functions
     */
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        window.location.reload();
        setOpen(false);
    };

    const override = css`
  display: block;
  margin: 0 auto;
`;
    /****
     * End Modal functions
     */

    const onChangeBatchId = (e) => {
        const batchId = e.target.value;
        setBatchId(batchId);
    };

    /*****
     * Prove Existence of Batch on the Blockchain
     * @param e
     */
    const handleSearch = (e) => {
        e.preventDefault();


        setSuccessful(false);
        setMessage('');


        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            setLoading(true);
            //call Service method check-product
            SupplyChainService.check_product(batchId)
                .then(response => {
                    console.log(response);
                    if(response.success === true){
                        setBatch(response.data);
                        setSuccessful(true);
                        setLoading(false);
                        console.log(response.data.receiver);
                        if(response.data.receiver === currentUser.name){
                            if(response.data.status !== "Delivered")
                            setShow(true);
                        }
                        handleOpen();
                    }
                    else{
                        setSuccessful(false);
                        setLoading(false);
                        setMessage('Batch Not Found! Check Your BatchId and Try Again.');
                        handleOpen();
                    }
                })
                .catch(error => {
                    console.log("error: ",error);
                    setSuccessful(false);
                    setLoading(false);
                    setMessage(error);
                })
        }
    }

    return (
        <div>
            <NavBar />
            <div className="container col-md-10">
                <header className="jumbotron mt-2">
                    {/*<img src={logo} alt="Chainx-Logo" className="profile-img-card"/>*/}
                    <h4 className="card-title text-center">Check Products WhereAbouts</h4>
                    <div className="card-body text-center">
                        <Form onSubmit={handleSearch} ref={form}>

                            <div className="row">
                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="batchId">Enter BatchId</label>
                                            <Input
                                                type="text"
                                                placeholder="Input BatchId"
                                                className="form-control rounded-pill"
                                                name="batchId"
                                                value={batchId}
                                                onChange={onChangeBatchId}
                                                validations={[required]}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-2">
                                            <h4 className="text-center font-weight-bolder">OR</h4>
                                        </div>
                                    </div>
                                    <div className="row">

                                        <div className="form-group col-md-6">
                                    <span className="btn btn-primary rounded-pill mb-3" onClick={onScanFile}>
                                        Scan Qr <FontAwesomeIcon icon={faQrcode} />
                                    </span>

                                            <QrReader
                                                ref={qrRef}
                                                delay={300}
                                                style={{width: '50%',height: '10%',marginLeft:50}}
                                                onError={handleFileError}
                                                onScan={handleScanFile}
                                                legacyMode
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group col-md-4">
                                    <button className="btn rounded-pill btn-primary btn-block">
                                        Search Batch Info
                                    </button>
                                </div>
                            </div>


                            <CheckButton style={{display: "none"}} ref={checkBtn}/>
                        </Form>
                        <RingLoader color="blue" loading={loading} css={override} size={75} />
                    </div>
                </header>

                {batch && (
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={open}>
                            <div className={classes.paper}>
                                <h2 id="transition-modal-title">Batch Info For Batch Id : {batch.batchId}</h2>
                                <p id="transition-modal-description"><span className="font-weight-bold">Name: </span>{batch.name}</p>
                                <p id="transition-modal-description"><span className="font-weight-bold">Expiry Date: </span>{batch.expiry_date}</p>
                                <p id="transition-modal-description"><span className="font-weight-bold">Receiver: </span>{batch.receiver}</p>
                                <p id="transition-modal-description"><span className="font-weight-bold">Receiver Type: </span>{batch.receiverType}</p>
                                <p id="transition-modal-description"><span className="font-weight-bold">Shipper: </span>{batch.shipper}</p>
                                <p id="transition-modal-description"><span className="font-weight-bold">Status: </span>{batch.status}</p>
                                <p id="transition-modal-description"><span className="font-weight-bold">Complete Chain: </span><span className="text-uppercase text-primary">{batch.chain}</span></p>
                                {showScanButton && (
                                    <Link to={{pathname: `/scan_shipment/${batchId}`, state: {id: batchId}}}  className="btn rounded-pill btn-outline-primary">Scan Shipment ( On Arrival)</Link>
                                )}
                            </div>
                        </Fade>
                    </Modal>
                )}

                {/*no batch found*/}
                {!batch && (
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={open}>
                            <div className={classes.paper}>
                                {message && (
                                    <div className="form-group row">
                                        <div
                                            className={successful ? "alert rounded-pill alert-success" : "alert alert-danger"}
                                            role="alert">
                                            {message}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Fade>
                    </Modal>
                )}
            </div>
        </div>
    )
}

export default Check_Product;