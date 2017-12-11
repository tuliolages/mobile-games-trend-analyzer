'use strict';

export default function(sequelize, DataTypes) {
    let Genre = sequelize.define('Genre', {
        _id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: DataTypes.STRING
    }, {
        tableName: 'genre',
        classMethods: {
            associate: models => {
                Genre.hasMany(models.Game);
            }
        },
    });

    return Genre;
}
