import React from "react"
import {Nav, Navbar} from "react-bootstrap"
import SearchIcon from '@material-ui/icons/Search';
import {Button} from "@material-ui/core";


const GlobalNavbar = () => {
  return (
      <>
        <Navbar expand="lg" >
          <Navbar.Brand href="/">WatchMaster</Navbar.Brand>
            <Nav className="mr-auto">
            </Nav>
            <Nav>
              <Nav.Link href="/search"><Button><SearchIcon/>Search</Button></Nav.Link>
            </Nav>
        </Navbar>
      </>
  )
}

export default GlobalNavbar
