# Agro Unity

Agro Unity is a web application aimed at facilitating agricultural community interactions and providing resources for farmers. It utilizes technologies such as EJS, Node.js, HTML, CSS, and MongoDB to create a seamless experience for users.

## Installation

To install and run Agro Unity locally, follow these steps:

1. **Clone the repository:**
2.**Navigate to the project directory:**
3. **Install dependencies:**
4. **Set up environment variables:**
- Create a `.env` file in the root directory.
- Add the following environment variables:
  ```
  MONGO_URI=your_mongodb_connection_string
  ```

5. **Start the server:**
6. **Access the application:**
Open your web browser and go to `http://localhost:3000`.

## Technologies Used

- EJS: Templating engine for generating HTML markup with JavaScript.
- Node.js: JavaScript runtime for server-side development.
- HTML: Markup language for structuring web pages.
- CSS: Style sheet language for designing web pages.
- MongoDB: NoSQL database for storing application data.
- Express: Web application framework for Node.js.
- Multer: Middleware for handling file uploads.
- dotenv: Module for loading environment variables from a .env file.
- Node Forge: Library for cryptographic and TLS/SSL tools.

## Project Structure

- `models.js`: Contains MongoDB schemas and models.
- `listingmodels.js`: Defines listing models.
- `contactmodel.js`: Defines contact models.
- `buymodel.js`: Defines buy models.
- `views/`: Directory containing EJS templates for rendering HTML views.
- `public/`: Directory for static assets such as CSS files, images, and client-side JavaScript.
- `routes/`: Directory for defining application routes.

## Deployment

Agro Unity is hosted on [https://agrounity-1.onrender.com/home](https://agrounity-1.onrender.com/home).


## License

This project is licensed under the [MIT License](LICENSE).

---

import express from "express";
import { dirname } from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import forge from "node-forge";
import mongoose from "mongoose";
import User from "./models.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import list from "./listingmodels.js";
import contact from"./contactmodel.js";
import dotenv from "dotenv";
import buy from "./buymodel.js"; 

