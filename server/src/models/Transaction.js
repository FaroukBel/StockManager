module.exports = (sequalize, DataTypes) => 
    sequalize.define('Transaction', {
        stock: {
            type:DataTypes.STRING
        }, quantity: {
            type:DataTypes.NUMBER
        }, buyprice: {
            type:DataTypes.NUMBER
        }, sellprice: {
            type:DataTypes.NUMBER
        }, total: {
            type:DataTypes.NUMBER
        }, pl: {
            type:DataTypes.NUMBER
        }, totalgain: {
            type:DataTypes.NUMBER
        }
    }
);
