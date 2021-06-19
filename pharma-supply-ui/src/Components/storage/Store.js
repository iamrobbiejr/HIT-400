import React, {useEffect, useState} from 'react';
import chainx from "../../chainx.png";

// import SupplyChainService from '../../services/supply_chain.service';

const Store = () => {

    const [batches, setBatches] = useState();
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);

    // //initial load of batches
    // useEffect(() => {
    //     const batches = SupplyChainService.getBatches();
    //
    //     if (batches) {
    //         setBatches(batches);
    //     }
    // }, []);


    return (
        <div className="card col-md-8 mt-5">
            <h4 className="card-subtitle text-center text-black-50 mb-4">
                InStore Batches <img src={chainx} alt="chainx-logo" width={20}/>
            </h4>

            <div className="">
                {message && (
                    <div className="form-group">
                        <div
                            className={successful ? "alert alert-success" : "alert alert-danger"}
                            role="alert">
                            {message}
                        </div>
                    </div>
                )}
                {/*    table of batches*/}

            </div>

        </div>
    )
}

export default Store;