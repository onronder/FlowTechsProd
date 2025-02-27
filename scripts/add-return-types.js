const ts = require('typescript');
const fs = require('fs');
const path = require('path');

// Get target files from command line arguments
const targetFiles = process.argv.slice(2);

// If no specific files provided, find all TypeScript files
if (targetFiles.length === 0) {
  console.log('No files specified. Usage: node add-return-types.js [files...]');
  process.exit(1);
}

// Process each file
targetFiles.forEach(filePath => {
  try {
    processFile(filePath);
    console.log(`✅ Processed: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
  }
});

function processFile(filePath) {
  // Read the file
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Parse the source file
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  // Track positions where return types should be added
  const edits = [];

  // Visit each node in the source file
  function visit(node) {
    // Check if the node is a function declaration or arrow function without a return type
    if (isFunctionWithoutReturnType(node)) {
      const returnType = determineReturnType(node);
      if (returnType) {
        const position = getReturnTypePosition(node);
        edits.push({
          position,
          text: `: ${returnType}`
        });
      }
    }

    // Continue visiting child nodes
    ts.forEachChild(node, visit);
  }

  // Start the recursive visit
  visit(sourceFile);

  // Apply edits in reverse order (from end to start of file)
  if (edits.length > 0) {
    let updatedContent = fileContent;
    edits.sort((a, b) => b.position - a.position); // Sort in reverse order

    for (const edit of edits) {
      updatedContent =
        updatedContent.substring(0, edit.position) +
        edit.text +
        updatedContent.substring(edit.position);
    }

    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Added ${edits.length} return types to ${filePath}`);
  } else {
    console.log(`No missing return types found in ${filePath}`);
  }
}

function isFunctionWithoutReturnType(node) {
  // Check for function declarations, arrow functions, and method declarations without return types
  return (
    (ts.isFunctionDeclaration(node) ||
      ts.isArrowFunction(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isFunctionExpression(node)) &&
    !node.type && // No explicit return type
    node.body && // Has a function body
    !ts.isExpressionStatement(node.parent) // Not an immediately invoked function
  );
}

function getReturnTypePosition(node) {
  // For functions, get position after parameter list closing parenthesis
  if (node.parameters) {
    const lastToken = node.parameters.length > 0
      ? node.parameters[node.parameters.length - 1]
      : node;

    // Find the closing parenthesis after the last parameter
    const paramListEnd = node.parameters.end;
    return paramListEnd + 1; // Position after closing parenthesis
  }

  // Fallback position
  return node.name ? node.name.end : node.pos;
}

function determineReturnType(node) {
  // React components typically return JSX
  if (isReactComponent(node)) {
    return 'React.ReactElement';
  }

  // Handle event handlers
  if (isEventHandler(node)) {
    return node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword)
      ? 'Promise<void>'
      : 'void';
  }

  // Check for specific return statements
  if (node.body && ts.isBlock(node.body)) {
    const returnStatements = findReturnStatements(node.body);

    if (returnStatements.length === 0) {
      // No return statements implies void
      return 'void';
    }

    // Check if any return statement has a value
    const hasReturnValue = returnStatements.some(stmt => stmt.expression);
    if (!hasReturnValue) {
      return 'void';
    }

    // If it's an async function, wrap the return type in Promise
    if (node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword)) {
      return 'Promise<any>'; // Could be refined with more analysis
    }

    return 'any'; // Default to any for now
  }

  // For arrow functions with expression bodies (implicit return)
  if (node.body && !ts.isBlock(node.body)) {
    if (node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword)) {
      return 'Promise<any>';
    }
    return 'any';
  }

  return 'any';
}

function isReactComponent(node) {
  // Check if it's a function named like a component (starts with uppercase)
  if (node.name && ts.isIdentifier(node.name)) {
    const name = node.name.text;
    return /^[A-Z]/.test(name);
  }

  // For exported default functions, check the variable name if available
  if (!node.name && node.parent && ts.isExportAssignment(node.parent)) {
    // This is a bit harder to detect without more context
    return true; // Assume exported functions might be components
  }

  return false;
}

function isEventHandler(node) {
  // Check if function name starts with "handle" or "on" followed by uppercase letter
  if (node.name && ts.isIdentifier(node.name)) {
    const name = node.name.text;
    return /^(handle|on)[A-Z]/.test(name);
  }

  // For arrow functions assigned to variables, check the variable name
  if (node.parent && ts.isVariableDeclaration(node.parent) &&
    node.parent.name && ts.isIdentifier(node.parent.name)) {
    const name = node.parent.name.text;
    return /^(handle|on)[A-Z]/.test(name);
  }

  return false;
}

function findReturnStatements(node) {
  const returnStatements = [];

  function visit(node) {
    if (ts.isReturnStatement(node)) {
      returnStatements.push(node);
    }

    // Don't look for returns in nested functions
    if (!ts.isFunctionDeclaration(node) &&
      !ts.isArrowFunction(node) &&
      !ts.isMethodDeclaration(node) &&
      !ts.isFunctionExpression(node)) {
      ts.forEachChild(node, visit);
    }
  }

  visit(node);
  return returnStatements;
}