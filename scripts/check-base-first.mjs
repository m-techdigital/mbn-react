import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const allowedNativeOwners = new Set([
    "src/components/base/BaseChoice.jsx",
    "src/components/base/BaseFilter.jsx",
    "src/components/base/BaseForm.jsx",
    "src/components/base/FormControls.jsx",
    "src/components/base/ImageUploadField.jsx",
    "src/components/base/MoneyInput.jsx",
    "src/components/base/MultiImageUploadField.jsx",
    "src/components/base/PasswordField.jsx",
    "src/components/base/ResponsiveDataTable.jsx",
    "src/components/base/GamingModal.jsx",
    "src/components/base/BaseDrawer.jsx",
]);
const forbiddenLegacyMarkers = [
    "table-primary-cell",
    "deposit-step-title",
    "security-form-card",
    "mbn-form-alert",
    "empty-panel",
];

function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const target = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(target) : [target];
    });
}

const failures = [];
for (const file of walk(sourceRoot).filter((item) => item.endsWith(".jsx"))) {
    const relative = path.relative(root, file).replaceAll("\\", "/");
    const source = fs.readFileSync(file, "utf8");
    if (!allowedNativeOwners.has(relative)) {
        if (
            /<(?:form|input|select|textarea|table|thead|tbody|th|td)\b/.test(
                source,
            )
        )
            failures.push(
                `${relative}: dựng native form/table ngoài base owner`,
            );
        if (/role=["']dialog["']/.test(source))
            failures.push(`${relative}: dựng dialog ngoài GamingModal`);
    }
    for (const marker of forbiddenLegacyMarkers) {
        if (source.includes(marker))
            failures.push(`${relative}: còn marker legacy ${marker}`);
    }
}

const required = [
    ["src/components/base/ContentPrimitives.jsx", "PrimaryTextCell"],
    ["src/components/base/ContentPrimitives.jsx", "StepHeading"],
    ["src/components/base/ContentPrimitives.jsx", "SurfacePanel"],
    ["src/components/base/ContentPrimitives.jsx", "RecordList"],
    ["src/components/base/GamingModal.jsx", "ModalFooterNote"],
    ["src/components/base/BaseDrawer.jsx", 'role="dialog"'],
    ["src/styles/base-primitives.css", ".mbn-primary-text-cell"],
];
for (const [file, marker] of required) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    if (!source.includes(marker)) failures.push(`${file}: thiếu ${marker}`);
}

if (failures.length) {
    console.error("Base-first UI contract failed:\n- " + failures.join("\n- "));
    process.exit(1);
}
console.log(
    "Base-first UI contract passed: feature code reuses canonical form, table, modal, notice, panel, step, list and cell owners.",
);
