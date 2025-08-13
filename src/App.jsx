import { useState } from "react";
import "./App.css";

function App() {
  const [welcomeText, setWelcomeText] = useState("Welcome!");
  const ru = () => {
    setWelcomeText("Fuck you Ru");
  };

  return (
    <>
      <div>
        <h2 className="app-header">Draft Aid</h2>
      </div>
      <div className="players_table">{welcomeText}</div>
      <button onClick={ru}>Click to get started</button>
    </>
  );
}

export default App;
