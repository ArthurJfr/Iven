#!/usr/bin/env node

/**
 * Script de vérification de la migration des composants
 * Vérifie que tous les composants sont correctement migrés vers la nouvelle architecture
 */

const fs = require('fs');
const path = require('path');

// Composants qui ont été migrés
const MIGRATED_COMPONENTS = {
  'EventCard': 'components/features/events',
  'TaskCard': 'components/features/tasks',
  'AccountActivationBanner': 'components/features/auth',
  'LoadingOverlay': 'components/shared',
  'EmptyState': 'components/shared'
};

// Composants UI qui restent en place
const UI_COMPONENTS = [
  'Button', 'Card', 'Text', 'Avatar', 'Badge', 'Input', 
  'DatePicker', 'TimePicker', 'Header', 'TopBar', 'BottomBar'
];

// Dossiers à analyser
const DIRECTORIES = ['app', 'components'];

function findFiles(dir, extensions = ['.tsx', '.ts']) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath);
      } else if (extensions.includes(path.extname(item))) {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Vérifier les imports des composants migrés
  for (const [component, expectedPath] of Object.entries(MIGRATED_COMPONENTS)) {
    const oldImportPattern = new RegExp(`import.*${component}.*from.*components/ui`, 'g');
    const matches = content.match(oldImportPattern);
    
    if (matches) {
      issues.push({
        type: 'MIGRATION_REQUIRED',
        component,
        expectedPath,
        matches: matches.length,
        file: filePath
      });
    }
  }
  
  // Vérifier les imports des composants UI (doivent rester dans ui/)
  for (const component of UI_COMPONENTS) {
    const uiImportPattern = new RegExp(`import.*${component}.*from.*components/ui`, 'g');
    const matches = content.match(uiImportPattern);
    
    if (matches) {
      // C'est normal, pas d'issue
    }
  }
  
  return issues;
}

function main() {
  console.log('🔍 Vérification de la migration des composants...\n');
  
  let totalIssues = 0;
  let filesWithIssues = 0;
  
  for (const dir of DIRECTORIES) {
    if (!fs.existsSync(dir)) continue;
    
    console.log(`📁 Analyse du dossier: ${dir}`);
    const files = findFiles(dir);
    console.log(`   ${files.length} fichiers trouvés\n`);
    
    for (const file of files) {
      const issues = analyzeFile(file);
      
      if (issues.length > 0) {
        filesWithIssues++;
        console.log(`❌ ${file}:`);
        
        for (const issue of issues) {
          totalIssues++;
          console.log(`   - ${issue.type}: ${issue.component} doit être importé depuis ${issue.expectedPath}`);
          console.log(`     ${issue.matches} occurrence(s) trouvée(s)`);
        }
        console.log('');
      }
    }
  }
  
  // Résumé
  console.log('📊 Résumé de la vérification:');
  console.log(`   Fichiers avec problèmes: ${filesWithIssues}`);
  console.log(`   Total des problèmes: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('\n✅ Tous les composants sont correctement migrés !');
    console.log('🎉 Votre architecture est prête !');
  } else {
    console.log('\n⚠️  Des problèmes de migration ont été détectés.');
    console.log('   Consultez le guide MIGRATION_COMPOSANTS.md pour les résoudre.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { analyzeFile, findFiles };
