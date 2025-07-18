// update-deps.js
const fs = require("fs");
const path = require("path");

const filePath = path.resolve("dist/edge/src/deps.js");

try {
  // Read the current file content
  let content = fs.readFileSync(filePath, "utf8");

  // Replace the import path
  const updatedContent = content.replace(
    /@flagship\.io\/js-sdk/g,
    "@flagship.io/js-sdk/dist/edge.js"
  );

  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent);

  console.log("Successfully updated import in dist/src/deps.js");
  console.log("Old: export * from '@flagship.io/js-sdk'");
  console.log("New: export * from '@flagship.io/js-sdk/dist/edge.js'");
} catch (error) {
  console.error("Error updating the file:", error.message);
}
