import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const sourceRoot = path.resolve("src");

async function findAstroFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });

    return (
        await Promise.all(
            entries.map(async (entry) => {
                const entryPath = path.join(directory, entry.name);

                if (entry.isDirectory()) return findAstroFiles(entryPath);
                return entry.isFile() && entry.name.endsWith(".astro")
                    ? [entryPath]
                    : [];
            }),
        )
    ).flat();
}

test("internal anchors render through the Link component", async () => {
    const astroFiles = await findAstroFiles(sourceRoot);
    const violations = [];
    const internalHrefPatterns = [
        /<a\b[^>]*\bhref\s*=\s*["'](?:\/|#)/g,
        /<a\b[^>]*\bhref\s*=\s*{(?:item\.href|href|respiratoryNotice\.data\.path)}/g,
        /<a\b[^>]*\s{href}(?:\s|>)/g,
    ];

    for (const file of astroFiles) {
        if (file.endsWith(path.join("navigation", "Link.astro"))) continue;

        const source = await readFile(file, "utf8");

        for (const pattern of internalHrefPatterns) {
            for (const match of source.matchAll(pattern)) {
                const line = source.slice(0, match.index).split("\n").length;
                violations.push(`${path.relative(process.cwd(), file)}:${line}`);
            }
        }
    }

    assert.deepEqual(
        violations,
        [],
        `Native anchors found for internal links:\n${violations.join("\n")}`,
    );
});
