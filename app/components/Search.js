import React, {useEffect, createRef, useState} from "react";
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";
import Loader from "../img/loader.gif"
import SearchArrows from "./SearchArrows.js";
import {Card} from "react-bootstrap";
import placeholderImage from "../img/placeholder.png";
import LinesEllipsis from 'react-lines-ellipsis'
import {Link, Route} from "react-router-dom";

const Search = (props) => {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const showPrevLink = currentPage > 1;
  const showNextLink = totalPages > currentPage;


  let cancel = "";

  const handleOnInputChange = (event) => {
    const query = event.target.value;

    if (query === "") {
      setQuery(query);
      setResults({});
      setTotalPages(0);
      setCurrentPage(0);
      setIsLoading(false);
    } else {
      setQuery(query);
      setIsLoading(true);
      fetchSearch(1, query);
    }
  };


  async function fetchSearch(updatedPageNr = '', query) {

    if (cancel)
      cancel.cancel();

    const pageNumber = updatedPageNr ? updatedPageNr : '';

    cancel = axios.CancelToken.source();

    axios.get("https://api.themoviedb.org/3/search/movie?api_key=39a85fabe12aa5a610dd6606db26efae&language=en-US&query=" + query + "&page=" + pageNumber, {
      cancelToken: cancel.token,
    })
        .then((response) => {
          const noResults = response.data.total_results === 0 ? 'Nothing found.' : '';
          setResults(response.data.results);
          setMessage(noResults);
          setTotalPages(response.data.total_pages);
          setTotalResults(response.data.total_results);
          setCurrentPage(pageNumber);
          setIsLoading(false);
        })
        .catch((e) => {
          if (axios.isCancel(error) || error) {
            setMessage("Something went wrong. Try again.")
            setIsLoading(false);
            console.log(e);
          }
        });
  }

  const renderSearchResults = () => {
    if (Object.keys(results).length && results.length) {
      return (
          <div className="resultsWrapper">
            {results.map((result, index) => {
              return (
                  <Link to={{pathname: "detail/" + result.id + "/m" }} key={index} >
                    <Card className="cardSearch" key={result.id}>
                      <Card.Img variant="top"
                                src={result.poster_path === null && result.backdrop_path === null ? placeholderImage : "https://image.tmdb.org/t/p/w500" + (result.poster_path === null ? result.backdrop_path : result.poster_path)}
                                width="120px"/>
                      <Card.Body>
                        <Card.Title>
                          <LinesEllipsis text={result.title} maxLine="2" elipsis="..." trimRight basedOn='letters'/>
                        </Card.Title>

                      </Card.Body>
                    </Card>
                  </Link>
              );
            })}
            <Route
                path={"detail/:id"}
                render={(props) => <Movies {...props}/>}
            />
          </div>
      );
    }
  };

  //fetch data with updates page number
  const handlePageClick = (type) => {
    event.preventDefault();
    const updatedPageNr = 'prev' === type ? (currentPage - 1) : (currentPage + 1);
    if (!isLoading) {
      setIsLoading(true);
      fetchSearch(updatedPageNr, query);
    }
  };


  return (
      <>
        <div className="searchWrapper">
          <div className="inputWrapper">
            <h2>Type in what you're looking for:</h2>
            <label className="search-label" htmlFor="search-input">
              <input
                  type="text"
                  value={query}
                  id="search-input"
                  placeholder="Let's search"
                  onChange={handleOnInputChange}
                  autoFocus={true}
              />
              <SearchIcon style={{fontSize: "3rem"}}/>
            </label>
          </div>
          <SearchArrows
              loading={isLoading}
              showPrevLink={showPrevLink}
              showNextLink={showNextLink}
              handlePrevClick={() => handlePageClick('prev')}
              handleNextClick={() => handlePageClick('next')}
          />
          { renderSearchResults() }
          { message && <p className="message">{message}</p> }
          <img src={Loader} className={`search-loading ${isLoading ? 'show' : 'hide' }`}  alt="loader"/>
        </div>
      </>
  )

}

export default Search
