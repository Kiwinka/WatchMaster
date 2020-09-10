
# WatchMaster


The web application is for browsing popular movies, with a short detail page of a selected movie.
In each detail page, there is an option to play a short movie trailer. 
The application was implemented and tested 
using Google Chrome.


---

### Information about the application

After downloading the application, run:
```
npm install
npm run start
```
---


## Implementation details

The application was developed using React with **React Hooks** approach. 

### Application structure


On the **home page**, four carousels are displayed, each for one of the category 
(Popular movies, Popular TV shows, Family movies and Documentaries). When scrolling in a carousel, it gets automatically updated.
After clicking on one of the movies, the **Detail page** is displayed. 
Its URL consists of the clicked movie ID and */t* or */m* to determine whether a movie or a TV show was clicked.
Invalid links are resolved in **404 page**.
In the detail page, the user can play a hardcoded short movie. It displays on a new **watch page** with a possibility to return 
to the previous page using the button under the player.
On the navigation bar at the top of the page, user can return to the home page any time clicking the name of the application,
or they can use a Search button to **search** for any movie in the API's library. The search process is real-time responsive.
The results are displayed 20 at a time, with *Next* and *Previous* buttons to see more pages of results. Found movies are 
clickable and their details will be displayed.

The application was designed to be responsive on any display or browser size.

### Data Fetching
All the data is fetched from a provided [API](https://www.themoviedb.org/documentation/api) using Axios library.

### Shaka player
The short movie trailer is played using [Shaka player](https://github.com/google/shaka-player). 
To play m3u8 file, the integration of [Mux.js](https://github.com/videojs/mux.js/) library was necessary. The video starts playing after the page is loaded, the width of the video is dependent on the width of the screen.
There is an unresolved error when loading the video:
```
Failed to load resource: the server responded with a status of 501 (Not Implemented)

Access to fetch at 'https://bitdash-a.akamaihd.net/content/sintel/hls/audio/stereo/en/128kbit/seq-0.ts' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
```
I did not find a solution to this problem yet.

### Used libraries

- [react-items-carousel](https://github.com/bitriddler/react-items-carousel) for browsing movies on the home page
- [react-loading-overlay](https://github.com/derrickpelletier/react-loading-overlay) for displaying when loading data on the home page
- [react-lines-ellipsis](https://github.com/xiaody/react-lines-ellipsis) for cutting long texts and adding "..." at the end of them
- [material-ui](https://material-ui.com/) for icons and components (Button and Box)
- [react-bootstrap](https://react-bootstrap.netlify.app/) for Card and Navbar component




