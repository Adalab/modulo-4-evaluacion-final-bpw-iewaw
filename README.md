# Recipes API

## Description
Simple yet complete, Node.js CRUD API.
Based on an **Express** server and a **MySQL** database.

## Getting started
Clone the repo and check out my project. Make sure you have [Node JS](https://nodejs.org/en) installed.
You will also need [MySQL Workbench](https://www.mysql.com/products/workbench/) to create your local database.
Finally, [Postman](https://www.postman.com/) is a great tool to try out the project's endpoints.

### Database
Inside **data** folder of the project, you will find two SQL files containing the database structure and some sample data. 
Run them in MySQL Workbench, wherever you wish to create your schema.

Make sure to create your own **.env** file that will include your database connection details.
You can use **.env_example** included inside the project, just rename it and complete the missing information.

### Installation
Please run the below command to install the project properly: 

```
npm install
```

### Dependencies
In order to add project's dependencies, run the following command:

```
npm i express cors nodemon dotenv mysql2
```

### Running the project
Finally, you are ready to run the project:

```
npm run dev
```

### Testing
Try out the endpoints invoking them from your Postman.

### Contributions
Pull requests are welcome. For major changes, please open an issue first.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Author
[iewaw](https://github.com/iewaw)

