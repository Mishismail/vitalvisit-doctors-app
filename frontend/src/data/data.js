// Menu configurations for user and admin roles

// User menu configuration
export const userMenu = [
  {
    name: "Home", // Display name of the menu item
    path: "/", // Path to navigate to when the menu item is clicked
    icon: "fa-solid fa-house", // Icon class for the menu item
  },
  {
    name: "Appointments", // Display name of the menu item
    path: "/appointments", // Path to navigate to when the menu item is clicked
    icon: "fa-solid fa-list", // Icon class for the menu item
  },
  {
    name: "Apply Doctor", // Display name of the menu item
    path: "/apply-doctor", // Path to navigate to when the menu item is clicked
    icon: "fa-solid fa-user-doctor", // Icon class for the menu item
  }
];

// Admin menu configuration
export const adminMenu = [
  {
    name: "Home", // Display name of the menu item
    path: "/", // Path to navigate to when the menu item is clicked
    icon: "fa-solid fa-house", // Icon class for the menu item
  },
  {
    name: "Doctors", // Display name of the menu item
    path: "/admin/doctors", // Path to navigate to when the menu item is clicked
    icon: "fa-solid fa-user-doctor", // Icon class for the menu item
  },
  {
    name: "Users", // Display name of the menu item
    path: "/admin/users", // Path to navigate to when the menu item is clicked
    icon: "fa-solid fa-user", // Icon class for the menu item
  }
];

// Doctor menu configuration
export const doctorMenu = [
  {
    name: "Home", // Display name of the menu item
    path: "/", // Path to navigate to when the menu item is clicked
    icon: "fa-solid fa-house", // Icon class for the menu item
  },
  {
    name: "Appointments", // Display name of the menu item
    path: "/doctor-appointments", // Path to navigate to when the menu item is clicked
    icon: "fa-solid fa-list", // Icon class for the menu item
  },
  {
    name: "Profile", // Display name of the menu item
    path: `/doctor/profile/:id`, // Path to navigate to when the menu item is clicked
    icon: "fa-solid fa-user", // Icon class for the menu item
  }
];


  