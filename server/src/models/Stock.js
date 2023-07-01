module.exports = (sequalize, DataTypes) => 
    sequalize.define('Stock', {
        value: {
            type:DataTypes.STRING
        }, quantity: {
            type:DataTypes.NUMBER
        }
    }
);
