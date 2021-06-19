import React, {useEffect, useRef, useState} from 'react';
import chainx from "../../chainx.png";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../../services/auth.service";
import SupplyChainService from '../../services/supply_chain.service';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy} from '@fortawesome/free-solid-svg-icons';
import QRCode from 'qrcode';
// import { css } from "@emotion/react";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import DataTable from "react-data-table-component";
import NavBar from "../includes/NavBar";
import FadeLoader from "react-spinners/FadeLoader";
import {css} from "@emotion/react";
import {nanoid} from "nanoid";


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

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};
const override = css`
  display: block;
      margin: 0 auto;
`;

const validName = (value) => {
    if (value.length < 3 || value.length > 50) {
        return (
            <div className="alert alert-danger" role="alert">
                The name must be between 3 and 50 characters!
            </div>
        );
    }
};


const WD_ShipProduct = () => {

    const form = useRef();
    const checkBtn = useRef();

    /*****
     * Initialize Variables/states
     */
    // store error message in state
    // const [error, setError] = useState();

    const [copied, setCopied] = useState(false);
    const [batchId, setBatchId] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [role, setRole] = useState('');
    const [receiver, setReceiver] = useState('');
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [currentUser, setCurrentUser] = useState(undefined);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [schain, setChain] = useState(undefined);

    const [showW, setShowW] = useState(false);
    const [showD, setShowD] = useState(false);


    const classes = useStyles();
    const [open ,setOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    /*****
     * End
     */


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

    /*****
     * Modal Functions
     */
    const handleOpen = (e) => {
        setCopied(false);
        console.log("modal open: " + e.target);
        setBatchId(e.target.value);
        setOpen(true);
    };

    const handleModalOpen = () => {
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setOpen(false);
        setModalOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
        setModalOpen(false);
        setLoading(true);
        /*****
         * Get all batches by owner
         */
        SupplyChainService.getAllBatchesByOwner(currentUser.name)
            .then(res => {
                console.log(res);
                setBatches(res);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    };

//     const override = css`
//   display: block;
//   margin: 0 auto;
// `;
    /****
     * End Modal functions
     */

    useEffect(() => {
        setLoading(true);
        setOpen(false);
        setModalOpen(false);
        const user = AuthService.getCurrentUser();


        if (user) {
            setCurrentUser(user);
            if (user.role === 'Wholesaler'){
                setShowW(true);
            }else if(user.role === 'Distributor'){
                setShowD(true);
            }

        }


        /*****
         * Get all batches by owner
         */
        SupplyChainService.getAllBatchesByOwner(user.name)
            .then(res => {
            console.log(res);
            setBatches(res);
                setLoading(false);
        })
            .catch(err => {
            console.log(err);
                setLoading(false);
        })
    },[]);



    const onChangeReceiver = (e) => {
        const receiverName = e.target.value;
        setReceiver(receiverName);
    };


    const onChangeRole = (e) => {
        const selectedRole = e.target.value;
        console.log(selectedRole);
        setRole(selectedRole);
    };


    const handleCopy = (e) => {
        setCopied(true);
    }

    const handleShip = (e) => {
        e.preventDefault();

        setMessage('');
        setSuccessful(false);

        form.current.validateAll();
        setModalLoading(true);
        handleModalOpen();

        if (checkBtn.current.context._errors.length === 0) {

            //call Service method check-product
            SupplyChainService.wd_ship_batch(batchId,receiver,currentUser.address)
                .then(response => {
                    console.log("response: ",response);
                    setMessage("Batch Has Been Shipped");
                    setSuccessful(true);
                    setModalLoading(false);
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
                    setModalLoading(false);
                    setCopied(false);
                    setMessage(resMessage);
                    setSuccessful(false);
                });

        }
    };

    const batchesColumns = [
        {
            name: 'BatchId',
            selector: 'batchId',
            sortable: true,
        },
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
        },
        {
            name: 'Status',
            selector: 'status',
            sortable: true,
        },
        {
            name: 'Expiration Date',
            selector: 'expiry_date',
            sortable: true,
        },
        {
            name: 'Chain',
            selector: 'chain',
            sortable: true,
            wrap: true

        },
        {
            name: "Action",
            cell: row => {if(row.status !== 'In Transit') { return(<button className="btn btn-outline-primary rounded-pill" value={row.batchId} onClick={handleOpen}>
                Ship Batch
            </button>)}}
        }
    ];

    return (
        <div>
            <NavBar />
            <div className="col-md-12">

                <div className="card container">
                    <h4 className="card-subtitle text-center text-black-50 mb-4">
                        Ship (InStore) Medicine Batch <img src={chainx} alt="chainx-logo" width={20}/>
                    </h4>

                    <div className="card-body">
                        {/*    list of batches on the blockchain*/}
                        <DataTable
                            columns={batchesColumns}
                            data={batches}
                            pagination={true}
                            striped={true}
                            highlightOnHover={true}
                            responsive={true}
                            progressPending={loading}
                        />
                    </div>

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
                            <h2 id="transition-modal-title">Ship Batch</h2>
                            <Form onSubmit={handleShip} ref={form}>

                                    <div>
                                        <div className="row g-3">
                                            <div className="form-group col-sm-6">
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
                                            <div className="col-sm-6">
                                                <label className="text-white-50" htmlFor="">Copy to Clipboard</label>
                                                <CopyToClipboard text={batchId}
                                                                 onCopy={handleCopy}>
                                                    <FontAwesomeIcon icon={faCopy} />
                                                </CopyToClipboard>
                                                {copied && (
                                                    <span className="text-success ml-1">BatchId Copied.</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            <div className="form-group col-sm-6">
                                                <label htmlFor="name">Receiver</label>
                                                <Input
                                                    type="text"
                                                    className="form-control rounded-pill"
                                                    name="receiver"
                                                    value={receiver}
                                                    onChange={onChangeReceiver}
                                                    validations={[required,validName]}
                                                />
                                            </div>
                                            <div className="form-group col-sm-6">
                                                <label htmlFor="role">Select Receiver Type</label>
                                                <select className="form-control rounded-pill"
                                                        name="role" id="role"
                                                        onChange={onChangeRole}
                                                        validations={[required]}
                                                >
                                                    <option value="" disabled>Please Choose</option>
                                                    {showW && (
                                                        <option value="Distributor">Distributor</option>
                                                    )}
                                                    {showD && (
                                                        <option value="Retailer">Retailer/Pharma</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <button className="btn btn-primary rounded-pill btn-block">
                                                Submit
                                            </button>
                                        </div>
                                    </div>



                                <CheckButton style={{display: "none"}} ref={checkBtn}/>
                            </Form>
                        </div>
                    </Fade>
                </Modal>

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={modalOpen}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={modalOpen}>
                        <div className={classes.paper}>
                            {modalLoading && (
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
                                    <a name="qr" href={imageUrl} download>
                                        <img src={imageUrl} alt="img"/>
                                    </a>
                                    <div className="row">
                                        <button onClick={handleClose} className="btn rounded-pill btn-warning mt-2">Close</button>
                                    </div>

                                </div>

                            ) : null}
                        </div>
                    </Fade>
                </Modal>

            </div>

        </div>

    )


};

export default WD_ShipProduct;