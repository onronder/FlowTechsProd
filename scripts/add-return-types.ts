/**
 * @file add-return-types.ts
 * Script to automatically add missing return types to functions in TypeScript files
 * Run with: npx ts-node scripts/add-return-types.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.next', 'out', 'dist', 'scripts', '.git'];
const FILE_EXTENSIONS = ['.ts', '.tsx'];

// Common React component return types
const REACT_RETURN_TYPES = {
  component: 'React.ReactElement',
  hook: 'void',
  callback: 'void',
  eventHandler: 'void',
  asyncEventHandler: 'Promise<void>',
};

// Function to recursively find all TypeScript files
function findTsFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !EXCLUDE_DIRS.includes(file)) {
      findTsFiles(filePath, fileList);
    } else if (
      stat.isFile() &&
      FILE_EXTENSIONS.includes(path.extname(file))
    ) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

// Function to determine if a node is a React component
function isReactComponent(node: ts.FunctionDeclaration | ts.ArrowFunction | ts.MethodDeclaration | ts.FunctionExpression): boolean {
  // Check if it's in a .tsx file
  if (node.getSourceFile().fileName.endsWith('.tsx')) {
    // Check for JSX return
    if (node.body && ts.isBlock(node.body)) {
      const returnStatements = findReturnStatements(node.body);
      for (const returnStatement of returnStatements) {
        if (returnStatement.expression && isJsxElement(returnStatement.expression)) {
          return true;
        }
      }
    }
  }

  // Check function name - common component naming patterns
  if ('name' in node && node.name) {
    const name = node.name.getText();
    return name.match(/^[A-Z][A-Za-z0-9]*$/) !== null; // PascalCase naming
  }

  return false;
}

// Check if a node is a JSX element
function isJsxElement(node: ts.Node): boolean {
  return ts.isJsxElement(node) ||
    ts.isJsxSelfClosingElement(node) ||
    ts.isJsxFragment(node);
}

// Find all return statements in a block
function findReturnStatements(node: ts.Block): ts.ReturnStatement[] {
  const returnStatements: ts.ReturnStatement[] = [];

  function visit(node: ts.Node) {
    if (ts.isReturnStatement(node)) {
      returnStatements.push(node);
    }
    ts.forEachChild(node, visit);
  }

  visit(node);
  return returnStatements;
}

// Determine return type based on function
function determineReturnType(node: ts.FunctionDeclaration | ts.ArrowFunction | ts.MethodDeclaration | ts.FunctionExpression): string {
  // Check if it's a React component
  if (isReactComponent(node)) {
    return REACT_RETURN_TYPES.component;
  }

  // Check function name for common patterns
  if ('name' in node && node.name) {
    const name = node.name.getText();

    if (name.startsWith('handle') || name.endsWith('Handler')) {
      // Is this an async event handler?
      if (node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword)) {
        return REACT_RETURN_TYPES.asyncEventHandler;
      }
      return REACT_RETURN_TYPES.eventHandler;
    }

    if (name.startsWith('use')) {
      return REACT_RETURN_TYPES.hook;
    }
  }

  // Check if it's an async function
  if (node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword)) {
    return 'Promise<void>';
  }

  // Analyze return statements to infer type
  if (node.body && ts.isBlock(node.body)) {
    const returnStatements = findReturnStatements(node.body);

    if (returnStatements.length === 0) {
      return 'void';
    }

    // Check for boolean returns
    const hasBoolean = returnStatements.some(stmt =>
      stmt.expression &&
      (stmt.expression.kind === ts.SyntaxKind.TrueKeyword ||
        stmt.expression.kind === ts.SyntaxKind.FalseKeyword)
    );

    if (hasBoolean) {
      return 'boolean';
    }

    // Check for null/undefined returns
    const hasNullOrUndefined = returnStatements.some(stmt =>
      stmt.expression &&
      (stmt.expression.kind === ts.SyntaxKind.NullKeyword ||
        stmt.expression.kind === ts.SyntaxKind.UndefinedKeyword)
    );

    // If mixed with other returns, might be part of a union type
    if (hasNullOrUndefined && returnStatements.length > 1) {
      return 'unknown';
    }

    // Check for string returns
    const hasString = returnStatements.some(stmt =>
      stmt.expression && ts.isStringLiteral(stmt.expression)
    );

    if (hasString) {
      return 'string';
    }

    // Check for number returns
    const hasNumber = returnStatements.some(stmt =>
      stmt.expression && ts.isNumericLiteral(stmt.expression)
    );

    if (hasNumber) {
      return 'number';
    }

    // Check for object returns
    const hasObject = returnStatements.some(stmt =>
      stmt.expression &&
      (ts.isObjectLiteralExpression(stmt.expression) ||
        ts.isArrayLiteralExpression(stmt.expression))
    );

    if (hasObject) {
      // We can't easily infer the exact object shape
      return 'Record<string, unknown>';
    }
  }

  // Default fallback
  return 'unknown';
}

// Update a file with fix for missing return type
function updateFile(filePath: string): boolean {
  console.log(`Analyzing ${filePath}...`);

  const sourceText = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true
  );

  let fileModified = false;
  const replacements: { start: number; end: number; text: string }[] = [];

  function visit(node: ts.Node) {
    // Handle function declarations
    if (ts.isFunctionDeclaration(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isFunctionExpression(node)) {

      // Check if it's missing a return type
      if (!node.type && node.name) {
        const returnType = determineReturnType(node);

        const closeParen = node.parameters.end;
        replacements.push({
          start: closeParen,
          end: closeParen,
          text: `: ${returnType}`
        });

        fileModified = true;
      }
    }

    // Handle arrow functions with explicit parameter lists
    if (ts.isArrowFunction(node) &&
      node.parent &&
      (ts.isVariableDeclaration(node.parent) || ts.isPropertyAssignment(node.parent)) &&
      !node.type) {

      // Only add types to named functions (variable declarations or properties)
      if ((ts.isVariableDeclaration(node.parent) && node.parent.name) ||
        (ts.isPropertyAssignment(node.parent) && node.parent.name)) {

        const returnType = determineReturnType(node);

        const closeParen = node.parameters.end;
        replacements.push({
          start: closeParen,
          end: closeParen,
          text: `: ${returnType}`
        });

        fileModified = true;
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // Apply replacements in reverse order to maintain correct positions
  if (replacements.length > 0) {
    console.log(`Found ${replacements.length} functions to update in ${filePath}`);

    let updatedText = sourceText;
    for (const { start, end, text } of replacements.sort((a, b) => b.start - a.start)) {
      updatedText = updatedText.slice(0, start) + text + updatedText.slice(end);
    }

    fs.writeFileSync(filePath, updatedText);
  }

  return fileModified;
}

// Main execution
function main(): void {
  console.log('Scanning for TypeScript files...');
  const tsFiles = findTsFiles(ROOT_DIR);
  console.log(`Found ${tsFiles.length} TypeScript files.`);

  let modifiedCount = 0;

  for (const file of tsFiles) {
    const modified = updateFile(file);
    if (modified) {
      modifiedCount++;
    }
  }

  console.log(`\nComplete! Modified ${modifiedCount} files.`);
}

main();