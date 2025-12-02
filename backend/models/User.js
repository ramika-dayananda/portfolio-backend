import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },

    // ✔ FIXED ROLE (Only one)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// ✔ Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✔ Compare entered password with hashed
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
