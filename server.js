const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
const { ObjectId } = require("mongoose");
const axios = require("axios");
const moment = require("moment");

const admin = require("firebase-admin");
const serviceAccount = require("./ontrack-33401-firebase-adminsdk-f4zkg-52b58708db.json");
const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({ node: "http://127.0.0.1:9200" });
esClient.ping({}, (error) => {
  if (error) {
    console.error("Elasticsearch cluster is down!");
  } else {
    console.log("Elasticsearch is connected.");
  }
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
mongoose.connect(
  "mongodb+srv://test:test@cluster0.9gaw9xu.mongodb.net/onTrack",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const createIndex = async () => {
  const indexExists = await esClient.indices.exists({ index: "routes" });
  if (!indexExists) {
    await esClient.indices.create({
      index: "routes",
      body: {
        mappings: {
          properties: {
            route_no: { type: "integer" },
            stops: { type: "text" },
            capacity: { type: "integer" },
            latitude: { type: "float" },
            longitude: { type: "float" },
            arrivalTime: { type: "text" },
          },
        },
      },
    });
  }
};

const indexRoutes = async () => {
  const routes = await Route.find();
  routes.forEach(async (route) => {
    await esClient.index({
      index: "routes",
      id: route._id.toString(),
      body: {
        route_no: route.route_no,
        stops: route.stops,
        capacity: route.capacity,
        latitude: route.latitude,
        longitude: route.longitude,
        arrivalTime: route.arrivalTime,
      },
    });
  });
  console.log("Routes indexed successfully.");
};
app.get("/api/search/routes", async (req, res) => {
  const { query } = req.query;
  try {
    const result = await esClient.search({
      index: "routes",
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ["route_no", "stops"],
          },
        },
      },
    });
    res.status(200).json(result.hits.hits.map((hit) => hit._source));
  } catch (error) {
    console.error("Error searching routes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
mongoose.connect(
  "mongodb+srv://test:test@cluster0.9gaw9xu.mongodb.net/onTrack",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async () => {
  console.log("Connected to MongoDB database");
  await createIndex();
  await indexRoutes();
});

app.put('/api/routes/:id', async (req, res) => {
  const routeId = req.params.id;
  const updatedRoute = req.body;
  try {
      await Route.findByIdAndUpdate(routeId, updatedRoute);
      await esClient.update({
          index: 'routes',
          id: routeId,
          body: {
              doc: updatedRoute
          }
      });
      res.status(200).json({ message: 'Route updated successfully' });
  } catch (error) {
      console.error('Error updating route:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
const adminSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
  },
  { collection: "admin" }
);
const routesSchema = new mongoose.Schema(
  {
    route_no: Number,
    stops: String,
    capacity: Number,
    latitude: [Number],
    longitude: [Number],
    arrivalTime: [String],
  },
  { collection: "routes" }
);

const liveTrackSchema = new mongoose.Schema(
  {
    routeNo: Number,
    latitude: Number,
    longitude: Number,
  },
  { collection: "livetrack" }
);

const attendanceSchema = new mongoose.Schema(
  {
    femail: String,
    userName: String,
    routeNo: Number,
    attendanceStatus: String,
    date: String,
  },
  { collection: "attendance" }
);
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    route: Number,
    stop: String,
    fee_status: String,
    student_email: String,
    fcmtoken: String,
  },
  { collection: "user" }
);
const reportandclaimitemsSchema = new mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    itemname: String,
    routeno: Number,
    details: String,
    base64string: String,
    itemstatus: String,
  },
  { collection: "reportandclaimlostitems", versionKey: false }
);
const claimitemsSchema = new mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    itemname: String,
    routeno: Number,
    details: String,
    base64string: String,
    claimby: String,
  },
  { collection: "claimitems", versionKey: false }
);

const reportissueschema = new mongoose.Schema(
  {
    email: String,
    type: String,
    description: String,
    status: String,
    reportcount: Number,
  },
  { collection: "reportissue", versionKey: false }
);

const changeRouteRequestSchema = new mongoose.Schema(
  {
    email: String,
    status: String,
    currentroute: Number,
    currentstop: String,
    requestedroute: Number,
    requestedstop: String,
    comments: String,
    dateTime: Date,
  },
  { collection: "changerouterequest", versionKey: false }
);

const busPassFeeSchema = new mongoose.Schema(
  {
    name: String,
    rollno: String,
    section: String,
    batch: String,
    transactionid: String,
    transactiondate: Date,
    traveldate: Date,
  },
  { collection: "buspassfees", versionKey: false }
);

const transportFeeSchema = new mongoose.Schema(
  {
    name: String,
    rollno: String,
    section: String,
    batch: String,
    transactionid: String,
    transactiondate: Date,
    traveldate: Date,
  },
  { collection: "transportfees", versionKey: false }
);

const routeSchema = new mongoose.Schema(
  {
    route_no: Number,
    stops: String,
    capacity: Number,
    latitude: [Number],
    longitude: [Number],
    arrivalTime: [String],
  },
  { collection: "routes", versionKey: false }
);

const Route = mongoose.model("Route", routeSchema);
const TransportFee = mongoose.model("TransportFee", transportFeeSchema);
const ChangeRouteRequest = mongoose.model(
  "ChangeRouteRequest",
  changeRouteRequestSchema
);
const BusPassFee = mongoose.model("BusPassFee", busPassFeeSchema);
const User = mongoose.model("User", userSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);
const Admin = mongoose.model("Admin", adminSchema);
const ReportAndClaimLostItem = mongoose.model(
  "ReportAndClaimLostItems",
  reportandclaimitemsSchema
);
const claimitems = mongoose.model("ClaimItems", claimitemsSchema);
const ReportIssue = mongoose.model("ReportIssue", reportissueschema);

const Routes = mongoose.model("Routes", routesSchema);
const LiveTrack = mongoose.model("LiveTrack", liveTrackSchema);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add this endpoint to fetch attendance data
app.get("/api/attendance", async (req, res) => {
  try {
    let query = {};
    if (req.query.option === "route") {
      query.routeNo = req.query.value;
    } else if (req.query.option === "date") {
      query.date = req.query.value;
    }
    const attendanceData = await (req.query.option === "all"
      ? Attendance.find()
      : Attendance.find(query));
    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Schedule a task to mark absent students at 9:00 AM every day (Monday to Friday)
cron.schedule("00 9 * * 1-5", async () => {
  try {
    const today = new Date();
    const todayDateString = `${today.getDate().toString().padStart(2, "0")}-${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${today.getFullYear()}`;

    // Find all students who are not in the attendance table but are in the user table and have role 'student'
    const studentsNotInAttendance = await User.find({
      role: "Student",
      email: { $nin: await getStudentsPresentToday(todayDateString) },
    });

    // Mark these students absent and add them to the attendance table
    const absentStudents = studentsNotInAttendance.map((student) => ({
      femail: student.email,
      userName: student.name,
      routeNo: student.routeNo,
      attendanceStatus: "Absent",
      date: todayDateString,
    }));

    await Attendance.insertMany(absentStudents);
    console.log("Attendance marked for absent students at 9:00 AM");
  } catch (error) {
    console.error("Error marking attendance:", error);
  }
});

// Function to get the emails of students present in attendance for a given date
async function getStudentsPresentToday(date) {
  const presentStudents = await Attendance.find({ date });
  return presentStudents.map((student) => student.femail);
}

// Add User Attendance

app.post("/api/attendance", async (req, res) => {
  try {
    const { femail, userName, routeNo, attendanceStatus, date } = req.body;
    const newAttendance = new Attendance({
      femail,
      userName,
      routeNo,
      attendanceStatus,
      date,
    });
    await newAttendance.save();
    res.status(201).json({
      message: "Attendance added successfully",
      attendance: newAttendance,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Search User by Email Route
app.get("/api/attendance/search", async (req, res) => {
  const userEmail = req.query.femail;
  try {
    const attendance = await Attendance.find({ femail: userEmail });
    if (attendance) {
      res.status(200).json(attendance);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error searching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Update attendance by Email Route
app.put("/api/attendance/:femail", async (req, res) => {
  const userEmail = req.params.femail;
  const { fcmtoken, ...updatedUserData } = req.body; // Extract fcmtoken from req.body
  console.log(fcmtoken);

  if (!fcmtoken) {
    return res
      .status(400)
      .json({ message: "fcmtoken is missing in updatedUserData" });
  }

  try {
    // Exclude _id field from update
    delete updatedUserData._id;

    const message = {
      token: fcmtoken,
      notification: {
        title: "Attendance Updated",
        body: "Your attendance has been updated by the admin.",
      },
    };

    // Send the notification using Firebase Cloud Messaging
    await admin.messaging().send(message);

    const updatedUser = await Attendance.findOneAndUpdate(
      { femail: userEmail },
      updatedUserData,
      { new: true }
    );

    if (updatedUser) {
      res
        .status(200)
        .json({ message: "Attendance updated successfully", updatedUser });
    } else {
      res.status(404).json({ message: "Attendance not found" });
    }
  } catch (error) {
    console.error("Error updating Attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Add this endpoint to delete attendance rows by IDs
app.delete("/api/attendance", async (req, res) => {
  const { rowsToDelete } = req.body;
  try {
    // Delete attendance rows with matching IDs
    const result = await Attendance.deleteMany({ _id: { $in: rowsToDelete } });

    res.status(200).json({
      message: "Attendance rows deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting attendance rows:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/reportandclaimlostitems", async (req, res) => {
  try {
    const report = await ReportAndClaimLostItem.find();
    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report and claim lost items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/api/claimitems", async (req, res) => {
  try {
    const report = await claimitems.find();
    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report and claim lost items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/reportandclaimlostitems/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  const updatedItemData = req.body;
  try {
    // Find the reported item by its ID and update its data
    const updatedItem = await ReportAndClaimLostItem.findByIdAndUpdate(
      itemId,
      updatedItemData,
      { new: true }
    );
    if (updatedItem) {
      res
        .status(200)
        .json({ message: "Reported item updated successfully", updatedItem });
    } else {
      res.status(404).json({ message: "Reported item not found" });
    }
  } catch (error) {
    console.error("Error updating reported item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add this endpoint to delete a reported item by ID
app.delete("/api/reportandclaimlostitems/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  try {
    // Find the reported item by ID and delete it from the database
    const deletedItem = await ReportAndClaimLostItem.findByIdAndDelete(itemId);
    if (deletedItem) {
      console.log("Reported item deleted:", deletedItem);
      res.status(200).json({ message: "Reported item deleted successfully" });
    } else {
      res.status(404).json({ message: "Reported item not found" });
    }
  } catch (error) {
    console.error("Error deleting reported item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Add this endpoint to delete a claimed item by ID
app.delete("/api/claimitems/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  try {
    // Find the claimed item by ID and delete it from the database
    const deletedItem = await claimitems.findByIdAndDelete(itemId);
    if (deletedItem) {
      console.log("Claimed item deleted:", deletedItem);
      res.status(200).json({ message: "Claimed item deleted successfully" });
    } else {
      res.status(404).json({ message: "Claimed item not found" });
    }
  } catch (error) {
    console.error("Error deleting claimed item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/api/reportandclaimlostitems", async (req, res) => {
  try {
    const { itemname, routeno, details, base64string, itemstatus } = req.body;
    const newLostItem = new ReportAndClaimLostItem({
      itemname,
      routeno,
      details,
      base64string,
      itemstatus,
    });
    const savedItem = await newLostItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error adding lost item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/reportissue", async (req, res) => {
  try {
    const report = await ReportIssue.find();
    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report issues:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/reportissue/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  const updatedItemData = req.body;
  try {
    // Find the reported item by its ID and update its data
    const updatedItem = await ReportIssue.findByIdAndUpdate(
      itemId,
      updatedItemData,
      { new: true }
    );
    if (updatedItem) {
      res
        .status(200)
        .json({ message: "Reported issue updated successfully", updatedItem });
    } else {
      res.status(404).json({ message: "Reported item not found" });
    }
  } catch (error) {
    console.error("Error updating reported issue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/reportissue/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  try {
    // Find the reported item by ID and delete it from the database
    const deletedItem = await ReportIssue.findByIdAndDelete(itemId);
    if (deletedItem) {
      console.log("Reported item deleted:", deletedItem);
      res.status(200).json({ message: "Reported item deleted successfully" });
    } else {
      res.status(404).json({ message: "Reported item not found" });
    }
  } catch (error) {
    console.error("Error deleting reported item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/routes", async (req, res) => {
  try {
    const routes = await Route.find(
      {},
      "_id route_no stops arrival_time capacity latitude longitude arrivalTime"
    ).sort({ route_no: 1 });
    res.status(200).json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Add Route
// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

// Calculate arrival time based on distance and speed
function calculateArrivalTime(startTime, distance) {
  const speed = 40; // Assuming an average speed of 40 km/h
  const time = distance / speed; // Time in hours
  const arrivalTime = moment(startTime, "hh:mm A")
    .add(time, "hours")
    .format("hh:mm A");
  return arrivalTime;
}
app.post("/api/routes", async (req, res) => {
  try {
    const { route_no, stops, capacity, arrivalTime } = req.body;
    const stopArray = stops.split(":");
    const locations = [];
    const latitudeArray = [];
    const longitudeArray = [];
    const arrivalTimeArray = [arrivalTime];
    const avgSpeed = 36; // km/h

    // Function to calculate Haversine distance between two points
    function haversineDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the Earth in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return d;
    }

    let prevLat, prevLng;
    for (let i = 0; i < stopArray.length; i++) {
      const stop = stopArray[i];
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: stop.trim(),
            key: "AIzaSyD0_zoemZLywa_RZRwygqDA7ch-9Jzy0Nw",
          },
        }
      );
      const { lat, lng } = response.data.results[0].geometry.location;
      latitudeArray.push(lat);
      longitudeArray.push(lng);

      // Calculate travel time from previous stop to current stop
      if (i > 0) {
        const distance = haversineDistance(prevLat, prevLng, lat, lng);
        const travelTimeHours = distance / avgSpeed;
        // Convert travel time from hours to milliseconds
        const travelTimeMilliseconds = travelTimeHours * 3600 * 1000;
        // Calculate arrival time for current stop
        const prevArrivalTime = arrivalTimeArray[i - 1];
        const arrivalTimeForCurrentStop = calculateArrivalTime(
          prevArrivalTime,
          distance,
          avgSpeed
        );

        // Function to calculate arrival time as string
        function calculateArrivalTime(prevArrivalTime, distance, avgSpeed) {
          const travelTimeHours = distance / avgSpeed;
          const prevArrivalTimeParts = prevArrivalTime.split(":");
          const prevArrivalDate = new Date(
            0,
            0,
            0,
            prevArrivalTimeParts[0],
            prevArrivalTimeParts[1]
          ); // Date object with hours and minutes
          const arrivalTime = new Date(
            prevArrivalDate.getTime() + travelTimeHours * 3600 * 1000
          );
          const arrivalHours = arrivalTime
            .getHours()
            .toString()
            .padStart(2, "0");
          const arrivalMinutes = arrivalTime
            .getMinutes()
            .toString()
            .padStart(2, "0");
          return `${arrivalHours}:${arrivalMinutes}`;
        }
        arrivalTimeArray.push(arrivalTimeForCurrentStop);
      }

      prevLat = lat;
      prevLng = lng;
    }

    const newRoute = new Route({
      route_no,
      stops,
      capacity,
      latitude: latitudeArray,
      longitude: longitudeArray,
      arrivalTime: arrivalTimeArray,
    });
    await newRoute.save();
    res
      .status(201)
      .json({ message: "Route added successfully", route: newRoute });
  } catch (error) {
    console.error("Error adding route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Delete Route
app.delete("/api/routes/:route_no", async (req, res) => {
  const routeNoToDelete = req.params.route_no;

  try {
    const deletedRoute = await Route.findOneAndDelete({
      route_no: routeNoToDelete,
    });

    if (deletedRoute) {
      res
        .status(200)
        .json({ message: "Route deleted successfully", deletedRoute });
    } else {
      res.status(404).json({ message: "Route not found" });
    }
  } catch (error) {
    console.error("Error deleting route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Update Route Route
// app.put("/api/routes/:route_no", async (req, res) => {
//   const routeNoToUpdate = req.params.route_no;
//   const updatedRouteData = req.body;
//   updatedRouteData.latitude = updatedRouteData.latitude
//     .split(",")
//     .map(parseFloat);
//   updatedRouteData.longitude = updatedRouteData.longitude
//     .split(",")
//     .map(parseFloat);
//   try {
//     const updatedRoute = await Route.findOneAndUpdate(
//       { route_no: routeNoToUpdate },
//       updatedRouteData,
//       { new: true }
//     );

//     if (updatedRoute) {
//       res
//         .status(200)
//         .json({ message: "Route updated successfully", updatedRoute });
//     } else {
//       res.status(404).json({ message: "Route not found" });
//     }
//   } catch (error) {
//     console.error("Error updating route:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// Get All Users Route
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Get Route by route_no
app.get("/api/routes/:route_no", async (req, res) => {
  const route_no = req.params.route_no; // Extract route ID from URL parameters

  try {
    const route = await Route.findOne(
      { route_no },
      "stops arrival_time capacity"
    ); // Find route by route_no and only select stops, arrival_time, and capacity fields
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.status(200).json(route);
  } catch (error) {
    console.error("Error fetching route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add User Route
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password, role, route, stop, fee_status } = req.body;
    const newUser = new User({
      name,
      email,
      password,
      role,
      route,
      stop,
      fee_status,
    });
    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete User by Email Route
app.delete("/api/users/:email", async (req, res) => {
  let userEmailToDelete = req.params.email;
  // URL decode the email parameter
  userEmailToDelete = decodeURIComponent(userEmailToDelete);
  try {
    const deletedUser = await User.findOneAndDelete({
      email: userEmailToDelete,
    });

    if (deletedUser) {
      res
        .status(200)
        .json({ message: "User deleted successfully", deletedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Search User by Email Route
app.get("/api/users/search", async (req, res) => {
  const userEmail = req.query.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error searching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update User by Email Route
app.put("/api/users/:email", async (req, res) => {
  const userEmail = req.params.email;
  const updatedUserData = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      updatedUserData,
      { new: true }
    );
    if (updatedUser) {
      res
        .status(200)
        .json({ message: "User updated successfully", updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Driver Route
app.delete("/api/users/driver/:email", async (req, res) => {
  let userEmail = req.params.email;
  // URL decode the email parameter
  userEmail = decodeURIComponent(userEmail);
  try {
    const deletedUser = await User.findOneAndDelete({
      email: userEmail,
      role: { $in: ["driver", "Driver"] },
    });

    if (deletedUser) {
      res
        .status(200)
        .json({ message: "Driver deleted successfully", deletedUser });
    } else {
      res.status(404).json({ message: "Driver not found" });
    }
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Search Driver by Email and Role Route
app.get("/api/users/driver/search", async (req, res) => {
  const userEmail = req.query.email;
  try {
    const user = await User.findOne({
      email: userEmail,
      role: { $in: ["driver", "Driver"] },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Driver not found" });
    }
  } catch (error) {
    console.error("Error searching driver:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Delete Guardian Route
app.delete("/api/users/guardian/:email", async (req, res) => {
  let userEmail = req.params.email;
  // URL decode the email parameter
  userEmail = decodeURIComponent(userEmail);
  try {
    const deletedUser = await User.findOneAndDelete({
      email: userEmail,
      role: { $in: ["guardian", "Guardian"] },
    });

    if (deletedUser) {
      res
        .status(200)
        .json({ message: "Guardian deleted successfully", deletedUser });
    } else {
      res.status(404).json({ message: "Guardian not found" });
    }
  } catch (error) {
    console.error("Error deleting guardian:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Search Guardian by Email and Role Route
app.get("/api/users/guardian/search", async (req, res) => {
  const userEmail = req.query.email;
  try {
    const user = await User.findOne({
      email: userEmail,
      role: { $in: ["guardian", "Guardian"] },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Guardian not found" });
    }
  } catch (error) {
    console.error("Error searching guardian:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all fields of "buspassfees" collection
app.get("/api/buspassfees", async (req, res) => {
  try {
    const busPassFees = await BusPassFee.find();
    res.status(200).json(busPassFees);
  } catch (error) {
    console.error("Error fetching bus pass fees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Fetch all fields of "transportfees" collection
app.get("/api/transportfees", async (req, res) => {
  try {
    const transportFees = await TransportFee.find();
    res.status(200).json(transportFees);
  } catch (error) {
    console.error("Error fetching transport fees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Delete Bus Pass Fee by ID Route
app.delete("/api/buspassfees/:id", async (req, res) => {
  const feeIdToDelete = req.params.id;

  try {
    const deletedFee = await BusPassFee.findOneAndDelete({
      _id: feeIdToDelete,
    });

    if (deletedFee) {
      res
        .status(200)
        .json({ message: "Bus pass fee deleted successfully", deletedFee });
    } else {
      res.status(404).json({ message: "Bus pass fee not found" });
    }
  } catch (error) {
    console.error("Error deleting bus pass fee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Delete Transport Fee by ID Route
app.delete("/api/transportfees/:id", async (req, res) => {
  const feeIdToDelete = req.params.id;

  try {
    const deletedFee = await TransportFee.findOneAndDelete({
      _id: feeIdToDelete,
    });

    if (deletedFee) {
      res
        .status(200)
        .json({ message: "Transport fee deleted successfully", deletedFee });
    } else {
      res.status(404).json({ message: "Transport fee not found" });
    }
  } catch (error) {
    console.error("Error deleting transport fee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all fields of "changerouterequest" collection
app.get("/api/changerouterequest", async (req, res) => {
  try {
    const changeRouteRequests = await ChangeRouteRequest.find();
    res.status(200).json(changeRouteRequests);
  } catch (error) {
    console.error("Error fetching change route requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Delete Change Route Request by ID Route
app.delete("/api/changerouterequest/:id", async (req, res) => {
  const requestIdToDelete = req.params.id;

  try {
    const deletedRequest = await ChangeRouteRequest.findOneAndDelete({
      _id: requestIdToDelete,
    });

    if (deletedRequest) {
      res.status(200).json({
        message: "Change route request deleted successfully",
        deletedRequest,
      });
    } else {
      res.status(404).json({ message: "Change route request not found" });
    }
  } catch (error) {
    console.error("Error deleting change route request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Fetch Change Route Request by ID Route
app.get("/api/changerouterequest/:id", async (req, res) => {
  const requestId = req.params.id;

  try {
    const changeRouteRequest = await ChangeRouteRequest.findById(requestId);

    if (changeRouteRequest) {
      res.status(200).json(changeRouteRequest);
    } else {
      res.status(404).json({ message: "Change route request not found" });
    }
  } catch (error) {
    console.error("Error fetching change route request by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Update Change Route Request Status by ID Route
app.put("/api/changerouterequest/:id", async (req, res) => {
  const requestIdToUpdate = req.params.id;

  try {
    const updatedRequest = await ChangeRouteRequest.findByIdAndUpdate(
      requestIdToUpdate,
      { status: "Fulfilled" },
      { new: true }
    );

    if (updatedRequest) {
      res.status(200).json({
        message: "Change route request status updated successfully",
        updatedRequest,
      });
    } else {
      res.status(404).json({ message: "Change route request not found" });
    }
  } catch (error) {
    console.error("Error updating change route request status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Delete attendance records by ID
app.delete("/api/attendance/:id", async (req, res) => {
  const attendanceId = req.params.id;
  try {
    // Find and delete the attendance record by ID
    const deletedAttendance = await Attendance.findByIdAndDelete(attendanceId);
    if (deletedAttendance) {
      res
        .status(200)
        .json({ message: "Attendance record deleted successfully" });
    } else {
      res.status(404).json({ message: "Attendance record not found" });
    }
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.put("/api/changerouterequest/:id/approve", async (req, res) => {
  const requestIdToUpdate = req.params.id;
  const { fcmtoken } = req.body;

  try {
    // Check if the FCM token is provided
    if (!fcmtoken) {
      return res.status(400).json({ message: "FCM token is required" });
    }

    // Find and update the request by ID
    const updatedRequest = await ChangeRouteRequest.findByIdAndUpdate(
      requestIdToUpdate,
      { status: "Fulfilled" },
      { new: true }
    );

    if (updatedRequest) {
      // Update the current route and stop fields in the request document
      updatedRequest.currentstop = updatedRequest.requestedstop;
      updatedRequest.currentroute = updatedRequest.requestedroute;
      await updatedRequest.save();

      // Construct the message
      const message = {
        token: fcmtoken,
        notification: {
          title: "Change Route Request Approved",
          body: "Your change route request has been approved by the admin.",
        },
      };

      // Send the notification
      await admin.messaging().send(message);

      res.status(200).json({
        message:
          "Change route request status updated to 'Fulfilled' successfully",
        updatedRequest,
      });
    } else {
      res.status(404).json({ message: "Change route request not found" });
    }
  } catch (error) {
    console.error("Error updating change route request status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Reject
app.put("/api/changerouterequest/:id/reject", async (req, res) => {
  const requestIdToUpdate = req.params.id;
  const { fcmtoken } = req.body;

  try {
    // Update the request status to 'Unfulfilled'
    const updatedRequest = await ChangeRouteRequest.findByIdAndUpdate(
      requestIdToUpdate,
      { status: "Unfulfilled" },
      { new: true }
    );

    if (updatedRequest) {
      // Send notification to the user
      const message = {
        token: fcmtoken,
        notification: {
          title: "Change Route Request Rejected",
          body: "Your change route request has been rejected by the admin.",
        },
      };
      await admin.messaging().send(message);

      res.status(200).json({
        message:
          "Change route request status updated to 'Unfulfilled' successfully",
        updatedRequest,
      });
    } else {
      res.status(404).json({ message: "Change route request not found" });
    }
  } catch (error) {
    console.error("Error updating change route request status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Add Guardian Route
app.post("/api/guardians", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      route,
      stop,
      fee_status,
      student_email,
    } = req.body;
    const newGuardian = new User({
      name,
      email,
      password,
      role,
      route,
      stop,
      fee_status,
      student_email, // Additional field for guardians
    });
    await newGuardian.save();
    res
      .status(201)
      .json({ message: "Guardian added successfully", guardian: newGuardian });
  } catch (error) {
    console.error("Error adding guardian:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Fetch route numbers endpoint
app.get("/fetchRouteNumbers", async (req, res) => {
  try {
    const routes = await Route.distinct("route_no");
    const liveTrackRoutes = await LiveTrack.distinct("routeNo");
    const commonRoutes = routes.filter((route) =>
      liveTrackRoutes.includes(route)
    );
    res.status(200).json(commonRoutes);
  } catch (error) {
    console.error("Error fetching route numbers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch current location
app.get("/fetchRouteCoordinates/:routeNo", async (req, res) => {
  const { routeNo } = req.params;

  try {
    const route = await LiveTrack.findOne({ routeNo: routeNo });
    if (route) {
      const coordinates = await Routes.findOne({ route_no: routeNo });
      const mergedCoordinates = coordinates.latitude.map((latitude, index) => ({
        latitude,
        longitude: coordinates.longitude[index],
      }));
      // console.log(mergedCoordinates);
      res.json({
        routeNo: route.routeNo,
        lat: route.latitude,
        lng: route.longitude,
        stops: mergedCoordinates,
      });
    } else {
      res.status(404).json({ error: "Route not found" });
    }
  } catch (error) {
    console.error("Error fetching route coordinates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/checkRoutes", async (req, res) => {
  const { input } = req.query;
  try {
    const route = await Routes.findOne({ route_no: input });
    if (route) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error fetching route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/places-autocomplete", async (req, res) => {
  const { input } = req.query;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&components=country:PK&location=31.423466,72.9244901&radius=100000&key=AIzaSyD0_zoemZLywa_RZRwygqDA7ch-9Jzy0Nw`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/drivers", async (req, res) => {
  try {
    const drivers = await User.find({
      role: "Driver",
    });
    res.json({ drivers });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
});
app.get("/api/routes/:routeno", async (req, res) => {
  try {
    const route = await Route.findOne(req.params.routeno);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json(route);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      return res.status(400).json({ message: "Invalid route ID" });
    }
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/routes/:routeNo", async (req, res) => {
  const routeNo = req.params.routeNo;
  const { route_no, stops, capacity } = req.body;

  try {
    const route = await Route.findOne({ route_no: routeNo });

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    route.route_no = route_no;

    // Update other route properties
    route.stops = stops;
    route.capacity = capacity;

    // Geocode the new stops
    const stopArray = stops.split(":");
    const latitudeArray = [];
    const longitudeArray = [];

    for (const stop of stopArray) {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: stop.trim(),
            key: "AIzaSyD0_zoemZLywa_RZRwygqDA7ch-9Jzy0Nw", // Replace with your Google Maps API key
          },
        }
      );
      const { lat, lng } = response.data.results[0].geometry.location;
      latitudeArray.push(lat);
      longitudeArray.push(lng);
    }

    // Update latitude and longitude arrays
    route.latitude = latitudeArray;
    route.longitude = longitudeArray;

    // Save the updated route
    const updatedRoute = await route.save();

    res
      .status(200)
      .json({ message: "Route updated successfully", route: updatedRoute });
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/api/user/:email", async (req, res) => {
  const userEmail = req.params.email; // Assuming 'email' is the query parameter sent by the React code
  try {
    const user = await User.findOne({ email: userEmail });

    if (user) {
      const fcmtoken = user.fcmtoken;
      if (fcmtoken) {
        res.status(200).json({ fcmtoken: fcmtoken });
      } else {
        res.status(404).json({ message: "FCM token not found for the user" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching FCM token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/api/send-notification", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).send("Notification message is required");
  }

  try {
    // Fetch all users' FCM tokens
    const users = await User.find({}, "fcmtoken");
    const tokens = users.map((user) => user.fcmtoken).filter((token) => token);

    if (tokens.length === 0) {
      return res.status(404).send("No FCM tokens found");
    }

    // Create the message payload
    const payload = {
      notification: {
        title: "New Notification",
        body: message,
      },
    };

    // Send the notification to all tokens in batches
    const batchSize = 500; // FCM allows up to 500 tokens per request
    for (let i = 0; i < tokens.length; i += batchSize) {
      const batchTokens = tokens.slice(i, i + batchSize);
      await admin.messaging().sendMulticast({
        tokens: batchTokens,
        ...payload,
      });
    }

    res.status(200).send("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send("Error sending notification");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
