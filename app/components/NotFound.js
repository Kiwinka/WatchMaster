import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom";
import { Button } from "@material-ui/core";

const NotFound = (props) => {

  return (
      <>
        <div className="notFoundWrapper">
          <h2 className="notFoundText">Requested page was not found.</h2>
          <Link to="/"><Button className="notFoundButton">Return to main page</Button></Link>
        </div>
      </>
  )
}
export default NotFound
