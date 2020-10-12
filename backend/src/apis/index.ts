export const getDayIdentifier = () => {
  return Math.floor(Date.now() / (1000*60*60*24))
}

