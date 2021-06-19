import React,{useEffect, useState} from 'react';
import logo from "../../chainx.png";
import AuthService from '../../services/auth.service';
import SupplyChainService from '../../services/supply_chain.service'
import DataTable, { createTheme } from 'react-data-table-component';
import NavBar from "../includes/NavBar";

createTheme('solarized', {
    text: {
        primary: '#268bd2',
        secondary: '#2aa198',
    },
    background: {
        default: '#002b36',
    },
    context: {
        background: '#cb4b16',
        text: '#FFFFFF',
    },
    divider: {
        default: '#073642',
    },
    action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: 'rgba(0,0,0,.12)',
    },
});

const Dashboard = () => {

    const [users, setUsers] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
       AuthService.getUsers().then(response => {
           setUsers(response);
           setLoading(false);

       }).catch(err => {
           console.log(err);
           setLoading(false);
       })

        SupplyChainService.getAllBatches().then(res => {
            console.log(res);
            setBatches(res);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        })

    }, []);


    console.log("Outside ", users);

    const date = Date().toLocaleString();

    const columns = [
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
        },
        {
            name: 'Email',
            selector: 'email',
            sortable: true,
        },
        {
            name: 'Role',
            selector: 'role',
            sortable: true,
            wrap: true
        },
        {
            name: 'Address',
            selector: 'address',
            sortable: true,
            wrap: true

        }
    ];

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

        }
    ];

    return (
        <div>
            <NavBar />
            <div className="container scroll">
                <header className="jumbotron mt-2">
                    <img src={logo} alt="Chainx-Logo" className="profile-img-card"/>
                    <h3 className="card-title text-center">MCAZ - Regulatory Services</h3>
                    <div className="card-body text-center">
                        Blockchain Data : <span className="">{date}</span>
                    </div>
                </header>
                <div className="card col-md-12">
                    <div className="card-header rounded-pill bg-dark">
                        <h5 className="card-title text-center text-white">Registered Nodes</h5>
                    </div>
                    <div className="card-body">
                        {/*    list of users on the blockchain*/}
                        <DataTable
                            columns={columns}
                            data={users}
                            pagination={true}
                            striped={true}
                            highlightOnHover={true}
                            progressPending={loading}
                        />
                    </div>
                    <hr/>
                    <div className="card-header rounded-pill bg-dark">
                        <h5 className="card-title text-center text-white">Medicinal Products in Transit</h5>
                    </div>
                    <div className="card-body">
                        {/*    list of products in transit*/}
                        <DataTable
                            columns={batchesColumns}
                            data={batches}
                            pagination={true}
                            striped={true}
                            highlightOnHover={true}
                        />
                    </div>

                </div>
            </div>
        </div>

    )

}

export default Dashboard;