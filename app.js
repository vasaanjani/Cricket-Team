const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use = express.json();

const path = require("path");

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//GET Method

app.get("/players/", async (request, response) => {
  const getAllPlayersDetails = `
    SELECT 
    * 
    FROM

    cricket_team
    ORDER BY 
    player_id;`;

  const allPlayerDetails = await db.all(getAllPlayersDetails);
  response.send(allPlayerDetails);
});

//POST Method

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const addPlayerDetails = `
    INSERT INTO cricket_team(player_name,jersey_number,role)

    VALUES(
       ' ${playerName}',
        ${jerseyNumber},
        '${role}'
         ); `;

  const dbResponse = await db.run(addPlayerDetails);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

//GET Method

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerDetails = `
        SELECT 
        * 
        FROM
        cricket_team
        WHERE player_id=${playerId};`;

  const playerDetails = await db.get(getPlayerDetails);
  response.send(playerDetails);
});

//PUT Method

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const playerUpdateDetails = `
    
    UPDATE cricket_team

    SET 

    player_name='${playerName}',
    jersey_number=${jerseyNumber},
    role='${role}'
    
    WHERE player_id=${playerId};`;

  const updatePlayer = await db.run(playerUpdateDetails);
  response.send("Player Details Updated");
});

// DELETE Method

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const deletePlayerDetails = `
    
    DELETE FROM cricket_team
    WHERE player_id=${playerId};`;

  const deletedPlayerDetails = await db.run(deletePlayerDetails);
  response.send("Player removed");
});
