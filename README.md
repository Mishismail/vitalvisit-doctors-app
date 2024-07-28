# Vital Visit Doctor Appointment Booking System

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [System Requirements Specification](#system-requirements-specification)
    - [Functional Requirements](#functional-requirements)
    - [Non-Functional Requirements](#non-functional-requirements)
    - [User Stories](#user-stories)
4. [Comparison with Existing Solutions](#comparison-with-existing-solutions)
5. [Deployment](#deployment)
6. [Usage](#usage)
7. [Installation](#installation)
8. [Security Measures](#security-measures)
9. [Third-Party APIs](#third-party-apis)
10. [Deployment Details](#deployment-details)
11. [Screenshots](#screenshots)

## Introduction
The Vital Visit Doctor Appointment Booking System is a web application designed to streamline the process of booking appointments with doctors. Patients can browse through a list of doctors and book appointments. Doctors can view their schedules, manage their availability, and approve or reject appointment requests. Admins can manage the list of doctors and users, approve or reject doctor applications, and block users if needed. The system aims to simplify the appointment booking process for patients, doctors, and admins, making it more efficient and user-friendly.

## System Architecture
### Web Stack
- **Frontend**: The frontend is developed using [Create React App (CRA)](https://create-react-app.dev/), a popular tool for building single-page React applications. It provides a robust setup with a great developer experience.
  - **Motivation**: React is chosen for its component-based architecture, which promotes reusability and ease of maintenance. CRA simplifies the setup and configuration process, allowing for faster development.
  - **Styling**: The app is styled using [Ant Design](https://ant.design/), a powerful UI framework that provides a wide range of pre-designed components and a consistent design language. It is chosen for its comprehensive library, ease of use, and professional design.

- **Backend**: The backend is built with [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/), a flexible web application framework for Node.js.
  - **Motivation**: Node.js is chosen for its non-blocking, event-driven architecture, which makes it suitable for I/O-heavy applications like ours. Express simplifies routing and middleware integration, making it easier to build scalable and maintainable APIs.

- **Database**: The application uses [MongoDB](https://www.mongodb.com/atlas/database) for data storage, managed via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
  - **Motivation**: MongoDB's schema-less design provides flexibility in storing diverse types of data and makes it easier to evolve the database schema as the application grows.

### System Architecture Diagram

[System Architecture Diagram](https://bit.ly/VitalVisitDiagram)

## System Requirements Specification

### Functional Requirements
1. **User Registration and Authentication**:
   - Patients, doctors, and admins can register and log in.
   - Authentication is managed using JSON Web Tokens (JWT).

2. **User Roles**:
   - **Patients**:
     - Browse through a list of available doctors.
     - Book appointments with selected doctors.
     - View their appointments.
   - **Doctors**:
     - View their appointment schedule.
     - Approve or reject appointment requests.
     - Manage their availability.
     - Manage their profile.
   - **Admins**:
     - Approve or reject doctor applications.
     - View and manage the list of registered users.
     - Block users if necessary.

3. **Appointment Management**:
   - Patients can book and view appointments.
   - Doctors can approve, reject, and manage their schedule.

4. **Notifications**:
   - Notify patients of appointment status changes.
   - Notify doctors of new appointment requests.
   - Notify admins of new doctor applications.
   - Notify users when their account is approved, an appointment is approved, or a new doctor has applied.

### Non-Functional Requirements
1. **Scalability**:
   - The system will be designed to scale horizontally to handle increased loads, with the possibility of adding new features like teleconsultation, prescription management, follow-up requests from the doctor, etc.

2. **Performance**:
   - The application will have a responsive UI with minimal load times and efficient backend processing to handle multiple concurrent users.

3. **Security**:
   - Data is protected using HTTPS for secure communication.
   - User authentication and authorization are managed using JWT and secure password hashing.

4. **Usability**:
   - The UI is intuitive and user-friendly, ensuring a seamless experience for patients, doctors, and admins.

5. **Maintainability**:
   - The codebase follows best practices with modular and reusable components, making it easier to maintain and extend.

### User Stories
1. **Patient User Stories**:
   - As a patient, I want to register and log in so that I can book appointments with doctors.
   - As a patient, I want to browse available doctors and their schedules so that I can choose the best time for an appointment.
   - As a patient, I want to book an appointment with a doctor so that I can receive medical consultation.
   - As a patient, I want to view and manage my booked appointments so that I can keep track of my medical visits.

2. **Doctor User Stories**:
   - As a doctor, I want to register and log in so that I can manage my schedule and appointments.
   - As a doctor, I want to view my appointment schedule so that I can prepare for my consultations.
   - As a doctor, I want to approve or reject appointment requests so that I can manage my availability.
   - As a doctor, I want to manage my profile so that my information is up-to-date.

3. **Admin User Stories**:
   - As an admin, I want to approve or reject doctor applications so that only qualified doctors can join the platform.
   - As an admin, I want to view and manage the list of registered users so that I can maintain the platform’s integrity.
   - As an admin, I want to block users if necessary to prevent misuse of the platform.

## Comparison with Existing Solutions
Currently, there are several web applications for booking doctor appointments, such as Zocdoc and Practo. However, our solution aims to be:
- **Simpler**: A more straightforward user interface focused on ease of use.
- **Cost-effective**: Potentially cheaper for smaller clinics or individual doctors.
- **Customizable**: Easy to add new features and customize according to specific needs.

## Deployment

The application will be deployed using [Vercel](https://vercel.com/) for both the frontend and backend.

- **Motivation**: Vercel provides seamless deployment for React applications with built-in support for serverless functions and Node.js applications. It offers an easy-to-use platform-as-a-service (PaaS) for deploying and managing applications.

### Deployment Steps

1. **Frontend (Vercel)**:
   - Connect the GitHub repository to Vercel.
   - Configure the build settings to use `npm run build`.
   - Deploy the application.

2. **Backend (Vercel)**:
   - Connect the GitHub repository to Vercel.
   - Configure the project to recognize serverless functions or API routes as the backend.
   - Configure environment variables for the database connection and JWT secret in Vercel.
   - Deploy the application.

### Detailed Deployment Instructions

#### Frontend (Vercel)

1. Go to the Vercel website and sign in or sign up.
2. Click on "New Project" and import your GitHub repository.
3. Select your repository and click "Import".
4. Configure the project settings:
   - Framework Preset: React
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Click "Deploy" to deploy the frontend.

#### Backend (Vercel)

1. Ensure your backend code is structured to work with Vercel serverless functions (e.g., placing your API routes in an `api` directory).
2. Go to the Vercel website and sign in.
3. Click on "New Project" and import your GitHub repository.
4. Select your repository and click "Import".
5. Configure the project settings:
   - Ensure that your backend API routes are correctly identified.
6. Set the necessary environment variables:
   - Go to the "Settings" tab of your project.
   - Under "Environment Variables", add the required variables (e.g., `DB_URL`, `JWT_SECRET`).
7. Click "Deploy" to deploy the backend.

## Usage
### How to Use the App
1. **Patients**:
   - Register an account and log in.
   - Browse through the list of available doctors.
   - Book an appointment with a selected doctor.
   - View and manage your booked appointments.
   - Receive notifications for appointment status changes.

2. **Doctors**:
   - Register an account and log in.
   - Manage your profile and availability.
   - View your appointment schedule.
   - Approve or reject appointment requests.
   - Receive notifications for new appointment requests.

3. **Admins**:
   - Register an account and log in.
   - Approve or reject doctor applications.
   - View and manage the list of registered users.
   - Block users if necessary.
   - Receive notifications for new doctor applications.

## Installation
### Local Installation Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Mishismail/vitalvisit-doctors-app.git
   cd doctor-appointment-booking-system

2. **Install Dependencies**:
   ```bash
   npm install
   
3. **Set Up Environment Variables**:
   - Create a .env file in the root directory.
   - Add the following environment variables:
   ```bash
   DB_URL=your_mongodb_uri
   JWT_SECRET=your_jwt_secret

4. **Run the Application**:
   ```bash
   npm start

5. **Access the Application**:
   - Open your browser and go to http://localhost:3000.


### Testing Instructions
1. **Run Tests**:
   ```bash
   npm test


## Security Measures
### Security Implementations
- **HTTPS**: Ensures secure communication between the client and server.
- **JWT**: Used for secure authentication and authorization.
- **Password Hashing**: User passwords are securely hashed before storing them in the database.
- **Environment Variables**: Sensitive information such as API keys and database URIs are stored in environment variables, not in the codebase.

## Third-Party APIs
### APIs Used
- **MongoDB Atlas**: Managed MongoDB service for data storage.
- **Ant Design**: UI framework for building the frontend components.

## Deployment Details
### Deployment Information
- The application has been deployed using Vercel.
- **Frontend** and **Backend**: Both are deployed together in the same root file using Vercel's platform-as-a-service (PaaS) capabilities.
            **Motivation**: This allows for seamless integration, better scalability, and maintainability.
- **Deployment Link**: Doctor Appointment Booking System

## Screenshots

### Login

![alt text](<images/Login Form.png>)

### Registration

![alt text](<images/Register Form.png>)

### Doctor Profile Homepage

![alt text](<images/Doctor Homepage.png>)

### Doctor Appointments Page

![alt text](<images/Doctor Appointments.png>)

### Doctor Manage Profile

![alt text](<images/Doctor Profile.png>)

### Users Profile Homepage

![alt text](<images/User Homepage.png>)

### Users Booking Form & Appointments Page

![alt text](<images/User Booking and Appointments.png>)

### Users Apply for Doctor Page

![alt text](<images/User - Apply for Doctor.png>)

### Admin Profile Homepage

![alt text](<images/Admin Homepage.png>)

### Admin Doctors Access Page

![alt text](<images/Admin Doctors List.png>)

### Admin Users Access Page

![alt text](<images/Admin User List.png>)
