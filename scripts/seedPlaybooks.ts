import { seedPlaybookLibrary } from '../server/seeds/playbookLibrarySeed.js';
import { seedPlaybookTemplates } from '../server/seeds/playbookTemplatesSeed.js';

async function main() {
  try {
    await seedPlaybookLibrary();
    await seedPlaybookTemplates();
    console.log('✅ Playbook seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Playbook seeding failed:', error);
    process.exit(1);
  }
}

main();
