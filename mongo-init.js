db.auth('hiverlab', 'hiverlab')
db = db.getSiblingDB("data-handler")
db.createUser(
    {
        user: "hiverlab",
        pwd: "hiverlab",
        roles: [
            {
                role: "readWrite",
                db: "data-handler"
            }
        ]
    }
);