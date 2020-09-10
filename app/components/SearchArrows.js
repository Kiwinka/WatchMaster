import React from 'react';
import {Button} from "@material-ui/core";


//2 buttons - previous and next used in search
export default (props) => {

  const {
    showPrevLink,
    showNextLink,
    handlePrevClick,
    handleNextClick,
    isLoading,
  } = props;

  console.log(props);

  return (
      <>
        <div className="buttonsWrapper">
          <div className="buttonPrev">
            <a href="#"
               className={` ${ showPrevLink ? 'show' : 'hide'} `}
               onClick={handlePrevClick}
            >
              <Button className="previous">Previous page</Button>
            </a>
          </div>
          <div className="buttonNext">
            <a
                href="#"
                className={` ${showNextLink ? 'show' : 'hide'} `}
                onClick={handleNextClick}
            >
              <Button className="next">Next page</Button>
            </a>
          </div>

        </div>
      </>
  );
};
