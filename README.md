# Stock Search App

`This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.4.`

## Demo (Click on the thumbmail below to view on YouTube)

<a href="https://www.youtube.com/watch?v=43Dg7sZt1lc" target="_blank">
 <img src="https://raw.githubusercontent.com/ruch0401/resources/main/csci-571/stock-search-angular-thumbnail.png" alt="Watch the video for project demo"/>
</a>

## Hands On!

Try the app yourself here - https://stock-search-angular.herokuapp.com/

## Technologies Used

| Area     | Technologies         |
|----------|----------------------|
| Backend  | Node.js + Express.js |
| Frontend | Angular              |

## Documentation

Click [here](resources/hw8-description.pdf) for HW8 description  
Click [here](resources/hw8-grading.pdf) for HW8 grading guidelines

## Server side code

### Library Details

| Libraries Used | Purpose                                         |
|----------------|-------------------------------------------------|
| `axios`        | For making API calls to the Finnhub API         |
| `cors`         | To handle cross-origin-resource-sharing issues  |
| `nodemon`      | For hot reloading of the node server            |
| `express`      | For making use of the Express Node.js framework |

### API endpoints

Host URL1: https://jdofgbmx.uw.r.appspot.com  
Host URL2: https://stock-search-angular.herokuapp.com/

| Purpose                       | Endpoint                       | Query Params                 | Example                                                                                                                   |
|-------------------------------|--------------------------------|------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| Company Description           | /company/description           | symbol                       | https://stock-search-angular.herokuapp.com/company/description?symbol=AAPL                                                |
| Company Historical Data       | /company/historical/data       | symbol, resolution, from, to | https://stock-search-angular.herokuapp.com/company/historical/data?symbol=AAPL&resolution=D&from=1631022248&to=1631627048 |
| Company Latest Stock Price    | /company/latest-stock-price    | symbol                       | https://stock-search-angular.herokuapp.com/company/latest-stock-price?symbol=AAPL                                         |
| Company Autocomplete          | /company/autocomplete          | q                            | https://stock-search-angular.herokuapp.com/company/autocomplete?q=AA                                                      |
| Company News                  | /company/news                  | symbol, from, to             | https://stock-search-angular.herokuapp.com/company/news?symbol=MSFT&from=2022-03-09&to=2022-03-10                         |
| Company Recommendation Trends | /company/recommendation-trends | symbol                       | https://stock-search-angular.herokuapp.com/company/recommendation-trends?symbol=MSFT                                      |
| Company Social Sentiment      | /company/social-sentiment      | symbol                       | https://stock-search-angular.herokuapp.com/company/social-sentiment?symbol=MSFT                                           |
| Company Peers                 | /company/peers                 | symbol                       | https://stock-search-angular.herokuapp.com/company/peers?symbol=MSFT                                                      |
| Company Earnings              | /company/stock/earnings        | symbol                       | https://stock-search-angular.herokuapp.com/company/stock/earnings?symbol=MSFT                                             |

## Steps to deploy on Heroku

Just as deployment to Google App Engine requires the project to consist of an `app.yaml` file, similarly, deployment to Heroku requires the app to consist of a [Procfile](https://devcenter.heroku.com/articles/procfile). Incase of a NodeJS app, contents of the Procfile were as follows -

```
web: npm run start
```

This was in accordance to the start command in the `package.json` file

```
{
  "name": "hw8",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    ...
    "start-backend": "nodemon server.js"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "~13.1.0",
    ...
    "zone.js": "~0.11.4"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~13.1.4",
    ...
    "typescript": "~4.5.2"
  }
}
```

Command to deploy a sub-directory to heroku - `git subtree push --prefix hw8 heroku master`
Note: Command has to be executed from the root of the git repo. `hw8` is the sub-folder, `heroku` is the git remote link to heroku and `master` is the branch on which the deployment needs to take place
