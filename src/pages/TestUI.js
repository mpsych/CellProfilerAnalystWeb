import React from 'react';
import { Row, Col} from "reactstrap";
import {Box, Button, Grid, IconButton, Menu, MenuItem}from '@material-ui/core'; 
import logo from '../CPA_newlogo.png';
import {Image, Dropdown, DropdownButton} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import BelladndTest from './BelladndTest'

function TestUI(){
    
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return (
        <div>
    
        <Row>
       
        
        <Col>
        <Image src={logo} style={{marginRight:"40%", height:'90px'}}></Image>
        </Col>

        <Col >
        <IconButton style={{color: "black", marginLeft:"50%"}}> <SaveAltIcon /></IconButton> 
        </Col>


        </Row>
        <Row>
        
        <Grid container justify="center" spacing={2} style={{marginBottom: 15}}>
       
        <Grid key={0} item>
        {/* <DropdownButton variant="secondary" title= "Fetch">
        
         <Dropdown.Item >Positive</Dropdown.Item>
         <Dropdown.Item >Negative</Dropdown.Item>
         <Dropdown.Item >Random</Dropdown.Item>
        
        </DropdownButton> */}
            <Button variant="contained" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            Fetch
            </Button>
            <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            >
            <MenuItem onClick={handleClose}>Random</MenuItem>
            <MenuItem onClick={handleClose}>Positive</MenuItem>
            <MenuItem onClick={handleClose}>Negative</MenuItem>
            </Menu>
    </Grid>


        <Grid key={1} item>
        <Button variant="contained">Train</Button>
        </Grid>

        <Grid key={2} item>
        <Button variant="contained">Evulate</Button>
        </Grid>
    </Grid>
    </Row>

    <BelladndTest></BelladndTest>
 
    </div>

    );
}

export default TestUI; 