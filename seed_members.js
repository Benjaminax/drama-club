import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const teamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String },
    imageUrl: { type: String },
    order: { type: Number, default: 0 }
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

const seedMembers = [
    {
        name: "Acsah Nhyira Okla",
        role: "President",
        bio: "Leading with vision, passion, and creativity. Nhyira continues to guide the club in building spaces where stories are told, ideas flourish, and artistic expression thrives.",
        imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1bfa82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        order: 1
    },
    {
        name: "Sybil Sackey",
        role: "Vice President",
        bio: "Through dedication and collaboration, Sybil plays a vital role in strengthening the club's community and supporting the creative process behind every production and project.",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        order: 2
    },
    {
        name: "Lois Eyeson-Ghansah",
        role: "General Secretary",
        bio: "With organization, commitment, and attention to detail, Lois keeps the heartbeat of the club steady, ensuring every idea and initiative moves forward with purpose.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        order: 3
    },
    {
        name: "Mercy Akeredolu",
        role: "Head Of Drama",
        bio: "Mercy helps bring stories to life on stage, guiding performances with creativity, discipline, and a deep passion for theatre and storytelling.",
        imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        order: 4
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dramaclub');
        console.log('MongoDB connected for seeding');

        await TeamMember.deleteMany(); // Clear existing
        await TeamMember.insertMany(seedMembers);

        console.log('Successfully seeded Team Members');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding DB:', err);
        process.exit(1);
    }
};

seedDB();
