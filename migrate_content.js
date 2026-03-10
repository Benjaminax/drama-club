import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const contentSchema = new mongoose.Schema({
    heroText: String,
    heroDescription: String,
    aboutDescription1: String,
    aboutDescription2: String,
    productions: [{ title: String, year: String, genre: String, description: String, image: String }],
    gallery: [{ label: String, url: String }],
    team: [{ name: String, aka: String, role: String, description: String }],
    stats: [{ icon: String, count: Number, suffix: String, label: String }],
    tertuliaDescription: String,
    updatedAt: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', contentSchema);

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const content = await Content.findOne();
        if (content) {
            console.log('Found existing content, updating fields...');

            if (!content.stats || content.stats.length === 0) {
                content.stats = [
                    { icon: '🎬', count: 20, suffix: '+', label: 'Productions' },
                    { icon: '👥', count: 100, suffix: '+', label: 'Members' },
                    { icon: '🏆', count: 15, suffix: '+', label: 'Awards' },
                ];
            }

            if (!content.tertuliaDescription) {
                content.tertuliaDescription = 'Our gathering space for creative minds to share ideas, discuss art, and inspire one another.';
            }

            await content.save();
            console.log('Migration successful');
        } else {
            console.log('No content found to migrate');
        }
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await mongoose.disconnect();
    }
};

migrate();
