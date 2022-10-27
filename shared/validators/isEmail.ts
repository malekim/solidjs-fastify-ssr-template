const isEmail = (content: string): boolean => {
  return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/i.test(content)
}

export { isEmail }
