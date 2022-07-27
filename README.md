# KidsWhoCode
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



