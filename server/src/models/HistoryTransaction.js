module.exports = (sequalize, DataTypes) => 
    sequalize.define('HistoryTransaction', {
        date: {
            type:DataTypes.DATE
        }, value: {
            type:DataTypes.STRING
        }, type: {
            type:DataTypes.STRING
        }, quantity: {
            type:DataTypes.STRING
        }, price: {
            type:DataTypes.STRING
        }, brut: {
            type:DataTypes.STRING
        }, tax: {
            type:DataTypes.STRING
        }, net: {
            type:DataTypes.STRING
        }
    }
);
