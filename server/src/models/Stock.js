module.exports = (sequalize, DataTypes) => 
    sequalize.define('Stock', {
        value: {
            type:DataTypes.STRING
        }, designation: {
            type:DataTypes.STRING
        }
    }
);
