# Blog_project

Link to website
https://blog-project-1-i8hi.onrender.com
![alt text](image.png)

![alt text](image-1.png)

Link to the repository of Blog Front-End
https://github.com/hadao169/Blog_frontend

# Project Description

## A blog is an online website where individuals regularly publish written content in the form of posts or articles. Blogs serve a variety of purposes and can be used for different reasons, including:

- Sharing Information
- Expressing Ideas and Opinions
- Educating and Informing

## Some features:

- User administration
- Token authentication
- Database to store data

## Functionalities:

- If a user is not logged in, only the login form is visible.
  ![alt text](image.png)

- If the user is logged-in, the name of the user and a list of blogs is shown and the token which is created will be save to browser local storage
  ![alt text](image-1.png)

  - Note: Because I'm using jwt authentication, so please use this account to sign in (username: hadao4, password:3432). I'm trying to implement user registration

- Failed login can show the following notification
  ![alt text](image-3.png)

- Notifications that inform the user about successful and unsuccessful operations at the top of the page
  ![alt text](image-2.png)

- In the homepage, for each blog, you can view the detailed informations of it by clicking view button
- Moreover, you can delete it from the app as well as the database by clicking remove button which trigger a browser dialog to make sure that you want to delete that blog
  ![alt text](image-4.png)

- In addition, I add the "add" functionality where you can add a new blog. By default, add blog form is not shown until you click "add blog" button. You can also click "cancel" button to hide the "add blog form"
  ![alt text](image-5.png)

# Future extension:

- User registration
- Improve responsive design
- Search blog with a key

# Technologies

## Front-end

- Languages:
  - HTML
  - CSS
  - JavaScript
- Framework:
  - ReactJs

## Back-end

- Language:
  - JavaScript
  - Node.js
- Framework:
  - Express.js
  - Mongoose
- Database:
  - MongoDB
