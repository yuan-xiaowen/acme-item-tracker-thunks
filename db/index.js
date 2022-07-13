const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/the_acme_item_tracker_db');

const { STRING, INTEGER } = Sequelize;

const User = conn.define('user', {
  name: {
    type: STRING 
  },
  ranking:{
    type:INTEGER,
    defaultValue:5
  }
});

const Thing = conn.define('thing', {
  name: {
    type: STRING 
  },
  ranking: {
    type: INTEGER,
    defaultValue: 1
  }
});

Thing.belongsTo(User);

Thing.addHook('beforeValidate', (thing) => {
  if(!thing.userId){
    thing.userId = null;
  }
});

Thing.addHook('beforeUpdate', async(thing) => {
  const id = thing.userId
  const content = await Thing.findAll({where:{userId:id}})   
  console.log('*******',content.length)
  if (content.length===3){
    throw new Error("You can't assign this user!")
  }
  return
}
);

module.exports = {
  conn,
  User,
  Thing
};
