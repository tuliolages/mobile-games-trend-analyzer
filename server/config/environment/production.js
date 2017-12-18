'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP
        || process.env.ip
        || undefined,

    // Server port
    port: process.env.OPENSHIFT_NODEJS_PORT
        || process.env.PORT
        || 8080,
    sequelize: {
        uri: process.env.POSTGRES_URL || 'postgres://fetmnkyjxobgre:41aae26b3000fc0f62d5afd8b1c63f35846d8dda34ce7976c51bd39ce440820e@ec2-107-21-201-57.compute-1.amazonaws.com:5432/d3gvpb7ubn3bok',
        options: {
          //logging: false,
          dialect: 'postgres',
          database: 'd3gvpb7ubn3bok',
          host: 'ec2-107-21-201-57.compute-1.amazonaws.com',
          port: 5432,
          username: 'fetmnkyjxobgre',
          password: '41aae26b3000fc0f62d5afd8b1c63f35846d8dda34ce7976c51bd39ce440820e',
    
          define: {
            timestamps: false
          }
        }     
      },
    
      seedDB: false
    };
};
