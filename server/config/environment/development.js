'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

    // Sequelize connection opions
    sequelize: {
        uri: process.env.SEQUELIZE_URI || 'postgres://postgres:1234@localhost:5432/dev',
        options: {
          //logging: false,
          dialect: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '1234',
    
          define: {
            timestamps: false
          }
        }     
      },
    
      seedDB: true
    };
};
