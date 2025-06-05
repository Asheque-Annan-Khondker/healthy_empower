

const {Op} = require('sequelize');
// Input: {} || {col: {op: value}}
// output: Array of objects

function get(model, include = []){
  return async (req, res) => {
    try {
      const {search,  ...rest} =req.query;
      
      console.log("Fetching data from model:", model.name); 
      
      let filters = {}
      if (req.query.filters){
        if(typeof req.query.filters === 'string'){
          filters = JSON.parse(req.query.filters)

        } else if(typeof req.query.filters === 'object'){
          filters = req.query.filters
        }
      }

      console.log("IM HERE Look AT Memememememememe:", filters)
  Object.entries(filters).forEach(([col, condition])=>{
    console.log(`DEBUG - Col: ${col}, Condition type: ${typeof condition}, Condition:`, condition);
    // ...rest of your code
  })
      // Parse through json since it will be sent through axios
      Object.keys(filters).forEach(key =>{
        const value = filters[key]
        if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))){
          try {
            filters[key] = JSON.parse(value)
            
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      })
      console.log("Filters after parsing:", filters)
      
      // Auto-add user_id filter if userId parameter exists in route
      if (req.params.userId) {
        console.log("🔐 Universal DML: Auto-adding user_id filter for userId:", req.params.userId);
        filters.user_id = { eq: req.params.userId };
      }
      
      if (search){
         console.log("Search query:", search);
        filters.name = {like: `%${search}%`}
      }
      // edit operator names from {col: {op: value}} to {col: {[Op.op]: value}}
      const whereClause = {} // Use this to make an object where the keys are the modified keys of filter
      //Seems like entries is not iterating through the
      Object.entries(filters).forEach(([col, condition])=>{
        // beware it may not be able to take multiple conditions, just test this first
        // fix this up: Done
        // modify this to support nested extraction. so far it's only single layered.
        console.log(`Col ${JSON.stringify(col)}:${JSON.stringify(condition)}`);
        
        // Handle both {col: value} and {col: {op: value}} formats
        if (typeof condition === 'object' && condition !== null && !Array.isArray(condition)) {
          // Check if it's an operator object like {eq: value}
          const hasOperators = Object.keys(condition).some(key => Op[key] !== undefined);
          if (hasOperators) {
            // It's a proper operator object: {eq: value, gt: 5}
            whereClause[col] = Object.entries(condition).reduce((acc, [op, value]) =>{
              acc[Op[op]] = value
              return acc
            }, {})
          } else {
            // It's a plain object, treat as equality: {col: {someKey: someValue}} -> {col: {someKey: someValue}}
            whereClause[col] = condition
          }
        } else {
          // It's a primitive value: {col: value} -> {col: {[Op.eq]: value}}
          whereClause[col] = { [Op.eq]: condition }
        }
      })
      // Loop through filters and build where clause
      
      console.log("Where clause:", whereClause);
      const result = await model.findAndCountAll({
        where: whereClause,
        include,
      })
      console.log("Result:", result);

      // return plain rows
      const plainRows = result.rows.map(row=>row.get({plain: true}))
      console.log("Plain rows:", plainRows);
      res.status(200).json({
        data: plainRows,
        totalCount: result.count,
      })
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

// This function is a universal post function.
function post(model){

  return async (req, res) => {
    // perform checks but we have to make sure to account for the table columns
    try{

      const payload = req.body;
      console.log("Payload:", payload);

      // make sure the payloud fits the model.
      // cheekily we may not have to. let the server return the error hehe
     // check if there any auto generated fields created_at fields
      const autoGenFields = ['created_at', 'completed_at', 'logged_at', 'last_login']
      autoGenFields.forEach(field=>{
        if(model.rawAttributes[field]){
          payload[field] = new Date()
        }
      })
     const submission = await model.create(payload); 
      res.status(201).json(submission)

    } catch (error){
      res.status(500).json({ error: error.message})
    }
}

}

function update(model){
  
  return async (req, res) => {

    try{

      // somehow we have to get the frontend to give the id_var here since we don't know the name of the id var as the model is a variable
      // shouldnt the id_var already be sent in the update request anyways?
      
      const payload = req.body;
      



    } catch(err){
      res.status(500).json({error: err.message})
    }
  }
}
module.exports = {
  get,
  post,
  update
}
