const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const FabricSchema = new Schema({
    name: {
        designerName: String,
        fabricName: String,
    },
    color: {
        type: Array,

    },
    amount: Number,

    projectPlanned: {
        type: Boolean,
        required: true
    },
    material: {
        type: String,
        enum: ["cotton", "silk", "denim", "rayon"]
    }
});
// name of collection, schema
module.exports = mongoose.model("Fabric", FabricSchema);
