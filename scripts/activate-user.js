db.users.update({ username : username}, { $set : { "meta.disabled" : null, permissions : ["contact:read"] } });
