## eBench Instagram Challenge

### The eBench Briefing

The project is aiming at getting the posts by tags from [Instagram API](https://www.instagram.com/developer/endpoints/tags/#get_tags_media_recent).
 Then, store the data into MongoDB as json, the format doesn’t matter.
The input would be uploading a file with a list of tags inside.
There are several points to note:

1.  Exception handling, specifically for the API requests.
2.  Rate limit control.
3.  the project includes Queue job system(bull-js), it has web interface as frontend, queue job handling as backend.
4.  Feel free to pick any framework/modules you want to use as you see fit.
5.  this would need you to understand the api doc of Instagram.
6.  No authentication needed, just a plain page, and CLI app for backend.
7.  The Instagram API is going to be deprecated, but it serves well as a trial project, also, we could need this in production.
8.  Optional: pack it up in docker image. Specifically with “docker stack apply”.

## My solution proposal

This application is responsible for receiving CSV files containing instagram tags, the app scanning the Instagram API storing the medias of each tag through job queues.

You can see the Live App [here](http://159.203.95.75), the live app uses the API of a basic application that I created called [instagram-tag-endpoint-faker](https://github.com/vmarquesdev/instagram-tags-endpoint-faker), this app simulates instagram API responses, without risking to reach the rate limits.

The [instagram-tag-endpoint-faker documantation](https://github.com/vmarquesdev/instagram-tags-endpoint-faker#instagram-tags-endpoint-faker) demonstrates how it is possible to add medias to a tag dynamically, this will help test the live app.

The live application rate limit is set to `200 requests/5 minutes` for you to see the behavior.

You can upload this base file [tags.csv](https://github.com/vmarquesdev/blob/master/tags.csv) in the live application to see how works.

## Installation

Installation can be done in several ways:

### Docker Compose

Build and start app with: `$ docker-compose up -d`

See the logs with: `$ docker-compose logs -f`

The first build can take up to 15 minutes, because of the Meteor installation.

### Installing services on a local machine

`$ curl https://install.meteor.com/ | sh && brew install redis && meteor npm install && redis-server && npm start`

### Build With

- **Server**
  - NodeJS
  - Meteor
  - MongoDB
  - Redis
  - Bull-JS
- **UI**
  - React
  - SCSS
- **Dev Tools**
  - ESLint
  - Stylelint
  - Autoprefixer
- **Tests**
  - Mocha
  - Chai
  - Sinon
- **Build & Deployment**
  - Docker

### General Informations

I made the decision to use Meteor in the development of this project because it provides me with libraries to create a reactive application (pub / sub) quickly without needing to write many lines of code, this allows me to focus on the development of the jobs module and also allows the creation of a more interactive interface.

Because the job module stores the information in the background, I wanted to create an interface where the user would receive the responses of the processes in real time, creating a good experience.

### Worker Module

The jobs module is in the `/imports/worker` folder, the only dependence it has on the Meteor application is Data Collections, in Meteor these collections are just a wrapper of the Mongo.Collection, ie it is extremely simple to uncouple this module for any other application.

- I have created a basic structure of arrows functions that makes it possible to scale up Queues and Jobs Processors.
- The `./imports/worker/index.js` file is responsible for receiving all queues in the application and processing the jobs for each queue.
- All queues are instantiated and exported in `./imports/worker/queues.js`.
- The file `./imports/woker/rateLimitersRegisterStatus.js` is found a helper responsible for register the moment the rate limit of the queue has been reached, I am using this helper to only display the status graphically.

### Behavior of work queues

- `RAKE_TAG:` Every 1 minute checks for outdated tags based on Instagram API information, if outdated tags exist, they are passed to `UPDATE_TAG_COUNT`.
- `INSERT_TAG:` Inserts a new tag into the system if it does not exist and has medias in the instagram API.
- `UPDATE_TAG_COUNT:` Updates information from an outdated tag through the instagram API.
- `TAG_RATE_LIMITER:` Responsible for controlling the rate limit of the tags requests.
- `MEDIAS_RATE_LIMIT:` Responsible for controlling the rate limit of the medias requests.

## Additional informations

#### ACCESS_TOKEN

This application uses 2 ACCESS_TOKEN, the first is my sandbox token, it allows me make 450 requests per hour for tag queries, it is being used in the `INSERT_TAG` and `UPTADE_TAG_COUNT` queues.

The second is the token provided by you, I am using 2 tokens because it allowed me to continue checking outdated tags and insert new tags if the token of medias reaches the rate limit.

### Unlisted Medias

The total value of medias that is reported in the `https://api.instagram.com/v1/tags/:tag-name` endpoint does not correspond to the total amount that is available at `https://api.instagram.com/v1/tags/:tag-name/media/recent`, because some of them are medias that have comments with the tag, or private posts, instagram shows the total tag count but does not dispose all medias.

The application is dealing with this, after scanning all the medias of a tag, the unlisted medias count is done and stored in the store.

### Handling Exceptions

The system is handling all the exceptions and printing them by the console, but the print function is already separated and can apply any business logic that is necessary.

#### CSV Upload

The only way to input tags is through CSV upload, this upload only accepts CSV files in comma separation format, for example `(string1,string2,string3,...)` you can notice that in the `./imports/files/api/files.js` the application listens every time it finishes uploading a file, doing the unification of each line and adding it to the insertion queue.

I want to make it clear that I have the knowledge that it is not the best approach to file interpretation only in the comma-separated format, and that it is also not recommended to unify the records of the files using `_.uniq()`, because it is not scalable.

However I am using this practical solution to focus on the development of the worker module, as I believe this is the goal to be measured in the test.

#### UI

This application uses React for its interface, it was not used Redux because it is a simple interface, most of the components are only pure functions and there is only a single page

## Tests

Run `$ npm test` to run the app tests.

## Author

- **Victor Hugo Marques** - [https://vmarquesdev.github.io](https://vmarquesdev.github.io)
