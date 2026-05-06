const mongoose = require('mongoose');

const rolePermissionSchema = new mongoose.Schema({
  resource: { type: String, required: true },
  actions: [{ type: String }],
}, { _id: false });

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  permissions: [rolePermissionSchema],
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  color: { type: String, default: '#c9a96e' },
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);