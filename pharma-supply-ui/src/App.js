import React from "react";
import {Switch, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';


// import SupplyChainService from './services/supply_chain.service';

// import pages
import Login from "./Components/login/login";
import Register from "./Components/signup/register";
import Home from "./Components/home/home";
import Profile from './Components/profile/profile';
import Check_Product from "./Components/check-product/check_product";
import Ship_Product from "./Components/ship-product/ship_product";
import Scan_Shipment from "./Components/scan-shipment/scan_shipment";
import Dashboard from "./Components/admin/dashboard";
import WD_ShipProduct from "./Components/ship-product/WD_ShipProduct";

const App = () => {

  return (
      <div>
        <div className="container mt-3">
          <Switch>
            <Route exact path={['/', '/home']} component={Home} />
            <Route exact path={'/login'} component={Login} />
            <Route exact path={'/register'} component={Register} />
            <Route path={'/dashboard'} component={Dashboard}/>
            <Route exact path={'/check-products'} component={Check_Product}/>
            <Route path={'/profile'} component={Profile} />
            <Route path={'/ship-product'} component={Ship_Product}/>
            <Route path={'/WD_ShipProduct'} component={WD_ShipProduct} />
            <Route path={'/scan_shipment/:id'} component={Scan_Shipment} />
          </Switch>
        </div>
      </div>
  )
}

export default App;
