import path from 'path'
import fsPromises from 'fs/promises'

export default async (outputFile, content) => {
  const filePath = path.resolve(process.cwd(), outputFile)
  try {
    await fsPromises.mkdir(path.dirname(filePath), { recursive: true })
    await fsPromises.writeFile(filePath, content)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`There was a problem writing the output file: ${e}`)
  }
}
