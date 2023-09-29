module.exports = (sequalize, DataTypes) => 
    sequalize.define('HistoryTransaction', {
        date: {
            type:DataTypes.DATE,
            get() {
                const rawValue = this.getDataValue('date');
                const date = new Date(rawValue);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const year = date.getFullYear();
                
                const formattedDate = `${day}/${month}/${year}`;
                
                console.log(formattedDate);
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
        }, bank: {
            type:DataTypes.STRING
        }
    }
);
