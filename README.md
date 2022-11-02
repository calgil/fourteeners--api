# Fourteeners API

> Backend API for Fourteeners application, which is a directory of mountains over 14,000 ft in Colorado.

## Usage
Rename "config/config.env.env" to "config/config.env" and update the values/setting to your own

## Install Dependencies
```
npm install
```

## Run App
```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with peaks and users from "\_data" folder, run:

```
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```

- Version 1.0.0
- License: MIT
