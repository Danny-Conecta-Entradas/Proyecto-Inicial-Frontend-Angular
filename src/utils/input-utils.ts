export function createFileList(files?: File[]) {
  const dataTransfer = new DataTransfer()

  for (const file of files ?? []) {
    dataTransfer.items.add(file)
  }

  return dataTransfer.files
}
