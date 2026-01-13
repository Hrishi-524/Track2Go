export default async function walkDir(dir, baseDir, collected = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        for(const ignoreEntry of ignoreEntries) {
            if(entry.name === ignoreEntry) {
                continue
            }
        }

        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            await walkDir(fullPath, baseDir, collected)
        } else {
            const relativePath = path.relative(baseDir, fullPath)
            collected.push({ fullPath, relativePath })
        }
    }

    return collected
}

const ignoreEntries = [
    '.apnaGit',
    '.git',
    'node_moduless'
]