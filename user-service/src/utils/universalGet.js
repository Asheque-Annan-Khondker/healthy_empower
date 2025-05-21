const {Op} = require('sequelize');
// Input: {} || {col: {op: value}}
// output: Array of objects

function get(model, include = []){
  return async (req, res) => {
    try {
      const {search, page = 1, limit = 10, ...rest} =req.query;
      const offset = (page -1) * limit;
      
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
      if (search){
         console.log("Search query:", search);
        filters.name = {like: `%${search}%`}
      }
      // edit operator names from {col: {op: value}} to {col: {[Op.op]: value}}
      const whereClause = {} // Use this to make an object where the keys are the modified keys of filter
      Object.entries(filters).forEach(([col, condition])=>{
        // beware it may not be able to take multiple conditions, just test this first
        whereClause[col] = {[Op[Object.keys(condition)[0]]]: Object.values(condition)[0]}
      })
      // Loop through filters and build where clause
      
      console.log("Where clause:", whereClause);
      const result = await model.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include,
      })
      console.log("Result:", result);

      // return plain rows
      const plainRows = result.rows.map(row=>row.get({plain: true}))
      console.log("Plain rows:", plainRows);
      res.status(200).json({
        data: plainRows,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page)
      })
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = get
