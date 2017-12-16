'use strict';

export default function(sequelize, DataTypes) {
    let Placement = sequelize.define('Placement', {
        position: {
            type: DataTypes.INTEGER,
        },
        date: {
            type: DataTypes.DATEONLY,
            defaultValue: sequelize.NOW,
        }
    }, {
        tableName: 'placement',
        classMethods: {
            associate: models => {
                Placement.belongsTo(models.Game, {
                    foreignKey: 'game_id',
                    foreignKeyConstraint: true
                });
            }
        }
    });

    return Placement;
}
