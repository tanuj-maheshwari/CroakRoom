const users = [];

//Add user in user-list
function addUser (id, username, room) {
    const user_object = {id, username, room};
    users.push(user_object);
}

//Returns a user object by id
function getUserById (id) {
    return users.find(user => user.id === id);
}

//Deletes a user from user list
function deleteUser (id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        const delUser = users[index];
        users.splice(index, 1);
        return delUser;
    }
}

//Returns list of all users in room
function getUsersInRoom (room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    addUser, 
    getUserById, 
    deleteUser,
    getUsersInRoom
};