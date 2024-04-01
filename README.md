# Parking Api

```sh
cd parking_api && npm run dev
```

```sh
./configure.sh
```

## Features

- authentication and authorization
- crud vehicles
- crud parking spots
- crud reservations

Here are the updated route descriptions based on the provided code:

1. **Authentication Routes (`authRoutes.js`):**

   - POST `/register`: Register a new user.
   - POST `/login`: Log in a user.
   - POST `/admin`: Log in as an admin.
   - POST `/refresh`: Refresh user authentication tokens.
   - GET `/me`: Retrieve the user's profile information (requires authentication).
   - POST `/logout`: Log out the user (requires authentication).

2. **Parking Place Routes (`parkingSpotRoutes.js`):**

   - POST `/`: Create a new parking place (requires authentication and authorization).
   - GET `/`: Retrieve a list of parking places.
   - GET `/:id`: Retrieve information about a specific parking place.
   - GET `/total`: Get the total number of parking places (requires authentication and authorization).
   - PUT `/:id/availability`: Update the availability of a specific parking place (requires authentication and authorization).
   - PUT `/:id`: Update information about a specific parking place (requires authentication and authorization).
   - DELETE `/:id`: Delete a specific parking place (requires authentication and authorization).

3. **Reservation Routes (`reservationRoutes.js`):**

   - POST `/`: Create a new reservation (requires authentication).
   - GET `/`: Retrieve a list of reservations (requires authentication and admin authorization).
   - GET `/total`: Get the total number of reservations (requires authentication and admin authorization).
   - GET `/:id`: Retrieve information about a specific reservation (requires authentication).
   - PUT `/:id`: Update information about a specific reservation (requires authentication).
   - PUT `/:id/status`: Update the status of a specific reservation (requires authentication and admin authorization).
   - DELETE `/:id`: Delete a specific reservation (requires authentication).

4. **User Routes (`userRoutes.js`):**

   - GET `/`: Retrieve a list of users (requires authentication and admin authorization).
   - GET `/total`: Get the total number of customers (requires authentication and admin authorization).
   - GET `/:id`: Retrieve information about a specific user (requires authentication and admin authorization).
   - DELETE `/profile`: Delete the user's profile (requires authentication).

5. **Vehicle Routes (`vehicleRoutes.js`):**
   - POST `/`: Create a new vehicle (requires authentication).
   - GET `/`: Retrieve a list of vehicles (requires authentication).
   - GET `/total`: Get the total number of vehicles (requires authentication and admin authorization).
   - GET `/:id`: Retrieve information about a specific vehicle (requires authentication and admin authorization).
   - PUT `/:id`: Update a specific vehicle (requires authentication).
   - GET `/u/p`: Retrieve a user's vehicles (requires authentication).
   - DELETE `/:id`: Delete a specific vehicle (requires authentication).
