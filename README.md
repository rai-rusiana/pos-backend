# pos-backend
  # install modules with this command in the terminal window to open pres [shift] + [`]:
    npm install
  # How to run? 
    npm run dev
  You should see these endpoints
  Server is running on http://localhost:3000
  JWT_SECRET from env: your_super_secret_jwt_key    
  Endpoints:
  <<=========== User Router =========>>
  - POST http://localhost:3000/api/users/login      
  - POST http://localhost:3000/api/users/
  - POST http://localhost:3000/api/users/refresh    
  - POST http://localhost:3000/api/users/staff      
  - GET http://localhost:3000/api/users/
  - GET http://localhost:3000/api/users/:id
  - PUT http://localhost:3000/api/users/:id
  - DELETE http://localhost:3000/api/users/:id      
  <<=========== Branch Router =========>>
  - POST http://localhost:3000/api/branches/        
  - GET http://localhost:3000/api/branches/
  - GET http://localhost:3000/api/branches/:id      
  - PUT http://localhost:3000/api/branches/:id      
  - DELETE http://localhost:3000/api/branches/:id   
  ....
  # how to test? 
  use PostMan https://www.postman.com/downloads/
  or install VS Code extension if you are using 
  VS CODE rangav.vscode-thunder-client or go here 
  https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client
  or a client with your preferences
  
  # if you use ThunderClient in VS Code press [ctrl] + [shift] + [r]
    //New Request Register user Example
    //POST http://localhost:3000/api/users/
    //Click body type JSON body like these objects.
    {
      "email": "...@gm232ail.com",
      "password": "...",
      "role": "CASHIER",
      "fullname": "staff test 1",
      "username": "Star kill"
    }
  # See src/routes/*. 
  => route endpoint creation
  # See src/controllers/*.
  => http status code controller, 200 success: 400 for errors, with error handling
  # See src/services/*. 
  => this is for creation, fetching data
  # See src/middleware/*. 
  => User guard before using the route, 
  E.g. authenticateToken() used to check if there access token in other words the user is Authenticated or Logged in
  before performing and action, if not authenticated they can't proceed it will send 403 error back to the user
  # note: each module are co-dependent, 
  please take your time to see the patterns, start with the users route.
  # additional note:
  Database Used is not Posgress but SQLite3, GraphQL not applied yet,
  purpose is to test before migrating a Scalable database and GraphQL.
  # See prisma/schema.prisma 
  database schema setup, relationships, models(tables), fields and fieldtypes. 
  
  # Create .env file in the root of the project and Message in Viber Group chat
