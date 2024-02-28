//attribution <a href="https://www.flaticon.com/free-icons/next" title="next icons">Next icons created by Smashicons - Flaticon</a>
// another attribution <a href="https://www.flaticon.com/free-icons/back" title="back icons">Back icons created by Smashicons - Flaticon</a>
function WeekHeader(props) {
  return (
    <>
      <button>
        <img
          src="/previous.png"
          alt="Previous button"
          onClick={props.changeWeekDown}
        />
      </button>
      <div className="weekHeader">
        <h1>Week of {props.currWeekDate}</h1>
      </div>
      <button>
        <img src="/next.png" alt="Next button" onClick={props.changeWeekUp} />
      </button>
    </>
  );
}

export default WeekHeader;
