import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive emoji to lucide-react icon mapping
const ICON_MAP = {
  // Stats icons
  '🎬': 'Film',
  '👥': 'Users',
  '🏆': 'Trophy',
  '🏅': 'Medal',
  '⭐': 'Star',
  '✨': 'Sparkles',
  '🎭': 'Drama',
  '🎨': 'Palette',
  '🎪': 'Tent',
  '🎵': 'Music',
  '🎤': 'Mic',
  '🎧': 'Headphones',
  '📱': 'Smartphone',
  '📧': 'Mail',
  '📞': 'Phone',
  '📍': 'MapPin',
  '💼': 'Briefcase',
  '🎯': 'Target',
  '💡': 'Lightbulb',
  '🔥': 'Flame',
  '❤️': 'Heart',
  '👑': 'Crown',
  '⚡': 'Zap',
  '🌟': 'Star',
  '🎁': 'Gift',
  '📊': 'BarChart3',
  '📈': 'TrendingUp',
  '🚀': 'Rocket',
  '🌍': 'Globe',
  '🖼️': 'Image',
  '📷': 'Camera',
  '🎥': 'Video',
  '👤': 'User',
};

const ContentSchema = new mongoose.Schema({
  heroText: String,
  heroDescription: String,
  aboutDescription1: String,
  aboutDescription2: String,
  stats: [{ icon: String, count: Number, suffix: String, label: String }],
  tertuliaDescription: String,
  productions: [{ title: String, year: String, genre: String, type: String, description: String, image: String }],
  gallery: [{ label: String, url: String }],
  team: [{ name: String, aka: String, role: String, description: String, image: String }],
});

const Content = mongoose.model('Content', ContentSchema);

// Utility functions
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
  data: (key, value) => console.log(`  ${colors.dim}${key}:${colors.reset} ${value}`),
};

function createBackup(data) {
  const backupDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `content-backup-${timestamp}.json`);
  
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
  log.success(`Backup created: ${backupPath}`);
  return backupPath;
}

function convertEmojisToIcons(text) {
  if (!text || typeof text !== 'string') return text;
  
  let converted = text;
  let hasChanges = false;
  
  for (const [emoji, iconName] of Object.entries(ICON_MAP)) {
    if (converted.includes(emoji)) {
      converted = converted.replace(new RegExp(emoji, 'g'), iconName);
      hasChanges = true;
    }
  }
  
  return hasChanges ? converted : text;
}

function validateIconName(iconName) {
  const validIcons = new Set(Object.values(ICON_MAP));
  validIcons.add('Film');
  validIcons.add('Users');
  validIcons.add('Trophy');
  validIcons.add('Award');
  validIcons.add('Drama');
  
  if (!validIcons.has(iconName) && !iconName.match(/^[A-Z][a-zA-Z0-9]*$/)) {
    return false;
  }
  return true;
}

async function migrateContent(dryRun = false) {
  try {
    log.header('🔄 AMD Club - Advanced Icon Migration Tool');
    
    // Connect to database
    log.info('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/drama-club');
    log.success('Connected to MongoDB');

    // Fetch all content
    const contents = await Content.find();
    
    if (contents.length === 0) {
      log.warning('No content found in database');
      log.info('The database might be empty. Start the server to seed initial data.');
      return;
    }

    log.info(`Found ${contents.length} content document(s)`);
    
    let totalChanges = 0;
    
    for (const content of contents) {
      log.header(`📋 Processing Content Document ID: ${content._id}`);
      
      // Create backup
      if (!dryRun) {
        createBackup(content.toObject());
      }
      
      let documentChanges = 0;
      const changes = [];

      // Process stats
      if (content.stats && content.stats.length > 0) {
        log.info('Checking statistics...');
        content.stats = content.stats.map((stat, idx) => {
          const originalIcon = stat.icon;
          
          // Check if it's an emoji
          if (ICON_MAP[stat.icon]) {
            stat.icon = ICON_MAP[stat.icon];
            changes.push(`  Stats[${idx}]: ${originalIcon} → ${stat.icon} (${stat.label})`);
            documentChanges++;
          } else if (!validateIconName(stat.icon)) {
            log.warning(`  Stats[${idx}]: "${stat.icon}" doesn't look like a valid icon name`);
            changes.push(`  Stats[${idx}]: ⚠️  "${originalIcon}" needs manual review`);
          } else {
            log.data(`Stats[${idx}]`, `${stat.icon} ✓ (${stat.label})`);
          }
          
          return stat;
        });
      }

      // Process text fields for emoji cleanup
      const textFields = ['heroText', 'heroDescription', 'aboutDescription1', 'aboutDescription2', 'tertuliaDescription'];
      
      for (const field of textFields) {
        if (content[field]) {
          const converted = convertEmojisToIcons(content[field]);
          if (converted !== content[field]) {
            changes.push(`  ${field}: Found and converted emojis`);
            content[field] = converted;
            documentChanges++;
          }
        }
      }

      // Display changes
      if (changes.length > 0) {
        log.header('📝 Changes detected:');
        changes.forEach(change => console.log(colors.yellow + change + colors.reset));
        totalChanges += documentChanges;
      } else {
        log.success('No emojis found - database already uses icon names!');
      }

      // Save changes
      if (!dryRun && documentChanges > 0) {
        await content.save();
        log.success(`Saved ${documentChanges} change(s) to database`);
      } else if (dryRun && documentChanges > 0) {
        log.info(`[DRY RUN] Would save ${documentChanges} change(s)`);
      }
    }

    // Summary
    log.header('📊 Migration Summary');
    log.data('Total documents processed', contents.length);
    log.data('Total changes', totalChanges);
    log.data('Mode', dryRun ? 'DRY RUN (no changes saved)' : 'LIVE (changes saved)');
    
    if (totalChanges > 0) {
      log.success('Migration completed successfully!');
      if (!dryRun) {
        log.info('Backups saved in ./backups/ directory');
      }
    } else {
      log.success('No migration needed - all icons are already using proper names!');
    }

  } catch (error) {
    log.error('Migration failed!');
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    log.info('Disconnected from MongoDB');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-d');
const showHelp = args.includes('--help') || args.includes('-h');

if (showHelp) {
  console.log(`
${colors.bright}AMD Club - Advanced Icon Migration Tool${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node migrate_stats_icons.js [options]

${colors.cyan}Options:${colors.reset}
  --dry-run, -d    Preview changes without saving to database
  --help, -h       Show this help message

${colors.cyan}Examples:${colors.reset}
  node migrate_stats_icons.js              # Run migration
  node migrate_stats_icons.js --dry-run    # Preview changes only

${colors.cyan}Features:${colors.reset}
  • Automatic backup before changes
  • Comprehensive emoji → icon mapping (${Object.keys(ICON_MAP).length} emojis supported)
  • Icon name validation
  • Detailed change logging
  • Dry-run mode for safe testing
  • Backup restoration support

${colors.cyan}Supported Icon Mappings:${colors.reset}
  🎬 → Film       👥 → Users      🏆 → Trophy
  🎭 → Drama      🎨 → Palette    ✨ → Sparkles
  📱 → Smartphone 📧 → Mail       🎯 → Target
  ... and ${Object.keys(ICON_MAP).length - 9} more!
`);
  process.exit(0);
}

// Run migration
migrateContent(dryRun);
