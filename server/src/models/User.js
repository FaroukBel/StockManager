module.exports = (sequalize, DataTypes) => 
    sequalize.define('User', {
        Username: {
            type: DataTypes.DATE,
            unique: true
        },
        Password: DataTypes.STRING
        
    }
        
    );
