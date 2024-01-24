**Simple Login Page Android App**

Welcome to the Simple Login Page Android App for IIT Ropar students! This app allows you to log in using your institute email ID or sign up if you're a new user. Once logged in, you can also edit your profile data.

### Instructions:

1. **Clone or Download the Repository:**
   - Clone or download the repository to your local machine.

2. **Install Node Modules:**
   - Navigate to the project directory in your terminal.
   - Run the following command to install the required Node modules for both the backend and frontend:

     ```bash
     npm install
     ```

3. **Update Email and Password (Backend):**
   - Open the `backend/util.js` file in a text editor.
   - Locate the following lines:

     ```javascript
     // Update these credentials with your IIT Ropar email ID and password
     const instituteEmail = "your_email@iitrpr.ac.in";
     const institutePassword = "your_password";
     ```

   - Replace `"your_email@iitrpr.ac.in"` with your actual IIT Ropar institute email ID.
   - Replace `"your_password"` with your actual institute email password.
   - Save the changes.

4. **Run Backend:**
   - Start the backend server first.
   - Navigate to the `backend` directory.
   - Run the backend server using the following command:

     ```bash
     npm start
     ```

   - Ensure the backend server is running and accessible.

5. **Run Frontend:**
   - Open a new terminal window and navigate to the `frontend` directory.
   - Run the frontend using the following command:

     ```bash
     npm start
     ```

   - The app should launch on your default web browser.

6. **Login or Signup:**
   - Use your IIT Ropar institute email ID to log in.
   - If you're a new user, sign up to create your account.

7. **Edit Profile Data:**
   - Once logged in, you have the option to edit your profile data.

### Note:
- Ensure that Node.js is installed on your machine.
- Make sure to start the backend server before running the frontend.
- In case of any issues, check the console logs for error messages.

Now you're all set to explore the Simple Login Page Android App for IIT Ropar! If you encounter any problems or have questions, feel free to reach out for assistance. Happy coding!
