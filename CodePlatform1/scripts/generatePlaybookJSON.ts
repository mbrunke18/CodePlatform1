import { readFileSync, writeFileSync } from 'fs';

const taxonomyFile = 'attached_assets/Pasted--Bastion-The-110-Situation-Playbook-Library-Complete-Taxonomy-of-Executive-Crisis-Scenarios--1761569120283_1761569120284.txt';
const content = readFileSync(taxonomyFile, 'utf-8');

interface Playbook {
  number: number;
  name: string;
  trigger: string;
  stakeholders: string[];
  response: string;
  domain: number;
  frequency: 'rare' | 'low' | 'medium' | 'high';
  budget: number;
}

const playbooks: Playbook[] = [];
const lines = content.split('\n');

let currentDomain = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line.includes('## DOMAIN 1:')) currentDomain = 1;
  else if (line.includes('## DOMAIN 2:')) currentDomain = 2;
  else if (line.includes('## DOMAIN 3:')) currentDomain = 3;
  else if (line.includes('## DOMAIN 4:')) currentDomain = 4;
  else if (line.includes('## DOMAIN 5:')) currentDomain = 5;
  else if (line.includes('## DOMAIN 6:')) currentDomain = 6;
  else if (line.includes('## DOMAIN 7:')) currentDomain = 7;
  else if (line.includes('## DOMAIN 8:')) currentDomain = 8;
  
  const match = line.match(/^\*\*#(\d{3}) - (.+)\*\*$/);
  if (match) {
    const number = parseInt(match[1]);
    const name = match[2];
    const trigger = lines[i + 2]?.replace('- Trigger: ', '').trim() || '';
    const stakeholdersRaw = lines[i + 3]?.replace('- Key Stakeholders: ', '').trim() || '';
    const response = lines[i + 4]?.replace('- Primary Response: ', '').trim() || '';
    
    const stakeholders = stakeholdersRaw.split(',').map(s => s.trim());
    const frequency = number <= 30 ? 'medium' : number <= 70 ? 'low' : 'rare';
    const budget = number <= 20 ? 500000 : number <= 50 ? 750000 : number <= 80 ? 1000000 : 1500000;
    
    playbooks.push({ number, name, trigger, stakeholders, response, domain: currentDomain, frequency, budget });
  }
}

const output = { playbooks, total: playbooks.length };
writeFileSync('server/seeds/data/playbooks.json', JSON.stringify(output, null, 2));
console.log(`✅ Generated playbooks.json with ${playbooks.length} playbooks`);
