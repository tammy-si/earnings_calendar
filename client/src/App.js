function App() {
  getWeeks();
  return (
    <div className="App">
      <h1>HI</h1>
    </div>
  );
}

async function getWeeks() {
  const response = await fetch("http://localhost:4000/");
  
  const weeks = await response.json();
  console.log(weeks);
}
export default App;
