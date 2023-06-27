module.exports = (sequalize, DataTypes) => 
    sequalize.define('Stock', {
        Date: {
            type:DataTypes.DATE
        }
        
    }
        
    );
