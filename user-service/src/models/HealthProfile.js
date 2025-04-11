module.exports = (sequelize, DataTypes) => {
  const HealthProfile = sequelize.define('HealthProfile', {
    profile_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }, 
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    height: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    weight: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    recorded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'health_profiles',
    timestamps: false
  }); 
  return HealthProfile;
}
