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
        }, total: {
            type:DataTypes.STRING
        }, tax: {
            type:DataTypes.STRING
        }, totalcom: {
            type:DataTypes.STRING
        }
    }
);
