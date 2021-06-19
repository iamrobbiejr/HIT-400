import React, {useEffect, useRef, useState} from 'react';
import chainx from "../../chainx.png";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../../services/auth.service";
import SupplyChainService from '../../services/supply_chain.service';
import { nanoid } from 'nanoid';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy} from '@fortawesome/free-solid-svg-icons';
import QRCode from 'qrcode';
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
// import {css} from "@emotion/react";
import {makeStyles} from "@material-ui/core/styles";
import NavBar from "../includes/NavBar";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

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

const validName = (value) => {
    if (value.length < 3 || value.length > 50) {
        return (
            <div className="alert alert-danger" role="alert">
                The name must be between 3 and 50 characters!
            </div>
        );
    }
};


const Ship_Product = () => {

    const shipper = AuthService.getCurrentUser();

    const form = useRef();
    const checkBtn = useRef();

    // store error message in state
    const [error, setError] = useState();

    const [copied, setCopied] = useState(false);
    const [batchId, setBatchId] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [location, setLocation] = useState();
    const [receiver, setReceiver] = useState('');
    const [message, setMessage] = useState('');
    const [expiry_date, setExpiryDate] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [users, setUsers] = useState([]);
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Success handler for geolocation's `getCurrentPosition` method
    const handleSuccess = (pos) => {
        const { latitude, longitude } = pos.coords;

        setLocation({
            latitude,
            longitude,
        });

        console.log("location ",location)
    };

    // Error handler for geolocation's `getCurrentPosition` method
    const handleError = (error) => {
        setError(error.message);
    };

    useEffect(() => {
        AuthService.getUsers().then(response => {
            setUsers(response);

        }).catch(err => {
            console.log(err);
        })
        setBatchId(nanoid(10));
        setCopied(false);
        const { geolocation } = navigator;

        // If the geolocation is not defined in the used browser we handle it as an error
        if (!geolocation) {
            setError("Geolocation is not supported.");
            return;
        }

        // Call Geolocation API
        geolocation.getCurrentPosition(handleSuccess, handleError, geolocationOptions);
    }, [geolocationOptions]);


    /****
     * Qr Code functions
     */

    const generateQrCode = async () => {
        try {
            const res = await QRCode.toDataURL(batchId);
            setImageUrl(res);
        }catch (e) {
            console.log(e);
        }
    }

    /***
     * End Qr Code functions
     */

    const onChangeName = (e) => {
        const name = e.target.value;
        setName(name);
    };


    const onChangeReceiver = (e) => {
        const receiverName = e.target.value;
        setReceiver(receiverName);
    };

    const onChangeExpiryDate = (e) => {
        console.log(e.target.value);
        const date = e.target.value;
        setExpiryDate(date);
    };

    const onChangeRole = (e) => {
        const selectedRole = e.target.value;
        console.log(selectedRole);
        setRole(selectedRole);
    };

    /*****
     * Modal Functions
     */
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        window.location.reload();
    };

//     const override = css`
//   display: block;
//   margin: 0 auto;
// `;
    /****
     * End Modal functions
     */


    const handleCopy = (e) => {
        setCopied(true);
    }

    const handleShip = (e) => {
        e.preventDefault();

        setMessage('');
        setSuccessful(false);


        form.current.validateAll();
        setLoading(true);
        handleOpen();
        if (checkBtn.current.context._errors.length === 0) {

            //call Service method check-product
            SupplyChainService.shipBatch(batchId,name,shipper.name,receiver,role,location,expiry_date)
                .then(response => {
                    console.log("response: ",response);
                    setMessage("Batch Has Been Shipped");
                    setSuccessful(true);
                    setLoading(false);
                    setBatchId(nanoid(10));
                    setCopied(false);

                    generateQrCode().then(res => {
                        console.log(res);
                    }).catch(err => {
                        console.log(err);
                    });
            })
                .catch(error => {
                    console.log(error);
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setCopied(false);
                    setLoading(false);
                    setMessage(resMessage);
                    setSuccessful(false);

                });

        }
    }

    return (
       <div>
           <NavBar />
           <div className="container col-md-8">

               <div className="card container">
                   <h4 className="card-subtitle text-center text-black-50 mb-4">
                       Ship Medicine Batch <img src={chainx} alt="chainx-logo" width={20}/>
                   </h4>


                   <Form onSubmit={handleShip} ref={form}>
                       <div>
                           <div className="row g-3">
                               <div className="form-group col-sm-9">
                                   <label htmlFor="email">BatchId</label>
                                   <Input
                                       type="text"
                                       className="form-control rounded-pill"
                                       name="batchId"
                                       readOnly={true}
                                       value={batchId}
                                       validations={[required]}
                                   />
                               </div>
                               <div className="col-sm-3">
                                   <label className="text-white-50" htmlFor="">Copy to Clipboard</label>
                                   <CopyToClipboard text={batchId}
                                                    onCopy={handleCopy}>
                                       <FontAwesomeIcon icon={faCopy} />
                                   </CopyToClipboard>
                                   {copied && (
                                       <span className="text-success ml-2">BatchId Copied.</span>
                                   )}
                               </div>
                           </div>
                           <div className="form-group">
                               <label htmlFor="name">Batch Description</label>
                               <Input
                                   type="text"
                                   className="form-control rounded-pill"
                                   name="name"
                                   value={name}
                                   onChange={onChangeName}
                                   validations={[required,validName]}
                               />
                           </div>
                           <div className="row g-3">
                               <div className="form-group col-sm-6">
                                   <label htmlFor="name">Receiver</label>
                                   <select className="form-control rounded-pill"
                                           name="receiver" id="receiver"
                                           onChange={onChangeReceiver}
                                           validations={[required]}
                                   >
                                       <option value="" selected disabled>Please Select Receiver</option>
                                       {users.map((user) =>{
                                               if(user.role !== "Manufacturer"){
                                                   return(
                                                       <option value={user.name}>{user.name}</option>
                                                       )
                                               }
                                       }
                                       )}
                                   </select>
                               </div>
                               <div className="form-group col-sm-6">
                                   <label htmlFor="role">Select Receiver Type</label>
                                   <select className="form-control rounded-pill"
                                           name="role" id="role"
                                           onChange={onChangeRole}
                                           validations={[required]}
                                   >
                                       <option value="" selected disabled>Please Choose</option>
                                       <option value="Wholesaler">Wholesaler</option>
                                       <option value="Distributor">Distributor</option>
                                       <option value="Retailer">Retailer/Pharma</option>
                                   </select>
                               </div>
                           </div>


                           <div className="form-group">
                               <label htmlFor="expiry">Expiry Date</label>
                               <Input
                                   type="date"
                                   className="form-control rounded-pill"
                                   name="expiry"
                                   value={expiry_date}
                                   onChange={onChangeExpiryDate}
                                   validations={[required]}
                               />
                           </div>

                           <div className="form-group">
                               <label htmlFor="location" className="form-label">Location Coordinates[Latitude,Longitude]</label>
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
                           <div className="form-group">
                               <button className="btn rounded-pill btn-primary btn-block">
                                   Submit Transaction
                               </button>
                           </div>
                       </div>

                       <CheckButton style={{display: "none"}} ref={checkBtn}/>
                   </Form>
               </div>

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
                           {loading && (
                               <div className="alert alert-info" role="alert">
                                   <span className="spinner-border spinner-border-md"></span> Please confirm transaction on Metamask
                               </div>
                           )}
                           {message && (
                               <div className="form-group">
                                   <div
                                       className={successful ? "alert alert-success" : "alert alert-danger"}
                                       role="alert">
                                       {message}
                                   </div>
                               </div>
                           )}
                           {imageUrl ? (
                               <div className="container ml-auto mr-auto">
                                   <label htmlFor="qr">Click Image to download</label>
                                   <a name="qr" href={imageUrl} download onClick={handleClose}>
                                       <img src={imageUrl} alt="img"/>
                                   </a>

                               </div>

                           ) : null}
                       </div>
                   </Fade>
               </Modal>
           </div>
       </div>
    )

}

export default Ship_Product;