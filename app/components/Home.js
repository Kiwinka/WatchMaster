import React, {useEffect, useState, useRef} from "react";
import {Link, Route, useRouteMatch, BrowserRouter, useParams} from "react-router-dom";
import axios from "axios";
import ItemsCarousel from "react-items-carousel";
import LoadingOverlay from "react-loading-overlay";
import {Card} from "react-bootstrap";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import LinesEllipsis from 'react-lines-ellipsis'
import placeholderImage from "../img/placeholder.png";
import Movie from "./Movie";
import Footer from "./Footer.js"
import WindowDimensions from "./WindowDimensions";
import {Button} from "@material-ui/core";


const Home = (props) => {

  const { height, width } = WindowDimensions();

  //API replies
  const [movies, setMovies] = useState("");
  const [tv, setTv] = useState("");
  const [family, setFamily] = useState("");
  const [docs, setDocs] = useState("");

  const [firstLoading, setFirstLoading] = useState(true); //first loading of the page
  const [isLoading, setLoading] = useState(false); //waiting for API answer
  const [activeId, setActiveId] = useState(0); //clicked movie ID

  const [displayInRow, setDisplayInRow] = useState(8);

  //indexes of current displayed item in curousel
  const [activeItemIndex1, setActiveItemIndex1] = useState(0);
  const [activeItemIndex2, setActiveItemIndex2] = useState(0);
  const [activeItemIndex3, setActiveItemIndex3] = useState(0);
  const [activeItemIndex4, setActiveItemIndex4] = useState(0);

  const didMountRef = useRef(false);

  // references to detect changes in indexes of curousel
  const clickedM = useRef(null);
  const clickedT = useRef(null);
  const clickedF = useRef(null);
  const clickedD = useRef(null);

  // current displayed API page
  const [pageMovies, setPageMovies] = useState(1);
  const [pageTv, setPageTv] = useState(1);
  const [pageFamily, setPageFamily] = useState(1);
  const [pageDocs, setPageDocs] = useState(1);

  // wrapper of data for easier looping
  let activeItems = {
    movies: {index: activeItemIndex1, page: pageMovies},
    tv: {index: activeItemIndex2, page: pageTv},
    family: {index: activeItemIndex3, page: pageFamily},
    docs: {index: activeItemIndex4, page: pageDocs}
  };

  const FAMILYGENRE = 10751;
  const DOCSGENRE = 99;


  /*
  * First API GET request after the page is loaded
  * sets the state parameters
  */
  async function fetchDataStart() {
    setFirstLoading(true);
    let amovies = "https://api.themoviedb.org/3/movie/popular?api_key=39a85fabe12aa5a610dd6606db26efae";
    let atv = "https://api.themoviedb.org/3/tv/popular?api_key=39a85fabe12aa5a610dd6606db26efae";
    let afamily = "https://api.themoviedb.org/3/movie/popular?api_key=39a85fabe12aa5a610dd6606db26efae&with_genres=10751";
    let adocs = "https://api.themoviedb.org/3/movie/popular?api_key=39a85fabe12aa5a610dd6606db26efae&with_genres=99";

    const requestM = axios.get(amovies);
    const requestT = axios.get(atv);
    const requestF = axios.get(afamily);
    const requestD = axios.get(adocs);

    axios
        .all([requestM, requestT, requestF, requestD])
        .then(
            axios.spread((...responses) => {
              const responseM = responses[0];
              const responseT = responses[1];
              const responseF = responses[2];
              const responseD = responses[3];

              setMovies(responseM.data.results);
              setTv(responseT.data.results);
              setFamily(responseF.data.results);
              setDocs(responseD.data.results);
              setFirstLoading(false);
            })
        )
        .catch(errors => {
          // react on errors.
          console.error(errors);
          console.log("Not successful.");
        });
  }


  /*
  * API request triggered by changes of index in carousel
  * send request with the current data set
  */
  async function fetchData(type, genre, pageNumber) {
    setLoading(true);
    axios.get("https://api.themoviedb.org/3/" + type + "/popular?api_key=39a85fabe12aa5a610dd6606db26efae&with_genres=" + genre + "&page=" + pageNumber)
        .then((response) => {
          console.log(response.data);
          console.log("Data fetching is happening with page number " + pageNumber);
          console.log(response.data.results);
          if (genre === FAMILYGENRE)
            setFamily(family.concat(response.data.results));
          else if (genre === DOCSGENRE)
            setDocs(docs.concat(response.data.results));
          else {
            if (type === "movie")
              setMovies(movies.concat(response.data.results));
            else
              setTv(tv.concat(response.data.results));
          }
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
  }



  useEffect(() => {

    if (didMountRef.current) {      // rendering caused by a change in activeItems
      // listener on index change
      const change = Object.keys(activeItems).map((item) => {
        return (activeItems[item].index === (activeItems[item].page * 20 - 4))  //current page of data, 16th item
            ? item : false}).filter((item) => item)[0];
      // detects which item met the treshold for new data request

      //handle each section separately
      if (change === "movies") {
        if (clickedM.current === activeItems.movies.index)
          return;  // change was already handled
        clickedM.current = activeItems.movies.index;
        fetchData("movie", "", activeItems.movies.page + 1);
        setPageMovies(actual => actual + 1);
      }
      else if (change === "tv") {
        if (clickedT.current === activeItems.tv.index) return;
        clickedT.current = activeItems.tv.index;
        fetchData("tv", "", activeItems.tv.page + 1);
        setPageTv(actual => actual + 1);
      }
      else if (change === "family") {
        if (clickedF.current === activeItems.family.index) return;
        clickedF.current = activeItems.family.index;
        fetchData("movie", FAMILYGENRE, activeItems.family.page + 1);
        setPageFamily(actual => actual + 1);
      }
      else if (change === "docs") {
        if (clickedD.current === activeItems.docs.index) return;
        clickedD.current = activeItems.docs.index;
        fetchData("movie", DOCSGENRE, activeItems.docs.page + 1);
        setPageDocs(actual => actual + 1);
      }


    } else {
      // rendering for the first time
      didMountRef.current = true;
      fetchDataStart();
    }
  }, [activeItems]);

  // separate useEffect for managing changes of width in browser
  useEffect(() => {
    if (width < 1300) {
      setDisplayInRow(4);
    }
    else if (width < 1700) {
      setDisplayInRow(6);
    }
    else
      setDisplayInRow(8);
  }, [width, displayInRow]);


  if (firstLoading) {
    return <></>;
  } else {
    return (
        <>
          <div id="containterHome">
            <LoadingOverlay
                active={isLoading}
                spinner
                text='Loading...'
            >
              <h4 className="homeHeadline">Popular Movies</h4>
              <div className="carouselWrapper">
                <ItemsCarousel
                    infiniteLoop={true}
                    gutter={12}
                    activePosition={"center"}
                    chevronWidth={50}
                    disableSwipe={false}
                    alwaysShowChevrons={true}
                    numberOfCards={displayInRow}
                    slidesToScroll={4}
                    outsideChevron={true}
                    showSlither={false}
                    firstAndLastGutter={false}
                    activeItemIndex={activeItemIndex1}
                    requestToChangeActive={index => setActiveItemIndex1(index)}
                    leftChevron={<Button className="arrowL"><ArrowBackIosIcon style={{ fontSize: "4rem", marginLeft: "40px" }}/></Button>}
                    rightChevron={<Button className="arrowR"><ArrowForwardIosIcon style={{ fontSize: "4rem" }}/></Button>}
                >
                  {movies.map((item, index) => (
                      <Link to={{pathname: "detail/" + item.id + "/m" }} key={index} >
                        <Card style={{width: "180px"}} key={item.id} onClick={() => setActiveId(item.id)}>
                          <Card.Img variant="top"
                                    src={item.poster_path === null && item.backdrop_path === null ? placeholderImage : "https://image.tmdb.org/t/p/w500" + (item.poster_path === null ? item.backdrop_path : item.poster_path)}
                                    width="150px"/>
                          <Card.Body>
                            <Card.Text>{new Date(item.release_date).getFullYear()}</Card.Text>
                            <Card.Title><LinesEllipsis text={item.title === undefined ? item.original_name : item.title}
                                                       maxLine="3" elipsis="..." trimRight basedOn='letters'/></Card.Title>
                          </Card.Body>
                        </Card>
                      </Link>
                  ))}
                </ItemsCarousel>
              </div>

              <h4 className="homeHeadline">Popular TV series</h4>
              <div className="carouselWrapper">
                <ItemsCarousel
                    infiniteLoop={true}
                    gutter={12}
                    activePosition={"center"}
                    chevronWidth={50}
                    disableSwipe={false}
                    alwaysShowChevrons={true}
                    numberOfCards={displayInRow}
                    slidesToScroll={4}
                    outsideChevron={true}
                    showSlither={false}
                    firstAndLastGutter={false}
                    activeItemIndex={activeItemIndex2}
                    requestToChangeActive={index => setActiveItemIndex2(index)}
                    leftChevron={<Button className="arrowL"><ArrowBackIosIcon style={{ fontSize: "4rem", marginLeft: "40px" }}/></Button>}
                    rightChevron={<Button className="arrowR"><ArrowForwardIosIcon style={{ fontSize: "4rem" }}/></Button>}
                >
                  {tv.map((item, index) => (
                      <Link to={{pathname: "detail/" + item.id + "/tv" }} key={index} >
                        <Card style={{width: "180px"}} key={item.id} onClick={() => setActiveId(item.id)}>
                          <Card.Img variant="top"
                                    src={"https://image.tmdb.org/t/p/w500" + (item.poster_path === null ? item.backdrop_path : item.poster_path)}
                                    width="150px"/>
                          <Card.Body>
                            <Card.Text>{new Date(item.first_air_date).getFullYear()}</Card.Text>
                            <Card.Title><LinesEllipsis text={item.title === undefined ? item.original_name : item.title}
                                                       maxLine="3" elipsis="..." trimRight basedOn='letters'/></Card.Title>
                          </Card.Body>
                        </Card>
                      </Link>
                  ))}
                </ItemsCarousel>
              </div>

              <h4 className="homeHeadline">Family</h4>
              <div className="carouselWrapper">
                <ItemsCarousel
                    infiniteLoop={true}
                    gutter={12}
                    activePosition={"center"}
                    chevronWidth={50}
                    disableSwipe={false}
                    alwaysShowChevrons={true}
                    numberOfCards={displayInRow}
                    slidesToScroll={4}
                    outsideChevron={true}
                    showSlither={false}
                    firstAndLastGutter={false}
                    activeItemIndex={activeItemIndex3}
                    requestToChangeActive={index => setActiveItemIndex3(index)}
                    leftChevron={<Button className="arrowL"><ArrowBackIosIcon style={{ fontSize: "4rem", marginLeft: "40px" }}/></Button>}
                    rightChevron={<Button className="arrowR"><ArrowForwardIosIcon style={{ fontSize: "4rem" }}/></Button>}
                >
                  {family.map((item, index) => (
                      <Link to={{pathname: "detail/" + item.id + "/m" }} key={index} >
                        <Card style={{width: "180px"}} key={item.id} onClick={() => setActiveId(item.id)}>
                          <Card.Img variant="top"
                                    src={"https://image.tmdb.org/t/p/w500" + (item.poster_path === null ? item.backdrop_path : item.poster_path)}
                                    width="150px"/>
                          <Card.Body>
                            <Card.Text>{new Date(item.release_date).getFullYear()}</Card.Text>
                            <Card.Title><LinesEllipsis text={item.title === undefined ? item.original_name : item.title}
                                                       maxLine="3" elipsis="..." trimRight basedOn='letters'/></Card.Title>
                          </Card.Body>
                        </Card>
                      </Link>
                  ))}
                </ItemsCarousel>
              </div>

              <h4 className="homeHeadline">Documentary</h4>
              <div className="carouselWrapper">
                <ItemsCarousel
                    infiniteLoop={true}
                    gutter={12}
                    activePosition={"center"}
                    chevronWidth={50}
                    disableSwipe={false}
                    alwaysShowChevrons={true}
                    numberOfCards={displayInRow}
                    slidesToScroll={4}
                    outsideChevron={true}
                    showSlither={false}
                    firstAndLastGutter={false}
                    activeItemIndex={activeItemIndex4}
                    requestToChangeActive={index => setActiveItemIndex4(index)}
                    leftChevron={<Button className="arrowL"><ArrowBackIosIcon style={{ fontSize: "4rem", marginLeft: "40px" }}/></Button>}
                    rightChevron={<Button className="arrowR"><ArrowForwardIosIcon style={{ fontSize: "4rem" }}/></Button>}
                >
                  {docs.map((item, index) => (
                      <Link to={{pathname: "detail/" + item.id + "/m" }} key={index} >
                        <Card style={{width: "180px"}} key={item.id} onClick={() => setActiveId(item.id)}>
                          <Card.Img variant="top"
                                    src={item.poster_path === null && item.backdrop_path === null ? placeholderImage : "https://image.tmdb.org/t/p/w500" + (item.poster_path === null ? item.backdrop_path : item.poster_path)}
                                    width="150px"/>
                          <Card.Body>
                            <Card.Text>{new Date(item.release_date).getFullYear()}</Card.Text>
                            <Card.Title><LinesEllipsis text={item.title === undefined ? item.original_name : item.title}
                                                       maxLine="3" elipsis="..." trimRight basedOn='letters'/></Card.Title>
                          </Card.Body>
                        </Card>
                      </Link>
                  ))}
                </ItemsCarousel>
              </div>

              <Route
                  path={"detail/:id"}
                  render={(props) => <Movies {...props}/>}
              />

            </LoadingOverlay>
          </div>
          <Footer/>
        </>
    );
  }
};
export default Home;
