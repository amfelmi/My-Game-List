const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcrypt');
const salt = 10;
const app = express();

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["POST", "GET"],
  credentials: true
}));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Password1",
  database: "users",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database!");
  }
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ message: "Please provide a token." })
  } else {
    jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ message: "Authentication Error." })
      } else {
        req.uid = decoded.uid
        req.username = decoded.username
        next();
      }
    })
  }
}



//API CALLS TO RAWG.API
app.get('/proxy/latest-games', async (req, res) => {
  const API_KEY = '4640b336cff145f98c613e2a8ea15843';
  const apiUrl = 'https://api.rawg.io/api/games';
  const { formattedDate } = req.query;

  try {
    const response = await axios.get(`${apiUrl}?dates=${formattedDate}&ordering=-added&key=${API_KEY}`);
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching latest releases:', error);
    return res.status(500).json({ error: 'Error fetching latest releases' });
  }
});

app.get('/proxy/anticipated-games', async (req, res) => {
  const API_KEY = '4640b336cff145f98c613e2a8ea15843';
  const apiUrl = 'https://api.rawg.io/api/games';
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().split('T')[0];

  try {
    const response = await axios.get(`${apiUrl}?dates=${formattedCurrentDate},2023-12-10&ordering=-added&key=${API_KEY}`);
    return res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching Anticipated releases:', error);
    return res.status(500).json({ error: 'Error fetching Anticipated releases' });
  }
});

app.get('/proxy/game-detail', async (req, res) => {
  const API_KEY = '4640b336cff145f98c613e2a8ea15843';
  const { gameId } = req.query;
  const apiUrl = `https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`;
  try {
    const response = await axios.get(apiUrl);
    return res.json(response.data);
  } catch (error) {
    console.error('Server Error fetching game detail:', error);
    return res.status(500).json({ error: 'Error fetching game detail' });
  }
});



//USER VERIFICATION AND DATA RETREIVAL API
app.get('/get-uid', verifyUser, (req, res) => {
  const uid = req.uid;
  return res.json({ Status: "Success", uid: uid })
})

app.get('/get-username', verifyUser, (req, res) => {
  const username = req.username;
  return res.json({ Status: "Success", username: username })
})

app.get('/check-auth', verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});



//USER REGISTRATION SYSTEM: SIGN UP, SIGN IN, AND SIGN OUT
app.post("/users", (req, res) => {
  const sql = "INSERT INTO users_login (username, email, password) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "Error for hashing password" });
    const values = [
      req.body.username,
      req.body.email,
      hash
    ]
    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Error inserting user data:", err);
        res.status(500).json({ error: "An error occurred while signing up." });
      } else {
        console.log("User signed up successfully:", result);
        res.status(200).json({ message: "User signed up successfully." });
      }
    });
  })
});

app.post("/users_login", (req, res) => {
  const sql = "SELECT * FROM users_login WHERE email = ?";
  db.query(sql, [req.body.email], (err, result) => {
    if (err) {
      return res.json({ Error: "Email compare error" })
    }

    if (result.length > 0) {
      bcrypt.compare(req.body.password.toString(),
        result[0].password, (err, response) => {
          if (err) return res.json({ Error: "Password compare error" });
          if (response) {
            const uid = result[0].uid;
            const username = result[0].username;
            const token = jwt.sign({ uid, username }, "our-jsonwebtoken-secret-key", { expiresIn: '1d' });
            res.cookie('token', token);
            return res.status(200).json("Success")
          }
        })
    } else {
      return res.status(401).json("Failed")
    }
  });
});

app.get('/signout', (req, res) => {
  res.clearCookie('token', { expires: new Date(0) });
  return res.json({ Status: "Success" });
})



//USER GAME DATABASE API
app.post('/add-game', (req, res) => {
  const { gid, uid } = req.body;

  const sql = "INSERT INTO mylist (gid, uid) VALUES (?, ?)";

  db.query(sql, [gid, uid], (err, result) => {
    if (err) {
      console.error("Error adding game to list:", err);
      return res.status(500).json({ error: "An error occurred while adding the game to the list." });
    } else {
      return res.status(200).json({ message: "Game added to the list successfully." });
    }
  });
});

app.get('/isInList', (req, res) => {
  const sql = "SELECT * FROM mylist WHERE GID = ? AND UID = ?";
  const gid = req.query.gid;
  const uid = req.query.uid;

  db.query(sql, [gid, uid], (err, result) => {
    if (err) {
      console.error("Error checking IDs in the list:", err);
      res.status(500).json({ error: "An error occurred while checking IDs." });
    } else {
      if (result.length > 0) {
        return res.json({ isInList: true });
      } else {
        return res.json({ isInList: false });
      }
    }
  });
});

app.get('/get-games', (req, res) => {
  const currentPage = req.query.page || 1;
  const limit = 60;
  const offset = (currentPage - 1) * limit;

  const sql = "SELECT gid, title, image, date_released, rating FROM steam limit ? offset ?";

  db.query(sql, [limit, offset], (err, result) => {
    if (err) {
      console.error("Error fetching game data:", err);
      res.status(500).json({ error: "An error occurred while fetching game data." });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/get-mylist', (req, res) => {
  const { uid } = req.query;
  const sql = "SELECT gid, title, image, date_released, rating FROM steam WHERE gid IN (SELECT gid FROM mylist WHERE uid = ? AND list IS NULL)";

  db.query(sql, [uid], (err, result) => {
    if (err) {
      console.error("Error fetching games by UID:", err);
      res.status(500).json({ error: "An error occurred while fetching games." });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/get-games-by-uid', (req, res) => {
  const { uid, condition } = req.query;
  const sql = "SELECT gid, title, image, date_released, rating FROM steam WHERE gid IN (SELECT gid FROM mylist WHERE uid = ? AND list = ?)";

  db.query(sql, [uid, condition], (err, result) => {
    if (err) {
      console.error("Error fetching games by UID:", err);
      res.status(500).json({ error: "An error occurred while fetching games." });
    } else {
      res.status(200).json(result);
    }
  });
});



//REMOVE FROM LIST
app.delete('/remove-from-mylist', (req, res) => {
  const uid = req.body.uid;
  const gid = req.body.gid;
  const sql = "DELETE FROM mylist WHERE uid = ? AND gid = ?";

  db.query(sql, [uid, gid], (err, result) => {
    if (err) {
      console.error("Error removing game:", err);
      res.status(500).json({ error: "An error occurred while removing games." });
    } else {
      res.status(200).json(result);
    }
  });
});



// USER RATINGS SECTIONS
app.get('/get-user-ratings', (req, res) => {
  const uid = req.query.uid;

  const sql = "SELECT * FROM mylist WHERE UID = ?";

  db.query(sql, [uid], (err, result) => {
    if (err) {
      console.error("Error fetching user ratings:", err);
      res.status(500).json({ error: "An error occurred while fetching user ratings." });
    } else {
      res.json(result);
    }
  });
});

app.get('/get-user-lists', (req, res) => {
  const uid = req.query.uid;

  const sql = "SELECT * FROM mylist WHERE uid = ?";

  db.query(sql, [uid], (err, result) => {
    if (err) {
      console.error("Error fetching user lists:", err);
      res.status(500).json({ error: "An error occurred while fetching user lists." });
    } else {
      res.json(result);
    }
  });
});

app.post('/insert-rating', (req, res) => {
  const { uid, gid, rating } = req.body;

  const sql = "INSERT INTO mylist (GID, UID, Rating) VALUES (?, ?, ?)";

  db.query(sql, [gid, uid, rating], (err, result) => {
    if (err) {
      console.error("Error inserting rating:", err);
      res.status(500).json({ error: "An error occurred while inserting rating." });
    } else {
      res.status(200).json({ message: "Rating inserted successfully." });
    }
  });
});

app.put('/update-rating', (req, res) => {
  const { gid, uid, rating } = req.body;

  const sql = "UPDATE mylist SET rating = ? WHERE gid = ? AND uid = ?";

  db.query(sql, [rating, gid, uid], (err, result) => {
    if (err) {
      console.error("Error updating rating:", err);
      res.status(500).json({ error: "An error occurred while updating rating." });
    } else {
      res.status(200).json({ message: "Rating updated successfully." });
    }
  });
});

app.post('/insert-game-into-list', (req, res) => {
  const { uid, gid, list } = req.body;

  const sql = "INSERT INTO mylist (uid, gid, list) VALUES (?, ?, ?)"

  db.query(
    sql, [uid, gid, list], (error, results) => {
      if (error) {
        console.error('Error inserting game into list:', error);
        return res.status(500).json({ message: 'Error inserting game into list' });
      }

      return res.status(200).json({ message: 'Game inserted into list successfully' });
    }
  );
});

app.put('/update-game-list', (req, res) => {
  const { uid, gid, list } = req.body;

  const sql = "UPDATE mylist SET list = ? WHERE uid = ? AND gid = ?"

  db.query(
    sql, [list, uid, gid], (error, results) => {
      if (error) {
        console.error('Error updating game list:', error);
        return res.status(500).json({ message: 'Error updating game list' });
      }

      return res.status(200).json({ message: 'Game list updated successfully' });
    }
  );
});

//PODIUM ENDPOINTS
app.get('/get-podium-games', (req, res) => {
  const { uid } = req.query;

  const query = `SELECT * FROM podium WHERE UID = ?`;
  db.query(query, [uid], (error, results) => {
    if (error) {
      console.error('Error fetching podium games:', error);
      return res.status(500).json({ message: 'Error fetching podium games' });
    }

    res.status(200).json(results);
  });
});

app.post('/update-podium-game', (req, res) => {
  const { uid, gid, position } = req.body;

  // Checking if a game already exists in the podium position
  const checkQuery = `SELECT * FROM podium WHERE UID = ? AND position = ?`;
  db.query(checkQuery, [uid, position], (error, results) => {
    if (error) {
      console.error('Error checking podium game:', error);
      return res.status(500).json({ message: 'Error checking podium game' });
    }

    if (results.length > 0) {
      const updateQuery = `UPDATE podium SET GID = ? WHERE UID = ? AND position = ?`;
      db.query(updateQuery, [gid, uid, position], (error, updateResults) => {
        if (error) {
          console.error('Error updating podium game:', error);
          return res.status(500).json({ message: 'Error updating podium game' });
        }

        res.status(200).json({ message: 'Podium game updated successfully' });
      });
    } else {
      // If no game existss
      const insertQuery = `INSERT INTO podium (UID, GID, position) VALUES (?, ?, ?)`;
      db.query(insertQuery, [uid, gid, position], (error, insertResults) => {
        if (error) {
          console.error('Error inserting podium game:', error);
          return res.status(500).json({ message: 'Error inserting podium game' });
        }

        res.status(200).json({ message: 'Podium game inserted successfully' });
      });
    }
  });
});


//Initialize
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
