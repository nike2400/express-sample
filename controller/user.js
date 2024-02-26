const bycrypt = require('bcrypt');
const { User } = require("../models/User")
const JWT = require('jsonwebtoken');
const sequelize = require('../libs/DbConnect');

const BCRYPT_SALT = 10;

// delete this later *** this code is just to confirm the connection with DB
exports.confirmDbConnection = async (req, res) => {
  let msg = ""
  try {
    await sequelize.authenticate();
    msg = 'Connection has been established successfully.';
    return res.status(200).json(msg);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.register = async (req, res) => {
  const password = req.body.password;
  try {
    // Password Hash
    req.body.password = bycrypt.hashSync(password, BCRYPT_SALT);

    const user = await User.create(req.body);

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.update = async (req, res) => {
  const userId = req.body.userId;

  try {
    const t = await sequelize.transaction();

    const user = await User.finByPk(userId);
    if (!user) {
      return res.status(500).json('No user is found');
    }

    user.set({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      // Add some parameters according to your project
    });

    await user.save();
    await t.commit();

    return res.status(200).json({ user });
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return res.status(500).json(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(500).json('No user is found');
    }

    await user.destroy();

    return res.status(200).json("User deleted");
  } catch (error) {
    return res.status(500).json(error);
  } finally {
    await sequelize.close();
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const t = await sequelize.transaction();

    const user = await User.findOne({
      where: { email: email },
    });
    if (!user) {
      return res.status(401).json({
        errors: {
          param: 'Email',
          message: 'Sing-in failed',
        }
      });
    }

    console.log(user);

    const authentication = await bycrypt.compare(password, user.password);
    if (!authentication) {
      return res.status(401).json({
        errors: {
          param: 'Password',
          message: 'Sing-in failed',
        }
      });
    }

    user.lastLogin = new Date();

    let result = await user.save();
    if (!result) {
      return res.status(500).json(error);
    }

    // JWT
    const token = JWT.sign({ id: user.id }, process.env.TOKEN_KEY, { expiresIn: '24h' });

    await t.commit();

    return res.status(201).json({ user, token });
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return res.status(500).json(error);
  }
};