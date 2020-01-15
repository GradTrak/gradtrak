const goalList = []
exports.getGoals = (req, res)=>res.send(goalList)
exports.postGoals = (req, res)=>{
  if (req.body.goals) goalList = req.body.goals;
}//todo: add joi for validation purposes
