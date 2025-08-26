#!/usr/bin/env node

/**
 * Script de test des imports de composants
 * Vérifie que tous les imports pointent vers les bons emplacements
 */

const fs = require('fs');
const path = require('path');

// Dossiers à analyser
const DIRECTORIES = ['app', 'components'];

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

function testImports(filePath) {
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
  
  // Vérifier les chemins relatifs incorrects
  const relativePathIssues = [
    {
      pattern: /import.*from.*'\.\.\/\.\.\/contexts\/ThemeContext'/g,
      description: 'Chemin incorrect vers ThemeContext depuis features/'
    },
    {
      pattern: /import.*from.*'\.\.\/\.\.\/styles'/g,
      description: 'Chemin incorrect vers styles depuis features/'
    },
    {
      pattern: /import.*from.*'\.\.\/\.\.\/types'/g,
      description: 'Chemin incorrect vers types depuis features/'
    },
    {
      pattern: /import.*from.*'\.\.\/\.\.\/services'/g,
      description: 'Chemin incorrect vers services depuis features/'
    }
  ];
  
  for (const issue of relativePathIssues) {
    const matches = content.match(issue.pattern);
    if (matches) {
      issues.push({
        type: 'RELATIVE_PATH_ISSUE',
        description: issue.description,
        matches: matches.length,
        file: filePath
      });
    }
  }
  
  return issues;
}

function main() {
  console.log('🧪 Test des imports de composants...\n');
  
  let totalIssues = 0;
  let filesWithIssues = 0;
  
  for (const dir of DIRECTORIES) {
    if (!fs.existsSync(dir)) continue;
    
    console.log(`📁 Analyse du dossier: ${dir}`);
    const files = findFiles(dir);
    console.log(`   ${files.length} fichiers trouvés\n`);
    
    for (const file of files) {
      const issues = testImports(file);
      
      if (issues.length > 0) {
        filesWithIssues++;
        console.log(`❌ ${file}:`);
        
        for (const issue of issues) {
          totalIssues++;
          if (issue.type === 'MIGRATION_REQUIRED') {
            console.log(`   - ${issue.type}: ${issue.component} doit être importé depuis ${issue.expectedPath}`);
            console.log(`     ${issue.matches} occurrence(s) trouvée(s)`);
          } else {
            console.log(`   - ${issue.type}: ${issue.description}`);
            console.log(`     ${issue.matches} occurrence(s) trouvée(s)`);
          }
        }
        console.log('');
      }
    }
  }
  
  // Résumé
  console.log('📊 Résumé du test:');
  console.log(`   Fichiers avec problèmes: ${filesWithIssues}`);
  console.log(`   Total des problèmes: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('\n✅ Tous les imports sont corrects !');
    console.log('🎉 Votre application devrait démarrer sans erreur !');
  } else {
    console.log('\n⚠️  Des problèmes d\'import ont été détectés.');
    console.log('   Corrigez-les avant de démarrer l\'application.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { testImports, findFiles };
