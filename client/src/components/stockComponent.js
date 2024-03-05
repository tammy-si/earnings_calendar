//attribution <a href="https://www.flaticon.com/free-icons/next" title="next icons">Next icons created by Smashicons - Flaticon</a>
// another attribution <a href="https://www.flaticon.com/free-icons/back" title="back icons">Back icons created by Smashicons - Flaticon</a>
// <a target="_blank" href="https://icons8.com/icon/j1UxMbqzPi7n/no-image">No Image</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
function Stock(props) {
  const altText = `Logo for ` + props.companyName;
  const img_url = props.img_url;
  const stockSymbol = props.stockSymbol;
  const yahooLink = props.yahooLink;
  return (
    <>
      <a href={yahooLink}>
        <div className="stockItem">
          <img
            src={img_url ? img_url : "icons8-no-image-100.png"}
            alt={altText}
          />
          <p>{stockSymbol}</p>
        </div>
      </a>
    </>
  );
}

export default Stock;
