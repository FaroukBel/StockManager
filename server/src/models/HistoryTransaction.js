module.exports = (sequalize, DataTypes) => 
    sequalize.define('HistoryTransaction', {
        date: {
            type:DataTypes.DATE,
            get() {
                const rawValue = this.getDataValue('date');
                const formattedDate = new Date(rawValue).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return formattedDate;
              },
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
