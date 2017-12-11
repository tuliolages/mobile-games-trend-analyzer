'use strict';

export default function(sequelize, DataTypes) {
    let Game = sequelize.define('Game', {
        _id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        title: DataTypes.STRING,
        icon: DataTypes.STRING
    }, {
        tableName: 'game',
        classMethods: {
            associate: models => {
                Game.belongsTo(models.Genre, {
                    foreignKey: 'genre_id', 
                    foreignKeyConstraint: true
                });
                Game.hasMany(models.Placement);
            }
        },
    });

    return Game;
}
