module.exports = (sequalize, DataTypes) => 
    sequalize.define('Transaction', {
        stock: {
            type:DataTypes.STRING
        }, quantity: {
            type:DataTypes.STRING
        }, buyprice: {
            type:DataTypes.STRING
        }, sellprice: {
            type:DataTypes.STRING
        }, total: {
            type:DataTypes.STRING
        }, pl: {
            type:DataTypes.STRING
        }, totalgain: {
            type:DataTypes.STRING
        }
    }
);
