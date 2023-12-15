// Code for mongoose config in backend
// Filename - backend/index.js

// To connect with your mongoDB database

const express  = require("express");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

const secretKey = '23498hq3e413f40';

app.use(express.json());
mongoose.connect("mongodb+srv://dwayne_reinaldy:mongodb123@cluster0.qufy1vp.mongodb.net/?retryWrites=true&w=majority", {
	dbName: "FitnessWeb",
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection failed: "));
db.once("open",function(){
	console.log("Connected to database successfully");
});

const verifyToken = (req, res, next) => {
	const token = req.header('Authorization');
  
	if (!token) {
	  return res.status(401).json({ message: 'Unauthorized' });
	}
  
	jwt.verify(token, secretKey, (err, decoded) => {
	  if (err) {
		return res.status(401).json({ message: 'Invalid token' });
	  }
  
	  req.userId = decoded.userId;
	  next();
	});
  };
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	height: {
		type: Number,
	},
	weight: {
		type: Number,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	pass:{
		type: String,
		required: true,
	},
});

const calorieEntrySchema = new mongoose.Schema({
	user: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'User',
	  required: true,
	},
	entries: [
	  {
		date: {
		  type: Date,
		  default: Date.now,
		},
		food: {
		  type: String,
		  required: true,
		},
		totalCalories: {
		  type: Number,
		  required: true,
		},
	  },
	],
  });
const User = mongoose.model('User', UserSchema);
const CalorieEntry = mongoose.model('CalorieEntry', calorieEntrySchema);
module.exports = { User, CalorieEntry };

User.createIndexes();
CalorieEntry.createIndexes();


const cors = require("cors");
const { Int32 } = require("mongodb");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {

	resp.send("App is Working");
});

app.get('/users/find-user/:userId', async (req, res) => {
	try {
	  const userId = req.params.userId;
	  console.log(userId)
	  const user = await User.findById(userId);
  
	  if (!user) {
		return res.status(404).json({ message: 'User not found' });
	  }
  
	  res.json({ name: user.name, email: user.email, height: user.height, weight: user.weight });
	} catch (error) {
	  console.error('Error finding user:', error);
	  res.status(500).json({ message: 'Internal Server Error' });
	}
  });

app.get('/users/total-calories/:userId/:dateCal', async (req, res) => {
	try {
	  const userId = req.params.userId;
	  const dateCal = req.params.dateCal;
	  const date = new Date(req.params.dateCal);
	  console.log(userId,date)
	  const user = await CalorieEntry.findOne({
		user: userId,
		'entries.date': { $eq: date }
	  });
  
	  if (!user) {
		return res.status(404).json({ message: 'User not found' });
	  }

	  const matchingEntries = user.entries.filter(item=>item.food == 'bread')
  	  console.log(matchingEntries); // An array of matching entries
	  res.json({ userid: user.user, entries: user.entries });
	} catch (error) {
	  console.error('Error finding user:', error);
	  res.status(500).json({ message: 'Internal Server Error' });
	}
  });

// app.get('/users/total-calories/:userId/:dateCal', async (req, res) => {
// 	try {
// 	  const userId = req.params.userId;
// 	  const dateCal = req.params.dateCal;
// 	  console.log(userId, dateCal);

// 	  const entries = await CalorieEntry.find({
// 		user: userId,
// 		'entries.date': { $eq: dateCal }, // Filter by user and date
// 	  });
  
// 	  if (!entries.length) {
// 		return res.status(404).json({ message: 'No entries found for that date' });
// 	  }
  
// 	  res.json({
// 		userid: userId,
// 		entries : entries, 
// 	  });
// 	} catch (error) {
// 	  console.error('Error finding user:', error);
// 	  res.status(500).json({ message: 'Internal Server Error' });
// 	}
//   });

app.post("/register", async (req, resp) => {
	try {
	  const { name, height, weight, email, pass } = req.body;
  
	  if (!pass) {
		return resp.status(400).send("Password is required");
	  }
	  const hashedPassword = await bcrypt.hash(pass, 10);

	  const user = new User({
		name,
		height,
		weight,
		email,
		pass: hashedPassword,
	  });
  
	  // Save the user to the database
	  let result = await user.save();
	  result = result.toObject();
  
	  if (result) {
		// Do not send the request body in the response
		delete result.password;
  
		resp.send(result);
		console.log(result);
	  } else {
		console.log("User already registered");
	  }
  
	} catch (e) {
	  console.error(e);
	  resp.status(500).send("Something Went Wrong");
	}
  });
  

app.post("/login", async (req, res) => {
	try {
	  const { emailLog, passLog } = req.body;
  
	  // Find the user by email
	  const user = await User.findOne({ email: emailLog });
  
	  // Check if the user exists and verify the password
	  if (user && (await bcrypt.compare(passLog, user.pass))) {
		// Generate a token with the user ID
		const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
  
		// Send the token and user data in the response
		res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
	  } else {
		res.status(401).json({ message: 'Invalid credentials' });
	  }
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Something went wrong' });
	}
  });


  

app.post('/calorie-entry', async (req, res) => {
	try {
	  const { user, entries } = req.body;
  
	  let existingCalorieEntry = await CalorieEntry.findOne({ user });
  
	  if (existingCalorieEntry) {
		existingCalorieEntry.entries.push(...entries);
		const result = await existingCalorieEntry.save();
		res.json(result);
		console.log(result);
	  } else {
		const calorieEntry = new CalorieEntry({
		  user,
		  entries,
		});
  
		const result = await calorieEntry.save();
  
		if (result) {
		  res.json(result);
		  console.log(result);
		} else {
		  console.log('Failed to save calorie entry');
		  res.status(500).json({ error: 'Failed to save calorie entry' });
		}
	  }
	} catch (e) {
	  console.error(e);
	  res.status(500).json({ message: 'Something Went Wrong' });
	}
});
app.listen(5000);