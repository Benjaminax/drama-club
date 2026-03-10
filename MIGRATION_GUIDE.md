# 🔄 Icon Migration Tool - User Guide

## Overview
Advanced migration tool to convert emoji icons to professional lucide-react icon names throughout your database.

## Features

✨ **Automatic Backup** - Creates timestamped backups before any changes
📊 **Comprehensive Mapping** - Supports 33+ emoji → icon conversions
🔍 **Smart Validation** - Validates icon names against lucide-react library
🎯 **Dry-Run Mode** - Preview changes before applying them
📝 **Detailed Logging** - Color-coded console output with full change tracking
🔒 **Safe Rollback** - All backups saved in `./backups/` directory

## Quick Start

### 1. Preview Changes (Safe)
```bash
node migrate_stats_icons.js --dry-run
```

### 2. Run Migration (Live)
```bash
node migrate_stats_icons.js
```

### 3. Show Help
```bash
node migrate_stats_icons.js --help
```

## Supported Icon Mappings

| Emoji | Icon Name | Use Case |
|-------|-----------|----------|
| 🎬 | Film | Productions, Movies |
| 👥 | Users | Members, Team |
| 🏆 | Trophy | Awards, Achievements |
| 🎭 | Drama | Theatre, Performing Arts |
| 🎨 | Palette | Visual Arts, Design |
| ✨ | Sparkles | Special, Featured |
| 📱 | Smartphone | Mobile, Contact |
| 📧 | Mail | Email, Messages |
| 🎯 | Target | Goals, Objectives |
| ⭐ | Star | Rating, Featured |
| 💡 | Lightbulb | Ideas, Innovation |
| 🔥 | Flame | Hot, Trending |
| 👑 | Crown | Premium, VIP |
| ⚡ | Zap | Fast, Energy |
| 🚀 | Rocket | Launch, Growth |
| 📊 | BarChart3 | Statistics, Analytics |
| 📈 | TrendingUp | Growth, Progress |
| 🌍 | Globe | Global, World |
| 🎁 | Gift | Rewards, Bonus |
| 🎤 | Mic | Audio, Voice |
| 🎵 | Music | Musical, Audio |
| 📷 | Camera | Photos, Media |
| 🎥 | Video | Video, Recording |
| 👤 | User | Profile, Person |
| 🏅 | Medal | Achievement, Award |
| 💼 | Briefcase | Business, Work |
| 📍 | MapPin | Location, Place |
| 📞 | Phone | Call, Contact |
| 🎧 | Headphones | Audio, Listen |
| 🎪 | Tent | Events, Festival |
| ❤️ | Heart | Love, Favorite |
| 🖼️ | Image | Picture, Photo |

*...and more! (Total: 33 mappings)*

## What Gets Migrated?

### Stats Section
- Converts emoji icons to lucide-react icon names
- Example: `{ icon: '🎬', label: 'Productions' }` → `{ icon: 'Film', label: 'Productions' }`

### Text Fields
- Scans and converts emojis in:
  - `heroText`
  - `heroDescription`
  - `aboutDescription1`
  - `aboutDescription2`
  - `tertuliaDescription`

## Output Examples

### Dry Run Output
```
🔄 AMD Club - Advanced Icon Migration Tool

ℹ Connecting to MongoDB...
✓ Connected to MongoDB
ℹ Found 1 content document(s)

📋 Processing Content Document ID: 507f1f77bcf86cd799439011

ℹ Checking statistics...

📝 Changes detected:
  Stats[0]: 🎬 → Film (Productions)
  Stats[1]: 👥 → Users (Members)
  Stats[2]: 🏆 → Trophy (Awards)

ℹ [DRY RUN] Would save 3 change(s)

📊 Migration Summary
  Total documents processed: 1
  Total changes: 3
  Mode: DRY RUN (no changes saved)
✓ Migration completed successfully!
```

### Live Run Output
```
🔄 AMD Club - Advanced Icon Migration Tool

ℹ Connecting to MongoDB...
✓ Connected to MongoDB
ℹ Found 1 content document(s)

📋 Processing Content Document ID: 507f1f77bcf86cd799439011

✓ Backup created: ./backups/content-backup-2026-03-10T14-30-45-123Z.json
ℹ Checking statistics...

📝 Changes detected:
  Stats[0]: 🎬 → Film (Productions)
  Stats[1]: 👥 → Users (Members)
  Stats[2]: 🏆 → Trophy (Awards)

✓ Saved 3 change(s) to database

📊 Migration Summary
  Total documents processed: 1
  Total changes: 3
  Mode: LIVE (changes saved)
✓ Migration completed successfully!
ℹ Backups saved in ./backups/ directory
ℹ Disconnected from MongoDB
```

## Backup & Recovery

### Backup Location
```
./backups/content-backup-{timestamp}.json
```

### Restore from Backup
1. Locate backup file in `./backups/` directory
2. Use MongoDB Compass or mongoimport:
```bash
mongoimport --db drama-club --collection contents --file ./backups/content-backup-{timestamp}.json
```

## Troubleshooting

### "No content found in database"
**Solution:** Start your server first to seed initial data
```bash
npm run dev
```

### "Invalid icon name" warnings
**Solution:** Manually update in admin dashboard at `/admin` → Stats tab

### Connection errors
**Solution:** Ensure MongoDB is running on `localhost:27017`
```bash
# Check if MongoDB is running
mongosh --eval "db.version()"
```

## Best Practices

1. ✅ **Always run dry-run first**
   ```bash
   node migrate_stats_icons.js --dry-run
   ```

2. ✅ **Verify backups exist** before running live migration

3. ✅ **Test on development** environment first

4. ✅ **Check admin dashboard** after migration to verify icons display correctly

5. ✅ **Keep backups** for at least 30 days

## Integration with Admin Dashboard

After migration, you can manage icons through the admin interface:

1. Navigate to `http://localhost:5174/admin`
2. Login with credentials
3. Go to "Statistics" tab
4. Use suggested icon names displayed at the top
5. Save changes

## Advanced Usage

### Custom Icon Mapping
Edit the `ICON_MAP` constant in `migrate_stats_icons.js`:

```javascript
const ICON_MAP = {
  '🎬': 'Film',
  '👥': 'Users',
  '🏆': 'Trophy',
  // Add your custom mappings here
  '🌈': 'Rainbow',
  '🦄': 'Unicorn',
};
```

### Programmatic Usage
```javascript
import { migrateContent } from './migrate_stats_icons.js';

// Run migration programmatically
await migrateContent(false); // Live mode
await migrateContent(true);  // Dry-run mode
```

## Support

For issues or questions:
- Check the admin dashboard guide at `/admin`
- Review lucide-react icons: https://lucide.dev/icons
- Consult server logs for detailed error messages

---

**Version:** 2.0 Advanced  
**Last Updated:** March 10, 2026  
**Compatibility:** MongoDB 4.4+, Node.js 18+
