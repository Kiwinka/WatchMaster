import React, {useEffect, createRef, useState} from "react";
import muxjs from "mux.js";
import shaka from 'shaka-player';
import { useParams, withRouter } from "react-router-dom";
import {Button} from "@material-ui/core";
import WindowDimensions from "./WindowDimensions";

const VideoPlayer = (props) => {

  const { name } = useParams()

  const { height, width } = WindowDimensions();
  const [videoWidth, setVideoWidth] = useState(1000);

  //for correct HLS
  window.muxjs = muxjs;
  //Creating reference which will allow access to video player on DOM
  const videoComponent = createRef();

  useEffect(() => {
    //MPEG-DASH video URL
    const manifestUri = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
    //Reference to video component on DOM
    const video = videoComponent.current;
    //Initializing our shaka player
    const player = new shaka.Player(video);
    // asynchronously load the manifest.
    player.load(manifestUri)
        .then(() => {
          console.log('The video has been loaded successfully!');
    }).catch(e => console.log(e));
  }, [])

  //separate useEffect for handeling changes of width
  useEffect(() => {
    if(width < 1000)
      setVideoWidth(width-150);
    else if (width < 1200)
      setVideoWidth(width-200);
    else if (width < 1400)
      setVideoWidth(width-300)
    else
      setVideoWidth(width-400)
  }, [width, videoWidth]);


  return(
      <>
        <div className="videoWrapper">
          <h1>{name}</h1>
          <video
              width={videoWidth}
              ref={videoComponent}
              controls
              autoPlay
              className="watchVideo"
          />
          <Button className="videoButton" onClick={props.history.goBack}>Return to movie description</Button>
        </div>
      </>
  );
}
export default withRouter(VideoPlayer);
