'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A firstName is required'
                },
                notEmpty: {
                    msg: 'Please provide a first name',
                },
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A lastName is required'
                },
                notEmpty: {
                    msg: 'Please provide a last name',
                },
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'An email is required'
                },
                notEmpty: {
                    msg: 'Please an email',
                },
                isEmail: {
                    msg: 'Please provide a correctly formatted email such as example@email.com'
                },
            }
        },
        password: {
            type: DataTypes.STRING,  
            allowNull: false,
            set(val) {
                const hash = bcrypt.hashSync(val, 10);
                this.setDataValue('password', hash);
            },
            validate: {
                notNull: {
                    msg: 'A password is required'
                },
                notEmpty: {
                    msg: 'A password is required',
                  },
            }
        }
    }, { 
        sequelize 
    });

    User.associate = (models) => {
        User.hasMany(models.Course, {
          foreignKey: {
            fieldName:'id',
            allowNull: false,
          },
        });  
      };
    return User;
};