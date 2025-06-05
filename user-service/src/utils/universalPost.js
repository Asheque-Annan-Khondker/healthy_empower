
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
