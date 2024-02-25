const express = require('express');
const router = express.Router();
const userController = require("../../controller/user")

// Routes for "http://localhost:4000/api/user"
router.post('/register',
  // It's better to create other files and read them to keep routes file organised.
  // Just look at "../controller/user"
  userController.register,
);

router.post('/update',
  userController.update,
);

router.post('/delete',
  userController.delete,
);

router.post('/login',
  userController.login,
);

// Delete this later *** this code is just to confirm the connection with DB
// To confirm, just acccess "http://localhost:4000/api/user/db"
router.get('/db',
  userController.confirmDbConnection,
);

module.exports = router;