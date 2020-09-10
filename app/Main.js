import React, {useEffect} from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import Navbar from "./components/Navbar.js"
import Home from "./components/Home.js"
import Movie from "./components/Movie.js"
import Search from "./components/Search.js"
import NotFound from "./components/NotFound"
import VideoPlayer from "./components/VideoPlayer.js"
import 'bootstrap/dist/css/bootstrap.min.css'
import './main.css'


const loader = document.querySelector('.loader');

const showLoader = () => loader.classList.remove('loader--hide');
const hideLoader = () => loader.classList.add('loader--hide');

const App = ({ hideLoader }) => {

  useEffect(hideLoader, []);

  return (

    <BrowserRouter>
      <Navbar/>

        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/detail/:id/:type" component={Movie}/>
          <Route exact path="/watch/:name" component={VideoPlayer}/>
          <Route exact path="/search" component={Search}/>
          <Route exact path="*" component={NotFound}/>
        </Switch>

    </BrowserRouter>
  )
}

ReactDOM.render(<App  hideLoader={hideLoader}
                      showLoader={showLoader}
                />, document.querySelector("#app"))

if (module.hot) {
  module.hot.accept()
}
