const mongoose = reguire("mongoose");
const Schema = mongoose.Schema;
let user = new Schema(
    {
        firstname: {
            type: String
        },
        lastName: {
            type: String
        },
        dob: {
            type: date
        },
        street_address: {
            type: String
        }
    },
    {collection: "users"}
)

module.exports = mongoose.model("users", user);