//attribution <a href="https://www.flaticon.com/free-icons/next" title="next icons">Next icons created by Smashicons - Flaticon</a>
// another attribution <a href="https://www.flaticon.com/free-icons/back" title="back icons">Back icons created by Smashicons - Flaticon</a>
function WeekHeader(props) {
  return (
    <>
      <div className="weekHeader">
        {props.currWeekIndex > 0 ? (
          <img
            src="/previous.png"
            alt="Previous button"
            onClick={props.changeWeekDown}
          />
        ) : (
          <div></div>
        )}
        <h1>Week of {props.currWeekDate}</h1>
        {props.currWeekIndex < 3 ? (
          <img src="/next.png" alt="Next button" onClick={props.changeWeekUp} />
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}

export default WeekHeader;
