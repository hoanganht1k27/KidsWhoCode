# CODIE
Small judging system for class and school so that kids who code can judge their solution


# Installation guide
## Currently, this system is only available for windows
## Installation prerequisites
<ul>
  <li>Install mingw and add to PATH variable follow this guide --- <a href="https://www.eclipse.org/4diac/documentation/html/installation/minGW.html">Install mingw on windows</a></li>
  <li>Install python --- <a target="_blank" href="https://www.python.org/downloads/">Download python on windows</a> </li>
  <li>Install nodejs --- <a target="_blank" href="https://nodejs.org/en/download/">Download nodejs on windows</a></li>
  <li>Install mongodb --- <a target="_blank" href="https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/">Install mongodb on windows</a></li>
</ul>

## Initialization
Jump into codie folder, run this command to install all nodejs dependencies
```
npm install
```

Open file <a href="https://github.com/hoanganht1k27/KidsWhoCode/blob/main/codie/config.env">config.env</a> and change some environment variables:
<ul>
  <li><b>BASE_DIR</b> variable to the path to codie folder on your machine</li>
  <li><b>MONGO_URI</b> variable to the link to your mongodb database, commonly it will be the same</li>
  <li><b>PORT</b> variable to the port you want the web server listen on, you can change it to default HTTP port is 80</li>
</ul>

After changing environment variable, jump to <a href="https://github.com/hoanganht1k27/KidsWhoCode/tree/main/codie">codie</a> folder and run this command to init <b>admin</b> user
```
node init.js
```
Your result in console should be like this
<img src="https://github.com/hoanganht1k27/KidsWhoCode/blob/main/images/init.png">


## Start web server and judge server
### Judge server
Jump to <a href="https://github.com/hoanganht1k27/KidsWhoCode/tree/main/codie/judge">codie/judge</a> folder and run this command to start judge server
```
python main.py
```

See the log in the console, it should be like this
<img src="https://github.com/hoanganht1k27/KidsWhoCode/blob/main/images/init_judge.png">


### Web server
Open another terminal, jump to <a href="https://github.com/hoanganht1k27/KidsWhoCode/tree/main/codie">codie</a> folder and run this command to start web server
```
npm start
```

See the log in the console, it should be like this

## Feature introduction
### Admin guide
#### Login page
img
#### Admin page
You can only access admin page if you have admin role

img

##### Control all user
With admin acount, you can add, delete, reset, ... all users

img
##### Add contest
You can add a contest

A contest will have name, password and start/stop state

img

Here is list of all contests

img
##### Add problem to contest
After adding contest, you can add problem to existing contest, problem can only be added to existing contest

img

Currently judge system only available with g++ compile so solution file will be cpp file only

Tests for problem can be multiple files and max number of tests is <b>200</b>

<b>Remember you have to set time and score for each test when adding a problem</b>




