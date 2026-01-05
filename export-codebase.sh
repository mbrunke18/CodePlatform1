#!/bin/bash

OUTPUT="bastion-complete-codebase.md"

echo "# Bastion - Complete Codebase Export" > $OUTPUT
echo "" >> $OUTPUT
echo "**Generated:** $(date)" >> $OUTPUT
echo "" >> $OUTPUT
echo "---" >> $OUTPUT
echo "" >> $OUTPUT

# Function to add file to export
add_file() {
    local filepath=$1
    if [ -f "$filepath" ]; then
        echo "" >> $OUTPUT
        echo "## File: \`$filepath\`" >> $OUTPUT
        echo "" >> $OUTPUT
        echo '```'"$(get_language $filepath)" >> $OUTPUT
        cat "$filepath" >> $OUTPUT
        echo "" >> $OUTPUT
        echo '```' >> $OUTPUT
        echo "" >> $OUTPUT
    fi
}

# Get language for syntax highlighting
get_language() {
    case "$1" in
        *.ts|*.tsx) echo "typescript" ;;
        *.js|*.jsx) echo "javascript" ;;
        *.json) echo "json" ;;
        *.css) echo "css" ;;
        *.html) echo "html" ;;
        *.md) echo "markdown" ;;
        *) echo "text" ;;
    esac
}

echo "# Table of Contents" >> $OUTPUT
echo "" >> $OUTPUT
echo "- [Configuration Files](#configuration-files)" >> $OUTPUT
echo "- [Shared Code](#shared-code)" >> $OUTPUT
echo "- [Server Code](#server-code)" >> $OUTPUT
echo "- [Client Code](#client-code)" >> $OUTPUT
echo "" >> $OUTPUT
echo "---" >> $OUTPUT

# Configuration Files
echo "" >> $OUTPUT
echo "# Configuration Files" >> $OUTPUT

add_file "package.json"
add_file "tsconfig.json"
add_file "drizzle.config.ts"
add_file "vite.config.ts"
add_file "tailwind.config.ts"
add_file "postcss.config.js"
add_file "components.json"

# Shared Code
echo "" >> $OUTPUT
echo "# Shared Code" >> $OUTPUT

add_file "shared/schema.ts"
add_file "shared/comprehensive-scenario-templates.ts"

# Server Code
echo "" >> $OUTPUT
echo "# Server Code" >> $OUTPUT

for file in server/*.ts; do
    add_file "$file"
done

# Client Code
echo "" >> $OUTPUT
echo "# Client Code" >> $OUTPUT

echo "" >> $OUTPUT
echo "## Main Entry Points" >> $OUTPUT
add_file "client/src/main.tsx"
add_file "client/src/App.tsx"
add_file "client/src/index.css"

echo "" >> $OUTPUT
echo "## Lib & Utilities" >> $OUTPUT
add_file "client/src/lib/queryClient.ts"
add_file "client/src/lib/utils.ts"

echo "" >> $OUTPUT
echo "## Contexts" >> $OUTPUT
for file in client/src/contexts/*.tsx; do
    add_file "$file"
done

echo "" >> $OUTPUT
echo "## Hooks" >> $OUTPUT
for file in client/src/hooks/*.ts client/src/hooks/*.tsx; do
    [ -f "$file" ] && add_file "$file"
done

echo "" >> $OUTPUT
echo "## Pages" >> $OUTPUT
for file in client/src/pages/*.tsx; do
    [ -f "$file" ] && add_file "$file"
done

echo "" >> $OUTPUT
echo "## Components" >> $OUTPUT
for file in client/src/components/*.tsx; do
    [ -f "$file" ] && add_file "$file"
done

echo "" >> $OUTPUT
echo "## UI Components" >> $OUTPUT
for file in client/src/components/ui/*.tsx; do
    [ -f "$file" ] && ! [[ "$file" =~ __tests__ ]] && add_file "$file"
done

echo "" >> $OUTPUT
echo "## Demo Components" >> $OUTPUT
for file in client/src/components/demo/*.tsx; do
    [ -f "$file" ] && add_file "$file"
done

echo "" >> $OUTPUT
echo "## Layout Components" >> $OUTPUT
for file in client/src/components/layout/*.tsx; do
    [ -f "$file" ] && add_file "$file"
done

echo "Export complete: $OUTPUT"
