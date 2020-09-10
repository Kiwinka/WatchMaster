import React, {useEffect, useState} from "react"
import {Link, Route, useParams} from "react-router-dom";
import axios from "axios";
import { Box, Button } from "@material-ui/core";
import placeholderImage from "../img/placeholder.png";
import VideoPlayer from "./VideoPlayer";
import NotFound from "./NotFound";
import WindowDimensions from "./WindowDimensions";
test

const Movie = (props) => {

  const { id } = useParams()
  const { type } = useParams() // m (for movie) or tv (for tv series)

  const [isLoading, setLoading] = useState(true);
  const [details, setDetails] = useState("");
  const [isError, setError] = useState(false);
  const [isMovie, setIsMovie] = useState("");


  async function loadDetails(isMovie) {
    if (isError)
      return;
    setLoading(true);
    const type = isMovie ? "movie" : "tv";
    axios.get("https://api.themoviedb.org/3/" + type + "/" + id + "?api_key=39a85fabe12aa5a610dd6606db26efae&language=en-US")
        .then((response) => {
          setDetails(response.data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setError(true);
          setLoading(false);
        });
  }

  //indentify type of id (movie or tv series) and send fetch data request
  useEffect(() => {
    if (isError)
      return;
    if (type === "m") {
      setIsMovie(true);
      loadDetails(true);
    }
    else if (type === "tv") {
      setIsMovie(false);
      loadDetails(false);
    }
    else {
      setError(true);
      setLoading(false);
      return;
    }

  }, [isError, isMovie]);



  if (isError) {
    return (<NotFound/>);
  }
  if (isLoading) {
    return (<></>);
  }
  else {
    return (
        <>
          <div id="containterMovie">
            <div className="movieWrapper">
              <Box display="flex" style={{width: "50%", float: "left"}}>
                <div className="movieText">

                  <h1>{isMovie ? details.title : details.name}</h1>
                  <h4>{details.tagline}</h4>

                  <ul>{details.genres.map((genre => {
                    return (<li key={genre.id}>{genre.name}</li>)
                  }))}</ul>
                  <hr/>
                  <h6>Original language: {details.original_language}</h6>
                  {isMovie ?
                      <h6>Released: {new Date(details.release_date).toLocaleDateString()}</h6>
                      : <><h6>{details.number_of_seasons + " seasons, " + details.number_of_episodes + " episodes"}</h6>
                          <h6>First aired: {new Date(details.first_air_date).toLocaleDateString()}</h6>
                          <h6>Last aired: {new Date(details.last_air_date).toLocaleDateString()}</h6>
                        </>
                  }
                  <hr/>
                  <h6>{details.overview}</h6>
                  <Link to={{pathname: "/watch/" + (isMovie ? details.title : details.name) }}><Button className="playMovie">WATCH MOVIE</Button></Link>
                </div>
              </Box>
              <Box display="flex" style={{float: "right", width: "35%"}}>
                <div className="movieImageWrapper">
                  <img
                      src={details.poster_path === null && details.backdrop_path === null ? placeholderImage : "https://image.tmdb.org/t/p/w500" + (details.poster_path === null ? details.backdrop_path : details.poster_path)}
                      width="100%" height="auto" className="imgMovie"/>
                </div>
              </Box>
            </div>
          </div>

          <Route
              path={"/watch/:name"}
              render={(props) => <VideoPlayer {...props}/>}
          />
        </>
    );
  }
}

export default Movie;
