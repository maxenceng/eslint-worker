import path from 'path'
import fsPromises from 'fs/promises'
import { flattenDeep } from 'lodash'

export default class FilesFinder {
  constructor(workerOptions) {
    this.numberOfWorkers = workerOptions.workers
    this.folders = workerOptions?.folders ?? ['.']
    this.ignoredFolders = workerOptions?.ignoredFolders ?? []
    this.fileTypesRegex = this.createFileTypesRegex(workerOptions?.fileTypes)
    this.ignoredFilesRegex = this.createIgnoredFilesRegex(workerOptions?.ignoredFiles)
  }

  createFileTypesRegex(fileTypes) {
    if (!fileTypes) return null
    return RegExp(`(${fileTypes
      .map((fileType) => (fileType.includes('.') ? `${fileType}$` : `.${fileType}$`))
      .join('|')})`, 'i')
  }

  createIgnoredFilesRegex(ignoredFiles) {
    if (!ignoredFiles) return null
    return RegExp(`(${ignoredFiles
      .map((ignoredFile) => `${ignoredFile}$`)
      .join('|')})`, 'i')
  }

  async recursiveFindFiles(folder) {
    const rootFolder = await fsPromises.readdir(folder, { withFileTypes: true })
    return Promise.all(
      rootFolder
        .filter((fileOrFolder) => this.isAccepted(fileOrFolder))
        .map(async (fileOrFolder) => (fileOrFolder.isDirectory()
          ? this.recursiveFindFiles(path.resolve(folder, fileOrFolder.name))
          : this.getRelativePath(folder, fileOrFolder.name))),
    )
  }

  isAccepted(fileOrFolder) {
    if (fileOrFolder.isDirectory()) {
      return !this.ignoredFolders.includes(fileOrFolder.name)
    }
    if (this.ignoredFilesRegex) {
      const isIgnoredFile = this.ignoredFilesRegex.test(fileOrFolder.name)
      if (isIgnoredFile) {
        return false
      }
    }
    return this.fileTypesRegex?.test(fileOrFolder.name) ?? true
  }

  getRelativePath(folder, file) {
    return path.relative(process.cwd(), path.resolve(folder, file))
  }

  async findFilesWithNumberOfWorkers() {
    const files = await Promise.all(
      this.folders
        .map(async (folder) => this.recursiveFindFiles(path.resolve(process.cwd(), folder))),
    )
    return this.splitFilesAmongWorkers(flattenDeep(files))
  }

  splitFilesAmongWorkers(files) {
    const numberPerChunk = Math.ceil(files.length / this.numberOfWorkers)
    return files.reduce((acc, file, idx) => {
      const chunkIndex = Math.floor(idx / numberPerChunk)
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = []
      }
      acc[chunkIndex] = [...acc[chunkIndex], file]
      return acc
    }, [])
  }
}
