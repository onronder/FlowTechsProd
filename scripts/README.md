# TypeScript Return Type Fixer

This tool automatically adds missing return types to TypeScript functions in your project to fix linting errors related to the `@typescript-eslint/explicit-function-return-type` rule.

## Features

- Automatically scans TypeScript (`.tsx`, `.ts`) files for functions without return types
- Intelligently determines appropriate return types based on function context and content
- Handles various function types including React components, event handlers, and utility functions
- Updates files in-place, adding the proper return type annotations

## How It Works

The script:
1. Analyzes the specified TypeScript files
2. Identifies functions missing return types
3. Determines appropriate return types based on:
   - Function name and context (React component, event handler, etc.)
   - Return statements within the function
   - Whether the function is async
4. Updates the files by adding the inferred return types

## Usage

There are two ways to use this tool:

### Method 1: Using the Bash Script

This is the recommended method as it handles dependency installation automatically:

```bash
# Run on specific files
./scripts/run-return-type-fix.sh path/to/file.tsx another/file.ts

# Run on all files in a directory
./scripts/run-return-type-fix.sh app/components/*.tsx
```

### Method 2: Direct Node.js Execution

```bash
# Install dependencies if needed
npm install --no-save typescript

# Run on specific files
node scripts/add-return-types.js path/to/file.tsx another/file.ts

# Run on all files in a directory
node scripts/add-return-types.js app/components/*.tsx
```

## Notes

- **Review Changes**: After running the script, review the changes to ensure they're correct
- **Complex Return Types**: For functions with complex return types, the script will add `any` or basic types. You may need to manually refine these.
- **Verify With Linting**: Run `npm run lint` after making changes to verify that errors have been resolved

## Return Type Inference Rules

The script uses the following rules to determine return types:

1. **React Components**:
   - Components (functions starting with uppercase letters) get `React.ReactElement`

2. **Event Handlers**:
   - Functions named like `handleClick`, `onSubmit` get `void` or `Promise<void>` if async

3. **Async Functions**:
   - Regular async functions get `Promise<any>` by default
   - Async functions with no return statements or that only return void get `Promise<void>`

4. **Regular Functions**:
   - Functions with no return statements get `void`
   - Functions with return statements get `any` (may need manual refinement)