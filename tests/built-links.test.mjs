// Verifies the production build: every same-site href/src must resolve to a
// file in dist/ and carry the configured base path. Run after `npm run build`.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import config from "../astro.config.mjs";

const distRoot = path.resolve("dist");
const base = `${(config.base ?? "/").replace(/\/$/, "")}/`;
const attributePattern = /\s(?:href|src)="([^"]*)"/g;

async function findHtmlFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(
        entries.map((entry) => {
            const entryPath = path.join(directory, entry.name);
            if (entry.isDirectory()) return findHtmlFiles(entryPath);
            return entry.name.endsWith(".html") ? [entryPath] : [];
        }),
    );
    return nested.flat();
}

function resolvesInDist(pathname) {
    const relative = decodeURIComponent(pathname.slice(base.length));
    const target = path.join(distRoot, relative);
    return pathname.endsWith("/")
        ? existsSync(path.join(target, "index.html"))
        : existsSync(target);
}

test("internal links resolve to built files under the base path", async () => {
    assert.ok(existsSync(distRoot), "dist/ missing: run `npm run build` first");

    const violations = [];
    for (const file of await findHtmlFiles(distRoot)) {
        const html = await readFile(file, "utf8");
        const page = path.relative(distRoot, file);

        for (const [, value] of html.matchAll(attributePattern)) {
            if (!value.startsWith("/") || value.startsWith("//")) continue;
            const { pathname } = new URL(value, "https://example.test");

            if (!pathname.startsWith(base)) {
                violations.push(`${page}: missing base path in ${value}`);
            } else if (!resolvesInDist(pathname)) {
                violations.push(`${page}: broken link ${value}`);
            }
        }
    }

    assert.deepEqual(violations, [], violations.join("\n"));
});
