# davinci
sample project

## Run it
After cloning the repo:
```
cd davinci
npm i
```

##### Run the back-end:
mysql server needs to be running.
```
node index.js
```

##### Run the front-end:
```
cd client
npm run serve
```

## What's wrong
this porject "just works". here's few points totally missing.
- no sql side data correctness check, i.e. no triggers in place
- no dockerzied environment for quick setup
- no classes nor type checking on data
- db error: I simply assume error code is always duplicate entry
- i don't sort by day on the front-end. there were no different days to show. i just sort by hour to make it more evident
- not sure if the specs wanted another "groupBy ragione sociale"??!! I believe this shows enough anyways...