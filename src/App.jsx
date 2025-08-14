import { useEffect, useState } from "react";
import "./App.css";
import Papa from "papaparse";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSojpR5_4MY-OOhUVpUShXf-ODceHjkEo6T0ZXwkXLEOCMiJM30HF3Goe0GZ6stM6R5qcYfl3sf6CaI/pub?gid=1725499445&single=true&output=csv";

function App() {
  const [players, setPlayers] = useState([]);
  const [drafted, setDrafted] = useState([]);
  // const [slimPlayers, setSlimPlayers] = useState([]);

  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true, // If your CSV has a header row
          complete: (results) => {
            setPlayers(results.data);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    };
    fetchCSVData();
  }, []);

  const slimPlayers = players.map((p) => ({
    Tier: p.TIERS,
    Pos: p.POS,
    Name: p.PLAYERNAME,
  }));

  const draftPlayer = (row) => {
    console.log(row);
    setPlayers((prevPlayers) =>
      prevPlayers.filter((p) => p.PLAYERNAME !== row.PLAYERNAME)
    );
    setDrafted((prevPlayers) => [row, ...prevPlayers]);
  };

  const undoLastPick = () => {
    if (drafted.length === 0) return;
    const lastPlayer = drafted[0];
    setPlayers((prevPlayers) => sortByRank([...prevPlayers, lastPlayer]));
    setDrafted((prev) => prev.slice(1));
  };

  console.log(players);
  console.log(slimPlayers);
  console.log(drafted);

  const tierColors = {
    1: "bg-yellow-100",
    2: "bg-green-100",
    3: "bg-blue-100",
    4: "bg-purple-100",
    5: "bg-pink-100",
    6: "bg-red-100",
    7: "bg-orange-100",
    8: "bg-lime-100",
    9: "bg-teal-100",
    10: "bg-cyan-100",
    11: "bg-sky-100",
    12: "bg-indigo-100",
    13: "bg-violet-100",
    14: "bg-fuchsia-100",
    15: "bg-rose-100",
    16: "bg-gray-100",
  };

  const sortByRank = (arr) => {
    return [...arr].sort((a, b) => {
      const tierA = parseInt(a.RK, 10);
      const tierB = parseInt(b.RK, 10);
      return tierA - tierB; // Ascending order
    });
  };

  return (
    <div>
      <h2 className="text-2xl p-6 bg-gray-50 text-center">
        The Ultimate Dynasty Draft Aid
      </h2>
      <div className="flex flex-row gap-8 p-6 bg-gray-50 min-h-screen">
        {/* Available Players */}
        <div className="bg-white p-4 rounded-lg shadow-md flex-1">
          <h2 className="text-xl font-bold mb-4">Available Players</h2>
          {players.length > 0 ? (
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  {Object.keys(slimPlayers[0]).map((key) => (
                    <th key={key} className="px-4 py-2 text-left">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slimPlayers.map((row, index) => (
                  <tr
                    key={index}
                    className={`cursor-pointer hover:bg-gray-100 hover:font-bold ${
                      tierColors[row.Tier] || ""
                    }`}
                    onClick={() => draftPlayer(players[index])}
                  >
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-4 py-2">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading data...</p>
          )}
        </div>

        {/* Drafted Players */}
        <div className="bg-white p-4 rounded-lg shadow-md w-1/3">
          <h2 className="text-xl font-bold mb-4">Drafted Players</h2>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={undoLastPick}
            disabled={drafted.length === 0}
          >
            Undo Last Pick
          </button>
          {drafted.length > 0 ? (
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Tier</th>
                  <th className="px-4 py-2 text-left">Pos</th>
                  <th className="px-4 py-2 text-left">Name</th>
                </tr>
              </thead>
              <tbody>
                {drafted.map((p, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2">{p.TIERS}</td>
                    <td className="px-4 py-2">{p.POS}</td>
                    <td className="px-4 py-2">{p.PLAYERNAME}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No players drafted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
