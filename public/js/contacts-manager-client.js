
function removeTagFromContact(id, contactId) {
  return axios.delete("/contacts/" + contactId + "/tags/" + id);
}

function addTagToContact(id, contactId) {
  return axios.post("/contacts/" + contactId + "/tags/", {
    tagId : id
  });
}

function deleteContact(id) {
  return axios.delete("/contacts/" + id);
}

function deleteTag(id) {
  return axios.delete("/tags/" + id);
}
