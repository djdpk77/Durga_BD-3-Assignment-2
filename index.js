const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;

let cors = require('cors');

let activities = [
  { activityId: 1, type: 'Running', duration: 30, caloriesBurned: 300 },
  { activityId: 2, type: 'Swimming', duration: 45, caloriesBurned: 400 },
  { activityId: 3, type: 'Cycling', duration: 60, caloriesBurned: 500 },
];

app.use(cors());

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

//Function to push a new activity to the activities array
function add(activities, activityId, type, duration, caloriesBurned) {
  activities.push({
    activityId: activityId,
    type: type,
    duration: duration,
    caloriesBurned: caloriesBurned,
  });

  return activities;
}

//Endpoint 1: Add an Activity
app.get('/activities/add', (req, res) => {
  let activityId = parseInt(req.query.activityId);
  let type = req.query.type;
  let duration = parseInt(req.query.duration);
  let caloriesBurned = parseInt(req.query.caloriesBurned);

  activities = add(activities, activityId, type, duration, caloriesBurned);

  res.json({ activities: activities });
});

//function to sort the activities array by duration
function sortActivitiesByDuration(activity1, activity2) {
  return activity1.duration - activity2.duration;
}

//Endpoint 2: Sort Activities by Duration
app.get('/activities/sort-by-duration', (req, res) => {
  let sortedActivities = activities.slice();

  sortedActivities.sort(sortActivitiesByDuration);

  res.json({ activities: sortedActivities });
});

//function to filter the activities array by type
function filterActivitiesByType(activity, type) {
  return activity.type === type;
}

//Endpoint 3: Filter Activities by Type
app.get('/activities/filter-by-type', (req, res) => {
  let type = req.query.type;

  let filteredActivities = activities.filter((activity) =>
    filterActivitiesByType(activity, type)
  );

  res.json({ activities: filteredActivities });
});

//function to sum the total calories burned for all activities
function calculateTotalCalories(activities) {
  let totalCaloriesBurned = 0;
  for (i = 0; i < activities.length; i++) {
    totalCaloriesBurned = totalCaloriesBurned + activities[i].caloriesBurned;
  }
  return totalCaloriesBurned;
}

//Endpoint 4: Calculate Total Calories Burned
app.get('/activities/total-calories', (req, res) => {
  let totalCaloriesBurned = calculateTotalCalories(activities);

  res.json({ totalCaloriesBurned: totalCaloriesBurned });
});

//function to find and update the duration of an activity in the activities array
function updateActivityDurationById(activities, activityId, duration) {
  for (i = 0; i < activities.length; i++) {
    if (activities[i].activityId === activityId) {
      activities[i].duration = duration;
      break;
    }
  }
  return activities;
}

//Endpoint 5: Update Activity Duration by ID
app.get('/activities/update-duration', (req, res) => {
  let activityId = parseInt(req.query.activityId);
  let duration = parseInt(req.query.duration);

  activities = updateActivityDurationById(activities, activityId, duration);

  res.json({ activities: activities });
});

//Function to filter out an activity from the activities array by its ID
function deleteActivityById(activity, activityId) {
  return activity.activityId !== activityId;
}

//Endpoint 6: Delete Activity by ID
app.get('/activities/delete', (req, res) => {
  let activityId = parseInt(req.query.activityId);

  activities = activities.filter((activity) =>
    deleteActivityById(activity, activityId)
  );

  res.json({ activities: activities });
});

//function to filter out all activities of a specific type from the activities array
function deleteActivityByType(activity, type) {
  return activity.type !== type;
}

//Endpoint 7: Delete Activities by Type
app.get('/activities/delete-by-type', (req, res) => {
  let type = req.query.type;

  activities = activities.filter((activity) =>
    deleteActivityByType(activity, type)
  );

  res.json({ activities: activities });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
