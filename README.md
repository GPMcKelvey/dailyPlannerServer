<h1 align="center">Daily Planner - Server</h1>

<h4 align="left">Models</h4>
<hr/>
<p>I created models for all of the database tables that I wanted to create.</p>

<ul>
  <li><h6>Users</h6></li>
  <ol>
    <li>Username - the name the user will use to log into the site.</li>
    <li>Password - a hashed string is stored so that the users login credentials remain private.</li>
    <li>Admin - this is a boolean value that can only be assigned from the backend through Postman. With a value of true, the user has administrative access to the site and its users</li>
  </ol>
  <li><h6>Events</h6></li>
  <ol>
    <li>eventTitle - string - title given to the event.</li>
    <li>eventDescription - string - this is where the user can describe the event.</li>
    <li>eventDate - date - the date of the event</li>
    <li>eventStartTime - time - the time the event starts.</li>
    <li>eventEndTime - time - the time the event ends.</li>
    <li>eventPrivacy - boolean - if true the event remains private to the user that created it.</li>
  </ol>
  <li><h6>Notes</h6></li>
  <ol>
    <li>title - string - title of the note.</li>
    <li>content - string - the content of the note.</li>
  </ol>
  <li><h6>Todos</h6></li>
  <ol>
    <li>task - string - the task created.</li>
    <li>completed - boolean - mark the task true if complete.</li>
  </ol>
</ul>
<hr />
<h4 align="left">Controllers</h4>
<hr/>
<p>I created controllers for all of the endpoints that I wanted to access.</p>
<ul>
  <li><h6>Users</h6></li>
  <ol>
    <li>Login - POST - allows a user to get a session token for Authorization in the Headers.</li>
    <li>Signup - POST - allows a user to create a username and password in the database and returns a session token for Authorization in the headers.</li>
    <li>View all users - GET - allows admins to view a list of all users where 'admin: false'.</li>
    <li>Delete a user - DELETE - allows admins to delete a user.</li>
  </ol>
  <li><h6>Events</h6></li>
  <ol>
    <li>Create event - POST - creates an event in the events database.</li>
    <li>Retrieve all public events - GET - retrieves all events that have a boolean of false.</li>
    <li>Retrieve all private events - GET - retrieves all events that have been created by the user that is requesting them.</li>
    <li>Update event - PUT - update any field of an event created by that user.</li>
    <li>Delete event - DELETE - delete a particular event that was created by that user.</li>
  </ol>
  <li><h6>Notes</h6></li>
  <ol>
    <li>Create note - POST - create a note in the notes database.</li>
    <li>Retrieve notes - GET - retrieves all notes created by the user requesting them.</li>
    <li>Update note- PUT - updates all fields of a note created by that user.</li>
    <li>Delete note - DELETE - deletes a particular note that was created by that user.</li>
  </ol>
  <li><h6>Todos</h6></li>
  <ol>
    <li>Create task - POST - create a task in the tasks database.</li>
    <li>Retrieve tasks - GET - retrieves all tasks created by the user requesting them.</li>
    <li>Update task- PUT - updates a task created by that user.</li>
    <li>Delete task - DELETE - deletes a particular task that was created by that user.</li>
  </ol>
</ul>
<hr />
<h4 align="left">Middleware</h4>
<hr/>
<p>Middleware functions to secure access to my site.</p>
<ul>
    <li>Validate Session</li>
    <p> - this is where a session token is generated that will authenticate users in the site. It utilizes jsonwebtoken dependency to generate an encrypted token that stores some basic user information as well as acts as an access "key" to the site. It is good for 24 hours which means that the user can access the site for that long before having to log back into the site.</p>
</ul>