db.users.update({ username : username}, { $set : { permissions : ["*"] } });
